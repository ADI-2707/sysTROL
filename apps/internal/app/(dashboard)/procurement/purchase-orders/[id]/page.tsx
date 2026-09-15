import { PODetailClient } from "./PODetailClient";

async function getPO(id: string) {
  try {
    const apiUrl = process.env.API_URL || "http://localhost:4000";
    const res = await fetch(`${apiUrl}/api/v1/procurement/purchase-orders/${id}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return data.purchaseOrder;
    }
  } catch {
    // offline fallback
  }

  return {
    id,
    poNumber: "PO-2026-0001",
    status: "SENT_TO_VENDOR",
    totalValue: 1700000,
    expectedDeliveryDate: new Date(Date.now() + 20 * 86400000).toISOString(),
    actualDeliveryDate: null,
    vendor: {
      name: "Siemens Heavy Drives India",
      country: "Germany / India",
      category: "Level-1 Drives & Automation",
    },
    project: {
      projectCode: "PROJ-2026-0001",
      name: "JSW Wire Rod Mill L2 Revamp",
    },
    items: [
      {
        id: "item-1",
        description: "Siemens S7-1500 Fail-Safe PLC Rack + IO Modules",
        quantity: 2,
        unit: "Sets",
        estimatedUnitCost: 850000,
      },
    ],
  };
}

export default async function PurchaseOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const po = await getPO(id);

  return <PODetailClient po={po} />;
}
