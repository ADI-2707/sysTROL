export const FALLBACK_PROJECT_IMAGE =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450" fill="none">
      <rect width="800" height="450" fill="#0c121e"/>
      <defs>
        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1f293d" stroke-width="0.75"/>
        </pattern>
      </defs>
      <rect width="800" height="450" fill="url(#grid)" />
      <circle cx="400" cy="200" r="44" fill="#141f33" stroke="#2563eb" stroke-width="1.5"/>
      <path d="M386 190H392L395 186H405L408 190H414C416.2 190 418 191.8 418 194V212C418 214.2 416.2 216 414 216H386C383.8 216 382 214.2 382 212V194C382 191.8 383.8 190 386 190Z" stroke="#93c5fd" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="400" cy="203" r="7" stroke="#93c5fd" stroke-width="2"/>
      <text x="400" y="270" text-anchor="middle" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" letter-spacing="1">SYSTROL TECHNICAL ARCHIVE</text>
      <text x="400" y="292" text-anchor="middle" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="11">High-Definition Industrial Imagery</text>
    </svg>
  `.trim());

export function resolveMediaUrl(url?: string | null): string {
  if (!url || typeof url !== "string" || !url.trim()) {
    return FALLBACK_PROJECT_IMAGE;
  }

  const trimmed = url.trim();

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  const publicOrigin =
    process.env.NEXT_PUBLIC_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://sys-trol.com";

  const cleanOrigin = publicOrigin.replace(/\/+$/, "");
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  return `${cleanOrigin}${cleanPath}`;
}
