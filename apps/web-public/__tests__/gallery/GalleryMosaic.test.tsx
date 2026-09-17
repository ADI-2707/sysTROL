import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GalleryMosaic } from "@/components/sections/Gallery/GalleryMosaic";
import { galleryItems, GalleryItem } from "@/content/gallery";

describe("GalleryMosaic Component", () => {
  it("renders all category filter buttons with correct item counts", () => {
    render(<GalleryMosaic onSelectItem={vi.fn()} />);

    const allBtn = screen.getByRole("button", { name: /all showcase/i });
    expect(allBtn).toBeInTheDocument();
    expect(allBtn).toHaveTextContent(String(galleryItems.length));

    const workplaceBtn = screen.getByRole("button", { name: /our workplace & labs/i });
    expect(workplaceBtn).toBeInTheDocument();

    const teamBtn = screen.getByRole("button", { name: /our team/i });
    expect(teamBtn).toBeInTheDocument();

    const deploymentsBtn = screen.getByRole("button", { name: /onsite deployments/i });
    expect(deploymentsBtn).toBeInTheDocument();
  });

  it("filters visible sections when a category button is clicked", () => {
    render(<GalleryMosaic onSelectItem={vi.fn()} />);

    expect(screen.getByRole("heading", { name: /our workplace & simulation labs/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /our team in action/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /onsite deployments & commissioning/i })).toBeInTheDocument();

    const workplaceBtn = screen.getByRole("button", { name: /our workplace & labs/i });
    fireEvent.click(workplaceBtn);

    expect(screen.getByRole("heading", { name: /our workplace & simulation labs/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /our team in action/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /onsite deployments & commissioning/i })).not.toBeInTheDocument();
  });

  it("shows only team section when team filter is active", () => {
    render(<GalleryMosaic onSelectItem={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /our team/i }));

    expect(screen.queryByRole("heading", { name: /our workplace & simulation labs/i })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /our team in action/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /onsite deployments & commissioning/i })).not.toBeInTheDocument();
  });

  it("shows only deployments section when deployments filter is active", () => {
    render(<GalleryMosaic onSelectItem={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /onsite deployments/i }));

    expect(screen.queryByRole("heading", { name: /our workplace & simulation labs/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /our team in action/i })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /onsite deployments & commissioning/i })).toBeInTheDocument();
  });

  it("calls onSelectItem when a gallery card is clicked", () => {
    const handleSelect = vi.fn();
    render(<GalleryMosaic onSelectItem={handleSelect} />);

    const targetItem = galleryItems[0];
    const card = screen.getByRole("button", { name: `View ${targetItem.title}` });
    fireEvent.click(card);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(targetItem);
  });

  it("calls onSelectItem when Enter or Space key is pressed on a card", () => {
    const handleSelect = vi.fn();
    render(<GalleryMosaic onSelectItem={handleSelect} />);

    const targetItem = galleryItems[1];
    const card = screen.getByRole("button", { name: `View ${targetItem.title}` });

    fireEvent.keyDown(card, { key: "Enter" });
    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(targetItem);

    fireEvent.keyDown(card, { key: " " });
    expect(handleSelect).toHaveBeenCalledTimes(2);
  });

  it("does not call onSelectItem on irrelevant keys", () => {
    const handleSelect = vi.fn();
    render(<GalleryMosaic onSelectItem={handleSelect} />);

    const card = screen.getByRole("button", { name: `View ${galleryItems[0].title}` });
    fireEvent.keyDown(card, { key: "Tab" });
    fireEvent.keyDown(card, { key: "Escape" });

    expect(handleSelect).not.toHaveBeenCalled();
  });

  it("renders dynamic API items when items prop is provided", () => {
    const dynamicItems: GalleryItem[] = [
      {
        id: "api-1",
        title: "API Dynamic Workplace Image",
        category: "workplace",
        categoryLabel: "Workplace & Labs",
        location: "Bengaluru HQ",
        description: "A dynamically loaded image from the public API.",
        image: "https://jvbwajcypzryqbvmuirv.storage.supabase.co/storage/v1/object/public/test/api-1.webp",
        tags: ["automation", "lab"],
        aspect: "featured",
      },
      {
        id: "api-2",
        title: "API Dynamic Team Image",
        category: "team",
        categoryLabel: "Our Team",
        location: "Bengaluru HQ",
        description: "Team image from API.",
        image: "https://jvbwajcypzryqbvmuirv.storage.supabase.co/storage/v1/object/public/test/api-2.webp",
        tags: ["team"],
        aspect: "standard",
      },
    ];

    render(<GalleryMosaic items={dynamicItems} onSelectItem={vi.fn()} />);

    expect(screen.getByRole("button", { name: /view api dynamic workplace image/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /view api dynamic team image/i })).toBeInTheDocument();
  });

  it("items without gridArea (dynamic API items) are all rendered and visible", () => {
    const apiItems: GalleryItem[] = Array.from({ length: 6 }, (_, i) => ({
      id: `api-${i}`,
      title: `API Mill Image ${i}`,
      category: (["workplace", "team", "deployments"] as const)[i % 3],
      categoryLabel: "Test",
      location: "Test Location",
      description: "Dynamic test item",
      image: `https://example.com/img-${i}.webp`,
      tags: ["rolling-mill"],
      aspect: "standard" as const,
    }));

    render(<GalleryMosaic items={apiItems} onSelectItem={vi.fn()} />);

    for (const item of apiItems) {
      expect(screen.getByRole("button", { name: `View ${item.title}` })).toBeInTheDocument();
    }
  });

  it("featured aspect items receive the featuredCard class via card structure", () => {
    const featuredItem: GalleryItem[] = [
      {
        id: "feat-1",
        title: "Featured Mill Shot",
        category: "workplace",
        categoryLabel: "Workplace & Labs",
        location: "Bengaluru",
        description: "Featured.",
        image: "/images/gallery/test-featured.jpg",
        tags: ["lab"],
        aspect: "featured",
      },
      {
        id: "std-1",
        title: "Standard Mill Shot",
        category: "workplace",
        categoryLabel: "Workplace & Labs",
        location: "Bengaluru",
        description: "Standard.",
        image: "/images/gallery/test-standard.jpg",
        tags: ["lab"],
        aspect: "standard",
      },
    ];

    render(<GalleryMosaic items={featuredItem} onSelectItem={vi.fn()} />);

    const featuredCard = screen.getByRole("button", { name: /view featured mill shot/i });
    const standardCard = screen.getByRole("button", { name: /view standard mill shot/i });

    expect(featuredCard.className).toContain("featuredCard");
    expect(standardCard.className).not.toContain("featuredCard");
  });

  it("falls back to static galleryItems when no items prop is provided", () => {
    render(<GalleryMosaic onSelectItem={vi.fn()} />);
    expect(screen.getAllByRole("button", { name: /^View /i }).length).toBe(galleryItems.length);
  });

  it("falls back to static galleryItems when items prop is empty array", () => {
    render(<GalleryMosaic items={[]} onSelectItem={vi.fn()} />);
    expect(screen.getAllByRole("button", { name: /^View /i }).length).toBe(galleryItems.length);
  });

  it("does not render empty section block when a category has zero items in all showcase view", () => {
    const onlyTeamItems: GalleryItem[] = [
      {
        id: "team-only-1",
        title: "Single Team Image",
        category: "team",
        categoryLabel: "Our Team",
        location: "Bengaluru",
        description: "Team description",
        image: "/images/gallery/team.jpg",
        tags: ["team"],
        aspect: "standard",
      },
    ];

    render(<GalleryMosaic items={onlyTeamItems} onSelectItem={vi.fn()} />);

    expect(screen.queryByRole("heading", { name: /our workplace & simulation labs/i })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /our team in action/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /onsite deployments & commissioning/i })).not.toBeInTheDocument();
  });

  it("renders empty state notice when filtered category has zero items", () => {
    const onlyTeamItems: GalleryItem[] = [
      {
        id: "team-only-1",
        title: "Single Team Image",
        category: "team",
        categoryLabel: "Our Team",
        location: "Bengaluru",
        description: "Team description",
        image: "/images/gallery/team.jpg",
        tags: ["team"],
        aspect: "standard",
      },
    ];

    render(<GalleryMosaic items={onlyTeamItems} onSelectItem={vi.fn()} />);

    const workplaceBtn = screen.getByRole("button", { name: /our workplace & labs/i });
    fireEvent.click(workplaceBtn);

    expect(screen.getByText(/no workplace & labs assets found/i)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /our workplace & simulation labs/i })).not.toBeInTheDocument();
  });

  it("scrolls to section top smoothly if section is scrolled out of view above viewport", () => {
    const scrollToSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    Object.defineProperty(window, "scrollY", { value: 500, writable: true, configurable: true });

    const getBoundingClientRectSpy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue({
        top: -150,
        bottom: 800,
        left: 0,
        right: 1000,
        width: 1000,
        height: 950,
        x: 0,
        y: -150,
        toJSON: () => {},
      });

    render(<GalleryMosaic onSelectItem={vi.fn()} />);

    const workplaceBtn = screen.getByRole("button", { name: /our workplace & labs/i });
    fireEvent.click(workplaceBtn);

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 330,
      behavior: "smooth",
    });

    scrollToSpy.mockRestore();
    getBoundingClientRectSpy.mockRestore();
  });

  it("does not trigger window.scrollTo when section top is already within viewport", () => {
    const scrollToSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    Object.defineProperty(window, "scrollY", { value: 500, writable: true, configurable: true });

    const getBoundingClientRectSpy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue({
        top: 50,
        bottom: 800,
        left: 0,
        right: 1000,
        width: 1000,
        height: 750,
        x: 0,
        y: 50,
        toJSON: () => {},
      });

    render(<GalleryMosaic onSelectItem={vi.fn()} />);

    const workplaceBtn = screen.getByRole("button", { name: /our workplace & labs/i });
    fireEvent.click(workplaceBtn);

    expect(scrollToSpy).not.toHaveBeenCalled();

    scrollToSpy.mockRestore();
    getBoundingClientRectSpy.mockRestore();
  });

  it("assigns fullCard class when a section has exactly 1 item", () => {
    const singleItem: GalleryItem[] = [
      {
        id: "single-1",
        title: "Solo Lab Shot",
        category: "workplace",
        categoryLabel: "Workplace & Labs",
        location: "Bengaluru",
        description: "Solo.",
        image: "/images/gallery/solo.jpg",
        tags: ["lab"],
        aspect: "standard",
      },
    ];

    render(<GalleryMosaic items={singleItem} onSelectItem={vi.fn()} />);

    const card = screen.getByRole("button", { name: /view solo lab shot/i });
    expect(card.className).toContain("fullCard");
  });

  it("applies alternating mosaic rhythm to a 4-item section without consecutive featured spans", () => {
    const fourItems: GalleryItem[] = Array.from({ length: 4 }, (_, i) => ({
      id: `wp-${i}`,
      title: `Mill Equipment ${i}`,
      category: "workplace" as const,
      categoryLabel: "Workplace & Labs",
      location: "Bengaluru",
      description: `Description ${i}`,
      image: `/images/gallery/wp-${i}.jpg`,
      tags: ["lab"],
      aspect: "standard" as const,
    }));

    render(<GalleryMosaic items={fourItems} onSelectItem={vi.fn()} />);

    const card0 = screen.getByRole("button", { name: "View Mill Equipment 0" });
    const card1 = screen.getByRole("button", { name: "View Mill Equipment 1" });
    const card2 = screen.getByRole("button", { name: "View Mill Equipment 2" });
    const card3 = screen.getByRole("button", { name: "View Mill Equipment 3" });

    expect(card0.className).toContain("featuredCard");
    expect(card1.className).not.toContain("featuredCard");
    expect(card2.className).not.toContain("featuredCard");
    expect(card3.className).toContain("featuredCard");
  });

  it("applies clean triplet row for trailing 3 items in odd 5-item section", () => {
    const fiveItems: GalleryItem[] = Array.from({ length: 5 }, (_, i) => ({
      id: `wp-${i}`,
      title: `Mill Equipment ${i}`,
      category: "workplace" as const,
      categoryLabel: "Workplace & Labs",
      location: "Bengaluru",
      description: `Description ${i}`,
      image: `/images/gallery/wp-${i}.jpg`,
      tags: ["lab"],
      aspect: "standard" as const,
    }));

    render(<GalleryMosaic items={fiveItems} onSelectItem={vi.fn()} />);

    const card0 = screen.getByRole("button", { name: "View Mill Equipment 0" });
    const card1 = screen.getByRole("button", { name: "View Mill Equipment 1" });
    const card2 = screen.getByRole("button", { name: "View Mill Equipment 2" });
    const card3 = screen.getByRole("button", { name: "View Mill Equipment 3" });
    const card4 = screen.getByRole("button", { name: "View Mill Equipment 4" });

    expect(card0.className).toContain("featuredCard");
    expect(card1.className).not.toContain("featuredCard");
    expect(card2.className).not.toContain("featuredCard");
    expect(card3.className).not.toContain("featuredCard");
    expect(card4.className).not.toContain("featuredCard");
  });
});
