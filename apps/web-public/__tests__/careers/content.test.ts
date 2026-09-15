import { describe, it, expect } from "vitest";
import { vacanciesData, careerDepartments, getVacancyById } from "@/content/careers";

describe("Careers Content Data Integrity", () => {
  it("contains exactly 6 defined engineering vacancies", () => {
    expect(vacanciesData).toHaveLength(6);
  });

  it("ensures every vacancy has all mandatory fields populated", () => {
    vacanciesData.forEach((vacancy) => {
      expect(vacancy.id).toBeTruthy();
      expect(vacancy.title).toBeTruthy();
      expect(vacancy.department).toBeTruthy();
      expect(vacancy.location).toBeTruthy();
      expect(vacancy.type).toBeTruthy();
      expect(vacancy.experience).toBeTruthy();
      expect(vacancy.description).toBeTruthy();
      expect(Array.isArray(vacancy.responsibilities)).toBe(true);
      expect(vacancy.responsibilities.length).toBeGreaterThan(0);
      expect(Array.isArray(vacancy.requirements)).toBe(true);
      expect(vacancy.requirements.length).toBeGreaterThan(0);
      expect(Array.isArray(vacancy.skills)).toBe(true);
      expect(vacancy.skills.length).toBeGreaterThan(0);
    });
  });

  it("ensures all vacancy IDs are unique", () => {
    const ids = vacanciesData.map((v) => v.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(vacanciesData.length);
  });

  it("ensures all vacancy departments exist in careerDepartments", () => {
    vacanciesData.forEach((v) => {
      expect(careerDepartments).toContain(v.department);
    });
  });

  it("retrieves a vacancy by id accurately via getVacancyById", () => {
    const first = vacanciesData[0];
    const found = getVacancyById(first.id);
    expect(found).toBeDefined();
    expect(found?.title).toBe(first.title);

    const notFound = getVacancyById("nonexistent-role-id");
    expect(notFound).toBeUndefined();
  });
});
