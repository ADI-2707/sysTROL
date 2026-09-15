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

export const UpdateShipmentSchema = z.object({
  trackingRef: z.string().optional(),
  carrier: z.string().optional(),
  customsStatus: z.string().optional(),
  dispatchedAt: z.string().datetime().optional(),
});

export type UpdateShipmentDto = z.infer<typeof UpdateShipmentSchema>;
