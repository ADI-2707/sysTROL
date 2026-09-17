"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Layers,
  CheckCircle2,
  Activity,
  Search,
  Filter,
  ArrowRight,
  Cpu,
} from "lucide-react";
import { Button, KpiCard, Badge } from "@/components/ui";
import { useDebounce } from "@/lib/use-debounce";

interface ProjectMetricRow {
  id: string;
  projectCode: string;
  client: string;
  architecture: string;
  stage: string;
  dwellDays: number;
  dwellBenchmark: number;
  status: "ON_TRACK" | "BOTTLENECK" | "ACCELERATED";
  contractValue: string;
  receivables: string;
  health: "EXCELLENT" | "STABLE" | "ATTENTION";
}

const mockProjectsData: ProjectMetricRow[] = [
  {
    id: "p1",
    projectCode: "PROJ-2026-0001",
    client: "ArcelorMittal Nippon Steel",
    architecture: "Hot Strip Mill (HSM)",
    stage: "COMMISSIONING",
    dwellDays: 18,
    dwellBenchmark: 21,
    status: "ACCELERATED",
    contractValue: "₹ 18,500,000",
    receivables: "₹ 1,850,000",
    health: "EXCELLENT",
  },
  {
    id: "p2",
    projectCode: "PROJ-2026-0002",
    client: "JSW Steel Ltd (Toranagallu)",
    architecture: "Wire Rod Mill (WRM)",
    stage: "MANUFACTURING & FAT",
    dwellDays: 44,
    dwellBenchmark: 38,
    status: "BOTTLENECK",
    contractValue: "₹ 24,200,000",
    receivables: "₹ 4,800,000",
    health: "ATTENTION",
  },
  {
    id: "p3",
    projectCode: "PROJ-2026-0003",
    client: "Tata Steel Ltd (Jamshedpur)",
    architecture: "Bar & Section Mill",
    stage: "ENGINEERING",
    dwellDays: 22,
    dwellBenchmark: 26,
    status: "ON_TRACK",
    contractValue: "₹ 14,000,000",
    receivables: "₹ 0",
    health: "EXCELLENT",
  },
  {
    id: "p4",
    projectCode: "PROJ-2026-0004",
    client: "Jindal Steel & Power (Angul)",
    architecture: "ERW Tube Mill",
    stage: "DISPATCH & FREIGHT",
    dwellDays: 5,
    dwellBenchmark: 7,
    status: "ON_TRACK",
    contractValue: "₹ 9,800,000",
    receivables: "₹ 1,200,000",
    health: "STABLE",
  },
  {
    id: "p5",
    projectCode: "PROJ-2026-0005",
    client: "SAIL (Rourkela Steel Plant)",
    architecture: "Plate & Coil Mill",
    stage: "COMMISSIONING",
    dwellDays: 26,
    dwellBenchmark: 24,
    status: "BOTTLENECK",
    contractValue: "₹ 31,500,000",
    receivables: "₹ 6,300,000",
    health: "ATTENTION",
  },
];

