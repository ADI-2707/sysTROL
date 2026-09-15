"use client";

import React, { useState } from "react";
import {
  DollarSign,
  Plus,
  FileText,
  ShieldCheck,
  Receipt,
  Download,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";
import { Button, KpiCard, Badge } from "../../../components/ui";

interface MilestoneInvoice {
  id: string;
  invoiceNumber: string;
  projectCode: string;
  projectName: string;
  milestone: string;
  amount: string;
  status: "PAID" | "SENT" | "DRAFT" | "OVERDUE";
  dueDate: string;
  paidDate?: string;
}

interface RetentionItem {
  id: string;
  projectCode: string;
  clientName: string;
  retentionPercent: string;
  amount: string;
  releaseTrigger: string;
  dlpEndDate: string;
  bgStatus: "VALID" | "RENEWAL_DUE" | "RELEASED";
}

const mockInvoices: MilestoneInvoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2026-001-A",
    projectCode: "PRJ-2026-001",
    projectName: "ArcelorMittal HSM Automation",
    milestone: "ADVANCE UPON LOI SIGNING (10%)",
    amount: "₹ 1,850,000.00",
    status: "PAID",
    dueDate: "2026-01-30T00:00:00Z",
    paidDate: "2026-01-28T00:00:00Z",
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2026-001-B",
    projectCode: "PRJ-2026-001",
    projectName: "ArcelorMittal HSM Automation",
    milestone: "DISPATCH OF L2 CABINETS (40%)",
    amount: "₹ 7,400,000.00",
    status: "PAID",
    dueDate: "2026-03-20T00:00:00Z",
    paidDate: "2026-03-18T00:00:00Z",
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-2026-001-C",
    projectCode: "PRJ-2026-001",
    projectName: "ArcelorMittal HSM Automation",
    milestone: "ERECTION & COLD COMMISSIONING (20%)",
    amount: "₹ 3,700,000.00",
    status: "SENT",
    dueDate: "2026-04-10T00:00:00Z",
  },
  {
    id: "inv-4",
    invoiceNumber: "INV-2026-001-D",
    projectCode: "PRJ-2026-001",
    projectName: "ArcelorMittal HSM Automation",
    milestone: "PG TEST RUN & HANDOVER (20%)",
    amount: "₹ 3,700,000.00",
    status: "DRAFT",
    dueDate: "2026-05-15T00:00:00Z",
  },
  {
    id: "inv-5",
    invoiceNumber: "INV-2026-001-E",
    projectCode: "PRJ-2026-001",
    projectName: "ArcelorMittal HSM Automation",
    milestone: "RETENTION GUARANTEE RELEASE (10%)",
    amount: "₹ 1,850,000.00",
    status: "DRAFT",
    dueDate: "2027-04-15T00:00:00Z",
  },
];

const mockRetentions: RetentionItem[] = [
  {
    id: "ret-1",
    projectCode: "PRJ-2026-001",
    clientName: "ArcelorMittal Nippon Steel India",
    retentionPercent: "10.0%",
    amount: "₹ 1,850,000.00",
    releaseTrigger: "12-month Defect Liability Period (DLP) Completion",
    dlpEndDate: "2027-04-15T00:00:00Z",
    bgStatus: "VALID",
  },
  {
    id: "ret-2",
    projectCode: "PRJ-2025-084",
    clientName: "Tata Steel Ltd (Kalinganagar)",
    retentionPercent: "10.0%",
    amount: "₹ 2,400,000.00",
    releaseTrigger: "Final Audit Signoff & Performance Certificate",
    dlpEndDate: "2026-08-30T00:00:00Z",
    bgStatus: "VALID",
  },
];

