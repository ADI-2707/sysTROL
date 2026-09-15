import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GalleryMosaic } from "@/components/sections/Gallery/GalleryMosaic";
import { galleryItems } from "@/content/gallery";

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
});
