import { describe, it, expect } from "vitest";
import { canAccessPage, PAGE_ACCESS_RULES, EmployeeTeam } from "./permissions";

describe("permissions and RBAC rules for /cta and internal routes", () => {
  it("grants access to /cta for LEADERSHIP, COMMISSIONING, and SALES teams", () => {
    expect(canAccessPage("LEADERSHIP", "/cta")).toBe(true);
    expect(canAccessPage("COMMISSIONING", "/cta")).toBe(true);
    expect(canAccessPage("SALES", "/cta")).toBe(true);
  });

  it("strictly denies access to /cta for HR_ACCOUNTS team", () => {
    expect(canAccessPage("HR_ACCOUNTS", "/cta")).toBe(false);
  });

  it("denies access when team is null or undefined", () => {
    expect(canAccessPage(null, "/cta")).toBe(false);
    expect(canAccessPage(undefined, "/cta")).toBe(false);
  });

  it("grants access to subroutes under /cta for authorized teams", () => {
    expect(canAccessPage("SALES", "/cta/feed")).toBe(true);
    expect(canAccessPage("COMMISSIONING", "/cta/enquiries/123")).toBe(true);
    expect(canAccessPage("HR_ACCOUNTS", "/cta/feed")).toBe(false);
  });

  it("maintains expected page access for all standard dashboard routes", () => {
    const standardRoutes = ["/dashboard", "/projects", "/media", "/analytics", "/settings"];
    const allTeams: EmployeeTeam[] = ["LEADERSHIP", "COMMISSIONING", "HR_ACCOUNTS", "SALES"];

    for (const team of allTeams) {
      for (const route of standardRoutes) {
        expect(canAccessPage(team, route)).toBe(true);
      }
    }
  });

  it("verifies PAGE_ACCESS_RULES configuration structure", () => {
    expect(PAGE_ACCESS_RULES.LEADERSHIP).toContain("/cta");
    expect(PAGE_ACCESS_RULES.COMMISSIONING).toContain("/cta");
    expect(PAGE_ACCESS_RULES.SALES).toContain("/cta");
    expect(PAGE_ACCESS_RULES.HR_ACCOUNTS).not.toContain("/cta");
  });
});
