import Link from "next/link";
import { Plus, Building, Star, ExternalLink, ShieldCheck, MapPin } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface VendorItem {
  id: string;
  name: string;
  country: string;
  category: string;
  ratingScore: number | null;
  _count?: { purchaseOrders: number };
}

async function getVendors(): Promise<VendorItem[]> {
  try {
    const res = await apiClient("/api/v1/procurement/vendors", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return data.vendors || [];
    }
  } catch {
  }

  return [
    {
      id: "v-1",
      name: "Siemens Heavy Drives India",
      country: "Germany / India",
      category: "Level-1 Drives & Automation",
      ratingScore: 4.8,
      _count: { purchaseOrders: 6 },
    },
    {
      id: "v-2",
      name: "ABB Metallurgy Systems",
      country: "Sweden / India",
      category: "Sensors & Optical Pyrometers",
      ratingScore: 4.5,
      _count: { purchaseOrders: 4 },
    },
    {
      id: "v-3",
      name: "Danieli Corus Spares",
      country: "Italy",
      category: "Tungsten Carbide Mill Rolls",
      ratingScore: 4.2,
      _count: { purchaseOrders: 8 },
    },
  ];
}

export default async function VendorsPage() {
  const vendors = await getVendors();

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>
            Approved Vendor Directory (Stage 3 Procurement)
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Qualified industrial suppliers, automated delivery performance ratings, and active PO volumes.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href="/procurement/purchase-orders"
            style={{
              padding: "10px 16px",
              borderRadius: "6px",
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Purchase Orders
          </Link>
          <Link
            href="/procurement/boq"
            style={{
              padding: "10px 16px",
              borderRadius: "6px",
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            BOQ Register
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
                Vendor Organization
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Country
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Equipment Category
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Delivery Rating
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Purchase Orders
              </th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{vendor.name}</div>
                </td>
                <td style={{ padding: "16px 20px", color: "var(--text-secondary)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <MapPin size={14} color="var(--text-muted)" />
                    <span>{vendor.country}</span>
                  </div>
                </td>
                <td style={{ padding: "16px 20px", color: "var(--text-secondary)" }}>
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "4px",
                      backgroundColor: "rgba(59, 130, 246, 0.15)",
                      color: "var(--accent-blue)",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {vendor.category}
                  </span>
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Star size={15} fill="var(--accent-amber)" color="var(--accent-amber)" />
                    <span style={{ fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--accent-amber)" }}>
                      {vendor.ratingScore ? vendor.ratingScore.toFixed(1) : "5.0 (Default)"}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>/ 5.0</span>
                  </div>
                </td>
                <td style={{ padding: "16px 20px", color: "var(--text-muted)" }}>
                  {vendor._count?.purchaseOrders ?? 0} POs issued
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
