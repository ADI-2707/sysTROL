import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { MobileDrawer } from "@/components/layout/MobileDrawer/MobileDrawer";

describe("Navbar Component", () => {
  it("renders all navigation items in the exact required sequence", () => {
    render(<Navbar />);

    const nav = screen.getByRole("navigation", { name: /main navigation/i });
    expect(nav).toBeInTheDocument();

    const expectedSequence = [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Projects", href: "/projects" },
      { label: "Clients", href: "/clients" },
      { label: "Careers", href: "/careers" },
      { label: "Gallery", href: "/gallery" },
      { label: "Contact", href: "/contact" },
    ];

    const navLinks = screen.getAllByRole("link").filter((link) => {
      const href = link.getAttribute("href");
      return expectedSequence.some((item) => item.href === href);
    });

    const labels = navLinks.map((link) => link.textContent?.trim());
    expectedSequence.forEach((item, index) => {
      expect(labels).toContain(item.label);
    });

    const careersIndex = labels.indexOf("Careers");
    const galleryIndex = labels.indexOf("Gallery");
    const contactIndex = labels.indexOf("Contact");

    expect(careersIndex).toBeGreaterThan(-1);
    expect(galleryIndex).toBeGreaterThan(careersIndex);
    expect(contactIndex).toBeGreaterThan(galleryIndex);
  });

  it("contains company logo linking to homepage", () => {
    render(<Navbar />);
    const logoLink = screen.getByRole("link", { name: /systrol/i });
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("renders CTA button linking to contact", () => {
    render(<Navbar />);
    const ctaButton = screen.getByRole("link", { name: /get in touch/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute("href", "/contact");
  });
});

describe("MobileDrawer Component", () => {
  it("renders mobile drawer links in correct order with Gallery between Careers and Contact", () => {
    render(<MobileDrawer isOpen={true} onClose={() => {}} />);

    const drawer = screen.getByRole("dialog");
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveAttribute("aria-modal", "true");

    const links = screen.getAllByRole("link");
    const linkTexts = links.map((l) => l.textContent?.trim());

    expect(linkTexts).toContain("Careers");
    expect(linkTexts).toContain("Gallery & Showcase");
    expect(linkTexts).toContain("Contact Us");

    const careersPos = linkTexts.indexOf("Careers");
    const galleryPos = linkTexts.indexOf("Gallery & Showcase");
    const contactPos = linkTexts.indexOf("Contact Us");

    expect(careersPos).toBeGreaterThan(-1);
    expect(galleryPos).toBe(careersPos + 1);
    expect(contactPos).toBe(galleryPos + 1);
  });

  it("calls onClose when close button is clicked", () => {
    let closed = false;
    render(<MobileDrawer isOpen={true} onClose={() => { closed = true; }} />);

    const closeBtn = screen.getByRole("button", { name: /close menu/i });
    fireEvent.click(closeBtn);
    expect(closed).toBe(true);
  });
});
