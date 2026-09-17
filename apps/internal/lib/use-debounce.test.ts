import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./use-debounce.js";

describe("useDebounce & Mutation Locking Unit Tests", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("defers value update until the specified delay has passed", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay?: number }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 350 },
      }
    );

    expect(result.current).toBe("initial");

    rerender({ value: "updated", delay: 350 });
    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe("updated");
  });

  it("discards intermediate rapid keystrokes and only propagates final value", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 350),
      {
        initialProps: { value: "s" },
      }
    );

    expect(result.current).toBe("s");

    rerender({ value: "st" });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe("s");

    rerender({ value: "ste" });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe("s");

    rerender({ value: "steel" });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe("s");

    act(() => {
      vi.advanceTimersByTime(350);
    });
    expect(result.current).toBe("steel");
  });

  it("validates button locking state lifecycle during async mutation", async () => {
    let isPending = false;
    const mutate = async () => {
      isPending = true;
      await new Promise((resolve) => setTimeout(resolve, 500));
      isPending = false;
    };

    expect(isPending).toBe(false);

    const promise = mutate();
    expect(isPending).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(500);
      await promise;
    });

    expect(isPending).toBe(false);
  });
});
