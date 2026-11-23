export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  SALES_EXEC = "SALES_EXEC",
  PROCUREMENT_MANAGER = "PROCUREMENT_MANAGER",
  COMMISSIONING_LEAD = "COMMISSIONING_LEAD",
  FIELD_ENGINEER = "FIELD_ENGINEER",
  FINANCE_MANAGER = "FINANCE_MANAGER",
  HR_RECRUITER = "HR_RECRUITER",
  METALLURGY_SPECIALIST = "METALLURGY_SPECIALIST",
  CLIENT_AUDITOR = "CLIENT_AUDITOR",
}

export interface JWTPayload {
  sub: string;
  role: UserRole;
  employeeCode?: string;
  email?: string;
  iat: number;
  exp: number;
}

export interface UserSummary {
  id: string;
  employeeCode?: string | null;
  name: string;
  email: string;
  role: UserRole;
}

export interface RefreshPayload {
  sub: string;
  jti: string;
}
