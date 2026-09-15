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
  iat: number;
  exp: number;
}

export interface RefreshPayload {
  sub: string;
  jti: string;
}
