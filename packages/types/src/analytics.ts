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
