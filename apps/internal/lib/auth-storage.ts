export const SYSTROL_SESSION_STORAGE_KEY = "systrol_user_session";

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: string;
  team: string;
  designation: string;
  baseLocation?: string;
  isSeededSuperAdmin?: boolean;
}

export interface StoredSession {
  user?: StoredUser;
  [key: string]: unknown;
}

export function getStoredSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SYSTROL_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    delete parsed.token;
    delete parsed.refreshToken;
    return parsed;
  } catch {
    return null;
  }
}

export function setStoredSession(session: StoredSession): void {
  if (typeof window === "undefined") return;
  try {
    const sanitized = { ...session };
    delete (sanitized as Record<string, unknown>).token;
    delete (sanitized as Record<string, unknown>).refreshToken;
    localStorage.setItem(SYSTROL_SESSION_STORAGE_KEY, JSON.stringify(sanitized));
  } catch {}
}

export function clearStoredSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SYSTROL_SESSION_STORAGE_KEY);
    localStorage.removeItem("systrol_user");
  } catch {}
}

export function updateStoredToken(_newToken: string, _newRefreshToken?: string): void {}