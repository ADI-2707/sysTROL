"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, CheckCircle2, Truck, Calendar, DollarSign, Package } from "lucide-react";

interface PODetailProps {
  po: {
    id: string;
    poNumber: string;
    status: "DRAFT" | "SENT_TO_VENDOR" | "ACKNOWLEDGED" | "PARTIALLY_DELIVERED" | "DELIVERED" | "CLOSED";
    totalValue: number;
    expectedDeliveryDate: string | null;
    actualDeliveryDate: string | null;
    vendor: { name: string; country: string; category: string };
    project: { projectCode: string; name: string };
    items: Array<{
      id: string;
      description: string;
      quantity: number;
      unit: string;
      estimatedUnitCost: number;
    }>;
  };
}

export function PODetailClient({ po }: PODetailProps) {
  const router = useRouter();
  const [status, setStatus] = useState(po.status);
  const [loading, setLoading] = useState(false);

  const handleSendToVendor = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/v1/procurement/purchase-orders/${po.id}/send`, {
        method: "POST",
      });

      if (res.ok) {
        setStatus("SENT_TO_VENDOR");
        alert("Purchase Order successfully dispatched to vendor with email confirmation!");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDelivery = async (newStatus: PODetailProps["po"]["status"]) => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/v1/procurement/purchase-orders/${po.id}/delivery`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          actualDeliveryDate: newStatus === "DELIVERED" || newStatus === "CLOSED" ? new Date().toISOString() : undefined,
        }),
      });

      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <Link
          href="/procurement/purchase-orders"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "var(--text-muted)",
            fontSize: "14px",
            marginBottom: "12px",
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Purchase Orders</span>
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>
                {po.poNumber}
              </h1>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 600,
                  backgroundColor: "rgba(59, 130, 246, 0.15)",
                  color: "var(--accent-blue)",
                }}
              >
                {status}
              </span>
            </div>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
              Supplier: {po.vendor.name} • Project: {po.project.projectCode} ({po.project.name})
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            {status === "DRAFT" && (
              <button
                onClick={handleSendToVendor}
                disabled={loading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 18px",
                  borderRadius: "6px",
                  backgroundColor: "var(--accent-green)",
                  border: "none",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                <Send size={15} />
                <span>Send to Vendor</span>
              </button>
            )}

            {status === "SENT_TO_VENDOR" && (
              <button
                onClick={() => handleUpdateDelivery("DELIVERED")}
                disabled={loading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 18px",
                  borderRadius: "6px",
                  backgroundColor: "var(--accent-blue)",
                  border: "none",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                <Truck size={15} />
                <span>Mark Delivered</span>
              </button>
            )}

            {status === "DELIVERED" && (
              <button
                onClick={() => handleUpdateDelivery("CLOSED")}
                disabled={loading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 18px",
                  borderRadius: "6px",
                  backgroundColor: "var(--accent-green)",
                  border: "none",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                <CheckCircle2 size={15} />
                <span>Close PO & Rate Vendor</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Items Table */}
          <div
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "14px" }}>
              Procured Line Items ({po.items.length})
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                  <th style={{ padding: "8px 0" }}>Item Description</th>
                  <th style={{ padding: "8px 0" }}>Qty</th>
                  <th style={{ padding: "8px 0" }}>Unit Cost</th>
                  <th style={{ padding: "8px 0", textAlign: "right" }}>Extended Total</th>
                </tr>
              </thead>
              <tbody>
                {po.items.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "12px 0", fontWeight: 500 }}>{item.description}</td>
                    <td style={{ padding: "12px 0", fontFamily: "var(--font-mono)" }}>
                      {item.quantity} {item.unit}
                    </td>
                    <td style={{ padding: "12px 0", fontFamily: "var(--font-mono)" }}>
                      ₹{Number(item.estimatedUnitCost).toLocaleString()}
                    </td>
                    <td style={{ padding: "12px 0", textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                      ₹{(item.quantity * Number(item.estimatedUnitCost)).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commercial Summary Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <h3 style={{ fontSize: "14px", fontWeight: 600, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "16px" }}>
              Commercial Summary
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Total Order Value</span>
                <span style={{ color: "var(--accent-green)", fontSize: "18px", fontWeight: 800, fontFamily: "var(--font-mono)" }}>
                  ₹{Number(po.totalValue).toLocaleString()}
                </span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Vendor Category</span>
                <span style={{ color: "var(--text-primary)" }}>{po.vendor.category}</span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Expected Delivery</span>
                <span style={{ color: "var(--text-primary)" }}>
                  {po.expectedDeliveryDate ? new Date(po.expectedDeliveryDate).toLocaleDateString() : "Standard"}
                </span>
              </div>
              {po.actualDeliveryDate && (
                <div>
                  <span style={{ color: "var(--text-muted)", display: "block" }}>Actual Delivery Date</span>
                  <span style={{ color: "var(--accent-green)", fontWeight: 600 }}>
                    {new Date(po.actualDeliveryDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
