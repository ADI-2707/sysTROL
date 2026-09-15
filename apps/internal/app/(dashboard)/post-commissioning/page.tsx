"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Flame,
  FileSignature,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui";

interface PGResult {
  id: string;
  kpiName: string;
  contractedVal: string;
  achievedVal: string;
  passed: boolean;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  milestone: string;
  amount: string;
  status: string;
  dueDate: string;
}

const mockPGResults: PGResult[] = [
  {
    id: "pg-1",
    kpiName: "Finished Gauge Tolerance (Hot Strip Centerline)",
    contractedVal: "±0.025 mm",
    achievedVal: "±0.018 mm",
    passed: true,
  },
  {
    id: "pg-2",
    kpiName: "Mill Maximum Threading Line Speed",
    contractedVal: "18.5 m/s",
    achievedVal: "19.2 m/s",
    passed: true,
  },
  {
    id: "pg-3",
    kpiName: "Specific Power Consumption (kWh / Ton rolled)",
    contractedVal: "≤ 88.0 kWh/t",
    achievedVal: "84.3 kWh/t",
    passed: true,
  },
];

const mockInvoices: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-PRJ-2026-001-01",
    milestone: "ADVANCE (10%)",
    amount: "₹ 1,850,000.00",
    status: "PAID",
    dueDate: "2026-01-30T00:00:00Z",
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-PRJ-2026-001-02",
    milestone: "DISPATCH (40%)",
    amount: "₹ 7,400,000.00",
    status: "PAID",
    dueDate: "2026-03-20T00:00:00Z",
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-PRJ-2026-001-03",
    milestone: "COMMISSIONING & PG TEST (30%)",
    amount: "₹ 5,550,000.00",
    status: "SENT",
    dueDate: "2026-04-15T00:00:00Z",
  },
  {
    id: "inv-4",
    invoiceNumber: "INV-PRJ-2026-001-04",
    milestone: "RETENTION (10%)",
    amount: "₹ 1,850,000.00",
    status: "DRAFT",
    dueDate: "2027-04-15T00:00:00Z",
  },
];

