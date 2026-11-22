import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../../app/api/revalidate/route";
import { revalidatePath, revalidateTag } from "next/cache";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

describe("Revalidation API Route Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when secret is missing or invalid", async () => {
    const req = new NextRequest("http://localhost:3000/api/revalidate?secret=wrong-secret");
    const res = await POST(req);

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.message).toBe("Invalid revalidation secret");
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("successfully triggers revalidation when valid secret is provided", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/revalidate?secret=systrol-revalidate-secret-2026&path=/projects&tag=projects"
    );
    const res = await POST(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.revalidated).toBe(true);
    expect(body.path).toBe("/projects");
    expect(body.tag).toBe("projects");
    expect(revalidatePath).toHaveBeenCalledWith("/projects");
    expect(revalidateTag).toHaveBeenCalledWith("projects");
  });
});
