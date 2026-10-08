import { describe, it, expect } from "vitest";
import { parseJwt, isTokenValid } from "./token-utils.js";

function createJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const jsonPayload = JSON.stringify(payload);
  const base64Payload = btoa(unescape(encodeURIComponent(jsonPayload)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  const signature = "dummy-signature";
  return `${header}.${base64Payload}.${signature}`;
}

describe("token-utils unit tests", () => {
  describe("parseJwt", () => {
    it("successfully decodes a standard 3-part JWT payload", () => {
      const exp = Math.floor(Date.now() / 1000) + 3600;
      const token = createJwt({ sub: "user-123", role: "ADMIN", exp });
      const decoded = parseJwt(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.sub).toBe("user-123");
      expect(decoded?.role).toBe("ADMIN");
      expect(decoded?.exp).toBe(exp);
    });

    it("handles URL-safe base64 characters (- and _) correctly", () => {
      const token = createJwt({ specialChars: "??+++///---___", id: "user-safe" });
      const decoded = parseJwt(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.id).toBe("user-safe");
    });

    it("returns null for non-JWT strings or strings without 3 parts", () => {
      expect(parseJwt("")).toBeNull();
      expect(parseJwt("invalid-token")).toBeNull();
      expect(parseJwt("header.payload")).toBeNull();
      expect(parseJwt("a.b.c.d")).toBeNull();
    });

    it("returns null for malformed base64 or invalid JSON in payload", () => {
      expect(parseJwt("header.!!!invalid-base64!!!.sig")).toBeNull();
      const notJson = btoa("just a plain text not json");
      expect(parseJwt(`header.${notJson}.sig`)).toBeNull();
    });
  });

  describe("isTokenValid", () => {
    it("returns true for a token with a future expiration timestamp", () => {
      const futureExp = Math.floor(Date.now() / 1000) + 1800; // 30 minutes in future
      const token = createJwt({ sub: "user-abc", exp: futureExp });
      expect(isTokenValid(token)).toBe(true);
    });

    it("returns false for a token with an expired timestamp", () => {
      const pastExp = Math.floor(Date.now() / 1000) - 60; // 1 minute ago
      const token = createJwt({ sub: "user-abc", exp: pastExp });
      expect(isTokenValid(token)).toBe(false);
    });

    it("returns false for null, undefined, or empty/whitespace string", () => {
      expect(isTokenValid(null)).toBe(false);
      expect(isTokenValid(undefined)).toBe(false);
      expect(isTokenValid("")).toBe(false);
      expect(isTokenValid("   ")).toBe(false);
    });

    it("returns false if token payload lacks an exp claim", () => {
      const tokenWithoutExp = createJwt({ sub: "user-1" });
      expect(isTokenValid(tokenWithoutExp)).toBe(false);
    });

    it("returns false if exp claim is not a number", () => {
      const tokenWithStringExp = createJwt({ sub: "user-1", exp: "9999999999" });
      expect(isTokenValid(tokenWithStringExp)).toBe(false);
    });

    it("returns false for completely malformed token strings", () => {
      expect(isTokenValid("not.a.valid.jwt")).toBe(false);
      expect(isTokenValid("random-garbage")).toBe(false);
    });
  });
});
