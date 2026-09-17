import { describe, it, expect } from "vitest";
import { PublicEnquirySchema, PublicCtaEventSchema } from "../../../../packages/types/src/enquiries";

describe("public enquiry and CTA schema validation tests", () => {
  it("validates full public enquiry with all attribution metadata fields", () => {
    const payload = {
      name: "Rajeev Singhal",
      company: "Bhushan Power & Steel Ltd",
      email: "rajeev.singhal@bpsl.net",
      phone: "+91 98310 99887",
      service: "L2 Automation Consultancy",
      message: "Need advanced mathematical tension control models for wire rod block.",
      ctaId: "navbar_get_in_touch",
      pagePath: "/services/automation-consultancy",
      utmSource: "linkedin",
      utmMedium: "cpc",
      utmCampaign: "modernization_q3",
      utmContent: "hero_banner",
      referrer: "https://www.linkedin.com/",
    };

    const parsed = PublicEnquirySchema.safeParse(payload);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.ctaId).toBe("navbar_get_in_touch");
      expect(parsed.data.utmCampaign).toBe("modernization_q3");
    }
  });

  it("validates public enquiry without attribution fields for backward compatibility", () => {
    const payload = {
      name: "Amitabh Banerjee",
      company: "Electrosteel Castings Ltd",
      email: "a.banerjee@electrosteel.com",
      phone: "+91 33 2248 1234",
      service: "Imported Spares Sourcing",
      message: "Inquiry for roll neck bearings and hydraulic cylinders for rougher.",
    };

    const parsed = PublicEnquirySchema.safeParse(payload);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.ctaId).toBeUndefined();
      expect(parsed.data.utmSource).toBeUndefined();
    }
  });

  it("rejects public enquiry with malformed email or short message", () => {
    const invalidEmail = {
      name: "John Doe",
      company: "Acme Steel",
      email: "not-an-email",
      phone: "+91 98450 12345",
      service: "General Technical Inquiry",
      message: "Valid requirement description here.",
    };
    expect(PublicEnquirySchema.safeParse(invalidEmail).success).toBe(false);

    const shortMsg = {
      name: "John Doe",
      company: "Acme Steel",
      email: "john@acme.com",
      phone: "+91 98450 12345",
      service: "General Technical Inquiry",
      message: "Short",
    };
    expect(PublicEnquirySchema.safeParse(shortMsg).success).toBe(false);
  });

  it("validates valid PublicCtaEventSchema payloads", () => {
    const eventPayload = {
      eventType: "WHATSAPP_CLICK",
      ctaId: "floating_whatsapp",
      pagePath: "/projects/bar-mill-modernization",
      utmSource: "google",
      utmMedium: "cpc",
      utmCampaign: "tmt_automation",
      metadata: { referrerDomain: "google.com", userLang: "en-US" },
    };

    const parsed = PublicCtaEventSchema.safeParse(eventPayload);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.eventType).toBe("WHATSAPP_CLICK");
      expect(parsed.data.ctaId).toBe("floating_whatsapp");
      expect(parsed.data.metadata).toBeDefined();
    }
  });

  it("rejects PublicCtaEventSchema if required fields are missing", () => {
    const missingType = {
      ctaId: "floating_call",
      pagePath: "/contact",
    };
    expect(PublicCtaEventSchema.safeParse(missingType).success).toBe(false);

    const missingCta = {
      eventType: "PHONE_CLICK",
      pagePath: "/contact",
    };
    expect(PublicCtaEventSchema.safeParse(missingCta).success).toBe(false);

    const missingPath = {
      eventType: "PHONE_CLICK",
      ctaId: "floating_call",
    };
    expect(PublicCtaEventSchema.safeParse(missingPath).success).toBe(false);
  });
});
