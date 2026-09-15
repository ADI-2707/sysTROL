import Link from "next/link";
import { Plus, ShoppingBag, Truck, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";

interface POItem {
  id: string;
  poNumber: string;
  vendor: { name: string };
  project: { projectCode: string; name: string };
  totalValue: number;
  status: "DRAFT" | "SENT_TO_VENDOR" | "ACKNOWLEDGED" | "PARTIALLY_DELIVERED" | "DELIVERED" | "CLOSED";
  expectedDeliveryDate: string | null;
  createdAt: string;
}

async function getPurchaseOrders(): Promise<POItem[]> {
  try {
    const apiUrl = process.env.API_URL || "http://localhost:4000";
    const res = await fetch(`${apiUrl}/api/v1/procurement/purchase-orders`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return data.purchaseOrders || [];
    }
  } catch {
    // offline fallback
  }

  return [
    {
      id: "po-1",
      poNumber: "PO-2026-0001",
      vendor: { name: "Siemens Heavy Drives India" },
      project: { projectCode: "PROJ-2026-0001", name: "JSW Wire Rod Mill" },
      totalValue: 1700000,
      status: "SENT_TO_VENDOR",
      expectedDeliveryDate: new Date(Date.now() + 20 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "po-2",
      poNumber: "PO-2026-0002",
      vendor: { name: "ABB Metallurgy Systems" },
      project: { projectCode: "PROJ-2026-0001", name: "JSW Wire Rod Mill" },
      totalValue: 1320000,
      status: "DRAFT",
      expectedDeliveryDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "po-3",
      poNumber: "PO-2026-0003",
      vendor: { name: "Danieli Corus Spares" },
      project: { projectCode: "PROJ-2026-0002", name: "Tata Steel Bar Mill" },
      totalValue: 5400000,
      status: "CLOSED",
      expectedDeliveryDate: new Date(Date.now() - 5 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    },
  ];
}

export default async function PurchaseOrdersListPage() {
  const pos = await getPurchaseOrders();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CLOSED":
        return { bg: "rgba(16, 185, 129, 0.15)", text: "#10b981", border: "rgba(16, 185, 129, 0.3)" };
      case "SENT_TO_VENDOR":
        return { bg: "rgba(59, 130, 246, 0.15)", text: "#3b82f6", border: "rgba(59, 130, 246, 0.3)" };
      case "DELIVERED":
        return { bg: "rgba(13, 148, 136, 0.15)", text: "#0d9488", border: "rgba(13, 148, 136, 0.3)" };
      default:
        return { bg: "rgba(245, 158, 11, 0.15)", text: "#f59e0b", border: "rgba(245, 158, 11, 0.3)" };
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>
            Vendor Purchase Orders (PO Pipeline)
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Track issued commercial purchase orders, delivery status schedules, and automated vendor notifications.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/procurement/boq">
            <Button variant="accent" icon={<Plus size={16} />}>
              Create PO from BOQ
            </Button>
          </Link>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderRadius: "8px",
          border: "1px solid var(--border-color)",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--bg-card)", borderBottom: "1px solid var(--border-color)" }}>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                PO Number
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Vendor Supplier
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Associated Project
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Status
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Total Value (INR)
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Expected Delivery
              </th>
              <th style={{ padding: "14px 20px", textAlign: "right" }}></th>
            </tr>
          </thead>
          <tbody>
            {pos.map((po) => {
              const badge = getStatusBadge(po.status);
              return (
                <tr key={po.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "16px 20px", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                    <Link href={`/procurement/purchase-orders/${po.id}`} style={{ color: "var(--accent-blue)" }}>
                      {po.poNumber}
                    </Link>
                  </td>
                  <td style={{ padding: "16px 20px", fontWeight: 600 }}>{po.vendor.name}</td>
                  <td style={{ padding: "16px 20px", color: "var(--text-secondary)", fontSize: "13px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{po.project.projectCode}</span>
                    <span style={{ display: "block", color: "var(--text-muted)", fontSize: "12px" }}>{po.project.name}</span>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: badge.bg,
                        color: badge.text,
                        border: `1px solid ${badge.border}`,
                      }}
                    >
                      {po.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px", fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--text-primary)" }}>
                    ₹{Number(po.totalValue).toLocaleString()}
                  </td>
                  <td style={{ padding: "16px 20px", color: "var(--text-muted)", fontSize: "13px" }}>
                    {po.expectedDeliveryDate ? new Date(po.expectedDeliveryDate).toLocaleDateString() : "Pending"}
                  </td>
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <Link href={`/procurement/purchase-orders/${po.id}`}>
                      <Button variant="outline" size="sm" icon={<ArrowRight size={13} />}>
                        Manage
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
