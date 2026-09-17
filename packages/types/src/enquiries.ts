import { z } from "zod";

export enum EnquirySource {
  WEB_RFQ = "WEB_RFQ",
  EMAIL = "EMAIL",
  REFERRAL = "REFERRAL",
  TRADE_SHOW = "TRADE_SHOW",
  REPEAT_CLIENT = "REPEAT_CLIENT",
}

export enum EnquiryStatus {
  OPEN = "OPEN",
  QUALIFIED = "QUALIFIED",
  DISQUALIFIED = "DISQUALIFIED",
  CONVERTED = "CONVERTED",
}

export const CreateEnquirySchema = z.object({
  source: z.nativeEnum(EnquirySource),
  clientId: z.string().uuid().optional(),
  prospectName: z.string().optional(),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  requirement: z.string().min(5),
  estimatedValue: z.number().positive().optional(),
  assignedToId: z.string().uuid().optional(),
});

export const ConvertToProjectSchema = z.object({
  name: z.string().min(3),
  plantLocation: z.string().min(2),
  country: z.string().default("India"),
  millType: z.string().default("Bar Mill"),
  standCount: z.number().int().positive().default(10),
  startDate: z.string().optional(),
  targetCutoverDate: z.string().optional(),
});

export const CreateSalesVisitSchema = z.object({
  enquiryId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  visitDate: z.string().optional(),
  plantLocation: z.string().min(2),
  scopeNotes: z.string().min(10),
  photoUrls: z.array(z.string()).optional(),
  nextActionAt: z.string().optional(),
});

export const PublicEnquirySchema = z.object({
  name: z.string().min(2).max(120),
  company: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(8).max(30).regex(/^[+0-9\s\-()]+$/),
  service: z.string().min(1).max(200),
  message: z.string().min(10).max(2000),
});

export type CreateEnquiryDto = z.infer<typeof CreateEnquirySchema>;
export type ConvertToProjectDto = z.infer<typeof ConvertToProjectSchema>;
export type CreateSalesVisitDto = z.infer<typeof CreateSalesVisitSchema>;
export type PublicEnquiryDto = z.infer<typeof PublicEnquirySchema>;
