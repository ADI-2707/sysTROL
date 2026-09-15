import { z } from "zod";

export interface ShipmentDto {
  id: string;
  projectId: string;
  trackingRef: string | null;
  carrier: string | null;
  originCountry: string;
  destination: string;
  customsStatus: string | null;
  podUrl: string | null;
  dispatchedAt: string | null;
  deliveredAt: string | null;
}

export const CreateShipmentSchema = z.object({
  projectId: z.string().uuid(),
  trackingRef: z.string().optional(),
  carrier: z.string().optional(),
  originCountry: z.string().min(2).default("India"),
  destination: z.string().min(2),
  customsStatus: z.string().optional(),
  dispatchedAt: z.string().optional(),
});

export const UpdateShipmentSchema = z.object({
  trackingRef: z.string().optional(),
  carrier: z.string().optional(),
  customsStatus: z.string().optional(),
  dispatchedAt: z.string().datetime().optional(),
});

export type CreateShipmentDto = z.infer<typeof CreateShipmentSchema>;
export type UpdateShipmentDto = z.infer<typeof UpdateShipmentSchema>;
