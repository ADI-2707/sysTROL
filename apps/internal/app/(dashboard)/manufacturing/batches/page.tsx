"use client";

import React, { useState } from "react";
import { Hammer, CheckCircle2, AlertTriangle, ShieldCheck, Plus, RefreshCw, FileText } from "lucide-react";

interface Batch {
  id: string;
  batchCode: string;
  panelType: string;
  fatPassed: boolean;
  fatReportUrl?: string | null;
  createdAt: string;
  completedAt?: string | null;
  project?: {
    id: string;
    projectCode: string;
    name: string;
  };
  qcChecks?: Array<{ id: string; checklistItem: string; result: string }>;
}

const mockBatches: Batch[] = [
  {
    id: "batch-1",
    batchCode: "BATCH-PRJ-2026-001-01",
    panelType: "PLC Control Panel (Siemens S7-1500 + Rittal IP55)",
    fatPassed: true,
    fatReportUrl: "https://systrol-documents.s3.us-east-1.amazonaws.com/manufacturing/fat-reports/BATCH-PRJ-2026-001-01.pdf",
    createdAt: "2026-03-01T08:00:00Z",
    completedAt: "2026-03-10T14:30:00Z",
    project: {
      id: "prj-1",
      projectCode: "PRJ-2026-001",
      name: "ArcelorMittal Hot Strip Mill Automation",
    },
    qcChecks: [
      { id: "qc-1", checklistItem: "Point-to-point wiring continuity verification", result: "PASS" },
      { id: "qc-2", checklistItem: "Dielectric insulation & high-voltage flash test (2.5kV)", result: "PASS" },
      { id: "qc-3", checklistItem: "Profibus/Profinet communication ping test", result: "PASS" },
    ],
  },
  {
    id: "batch-2",
    batchCode: "BATCH-PRJ-2026-001-02",
    panelType: "Main Drive Panel (ABB ACS880 Multi-Drive 400kW)",
    fatPassed: false,
    createdAt: "2026-03-08T09:15:00Z",
    project: {
      id: "prj-1",
      projectCode: "PRJ-2026-001",
      name: "ArcelorMittal Hot Strip Mill Automation",
    },
    qcChecks: [
      { id: "qc-4", checklistItem: "Busbar torque & phase clearance check", result: "PASS" },
      { id: "qc-5", checklistItem: "Cooling fan airflow & thermography run", result: "FAIL" },
    ],
  },
  {
    id: "batch-3",
    batchCode: "BATCH-PRJ-2026-002-01",
    panelType: "Remote I/O Junction Enclosure (Hazardous Area Zone 2)",
    fatPassed: false,
    createdAt: "2026-03-12T11:00:00Z",
    project: {
      id: "prj-2",
      projectCode: "PRJ-2026-002",
      name: "Tata Steel Blast Furnace Slag Granulation",
    },
    qcChecks: [],
  },
];

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>(mockBatches);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(mockBatches[0]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Hammer className="h-6 w-6 text-amber-500" />
            Manufacturing & Panel Assembly Batches
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track workshop assembly line progression, panel fabrication stages, and Factory Acceptance Testing (FAT).
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition shadow-sm">
          <Plus className="h-4 w-4" />
          Create Assembly Batch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <span className="text-xs text-slate-500 font-medium uppercase">Active Batches</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{batches.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <span className="text-xs text-slate-500 font-medium uppercase">FAT Cleared</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {batches.filter((b) => b.fatPassed).length}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <span className="text-xs text-slate-500 font-medium uppercase">FAT In Progress / Pending</span>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {batches.filter((b) => !b.fatPassed).length}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
          <span className="text-xs text-slate-500 font-medium uppercase">Total QC Checks Logged</span>
          <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-1">
            {batches.reduce((acc, b) => acc + (b.qcChecks?.length || 0), 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-medium text-slate-900 dark:text-white flex items-center justify-between">
            <span>Assembly Work Orders</span>
            <span className="text-xs text-slate-400">Workshop Line A / Line B</span>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {batches.map((batch) => (
              <div
                key={batch.id}
                onClick={() => setSelectedBatch(batch)}
                className={`p-4 cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                  selectedBatch?.id === batch.id ? "bg-amber-500/5 dark:bg-amber-500/10" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {batch.batchCode}
                  </span>
                  {batch.fatPassed ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="h-3 w-3" />
                      FAT PASSED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      ASSEMBLY & QC
                    </span>
                  )}
                </div>
                <h3 className="font-medium text-slate-900 dark:text-white text-sm mt-2">{batch.panelType}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Project: {batch.project?.projectCode} — {batch.project?.name}
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                  <span>QC Checks: {batch.qcChecks?.length || 0} registered</span>
                  <span>Started: {new Date(batch.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {selectedBatch ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Batch Details</h3>
                  <span className="font-mono text-xs text-amber-600 dark:text-amber-400">{selectedBatch.batchCode}</span>
                </div>
                <ShieldCheck className="h-5 w-5 text-slate-400" />
              </div>

              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Panel Specification</span>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5">{selectedBatch.panelType}</p>
              </div>

              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">QC Checkpoints</span>
                {selectedBatch.qcChecks && selectedBatch.qcChecks.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {selectedBatch.qcChecks.map((qc) => (
                      <div
                        key={qc.id}
                        className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between"
                      >
                        <span className="text-slate-700 dark:text-slate-300 pr-2">{qc.checklistItem}</span>
                        <span
                          className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                            qc.result === "PASS"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400"
                          }`}
                        >
                          {qc.result}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 mt-1 italic">No QC inspections logged yet.</p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold">Factory Acceptance Test (FAT)</span>
                {selectedBatch.fatPassed ? (
                  <div className="mt-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs">
                    <p className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      FAT Formally Approved & Signed
                    </p>
                    {selectedBatch.fatReportUrl && (
                      <a
                        href={selectedBatch.fatReportUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Download Certified FAT Report PDF
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="mt-2 space-y-3">
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
                      Pending customer witness and final insulation high-pot signoff.
                    </div>
                    <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition">
                      Sign-off & Pass FAT
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-slate-400 border border-dashed rounded-xl">
              Select an assembly batch to inspect QC checks and FAT status
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
