import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Skeleton,
  SkeletonCard,
  SkeletonKpiCard,
  SkeletonTableRow,
} from "./skeleton";

describe("Skeleton components", () => {
  it("renders base rectangular skeleton by default", () => {
    render(<Skeleton />);
    const el = screen.getByTestId("skeleton");
    expect(el).toBeDefined();
    expect(el.className).toContain("skeleton-shimmer");
  });

  it("renders with custom dimensions and variants", () => {
    const { rerender } = render(<Skeleton variant="circular" width={48} height={48} />);
    let el = screen.getByTestId("skeleton");
    expect(el.style.width).toBe("48px");
    expect(el.style.height).toBe("48px");
    expect(el.style.borderRadius).toBe("50%");

    rerender(<Skeleton variant="text" width="60%" height={16} />);
    el = screen.getByTestId("skeleton");
    expect(el.style.width).toBe("60%");
    expect(el.style.height).toBe("16px");

    rerender(<Skeleton variant="card" height={200} />);
    el = screen.getByTestId("skeleton");
    expect(el.style.height).toBe("200px");
  });

  it("renders SkeletonCard compound component", () => {
    render(<SkeletonCard height={180} />);
    const card = screen.getByTestId("skeleton-card");
    expect(card).toBeDefined();
    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons.length).toBe(4);
  });

  it("renders SkeletonKpiCard compound component", () => {
    render(<SkeletonKpiCard />);
    const kpi = screen.getByTestId("skeleton-kpi-card");
    expect(kpi).toBeDefined();
    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons.length).toBe(4);
  });

  it("renders SkeletonTableRow inside a table with configurable columns", () => {
    render(
      <table>
        <tbody>
          <SkeletonTableRow columns={5} />
        </tbody>
      </table>
    );
    const row = screen.getByTestId("skeleton-table-row");
    expect(row).toBeDefined();
    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons.length).toBe(5);
  });
});
