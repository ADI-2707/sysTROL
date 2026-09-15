export enum VisitFrequency {
  QUARTERLY = "QUARTERLY",
  BI_ANNUAL = "BI_ANNUAL",
}

export interface AMCContractDto {
  id: string;
  projectId: string;
  contractCode: string;
  startDate: string;
  endDate: string;
  visitFrequency: VisitFrequency;
  renewed: boolean;
}

export interface AMCVisitDto {
  id: string;
  amcContractId: string;
  scheduledDate: string;
  completedDate: string | null;
  engineerId: string | null;
  reportUrl: string | null;
}