export default function FinancePage() {
  const [filter, setFilter] = useState<string>("ALL");

  const filteredInvoices = filter === "ALL" 
    ? mockInvoices 
    : mockInvoices.filter((inv) => inv.status === filter);

  const getStatusBadge = (status: MilestoneInvoice["status"]) => {
    switch (status) {
      case "PAID":
        return <Badge variant="green">PAID</Badge>;
      case "SENT":
        return <Badge variant="blue">SENT / BILLED</Badge>;
      case "OVERDUE":
        return <Badge variant="red">OVERDUE</Badge>;
      case "DRAFT":
      default:
        return <Badge variant="neutral">DRAFT</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <DollarSign className="h-6 w-6" style={{ color: "var(--sys-green-accent)" }} />
            Finance & Contractual Retention
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Contractual milestone billing, bank guarantee tracking, defect liability retention, and payment tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" icon={<Download size={15} />}>
            Export Tally / ERP
          </Button>
          <Button variant="accent" icon={<Plus size={16} />}>
            Generate Milestone Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Contract Sum"
          value="₹ 18.50M"
          unit="INR"
          subtitle="Contract Value (Project 001)"
          highlight="blue"
          icon={<Layers size={18} />}
        />
        <KpiCard
          title="Billed to Date"
          value="₹ 12.95M"
          unit="70%"
          subtitle="3 of 5 milestones billed"
          highlight="neutral"
          icon={<Receipt size={18} />}
        />
        <KpiCard
          title="Realized Revenue"
          value="₹ 9.25M"
          unit="50%"
          subtitle="Zero overdue aging"
          highlight="green"
          icon={<CheckCircle2 size={18} />}
        />
        <KpiCard
          title="Retention Pool (10%)"
          value="₹ 1.85M"
          unit="Active"
          subtitle="DLP Release: Apr 15, 2027"
          highlight="amber"
          icon={<ShieldCheck size={18} />}
        />
      </div>

      <div className="table-card">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              Project Milestone Billing Register
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Scheduled milestone claims pegged to engineering, manufacturing, and erection signoffs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(["ALL", "PAID", "SENT", "DRAFT"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "5px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: filter === s ? "var(--sys-blue-primary)" : "transparent",
                  color: filter === s ? "#ffffff" : "var(--text-body)",
                  transition: "all 0.15s ease",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Invoice & Project</th>
                <th>Contractual Milestone</th>
                <th>Due Date</th>
                <th>Billing Amount</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: "var(--text-heading)" }}>{inv.invoiceNumber}</div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                      {inv.projectCode} • {inv.projectName}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, color: "var(--text-heading)" }}>{inv.milestone}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: "12.5px", color: "var(--text-body)" }}>
                      {new Date(inv.dueDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    {inv.paidDate && (
                      <div style={{ fontSize: "11px", color: "var(--sys-green-accent)" }}>
                        Paid on {new Date(inv.paidDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--text-heading)", fontSize: "13.5px" }}>
                      {inv.amount}
                    </span>
                  </td>
                  <td>{getStatusBadge(inv.status)}</td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "6px" }}>
                      <Button size="sm" variant="outline" icon={<FileText size={13} />}>
                        View
                      </Button>
                      {inv.status === "SENT" && (
                        <Button size="sm" variant="accent" icon={<CheckCircle2 size={13} />}>
                          Record Payment
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="table-card">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck size={16} style={{ color: "var(--sys-green-accent)" }} />
              Active Retention & Bank Guarantee (BG) Tracker
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Retained client funds protected by Performance Bank Guarantees (PBG) under Defect Liability Periods.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Project & Client</th>
                <th>Retention %</th>
                <th>Retained Sum</th>
                <th>Release Trigger Protocol</th>
                <th>DLP Expiry Date</th>
                <th>Bank Guarantee Status</th>
              </tr>
            </thead>
            <tbody>
              {mockRetentions.map((ret) => (
                <tr key={ret.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: "var(--text-heading)" }}>{ret.projectCode}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{ret.clientName}</div>
                  </td>
                  <td>
                    <Badge variant="blue">{ret.retentionPercent}</Badge>
                  </td>
                  <td>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--text-heading)" }}>
                      {ret.amount}
                    </span>
                  </td>
                  <td style={{ maxWidth: "340px" }}>
                    <span style={{ fontSize: "12.5px", color: "var(--text-body)" }}>{ret.releaseTrigger}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: "12.5px", color: "var(--text-body)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Calendar size={13} color="var(--text-muted)" />
                      {new Date(ret.dlpEndDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td>
                    <Badge variant={ret.bgStatus === "VALID" ? "green" : "amber"}>
                      PBG {ret.bgStatus}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
