import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GalleryLightbox } from "@/components/sections/Gallery/GalleryLightbox";
import { galleryItems } from "@/content/gallery";

describe("GalleryLightbox Component", () => {
  it("renders nothing when item is null", () => {
    const { container } = render(
      <GalleryLightbox
        item={null}
        items={galleryItems}
        onClose={vi.fn()}
        onNavigate={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders full lightbox modal content when item is selected", () => {
    const item = galleryItems[0];
    render(
      <GalleryLightbox
        item={item}
        items={galleryItems}
        onClose={vi.fn()}
        onNavigate={vi.fn()}
      />
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");

    expect(screen.getByRole("heading", { name: item.title })).toBeInTheDocument();
    expect(screen.getByText(item.description)).toBeInTheDocument();
    expect(screen.getByText(item.location)).toBeInTheDocument();

    item.tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it("triggers onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <GalleryLightbox
        item={galleryItems[0]}
        items={galleryItems}
        onClose={handleClose}
        onNavigate={vi.fn()}
      />
    );

    const closeBtn = screen.getByRole("button", { name: /close lightbox/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("triggers onNavigate when navigation buttons are clicked", () => {
    const handleNavigate = vi.fn();

    render(
      <GalleryLightbox
        item={galleryItems[1]}
        items={galleryItems}
        onClose={vi.fn()}
        onNavigate={handleNavigate}
      />
    );

    const nextBtn = screen.getByRole("button", { name: /next image/i });
    const prevBtn = screen.getByRole("button", { name: /previous image/i });

    fireEvent.click(nextBtn);
    expect(handleNavigate).toHaveBeenCalledWith(galleryItems[2]);

    fireEvent.click(prevBtn);
    expect(handleNavigate).toHaveBeenCalledWith(galleryItems[0]);
  });

  it("handles keyboard events: Escape closes, ArrowRight advances, ArrowLeft goes back", () => {
    const handleClose = vi.fn();
    const handleNavigate = vi.fn();

    render(
      <GalleryLightbox
        item={galleryItems[1]}
        items={galleryItems}
        onClose={handleClose}
        onNavigate={handleNavigate}
      />
    );

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(handleNavigate).toHaveBeenCalledWith(galleryItems[2]);

    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(handleNavigate).toHaveBeenCalledWith(galleryItems[0]);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
