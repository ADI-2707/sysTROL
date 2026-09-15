import { describe, it, expect } from "vitest";
import { galleryItems, galleryCategories } from "@/content/gallery";

describe("Gallery Content Data Integrity", () => {
  it("contains exactly 10 curated gallery items", () => {
    expect(galleryItems).toHaveLength(10);
  });

  it("ensures every gallery item has all mandatory fields", () => {
    const validCategories = ["workplace", "team", "deployments"];

    galleryItems.forEach((item) => {
      expect(item.id).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(validCategories).toContain(item.category);
      expect(item.image).toMatch(/^\/images\/gallery\/[\w-]+\.(jpg|jpeg|png)$/);
      expect(item.location).toBeTruthy();
      expect(item.description).toBeTruthy();
      expect(Array.isArray(item.tags)).toBe(true);
      expect(item.tags.length).toBeGreaterThan(0);
      expect(item.gridArea).toBeTruthy();
    });
  });

  it("ensures all gallery item IDs are unique", () => {
    const ids = galleryItems.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(galleryItems.length);
  });

  it("verifies all categories have items associated with them", () => {
    const categories = ["workplace", "team", "deployments"];
    categories.forEach((cat) => {
      const itemsInCat = galleryItems.filter((item) => item.category === cat);
      expect(itemsInCat.length).toBeGreaterThan(0);
    });
  });

  it("verifies galleryCategories metadata definition", () => {
    expect(galleryCategories).toHaveLength(4);
    const catIds = galleryCategories.map((c) => c.id);
    expect(catIds).toEqual(["all", "workplace", "team", "deployments"]);
  });
});
