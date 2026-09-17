export interface StageDwellDto {
  stage: string;
  millType: string;
  avgDays: number;
  projectCount: number;
}

export interface EnquiryFunnelDto {
  source: string;
  statusBreakdown: Record<string, number>;
  total: number;
}

export interface PaymentAgingDto {
  bucket: "current" | "30" | "60" | "90plus";
  totalAmount: string;
  invoiceCount: number;
}

export interface AMCForecastDto {
  contractId: string;
  projectName: string;
  endDate: string;
  daysUntilExpiry: number;
  sparesAlertCount: number;
}

export interface ProjectsAnalyticsDto {
  mostDoneMaterial: { material: string; count: number }[];
  topClientsOverYears: { clientId: string; clientName: string; projectCount: number; years: number[] }[];
  mostDoneLines: { lineType: string; count: number }[];
  topMaterialAndLineCombinations: { material: string; lineType: string; count: number }[];
  fastestExecutionCombination: {
    material: string;
    lineType: string;
    minDays: number;
    projectCode: string;
    projectName: string;
  } | null;
}

export interface CtaAnalyticsDto {
  mostEnquiredPages: { pagePath: string; count: number }[];
  mostEffectiveCtaButtons: { ctaId: string; count: number }[];
  directWhatsappCount: number;
  totalCtaEvents: number;
  totalEnquiries: number;
}

export interface EmployeeSiteStatsDto {
  employeeId: string;
  employeeName: string;
  totalSites: number;
  completedSites: number;
  indiaSites: number;
  overseasSites: number;
}

export interface EmployeesAnalyticsDto {
  employees: EmployeeSiteStatsDto[];
  totalCompletedSites: number;
  totalIndiaSites: number;
  totalOverseasSites: number;
}

export interface NotificationBadgeDto {
  unreadCount: number;
  latestEventAt?: string;
}