export default function AnalyticsDashboardPage() {
  const [selectedMillType, setSelectedMillType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 350);

  const filteredProjects = mockProjectsData.filter((p) => {
    const matchesMill =
      selectedMillType === "ALL" ||
      (selectedMillType === "HOT_STRIP_MILL" && p.architecture.includes("Hot Strip")) ||
      (selectedMillType === "WIRE_ROD_MILL" && p.architecture.includes("Wire Rod")) ||
      (selectedMillType === "ERW_TUBE_MILL" && p.architecture.includes("ERW Tube")) ||
      (selectedMillType === "BAR_MILL" && p.architecture.includes("Bar & Section"));
    const matchesSearch =
      p.projectCode.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.client.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.stage.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchesMill && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6" style={{ color: "var(--sys-blue-primary)" }} />
            Executive Intelligence & Operational Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time stage dwell telemetry, commercial conversion funnels, payment aging, and preventative AMC forecasting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedMillType}
            onChange={(e) => setSelectedMillType(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Mill Architectures</option>
            <option value="HOT_STRIP_MILL">Hot Strip Mills (HSM)</option>
            <option value="WIRE_ROD_MILL">Wire Rod Mills (WRM)</option>
            <option value="ERW_TUBE_MILL">ERW Tube Mills</option>
            <option value="BAR_MILL">Bar & Section Mills</option>
          </select>
          <Button variant="outline" size="sm" icon={<Calendar size={14} />}>
            Last 90 Days
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Avg. Commissioning Lead Time"
          value="21.4 Days"
          icon={<Clock className="h-4 w-4" />}
          trend={{ value: "14% faster than benchmark", isPositive: true }}
          highlight="blue"
        />
        <KpiCard
          title="Enquiry-to-PO Win Rate"
          value="42.8%"
          icon={<ArrowUpRight className="h-4 w-4" />}
          trend={{ value: "Highest in flat steel", isPositive: true }}
          highlight="green"
        />
        <KpiCard
          title="Total Receivables"
          value="₹ 24.8M"
          icon={<DollarSign className="h-4 w-4" />}
          subtitle="92% within 30-day bucket"
          highlight="neutral"
        />
        <KpiCard
          title="Active AMC Fleet"
          value="18 Plants"
          icon={<ShieldCheck className="h-4 w-4" />}
          subtitle="2 renewals < 60 days"
          highlight="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "var(--shadow-sm)",
          }}
          className="space-y-4"
        >
          <div
            style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "12px" }}
            className="flex items-center justify-between"
          >
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Average Dwell Time by Stage</h3>
              <p className="text-xs text-slate-400">Bottleneck discovery across project lifecycle stages.</p>
            </div>
            <Badge variant="blue" size="sm">Mean Days</Badge>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>PROCUREMENT (BOQ & Vendor POs)</span>
                <span className="font-mono text-slate-500">14 Days</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: "30%", backgroundColor: "var(--sys-blue-primary)" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>ENGINEERING (Schematics & Reviews)</span>
                <span className="font-mono text-slate-500">26 Days</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: "55%", backgroundColor: "var(--sys-blue-primary)" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>MANUFACTURING & FAT (Panel Assembly)</span>
                <span className="font-mono text-amber-500 font-bold">42 Days (Critical Path)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: "88%", backgroundColor: "#f59e0b" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>DISPATCH & FREIGHT LOGISTICS</span>
                <span className="font-mono text-slate-500">6 Days</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: "15%", backgroundColor: "var(--sys-green-accent)" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>COMMISSIONING & TRIALS</span>
                <span className="font-mono text-slate-500">21 Days</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: "45%", backgroundColor: "var(--sys-blue-primary)" }} />
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "var(--shadow-sm)",
          }}
          className="space-y-4"
        >
          <div
            style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "12px" }}
            className="flex items-center justify-between"
          >
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Commercial Receivables Aging</h3>
              <p className="text-xs text-slate-400">Milestone cashflow outstanding by overdue brackets.</p>
            </div>
            <Badge variant="green" size="sm">INR (₹)</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "8px",
                padding: "12px",
              }}
            >
              <span className="text-[11px] text-slate-400 font-semibold block">CURRENT (Not Due)</span>
              <p className="font-mono text-lg font-bold mt-1" style={{ color: "var(--sys-green-accent)" }}>
                ₹ 14,800,000
              </p>
              <span className="text-[10px] text-slate-500">6 milestone invoices</span>
            </div>

            <div
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "8px",
                padding: "12px",
              }}
            >
              <span className="text-[11px] text-slate-400 font-semibold block">1 - 30 DAYS OVERDUE</span>
              <p className="font-mono text-lg font-bold mt-1" style={{ color: "var(--sys-blue-primary)" }}>
                ₹ 5,550,000
              </p>
              <span className="text-[10px] text-slate-500">2 milestone invoices</span>
            </div>

            <div
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "8px",
                padding: "12px",
              }}
            >
              <span className="text-[11px] text-slate-400 font-semibold block">31 - 60 DAYS OVERDUE</span>
              <p className="font-mono text-lg font-bold text-amber-500 mt-1">₹ 2,600,000</p>
              <span className="text-[10px] text-slate-500">1 milestone invoice</span>
            </div>

            <div
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "8px",
                padding: "12px",
              }}
            >
              <span className="text-[11px] text-slate-400 font-semibold block">90+ DAYS OVERDUE</span>
              <p className="font-mono text-lg font-bold text-red-500 mt-1">₹ 1,850,000</p>
              <span className="text-[10px] text-slate-500">1 retention claim</span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "var(--sys-green-subtle)",
              border: "1px solid var(--sys-green-border)",
              borderRadius: "8px",
              padding: "10px 14px",
            }}
            className="text-xs flex items-center justify-between"
          >
            <span style={{ color: "var(--text-heading)", fontWeight: 500 }}>
              DSO (Days Sales Outstanding): <span className="font-bold">38.2 days</span>
            </span>
            <Badge variant="green" size="sm">Healthy Liquidity</Badge>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "12px",
          boxShadow: "var(--shadow-sm)",
          overflow: "hidden",
        }}
      >
        <div
          style={{ borderBottom: "1px solid var(--border-subtle)", padding: "16px 20px" }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Layers size={18} style={{ color: "var(--sys-green-accent)" }} />
              Plant Automation Project Telemetry & Milestone Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cross-project operational health, stage dwell benchmarks, and commercial milestone fulfillment.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: "10px",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="text"
                placeholder="Search projects or clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: "30px",
                  paddingRight: "12px",
                  height: "32px",
                  fontSize: "12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-heading)",
                  width: "220px",
                }}
              />
            </div>
            <Link href="/lifecycle">
              <Button variant="outline" size="sm" icon={<ArrowRight size={13} />}>
                Lifecycle DAG
              </Button>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              style={{
                backgroundColor: "var(--bg-surface)",
                borderBottom: "1px solid var(--border-subtle)",
                color: "var(--text-muted)",
              }}
              className="uppercase font-semibold"
            >
              <tr>
                <th className="p-3.5">Project / Client</th>
                <th className="p-3.5">Architecture</th>
                <th className="p-3.5">Current Stage</th>
                <th className="p-3.5">Stage Dwell vs Benchmark</th>
                <th className="p-3.5">Dwell Status</th>
                <th className="p-3.5">Contract Value</th>
                <th className="p-3.5">Receivables</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
              {filteredProjects.map((row) => (
                <tr
                  key={row.id}
                  style={{
                    transition: "background-color 0.15s ease",
                  }}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  <td className="p-3.5">
                    <span className="font-mono font-bold text-slate-900 dark:text-white block">
                      {row.projectCode}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] block mt-0.5">
                      {row.client}
                    </span>
                  </td>
                  <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">
                    {row.architecture}
                  </td>
                  <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">
                    {row.stage}
                  </td>
                  <td className="p-3.5 font-mono">
                    <span className="font-bold text-slate-900 dark:text-white">{row.dwellDays}d</span>
                    <span className="text-slate-400 text-[11px] ml-1.5">/ {row.dwellBenchmark}d mean</span>
                  </td>
                  <td className="p-3.5">
                    {row.status === "ACCELERATED" && (
                      <Badge variant="green" size="sm">Accelerated</Badge>
                    )}
                    {row.status === "ON_TRACK" && (
                      <Badge variant="blue" size="sm">On Schedule</Badge>
                    )}
                    {row.status === "BOTTLENECK" && (
                      <Badge variant="amber" size="sm">Bottleneck</Badge>
                    )}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                    {row.contractValue}
                  </td>
                  <td className="p-3.5 font-mono font-semibold" style={{ color: row.receivables === "₹ 0" ? "var(--sys-green-accent)" : "#f59e0b" }}>
                    {row.receivables}
                  </td>
                  <td className="p-3.5 text-right">
                    <Link href={`/lifecycle?project=${row.id}`}>
                      <Button variant="outline" size="sm" icon={<ArrowRight size={13} />}>
                        Inspect
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            backgroundColor: "var(--bg-surface)",
            padding: "12px 20px",
          }}
          className="flex items-center justify-between text-xs text-slate-500"
        >
          <span>Showing {filteredProjects.length} of {mockProjectsData.length} monitored mill automation projects</span>
          <span className="font-mono">Real-time Telemetry: Healthy</span>
        </div>
      </div>
    </div>
  );
}
