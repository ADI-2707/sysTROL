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
