import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useVisibilityPolling } from "./use-visibility-polling.js";

describe("useVisibilityPolling unit tests", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.restoreAllMocks();
    Object.defineProperty(document, "visibilityState", {
      value: "visible",
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("executes immediately on mount and periodically across intervals when visible", async () => {
    const callback = vi.fn().mockResolvedValue(undefined);

    renderHook(() =>
      useVisibilityPolling(callback, { intervalMs: 5000, enabled: true })
    );

    await act(async () => {
      await Promise.resolve();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    await act(async () => {
      vi.advanceTimersByTime(5000);
      await Promise.resolve();
    });
    expect(callback).toHaveBeenCalledTimes(2);

    await act(async () => {
      vi.advanceTimersByTime(5000);
      await Promise.resolve();
    });
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it("pauses polling while document visibilityState is hidden", async () => {
    const callback = vi.fn().mockResolvedValue(undefined);

    renderHook(() =>
      useVisibilityPolling(callback, { intervalMs: 5000, enabled: true })
    );

    await act(async () => {
      await Promise.resolve();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    Object.defineProperty(document, "visibilityState", {
      value: "hidden",
      writable: true,
      configurable: true,
    });

    await act(async () => {
      vi.advanceTimersByTime(15000);
      await Promise.resolve();
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("resumes and executes immediately when document becomes visible again", async () => {
    const callback = vi.fn().mockResolvedValue(undefined);

    renderHook(() =>
      useVisibilityPolling(callback, { intervalMs: 5000, enabled: true })
    );

    await act(async () => {
      await Promise.resolve();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    Object.defineProperty(document, "visibilityState", {
      value: "hidden",
      writable: true,
      configurable: true,
    });

    await act(async () => {
      vi.advanceTimersByTime(10000);
      await Promise.resolve();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    Object.defineProperty(document, "visibilityState", {
      value: "visible",
      writable: true,
      configurable: true,
    });

    await act(async () => {
      document.dispatchEvent(new Event("visibilitychange"));
      await Promise.resolve();
    });
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("permanently halts polling on 401 error circuit breaker", async () => {
    const err401: any = new Error("Unauthorized");
    err401.status = 401;
    let callCount = 0;
    const callback = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 2) {
        throw err401;
      }
      return Promise.resolve();
    });
    const onError = vi.fn();

    renderHook(() =>
      useVisibilityPolling(callback, { intervalMs: 3000, enabled: true, onError })
    );

    await act(async () => {
      await Promise.resolve();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    await act(async () => {
      vi.advanceTimersByTime(3000);
      await Promise.resolve();
    });
    expect(callback).toHaveBeenCalledTimes(2);
    expect(onError).toHaveBeenCalledWith(err401);

    await act(async () => {
      vi.advanceTimersByTime(9000);
      await Promise.resolve();
    });
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("allows manual halt and resume", async () => {
    const callback = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useVisibilityPolling(callback, { intervalMs: 4000, enabled: true })
    );

    await act(async () => {
      await Promise.resolve();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.halt();
    });

    await act(async () => {
      vi.advanceTimersByTime(12000);
      await Promise.resolve();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    await act(async () => {
      result.current.resume();
      await Promise.resolve();
    });
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("cleans up interval and visibility event listener on unmount", async () => {
    const callback = vi.fn().mockResolvedValue(undefined);

    const { unmount } = renderHook(() =>
      useVisibilityPolling(callback, { intervalMs: 3000, enabled: true })
    );

    await act(async () => {
      await Promise.resolve();
    });
    expect(callback).toHaveBeenCalledTimes(1);

    unmount();

    await act(async () => {
      vi.advanceTimersByTime(10000);
      document.dispatchEvent(new Event("visibilitychange"));
      await Promise.resolve();
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
