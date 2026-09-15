"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Save, ShoppingBag, Layers, CheckCircle2 } from "lucide-react";

interface BOQRow {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedUnitCost: number;
  purchaseOrderId?: string | null;
}

export default function BOQEditorPage() {
  const [selectedProjectId, setSelectedProjectId] = useState("proj-1");
  const [items, setItems] = useState<BOQRow[]>([
    {
      id: "boq-1",
      description: "Siemens S7-1500 Fail-Safe PLC Rack + IO Modules",
      quantity: 2,
      unit: "Sets",
      estimatedUnitCost: 850000,
      purchaseOrderId: "po-1",
    },
    {
      id: "boq-2",
      description: "Optical Dual-Wavelength Pyrometer (-40°C to 1200°C)",
      quantity: 6,
      unit: "Units",
      estimatedUnitCost: 220000,
    },
    {
      id: "boq-3",
      description: "Hydraulic Roll Gap Servo Valve Assembly",
      quantity: 12,
      unit: "Units",
      estimatedUnitCost: 450000,
    },
  ]);

  const [newItem, setNewItem] = useState({
    description: "",
    quantity: 1,
    unit: "Units",
    estimatedUnitCost: 100000,
  });

  const addItem = () => {
    if (newItem.description.trim()) {
      setItems([
        ...items,
        {
          id: `boq-${Date.now()}`,
          ...newItem,
        },
      ]);
      setNewItem({ description: "", quantity: 1, unit: "Units", estimatedUnitCost: 100000 });
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const totalCost = items.reduce((acc, curr) => acc + curr.quantity * curr.estimatedUnitCost, 0);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>
            Project Bill of Quantities (BOQ Register)
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Finalize engineering line items, quantify materials, and link items directly into Vendor Purchase Orders.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            style={{
              padding: "9px 14px",
              borderRadius: "6px",
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontSize: "14px",
            }}
          >
            <option value="proj-1">PROJ-2026-0001 (JSW Wire Rod Mill)</option>
            <option value="proj-2">PROJ-2026-0002 (Tata Steel Bar Mill)</option>
          </select>

          <Link
            href="/procurement/purchase-orders"
            style={{
              padding: "9px 16px",
              borderRadius: "6px",
              backgroundColor: "var(--accent-green)",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Create PO from BOQ
          </Link>
        </div>
      </div>

      {/* Spreadsheet Card */}
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
                Line Item Description
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Quantity
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Unit
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Unit Cost (INR)
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Total Extended
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                PO Status
              </th>
              <th style={{ padding: "14px 20px", textAlign: "right" }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td style={{ padding: "14px 20px", fontWeight: 600 }}>{item.description}</td>
                <td style={{ padding: "14px 20px", fontFamily: "var(--font-mono)" }}>{item.quantity}</td>
                <td style={{ padding: "14px 20px", color: "var(--text-secondary)" }}>{item.unit}</td>
                <td style={{ padding: "14px 20px", fontFamily: "var(--font-mono)" }}>
                  ₹{item.estimatedUnitCost.toLocaleString()}
                </td>
                <td style={{ padding: "14px 20px", fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--accent-green)" }}>
                  ₹{(item.quantity * item.estimatedUnitCost).toLocaleString()}
                </td>
                <td style={{ padding: "14px 20px" }}>
                  {item.purchaseOrderId ? (
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        backgroundColor: "rgba(59, 130, 246, 0.15)",
                        color: "var(--accent-blue)",
                        fontSize: "11px",
                        fontWeight: 600,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      PO LINKED
                    </span>
                  ) : (
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Unassigned</span>
                  )}
                </td>
                <td style={{ padding: "14px 20px", textAlign: "right" }}>
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {/* Inline Add Row */}
            <tr style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
              <td style={{ padding: "12px 20px" }}>
                <input
                  type="text"
                  placeholder="New item description..."
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    fontSize: "13px",
                  }}
                />
              </td>
              <td style={{ padding: "12px 20px" }}>
                <input
                  type="number"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value, 10) || 1 })}
                  style={{
                    width: "80px",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    fontSize: "13px",
                  }}
                />
              </td>
              <td style={{ padding: "12px 20px" }}>
                <input
                  type="text"
                  value={newItem.unit}
                  onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                  style={{
                    width: "80px",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    fontSize: "13px",
                  }}
                />
              </td>
              <td style={{ padding: "12px 20px" }}>
                <input
                  type="number"
                  value={newItem.estimatedUnitCost}
                  onChange={(e) => setNewItem({ ...newItem, estimatedUnitCost: parseFloat(e.target.value) || 0 })}
                  style={{
                    width: "140px",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    fontSize: "13px",
                  }}
                />
              </td>
              <td style={{ padding: "12px 20px", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                ₹{(newItem.quantity * newItem.estimatedUnitCost).toLocaleString()}
              </td>
              <td colSpan={2} style={{ padding: "12px 20px", textAlign: "right" }}>
                <button
                  type="button"
                  onClick={addItem}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    borderRadius: "4px",
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <Plus size={15} />
                  <span>Add Line</span>
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: "var(--bg-card)", borderTop: "2px solid var(--border-color)" }}>
              <td colSpan={4} style={{ padding: "16px 20px", fontWeight: 700, textAlign: "right" }}>
                Total Estimated BOQ Value:
              </td>
              <td colSpan={3} style={{ padding: "16px 20px", fontWeight: 800, fontSize: "16px", color: "var(--accent-green)", fontFamily: "var(--font-mono)" }}>
                ₹{totalCost.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
