import { describe, it, expect } from "vitest";
import { GET } from "../../app/api/health/route.js";

describe("Public Web Health Endpoint Tests", () => {
  it("returns 200 OK with status ok and timestamp", async () => {
    const res = await GET();
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(body.app).toBe("sysTROL Web Public");
    expect(typeof body.timestamp).toBe("number");
  });
});
