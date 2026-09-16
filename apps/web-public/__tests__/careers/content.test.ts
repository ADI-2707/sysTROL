import { describe, it, expect } from "vitest";
import { vacanciesData, careerDepartments, getVacancyById } from "@/content/careers";

describe("Careers Content Data Integrity", () => {
  it("initializes vacanciesData as an array ready for CMS ingestion", () => {
    expect(Array.isArray(vacanciesData)).toBe(true);
  });

  it("ensures career departments are defined", () => {
    expect(careerDepartments.length).toBeGreaterThan(0);
    expect(careerDepartments).toContain("All Roles");
  });

  it("returns undefined for getVacancyById when role does not exist", () => {
    const notFound = getVacancyById("nonexistent-role-id");
    expect(notFound).toBeUndefined();
  });
});
