import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  SYSTROL_SESSION_STORAGE_KEY,
  getStoredSession,
  setStoredSession,
  clearStoredSession,
  updateStoredToken,
} from "./auth-storage.js";

describe("auth-storage unit tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null when no session is present", () => {
    expect(getStoredSession()).toBeNull();
  });

  it("stores and retrieves a valid session without persisting sensitive tokens", () => {
    const session = {
      token: "access-token-123",
      refreshToken: "refresh-token-456",
      user: {
        id: "usr-1",
        email: "admin@systrol.com",
        name: "Admin User",
        role: "SUPER_ADMIN",
        team: "LEADERSHIP",
        designation: "Executive",
      },
    };
    setStoredSession(session);
    const retrieved = getStoredSession();
    expect(retrieved?.user).toEqual(session.user);
    expect(retrieved?.token).toBeUndefined();
    expect(retrieved?.refreshToken).toBeUndefined();
  });

  it("handles corrupted non-JSON storage content safely", () => {
    localStorage.setItem(SYSTROL_SESSION_STORAGE_KEY, "invalid-json-string{");
    expect(getStoredSession()).toBeNull();
  });

  it("clears stored session and legacy key", () => {
    localStorage.setItem(SYSTROL_SESSION_STORAGE_KEY, JSON.stringify({ user: { id: "test" } }));
    localStorage.setItem("systrol_user", JSON.stringify({ token: "legacy" }));
    clearStoredSession();
    expect(localStorage.getItem(SYSTROL_SESSION_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem("systrol_user")).toBeNull();
    expect(getStoredSession()).toBeNull();
  });

  it("safely handles updateStoredToken as no-op for token storage", () => {
    setStoredSession({ user: { id: "usr-1", email: "test@example.com", name: "User", role: "USER", team: "OPS", designation: "Engineer" } });
    updateStoredToken("new-token", "new-refresh");
    const updated = getStoredSession();
    expect(updated?.token).toBeUndefined();
    expect(updated?.refreshToken).toBeUndefined();
  });

  it("Scenario 1.4: safely catches QuotaExceededError or storage exceptions without throwing", () => {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = vi.fn().mockImplementation(() => {
      throw new DOMException("QuotaExceededError", "QuotaExceededError");
    });

    expect(() => setStoredSession({ user: { id: "test", email: "test@example.com", name: "User", role: "USER", team: "OPS", designation: "Engineer" } })).not.toThrow();
    expect(() => updateStoredToken("test")).not.toThrow();

    localStorage.setItem = originalSetItem;
  });
});