export default function PostCommissioningPage() {
  const [activeTab, setActiveTab] = useState<"pg-test" | "mom" | "finance" | "amc">("pg-test");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="h-6 w-6 text-rose-500" />
            Trials, Handover & Commercials
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Performance Guarantee (PG) testing, signed Minutes of Meeting (MOM) plant handover, milestone invoicing, and AMC.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          padding: "4px",
          borderRadius: "10px",
          boxShadow: "var(--shadow-sm)",
          width: "fit-content",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("pg-test")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "7px",
            fontSize: "13px",
            fontWeight: activeTab === "pg-test" ? 600 : 500,
            color: activeTab === "pg-test" ? "var(--text-heading)" : "var(--text-muted)",
            backgroundColor: activeTab === "pg-test" ? "var(--bg-hover)" : "transparent",
            border: activeTab === "pg-test" ? "1px solid var(--border-subtle)" : "1px solid transparent",
            boxShadow: activeTab === "pg-test" ? "var(--shadow-sm)" : "none",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <Flame size={15} color={activeTab === "pg-test" ? "var(--sys-green-accent)" : "currentColor"} />
          <span>PG Test Matrix</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("mom")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "7px",
            fontSize: "13px",
            fontWeight: activeTab === "mom" ? 600 : 500,
            color: activeTab === "mom" ? "var(--text-heading)" : "var(--text-muted)",
            backgroundColor: activeTab === "mom" ? "var(--bg-hover)" : "transparent",
            border: activeTab === "mom" ? "1px solid var(--border-subtle)" : "1px solid transparent",
            boxShadow: activeTab === "mom" ? "var(--shadow-sm)" : "none",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <FileSignature size={15} color={activeTab === "mom" ? "var(--sys-green-accent)" : "currentColor"} />
          <span>Handover MOM</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("finance")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "7px",
            fontSize: "13px",
            fontWeight: activeTab === "finance" ? 600 : 500,
            color: activeTab === "finance" ? "var(--text-heading)" : "var(--text-muted)",
            backgroundColor: activeTab === "finance" ? "var(--bg-hover)" : "transparent",
            border: activeTab === "finance" ? "1px solid var(--border-subtle)" : "1px solid transparent",
            boxShadow: activeTab === "finance" ? "var(--shadow-sm)" : "none",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <DollarSign size={15} color={activeTab === "finance" ? "var(--sys-green-accent)" : "currentColor"} />
          <span>Invoices & Retention</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("amc")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "7px",
            fontSize: "13px",
            fontWeight: activeTab === "amc" ? 600 : 500,
            color: activeTab === "amc" ? "var(--text-heading)" : "var(--text-muted)",
            backgroundColor: activeTab === "amc" ? "var(--bg-hover)" : "transparent",
            border: activeTab === "amc" ? "1px solid var(--border-subtle)" : "1px solid transparent",
            boxShadow: activeTab === "amc" ? "var(--shadow-sm)" : "none",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <ShieldCheck size={15} color={activeTab === "amc" ? "var(--sys-green-accent)" : "currentColor"} />
          <span>AMC Contract</span>
        </button>
      </div>

      {activeTab === "pg-test" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">Performance Guarantee Key Performance Indicators</h3>
            <Button variant="primary" size="sm" icon={<Plus size={14} />}>
              Log Trial Run KPI
            </Button>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5 font-semibold">Parameter / Metric</th>
                  <th className="p-3.5 font-semibold">Contractual Specification</th>
                  <th className="p-3.5 font-semibold">Site Achieved Performance</th>
                  <th className="p-3.5 font-semibold">Verification Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {mockPGResults.map((r) => (
                  <tr key={r.id}>
                    <td className="p-3.5 font-medium text-slate-900 dark:text-white">{r.kpiName}</td>
                    <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">{r.contractedVal}</td>
                    <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">{r.achievedVal}</td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="h-3 w-3" />
                        PASSED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "mom" && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Commercial Handover & Protocol Sign-off</h3>
              <p className="text-xs text-slate-400">Formal transfer of plant custody to client operations.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              Countersigned by Client VP Operations
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-semibold text-slate-400 uppercase">Meeting Summary</span>
              <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                Joint commissioning protocol finalized between sysTROL Automation and ArcelorMittal Project Management team.
                Hot rolling performance guarantee test run completed for 72 consecutive hours with 0 unplanned automation trips.
                Client officially accepts automation package handover into commercial production.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="#"
                className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold hover:underline"
              >
                <FileText className="h-4 w-4" />
                View Countersigned Handover Protocol PDF (Signed Apr 02, 2026)
              </a>
            </div>
          </div>
        </div>
      )}

      {activeTab === "finance" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">Dedicated Finance & Retention Module</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">View complete bank guarantees, retention maturity schedules, and milestone cashflow in the dedicated finance dashboard.</p>
            </div>
            <Link href="/finance">
              <Button variant="accent" size="sm" icon={<ArrowRight size={14} />}>
                Go to Finance
              </Button>
            </Link>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-medium text-slate-900 dark:text-white flex items-center justify-between">
              <span>Contractual Milestone Billing</span>
              <span className="text-xs text-slate-400">Total Contract Value: ₹ 18,500,000.00</span>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {mockInvoices.map((inv) => (
                <div key={inv.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{inv.invoiceNumber}</span>
                    <h4 className="font-semibold text-slate-900 dark:text-white mt-0.5">{inv.milestone}</h4>
                    <p className="text-slate-400 mt-0.5">Due: {new Date(inv.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-sm text-slate-900 dark:text-white">{inv.amount}</p>
                    <span
                      className={`inline-block mt-1 font-semibold px-2 py-0.5 rounded text-[10px] ${
                        inv.status === "PAID"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                          : inv.status === "SENT"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "amc" && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Annual Maintenance Contract (AMC-PRJ-2026-001)</h3>
              <p className="text-xs text-slate-400">Quarterly preventative health checks and 24/7 Level 2 emergency support.</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
              ACTIVE (Quarterly Frequency)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block uppercase">Start Date</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">May 01, 2026</span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block uppercase">Renewal Expiry</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">Apr 30, 2027</span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block uppercase">Next Scheduled Visit</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">Aug 15, 2026</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
