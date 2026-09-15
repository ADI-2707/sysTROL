"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Clock,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Calendar,
} from "lucide-react";

export default function AnalyticsDashboardPage() {
  const [selectedMillType, setSelectedMillType] = useState<string>("ALL");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-indigo-500" />
            Executive Intelligence & Operational Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time stage dwell telemetry, commercial conversion funnels, payment aging, and preventative AMC forecasting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedMillType}
            onChange={(e) => setSelectedMillType(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Mill Architectures</option>
            <option value="HOT_STRIP_MILL">Hot Strip Mills (HSM)</option>
            <option value="WIRE_ROD_MILL">Wire Rod Mills (WRM)</option>
            <option value="ERW_TUBE_MILL">ERW Tube Mills</option>
          </select>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <span className="text-xs text-slate-500 font-medium uppercase flex items-center justify-between">
            <span>Avg. Commissioning Lead Time</span>
            <Clock className="h-4 w-4 text-indigo-500" />
          </span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">21.4 Days</p>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3" /> 14% faster than industry benchmark
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <span className="text-xs text-slate-500 font-medium uppercase flex items-center justify-between">
            <span>Enquiry-to-PO Win Rate</span>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">42.8%</p>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
            Highest in flat steel modernization
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <span className="text-xs text-slate-500 font-medium uppercase flex items-center justify-between">
            <span>Total Receivables</span>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹ 24.8M</p>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
            92% within current 30-day bucket
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <span className="text-xs text-slate-500 font-medium uppercase flex items-center justify-between">
            <span>Active AMC Fleet</span>
            <ShieldCheck className="h-4 w-4 text-amber-500" />
          </span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">18 Plants</p>
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1">
            2 renewals approaching &lt; 60 days
          </span>
        </div>
      </div>

      {/* Analytics Visual Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stage Dwell Time Heatmap */}
        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Average Dwell Time by Stage</h3>
              <p className="text-xs text-slate-400">Bottleneck discovery across project lifecycle stages.</p>
            </div>
            <span className="text-xs font-mono text-slate-400">Mean Days</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>PROCUREMENT (BOQ & Vendor POs)</span>
                <span className="font-mono text-slate-500">14 Days</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: "30%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>ENGINEERING (Schematics & Reviews)</span>
                <span className="font-mono text-slate-500">26 Days</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: "55%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>MANUFACTURING & FAT (Panel Assembly)</span>
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">42 Days (Critical Path)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "88%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>DISPATCH & FREIGHT LOGISTICS</span>
                <span className="font-mono text-slate-500">6 Days</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: "15%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>COMMISSIONING & TRIALS</span>
                <span className="font-mono text-slate-500">21 Days</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: "45%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Commercial Payment Aging Buckets */}
        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Commercial Receivables Aging</h3>
              <p className="text-xs text-slate-400">Milestone cashflow outstanding by overdue brackets.</p>
            </div>
            <span className="text-xs font-mono text-slate-400">INR (₹)</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <span className="text-xs text-slate-400 font-semibold block">CURRENT (Not Due)</span>
              <p className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">₹ 14,800,000</p>
              <span className="text-[10px] text-slate-500">6 milestone invoices</span>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <span className="text-xs text-slate-400 font-semibold block">1 - 30 DAYS OVERDUE</span>
              <p className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">₹ 5,550,000</p>
              <span className="text-[10px] text-slate-500">2 milestone invoices</span>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <span className="text-xs text-slate-400 font-semibold block">31 - 60 DAYS OVERDUE</span>
              <p className="font-mono text-lg font-bold text-amber-600 dark:text-amber-400 mt-1">₹ 2,600,000</p>
              <span className="text-[10px] text-slate-500">1 milestone invoice</span>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <span className="text-xs text-slate-400 font-semibold block">90+ DAYS OVERDUE</span>
              <p className="font-mono text-lg font-bold text-rose-600 dark:text-rose-400 mt-1">₹ 1,850,000</p>
              <span className="text-[10px] text-slate-500">1 retention claim</span>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-500/5 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between">
            <span>DSO (Days Sales Outstanding): 38.2 days</span>
            <span className="font-semibold">Healthy Liquidity</span>
          </div>
        </div>
      </div>
    </div>
  );
}
