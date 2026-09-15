import { z } from "zod";

export enum PurchaseOrderStatus {
  DRAFT = "DRAFT",
  SENT_TO_VENDOR = "SENT_TO_VENDOR",
  ACKNOWLEDGED = "ACKNOWLEDGED",
  PARTIALLY_DELIVERED = "PARTIALLY_DELIVERED",
  DELIVERED = "DELIVERED",
  CLOSED = "CLOSED",
}

export interface VendorDto {
  id: string;
  name: string;
  country: string;
  category: string;
  ratingScore: number | null;
  createdAt: string;
}

export interface BOQItemDto {
  id: string;
  projectId: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedUnitCost: string;
  purchaseOrderId: string | null;
}

export interface PurchaseOrderDto {
  id: string;
  poNumber: string;
  vendorId: string;
  projectId: string;
  status: PurchaseOrderStatus;
  totalValue: string;
  expectedDeliveryDate: string | null;
  actualDeliveryDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export const CreateVendorSchema = z.object({
  name: z.string().min(2),
  country: z.string().min(2),
  category: z.string().min(2),
});

export const CreatePurchaseOrderSchema = z.object({
  vendorId: z.string().uuid(),
  projectId: z.string().uuid(),
  totalValue: z.string(),
  expectedDeliveryDate: z.string().datetime().optional(),
  itemIds: z.array(z.string().uuid()).min(1),
});

export type CreateVendorDto = z.infer<typeof CreateVendorSchema>;
export type CreatePurchaseOrderDto = z.infer<typeof CreatePurchaseOrderSchema>;
