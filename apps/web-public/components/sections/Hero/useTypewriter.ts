"use client";

import { useState, useEffect, useRef } from "react";

interface UseTypewriterOptions {
  typingSpeed?: number;
  deleteSpeed?: number;
  pauseAfterType?: number;
  pauseBeforeNext?: number;
  isActive?: boolean;
}

export function useTypewriter(
  words: string[],
  {
    typingSpeed = 80,
    deleteSpeed = 45,
    pauseAfterType = 1800,
    pauseBeforeNext = 300,
    isActive = true,
  }: UseTypewriterOptions = {}
) {
  const [displayText, setDisplayText] = useState("");
  const wordsRef = useRef(words);
  wordsRef.current = words;
  const wordIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const isDeletingRef = useRef(false);
  const isActiveRef = useRef(isActive);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickRef = useRef<() => void>(() => {});

  useEffect(() => {
    const tick = () => {
      if (!isActiveRef.current) {
        timeoutIdRef.current = null;
        return;
      }

      const currentWords = wordsRef.current;
      const currentWord = currentWords[wordIndexRef.current % currentWords.length];

      if (isDeletingRef.current) {
        charIndexRef.current -= 1;
        setDisplayText(currentWord.slice(0, charIndexRef.current));

        if (charIndexRef.current === 0) {
          isDeletingRef.current = false;
          wordIndexRef.current = (wordIndexRef.current + 1) % words.length;
          timeoutIdRef.current = setTimeout(tick, pauseBeforeNext);
        } else {
          timeoutIdRef.current = setTimeout(tick, deleteSpeed);
        }
      } else {
        charIndexRef.current += 1;
        setDisplayText(currentWord.slice(0, charIndexRef.current));

        if (charIndexRef.current === currentWord.length) {
          isDeletingRef.current = true;
          timeoutIdRef.current = setTimeout(tick, pauseAfterType);
        } else {
          timeoutIdRef.current = setTimeout(tick, typingSpeed);
        }
      }
    };

    tickRef.current = tick;
    timeoutIdRef.current = setTimeout(tick, typingSpeed);

    return () => {
      if (timeoutIdRef.current !== null) clearTimeout(timeoutIdRef.current);
    };
  }, []);

  useEffect(() => {
    isActiveRef.current = isActive;

    if (!isActive) {
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
      return;
    }

    if (timeoutIdRef.current === null) {
      timeoutIdRef.current = setTimeout(tickRef.current, typingSpeed);
    }
  }, [isActive, typingSpeed]);

  return { displayText };
}
