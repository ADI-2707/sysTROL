import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ContactPage from "@/app/contact/page";

vi.mock("@/components/layout/Navbar/Navbar", () => ({
  Navbar: () => React.createElement("nav", { "data-testid": "navbar" }),
}));
vi.mock("@/components/layout/Footer/Footer", () => ({
  Footer: () => React.createElement("footer", { "data-testid": "footer" }),
}));
vi.mock("@/components/layout/FloatingContact/FloatingContact", () => ({
  FloatingContact: () => null,
}));
vi.mock("@/components/sections/PageHero/PageHero", () => ({
  PageHero: ({ children }: any) => React.createElement("div", { "data-testid": "page-hero" }, children),
}));
vi.mock("@/components/sections/CTASection/CTASection", () => ({
  CTASection: () => null,
}));
vi.mock("@/components/ui/Reveal/Reveal", () => ({
  Reveal: ({ children }: any) => React.createElement("div", null, children),
}));
vi.mock("next/image", () => ({
  default: ({ src, alt }: any) => React.createElement("img", { src, alt }),
}));

const fillContactForm = () => {
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Rajesh Kumar" } });
  fireEvent.change(screen.getByLabelText(/plant \/ company name/i), { target: { value: "Steel Plant Ltd" } });
  fireEvent.change(screen.getByLabelText(/professional email/i), { target: { value: "rajesh@plant.com" } });
  fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "+91 9845012345" } });
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "L2 Automation Consultancy" } });
  fireEvent.change(screen.getByLabelText(/requirement summary/i), { target: { value: "Need Level-2 automation for 16-stand mill configuration." } });
};

describe("Contact Form", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the contact form with all required fields", () => {
    render(<ContactPage />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/plant \/ company name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/professional email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByLabelText(/requirement summary/i)).toBeInTheDocument();
  });

  it("shows validation errors when form is submitted empty", async () => {
    render(<ContactPage />);
    const submitBtn = screen.getByRole("button", { name: /transmit technical enquiry/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/contact name must be at least 2 characters/i)).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid email", async () => {
    render(<ContactPage />);
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Rajesh Kumar" } });
    fireEvent.change(screen.getByLabelText(/plant \/ company name/i), { target: { value: "Steel Plant Ltd" } });
    fireEvent.change(screen.getByLabelText(/professional email/i), { target: { value: "not-an-email" } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "+91 9845012345" } });
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "L2 Automation Consultancy" } });
    fireEvent.change(screen.getByLabelText(/requirement summary/i), { target: { value: "Need automation for mill." } });

    fireEvent.click(screen.getByRole("button", { name: /transmit technical enquiry/i }));

    await waitFor(() => {
      expect(screen.getByText(/valid professional email/i)).toBeInTheDocument();
    });
  });

  it("sends POST request to API on valid submission", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => ({ success: true, enquiryId: "enq-1" }) });
    vi.stubGlobal("fetch", mockFetch);

    render(<ContactPage />);
    fillContactForm();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /transmit technical enquiry/i }));
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/public/enquiry"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
    });
  });

  it("shows success toast after successful API submission", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 201 }));

    render(<ContactPage />);
    fillContactForm();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /transmit technical enquiry/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/enquiry registered successfully/i)).toBeInTheDocument();
    });
  });

  it("shows rate-limit toast when API returns 429", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 429 }));

    render(<ContactPage />);
    fillContactForm();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /transmit technical enquiry/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/too many requests/i)).toBeInTheDocument();
    });
  });

  it("shows error toast when API returns 500", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    render(<ContactPage />);
    fillContactForm();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /transmit technical enquiry/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/transmission interruption/i)).toBeInTheDocument();
    });
  });

  it("shows error toast when network fetch throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    render(<ContactPage />);
    fillContactForm();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /transmit technical enquiry/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/transmission interruption/i)).toBeInTheDocument();
    });
  });

  it("silently ignores submission when honeypot field is filled by bot", async () => {
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);

    render(<ContactPage />);
    fillContactForm();

    const honeypot = document.querySelector("input[name='website']") as HTMLInputElement;
    if (honeypot) {
      fireEvent.change(honeypot, { target: { value: "http://spam.com" } });
    }

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /transmit technical enquiry/i }));
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("honeypot field is hidden from real users", () => {
    render(<ContactPage />);
    const honeypot = document.querySelector("input[name='website']") as HTMLInputElement;
    expect(honeypot).toBeTruthy();
    expect(honeypot.style.display).toBe("none");
    expect(honeypot.getAttribute("tabindex")).toBe("-1");
    expect(honeypot.getAttribute("autocomplete")).toBe("off");
    expect(honeypot.getAttribute("aria-hidden")).toBe("true");
  });
});
