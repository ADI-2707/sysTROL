import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ToastProvider, useToast } from "@systrol/ui";

function ToastTestTrigger() {
  const { toast } = useToast();
  return (
    <div>
      <button onClick={() => toast.success("Success operation", { description: "Data synced" })}>
        Trigger Success
      </button>
      <button onClick={() => toast.error("Error occurred")}>
        Trigger Error
      </button>
      <button onClick={() => toast.warning("Warning alert")}>
        Trigger Warning
      </button>
      <button onClick={() => toast.info("Info notice")}>
        Trigger Info
      </button>
    </div>
  );
}

describe("Toast Notification System", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders trigger buttons inside ToastProvider", () => {
    render(
      <ToastProvider>
        <ToastTestTrigger />
      </ToastProvider>
    );
    expect(screen.getByText("Trigger Success")).toBeDefined();
  });

  it("displays success toast when triggered", () => {
    render(
      <ToastProvider>
        <ToastTestTrigger />
      </ToastProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText("Trigger Success"));
    });

    const alert = screen.getByRole("alert");
    expect(alert).toBeDefined();
    expect(screen.getByText("Success operation")).toBeDefined();
    expect(screen.getByText("Data synced")).toBeDefined();
  });

  it("displays error, warning, and info variants", () => {
    render(
      <ToastProvider>
        <ToastTestTrigger />
      </ToastProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText("Trigger Error"));
    });
    expect(screen.getByText("Error occurred")).toBeDefined();

    act(() => {
      fireEvent.click(screen.getByText("Trigger Warning"));
    });
    expect(screen.getByText("Warning alert")).toBeDefined();

    act(() => {
      fireEvent.click(screen.getByText("Trigger Info"));
    });
    expect(screen.getByText("Info notice")).toBeDefined();
  });

  it("dismisses toast manually via close button", () => {
    render(
      <ToastProvider>
        <ToastTestTrigger />
      </ToastProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText("Trigger Success"));
    });

    const closeBtn = screen.getByRole("button", { name: "Close notification" });
    act(() => {
      fireEvent.click(closeBtn);
    });

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(screen.queryByText("Success operation")).toBeNull();
  });

  it("auto-dismisses toast when duration timer expires", () => {
    render(
      <ToastProvider>
        <ToastTestTrigger />
      </ToastProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText("Trigger Success"));
    });

    expect(screen.getByText("Success operation")).toBeDefined();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.queryByText("Success operation")).toBeNull();
  });
});
