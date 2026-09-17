import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { initAttribution, getAttribution, trackCtaEvent } from "@/lib/attribution";

describe("attribution tracker and session storage tests", () => {
  const originalLocation = window.location;
  const originalDocument = document.referrer;

  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
    delete (window as any).location;
    window.location = {
      ...originalLocation,
      search: "",
      pathname: "/services/automation-consultancy",
    } as any;
  });

  afterEach(() => {
    sessionStorage.clear();
    window.location = originalLocation;
  });

  it("extracts UTM tags and cta query from location search and stores them in sessionStorage", () => {
    window.location.search = "?utm_source=linkedin&utm_medium=cpc&utm_campaign=bar_mill_2026&utm_content=banner&cta=hero_quote";

    const data = initAttribution();

    expect(data.utmSource).toBe("linkedin");
    expect(data.utmMedium).toBe("cpc");
    expect(data.utmCampaign).toBe("bar_mill_2026");
    expect(data.utmContent).toBe("banner");
    expect(data.ctaId).toBe("hero_quote");
    expect(data.pagePath).toBe("/services/automation-consultancy");

    const raw = sessionStorage.getItem("systrol_attribution");
    expect(raw).toBeTruthy();
    const stored = JSON.parse(raw!);
    expect(stored.utmSource).toBe("linkedin");
    expect(stored.ctaId).toBe("hero_quote");
  });

  it("preserves previously stored UTM tags when navigating to a new page without search query", () => {
    sessionStorage.setItem(
      "systrol_attribution",
      JSON.stringify({
        utmSource: "google",
        utmMedium: "organic",
        utmCampaign: "spares_procurement",
        ctaId: "navbar_consult",
      })
    );

    window.location.search = "";
    window.location.pathname = "/contact";

    const data = initAttribution();

    expect(data.utmSource).toBe("google");
    expect(data.utmMedium).toBe("organic");
    expect(data.utmCampaign).toBe("spares_procurement");
    expect(data.ctaId).toBe("navbar_consult");
    expect(data.pagePath).toBe("/contact");
  });

  it("getAttribution returns stored attribution if present without re-initializing", () => {
    const existing = {
      utmSource: "twitter",
      utmMedium: "social",
      ctaId: "footer_whatsapp",
      pagePath: "/about",
    };
    sessionStorage.setItem("systrol_attribution", JSON.stringify(existing));

    const result = getAttribution();
    expect(result.utmSource).toBe("twitter");
    expect(result.ctaId).toBe("footer_whatsapp");
  });

  it("getAttribution recovers gracefully if sessionStorage contains invalid JSON", () => {
    sessionStorage.setItem("systrol_attribution", "{invalid json");

    const result = getAttribution();
    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
  });

  it("dispatches trackCtaEvent via navigator.sendBeacon when supported", () => {
    sessionStorage.setItem(
      "systrol_attribution",
      JSON.stringify({
        utmSource: "partner_referral",
        utmCampaign: "tata_modernization",
      })
    );

    const sendBeaconMock = vi.fn().mockReturnValue(true);
    Object.defineProperty(navigator, "sendBeacon", {
      value: sendBeaconMock,
      configurable: true,
      writable: true,
    });

    trackCtaEvent({
      eventType: "WHATSAPP_CLICK",
      ctaId: "floating_whatsapp",
    });

    expect(sendBeaconMock).toHaveBeenCalledTimes(1);
    const [endpoint, blob] = sendBeaconMock.mock.calls[0];
    expect(endpoint).toContain("/api/v1/public/cta-event");
    expect(blob).toBeInstanceOf(Blob);
  });

  it("falls back to fetch with keepalive when navigator.sendBeacon returns false", () => {
    sessionStorage.setItem(
      "systrol_attribution",
      JSON.stringify({
        utmSource: "email_newsletter",
      })
    );

    const sendBeaconMock = vi.fn().mockReturnValue(false);
    Object.defineProperty(navigator, "sendBeacon", {
      value: sendBeaconMock,
      configurable: true,
      writable: true,
    });

    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock;

    trackCtaEvent({
      eventType: "PHONE_CLICK",
      ctaId: "floating_call",
      metadata: { callDurationSec: 0 },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [endpoint, options] = fetchMock.mock.calls[0];
    expect(endpoint).toContain("/api/v1/public/cta-event");
    expect(options.keepalive).toBe(true);
    const body = JSON.parse(options.body);
    expect(body.eventType).toBe("PHONE_CLICK");
    expect(body.ctaId).toBe("floating_call");
    expect(body.utmSource).toBe("email_newsletter");
  });
});
