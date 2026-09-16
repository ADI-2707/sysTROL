export type EmployeeTeam = "LEADERSHIP" | "COMMISSIONING" | "HR_ACCOUNTS" | "SALES";

export interface TeamConfig {
  value: EmployeeTeam;
  label: string;
}

export const TEAM_OPTIONS: TeamConfig[] = [
  { value: "LEADERSHIP", label: "Leadership Team" },
  { value: "COMMISSIONING", label: "Commissioning Team" },
  { value: "HR_ACCOUNTS", label: "HR/Accounts" },
  { value: "SALES", label: "Sales Team" },
];

export const TEAM_LABELS: Record<EmployeeTeam, string> = {
  LEADERSHIP: "Leadership Team",
  COMMISSIONING: "Commissioning Team",
  HR_ACCOUNTS: "HR/Accounts",
  SALES: "Sales Team",
};

export const PAGE_ACCESS_RULES: Record<EmployeeTeam, string[]> = {
  LEADERSHIP: ["/dashboard", "/projects", "/employees", "/analytics", "/settings"],
  COMMISSIONING: ["/dashboard", "/projects", "/analytics", "/settings"],
  HR_ACCOUNTS: ["/dashboard", "/projects", "/employees", "/analytics", "/settings"],
  SALES: ["/dashboard", "/projects", "/analytics", "/settings"],
};

export function canAccessPage(team: EmployeeTeam | undefined | null, pathname: string): boolean {
  if (!team) {
    return false;
  }
  const allowed = PAGE_ACCESS_RULES[team] || [];
  return allowed.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function isSeededSuperAdmin(user: { email?: string; id?: string; isSeededSuperAdmin?: boolean } | null | undefined): boolean {
  if (!user) return false;
  return user.isSeededSuperAdmin === true || user.email === "admin@systrol.com";
}

export function canCreateEmployee(user: { email?: string; id?: string; isSeededSuperAdmin?: boolean } | null | undefined): boolean {
  return isSeededSuperAdmin(user);
}
