import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { resolveMediaUrl, FALLBACK_PROJECT_IMAGE } from "./media-utils";

describe("resolveMediaUrl utility tests", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_PUBLIC_SITE_URL;
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns FALLBACK_PROJECT_IMAGE when url is null, undefined, or empty", () => {
    expect(resolveMediaUrl(null)).toBe(FALLBACK_PROJECT_IMAGE);
    expect(resolveMediaUrl(undefined)).toBe(FALLBACK_PROJECT_IMAGE);
    expect(resolveMediaUrl("")).toBe(FALLBACK_PROJECT_IMAGE);
    expect(resolveMediaUrl("   ")).toBe(FALLBACK_PROJECT_IMAGE);
  });

  it("returns absolute URLs unchanged", () => {
    const httpsUrl = "https://jvbwajcypzryqbvmuirv.supabase.co/storage/v1/object/public/systrol-media/photo.jpg";
    const httpUrl = "http://example.com/asset.webp";
    const dataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA";

    expect(resolveMediaUrl(httpsUrl)).toBe(httpsUrl);
    expect(resolveMediaUrl(httpUrl)).toBe(httpUrl);
    expect(resolveMediaUrl(dataUrl)).toBe(dataUrl);
  });

  it("returns clean local relative path when no public site origin is configured", () => {
    expect(resolveMediaUrl("/images/hero-rolling-mill.jpg")).toBe("/images/hero-rolling-mill.jpg");
    expect(resolveMediaUrl("images/projects/wire-rod-mill.jpg")).toBe("/images/projects/wire-rod-mill.jpg");
  });

  it("prepends NEXT_PUBLIC_PUBLIC_SITE_URL when configured in environment", () => {
    process.env.NEXT_PUBLIC_PUBLIC_SITE_URL = "https://sys-trol.com";

    expect(resolveMediaUrl("/images/hero-rolling-mill.jpg")).toBe(
      "https://sys-trol.com/images/hero-rolling-mill.jpg"
    );
  });
});
