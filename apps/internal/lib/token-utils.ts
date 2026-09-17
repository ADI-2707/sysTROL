export interface DecodedJwt {
  exp?: number;
  sub?: string;
  role?: string;
  [key: string]: unknown;
}

export function parseJwt(token: string): DecodedJwt | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function isTokenValid(token?: string | null): boolean {
  if (!token || typeof token !== "string" || token.trim() === "") {
    return false;
  }
  const payload = parseJwt(token);
  if (!payload || typeof payload.exp !== "number") {
    return false;
  }
  return payload.exp * 1000 > Date.now();
}
