import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import MediaPage from "./page";
import { UploadModal } from "./UploadModal";

vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({
    user: { id: "usr-admin-01", name: "Admin Controls", role: "SUPER_ADMIN", token: "mock-token" },
    isAuthenticated: true,
    hasValidToken: true,
  }),
}));

describe("Media CMS category isolation", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            items: [],
            total: 0,
            totalPages: 1,
            media: [],
          }),
      })
    );
  });

  it("renders standard categories without Project Case Studies in MediaPage filter bar", async () => {
    render(<MediaPage />);

    expect(screen.getByRole("button", { name: /^All Assets$/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /^Gallery$/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /^Products & Spares$/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /^Facilities & Labs$/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /^Branding$/i })).toBeDefined();

    expect(screen.queryByRole("button", { name: /Project Case Studies/i })).toBeNull();
    expect(screen.queryByText(/Project Case Studies/i)).toBeNull();
  });

  it("does not offer PROJECTS in UploadModal category selector", () => {
    render(
      <UploadModal
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
        apiUrl="https://systrol-api.onrender.com"
        token="mock-token"
      />
    );

    expect(screen.getByRole("option", { name: /Gallery \(Public Showcase\)/i })).toBeDefined();
    expect(screen.getByRole("option", { name: /Machinery & Spares Catalog/i })).toBeDefined();
    expect(screen.getByRole("option", { name: /Facilities & Labs/i })).toBeDefined();
    expect(screen.getByRole("option", { name: /Branding & Identity/i })).toBeDefined();

    expect(screen.queryByRole("option", { name: /Project Case Studies/i })).toBeNull();
  });
});
