export function cleanSetCookieHeader(cookieValue: string): string {
  const parts = cookieValue.split(";").map((p) => p.trim());
  const filtered = parts.filter((part) => {
    const lower = part.toLowerCase();
    return !lower.startsWith("domain=") && !lower.startsWith("samesite=") && !lower.startsWith("partitioned");
  });
  filtered.push("Path=/");
  filtered.push("SameSite=Lax");
  filtered.push("HttpOnly");
  if (process.env.NODE_ENV === "production" || cookieValue.toLowerCase().includes("secure")) {
    filtered.push("Secure");
  }
  return filtered.join("; ");
}

export function parseCookieAttributes(cookieStr: string) {
  const parts = cookieStr.split(";").map((p) => p.trim());
  const [firstPart, ...attrs] = parts;
  const eqIdx = firstPart.indexOf("=");
  const name = eqIdx > -1 ? firstPart.slice(0, eqIdx) : firstPart;
  const value = eqIdx > -1 ? firstPart.slice(eqIdx + 1) : "";

  let maxAge: number | undefined = undefined;
  for (const attr of attrs) {
    const lower = attr.toLowerCase();
    if (lower.startsWith("max-age=")) {
      const parsed = parseInt(attr.split("=")[1], 10);
      if (!isNaN(parsed)) maxAge = parsed;
    }
  }

  return {
    name,
    value,
    path: "/",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production" || cookieStr.toLowerCase().includes("secure"),
    maxAge: maxAge ?? 7 * 24 * 60 * 60,
  };
}
