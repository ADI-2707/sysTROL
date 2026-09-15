import { z } from "zod";

export enum InvoiceMilestone {
  ADVANCE = "ADVANCE",
  DISPATCH = "DISPATCH",
  ERECTION = "ERECTION",
  COMMISSIONING = "COMMISSIONING",
  PERFORMANCE_GUARANTEE = "PERFORMANCE_GUARANTEE",
  RETENTION = "RETENTION",
  AMC_RENEWAL = "AMC_RENEWAL",
}

export enum InvoiceStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
}

export interface InvoiceDto {
  id: string;
  invoiceNumber: string;
  projectId: string;
  milestone: InvoiceMilestone;
  amount: string;
  status: InvoiceStatus;
  dueDate: string;
  createdAt: string;
}

export interface PaymentDto {
  id: string;
  invoiceId: string;
  amountPaid: string;
  paidAt: string;
  reference: string | null;
}

export interface RetentionScheduleDto {
  id: string;
  projectId: string;
  percentage: string;
  releaseDate: string | null;
  releasedAt: string | null;
}

export const CreateInvoiceSchema = z.object({
  projectId: z.string().uuid(),
  milestone: z.nativeEnum(InvoiceMilestone),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  dueDate: z.string().datetime(),
});

export type CreateInvoiceDto = z.infer<typeof CreateInvoiceSchema>;
