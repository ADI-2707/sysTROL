import { describe, it, expect } from "vitest";
import { galleryItems, galleryCategories, GalleryItem } from "@/content/gallery";

describe("Gallery Content Data Integrity", () => {
  it("contains exactly 10 curated gallery items", () => {
    expect(galleryItems).toHaveLength(10);
  });

  it("ensures every gallery item has all mandatory fields", () => {
    const validCategories = ["workplace", "team", "deployments"];
    const validAspects = ["featured", "tall", "standard", "wide"];

    galleryItems.forEach((item) => {
      expect(item.id).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(validCategories).toContain(item.category);
      expect(item.image).toMatch(/^\/images\/gallery\/[\w-]+\.(jpg|jpeg|png)$/);
      expect(item.location).toBeTruthy();
      expect(item.description).toBeTruthy();
      expect(Array.isArray(item.tags)).toBe(true);
      expect(item.tags.length).toBeGreaterThan(0);
      expect(validAspects).toContain(item.aspect);
    });
  });

  it("does not contain gridArea field on any item", () => {
    galleryItems.forEach((item) => {
      expect((item as any).gridArea).toBeUndefined();
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

  it("has at least one featured aspect item in each category", () => {
    const categories = ["workplace", "team", "deployments"] as const;
    categories.forEach((cat) => {
      const featuredInCat = galleryItems.filter(
        (item) => item.category === cat && (item.aspect === "featured" || item.aspect === "wide")
      );
      expect(featuredInCat.length).toBeGreaterThan(0);
    });
  });

  it("GalleryItem type does not have gridArea field in TypeScript interface", () => {
    const item: GalleryItem = {
      id: "test",
      title: "Test",
      category: "workplace",
      categoryLabel: "Workplace & Labs",
      location: "Bengaluru",
      description: "Test item",
      image: "/images/gallery/test.jpg",
      tags: ["test"],
      aspect: "standard",
    };
    expect(item).not.toHaveProperty("gridArea");
  });
});
