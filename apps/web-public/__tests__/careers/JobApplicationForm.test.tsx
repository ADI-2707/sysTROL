import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { JobApplicationForm } from "@/app/careers/[id]/JobApplicationForm";
import { Vacancy } from "@/content/careers";

const mockVacancy: Vacancy = {
  id: "l2-software-engineer",
  title: "Level-2 Automation Software Engineer",
  department: "L2 Software Engineering",
  location: "Bengaluru, Karnataka",
  type: "Full Time",
  experience: "3 - 7 Years",
  description: "Build deterministic C# automation for rolling mills.",
  responsibilities: ["Develop pass schedules", "Commission on-site"],
  requirements: ["C# .NET 6+", "OPC UA knowledge"],
  skills: ["C# .NET", "OPC UA", "PLC Interfaces"],
};

const fillApplicationForm = () => {
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Rahul Sharma" } });
  fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "rahul@plant.com" } });
  fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: "+91 9876543210" } });
  fireEvent.change(screen.getByLabelText(/years of relevant experience/i), { target: { value: "5 Years" } });
  fireEvent.change(screen.getByLabelText(/key industrial projects/i), {
    target: { value: "Worked on 16-stand bar mill automation with Siemens S7-400 PLCs and C# SCADA." },
  });
};

describe("JobApplicationForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders all required form fields", () => {
    render(<JobApplicationForm vacancy={mockVacancy} />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/years of relevant experience/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/linkedin profile/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/key industrial projects/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit application/i })).toBeInTheDocument();
  });

  it("submits POST to correct jobs apply endpoint on valid form", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => ({ success: true, applicationId: "app-1" }) });
    vi.stubGlobal("fetch", mockFetch);

    render(<JobApplicationForm vacancy={mockVacancy} />);
    fillApplicationForm();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /submit application/i }));
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/v1/public/jobs/${mockVacancy.id}/apply`),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
    });
  });

  it("sends applicantName, email, phone, and coverNote in request body", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, status: 201 });
    vi.stubGlobal("fetch", mockFetch);

    render(<JobApplicationForm vacancy={mockVacancy} />);
    fillApplicationForm();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /submit application/i }));
    });

    await waitFor(() => {
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.applicantName).toBe("Rahul Sharma");
      expect(body.email).toBe("rahul@plant.com");
      expect(body.phone).toBe("+91 9876543210");
      expect(body.coverNote).toContain("5 Years");
    });
  });

  it("shows success state after successful API response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 201 }));

    render(<JobApplicationForm vacancy={mockVacancy} />);
    fillApplicationForm();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /submit application/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/application successfully received/i)).toBeInTheDocument();
      expect(screen.getByText(mockVacancy.title)).toBeInTheDocument();
    });
  });

  it("shows rate-limit error message on 429 response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 429 }));

    render(<JobApplicationForm vacancy={mockVacancy} />);
    fillApplicationForm();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /submit application/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/too many applications/i)).toBeInTheDocument();
    });
  });

  it("shows generic error message on non-429 API failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    render(<JobApplicationForm vacancy={mockVacancy} />);
    fillApplicationForm();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /submit application/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/application submission failed/i)).toBeInTheDocument();
    });
  });

  it("shows network error message when fetch throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network offline")));

    render(<JobApplicationForm vacancy={mockVacancy} />);
    fillApplicationForm();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /submit application/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it("silently short-circuits when honeypot field is filled by a bot", async () => {
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);

    render(<JobApplicationForm vacancy={mockVacancy} />);
    fillApplicationForm();

    const honeypot = document.querySelector("input[name='website']") as HTMLInputElement;
    if (honeypot) {
      fireEvent.change(honeypot, { target: { value: "https://spam.com" } });
    }

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /submit application/i }));
    });

    expect(mockFetch).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText(/application successfully received/i)).toBeInTheDocument();
    });
  });

  it("honeypot field is hidden from real users", () => {
    render(<JobApplicationForm vacancy={mockVacancy} />);
    const honeypot = document.querySelector("input[name='website']") as HTMLInputElement;
    expect(honeypot).toBeTruthy();
    expect(honeypot.style.display).toBe("none");
    expect(honeypot.getAttribute("tabindex")).toBe("-1");
    expect(honeypot.getAttribute("aria-hidden")).toBe("true");
  });

  it("allows another application submission after clicking reset in success state", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 201 }));

    render(<JobApplicationForm vacancy={mockVacancy} />);
    fillApplicationForm();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /submit application/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/application successfully received/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /submit another application/i }));

    expect(screen.getByRole("button", { name: /submit application/i })).toBeInTheDocument();
    expect(screen.queryByText(/application successfully received/i)).not.toBeInTheDocument();
  });
});
