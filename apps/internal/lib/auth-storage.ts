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
  token?: string;
  refreshToken?: string;
  user?: StoredUser;
  [key: string]: unknown;
}

export function getStoredSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SYSTROL_SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredSession(session: StoredSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SYSTROL_SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
  }
}

export function clearStoredSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SYSTROL_SESSION_STORAGE_KEY);
    localStorage.removeItem("systrol_user");
  } catch {
  }
}

export function updateStoredToken(newToken: string, newRefreshToken?: string): void {
  if (typeof window === "undefined") return;
  try {
    const session = getStoredSession();
    if (session) {
      session.token = newToken;
      if (newRefreshToken) {
        session.refreshToken = newRefreshToken;
      }
      setStoredSession(session);
    }
  } catch {
  }
}
