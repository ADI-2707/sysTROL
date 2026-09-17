export interface AttributionData {
  ctaId?: string;
  pagePath?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  referrer?: string;
}

const STORAGE_KEY = "systrol_attribution";

export function initAttribution(): AttributionData {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const existingRaw = sessionStorage.getItem(STORAGE_KEY);
    const existing: AttributionData = existingRaw ? JSON.parse(existingRaw) : {};

    const utmSource = params.get("utm_source") || existing.utmSource || undefined;
    const utmMedium = params.get("utm_medium") || existing.utmMedium || undefined;
    const utmCampaign = params.get("utm_campaign") || existing.utmCampaign || undefined;
    const utmContent = params.get("utm_content") || existing.utmContent || undefined;
    const ctaId = params.get("cta") || existing.ctaId || undefined;
    const referrer = document.referrer || existing.referrer || undefined;
    const pagePath = window.location.pathname;

    const updated: AttributionData = {
      ...existing,
      pagePath,
      ...(utmSource ? { utmSource } : {}),
      ...(utmMedium ? { utmMedium } : {}),
      ...(utmCampaign ? { utmCampaign } : {}),
      ...(utmContent ? { utmContent } : {}),
      ...(ctaId ? { ctaId } : {}),
      ...(referrer ? { referrer } : {}),
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return {};
  }
}

export function getAttribution(): AttributionData {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return initAttribution();
    }
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function trackCtaEvent(params: {
  eventType: string;
  ctaId: string;
  pagePath?: string;
  metadata?: Record<string, unknown>;
}): void {
  if (typeof window === "undefined") {
    return;
  }

  const attribution = getAttribution();
  const pagePath = params.pagePath || window.location.pathname;
  const payload = {
    eventType: params.eventType,
    ctaId: params.ctaId,
    pagePath,
    utmSource: attribution.utmSource,
    utmMedium: attribution.utmMedium,
    utmCampaign: attribution.utmCampaign,
    utmContent: attribution.utmContent,
    referrer: attribution.referrer || (document.referrer ? document.referrer : undefined),
    metadata: params.metadata,
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://systrol-api.onrender.com";
  const endpoint = `${apiUrl}/api/v1/public/cta-event`;
  const body = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    const success = navigator.sendBeacon(endpoint, blob);
    if (success) return;
  }

  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
