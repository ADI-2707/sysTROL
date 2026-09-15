"use client";

import React, { useState } from "react";
import {
  GitCommit,
  CheckCircle2,
  Clock,
  AlertOctagon,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Building2,
  Calendar,
  RotateCcw,
} from "lucide-react";
import { LifecycleStage, STAGE_ORDER } from "@systrol/types";
import { Button } from "@/components/ui";

interface Project {
  id: string;
  projectCode: string;
  name: string;
  plantLocation: string;
  currentStage: LifecycleStage;
  startDate: string;
  targetCutoverDate: string;
  client: { name: string; sector: string };
  boqCount: number;
  approvedDocsCount: number;
  fatClearedBatchesCount: number;
}

const mockProjects: Project[] = [
  {
    id: "prj-1",
    projectCode: "PRJ-2026-001",
    name: "ArcelorMittal Hot Strip Mill Automation",
    plantLocation: "Hazira, Gujarat",
    currentStage: LifecycleStage.DISPATCH,
    startDate: "2026-01-15T00:00:00Z",
    targetCutoverDate: "2026-07-15T00:00:00Z",
    client: { name: "ArcelorMittal Nippon Steel India", sector: "Flat Steel / HSM" },
    boqCount: 24,
    approvedDocsCount: 18,
    fatClearedBatchesCount: 2,
  },
  {
    id: "prj-2",
    projectCode: "PRJ-2026-002",
    name: "Tata Steel Blast Furnace Slag Granulation",
    plantLocation: "Kalinganagar, Odisha",
    currentStage: LifecycleStage.ENGINEERING,
    startDate: "2026-02-01T00:00:00Z",
    targetCutoverDate: "2026-08-30T00:00:00Z",
    client: { name: "Tata Steel Limited", sector: "Iron Making" },
    boqCount: 15,
    approvedDocsCount: 4,
    fatClearedBatchesCount: 0,
  },
];

export default function LifecyclePage() {
  const [projects] = useState<Project[]>(mockProjects);
  const [selectedProject, setSelectedProject] = useState<Project>(mockProjects[0]);
  const [deviationModal, setDeviationModal] = useState(false);
  const [targetStage, setTargetStage] = useState<LifecycleStage>(LifecycleStage.ENGINEERING);
  const [deviationReason, setDeviationReason] = useState("");
  const [correctiveAction, setCorrectiveAction] = useState("");

  const currentStageIndex = STAGE_ORDER.indexOf(selectedProject.currentStage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <GitCommit className="h-6 w-6 text-indigo-500" />
            12-Stage Project Lifecycle Engine
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enforce stage-gate prerequisites, track sequential milestones, and log formal backwards deviations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="danger"
            icon={<RotateCcw size={15} />}
            onClick={() => setDeviationModal(true)}
          >
            Stage Deviation (Rollback)
          </Button>
          <Button
            variant="primary"
            icon={<ArrowRight size={15} />}
          >
            Advance Next Stage
          </Button>
        </div>
      </div>

      {/* Project selector */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedProject(p)}
            className={`px-4 py-3 rounded-xl border text-left min-w-[280px] transition ${
              selectedProject.id === p.id
                ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-500"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{p.projectCode}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {p.currentStage}
              </span>
            </div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white mt-1 truncate">{p.name}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{p.client.name}</p>
          </button>
        ))}
      </div>

      {/* 12-Stage Visual Backbone */}
      <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Backbone Progression:</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono">{selectedProject.name}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Stage {currentStageIndex + 1} of {STAGE_ORDER.length} — {selectedProject.currentStage}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600 dark:text-slate-300">Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-slate-600 dark:text-slate-300">Current Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="text-slate-400">Pending Gates</span>
            </div>
          </div>
        </div>

        {/* Stepper Timeline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {STAGE_ORDER.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div
                key={stage}
                className={`p-3 rounded-lg border text-xs flex flex-col justify-between transition min-h-[90px] ${
                  isCurrent
                    ? "border-indigo-500 bg-indigo-500/10 shadow-sm"
                    : isCompleted
                    ? "border-emerald-500/40 bg-emerald-500/5 text-slate-800 dark:text-slate-200"
                    : "border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 opacity-70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold">0{idx + 1}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : isCurrent ? (
                    <Clock className="h-4 w-4 text-indigo-500 animate-spin" />
                  ) : (
                    <div className="h-3.5 w-3.5 rounded-full border border-slate-400/40" />
                  )}
                </div>
                <div className="mt-2">
                  <span className="font-semibold block truncate leading-tight">{stage.replace(/_/g, " ")}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage Gate Analysis & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white">Active Gate Prerequisites</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 font-semibold">
              Gate: {selectedProject.currentStage} &rarr; Next
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">Engineering Documentation Sign-off</p>
                <p className="text-xs text-slate-400">All electrical single-line & schematic drawings approved</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> SATISFIED
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">Factory Acceptance Test (FAT) Status</p>
                <p className="text-xs text-slate-400">All panel batches FAT cleared with certified test report</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> SATISFIED
              </span>
            </div>

            <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-500/5 flex items-center justify-between">
              <div>
                <p className="font-medium text-amber-900 dark:text-amber-200">Consignment Plant Delivery (POD)</p>
                <p className="text-xs text-amber-700/80 dark:text-amber-400/80">Pending signed gate receipt verification</p>
              </div>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <AlertOctagon className="h-3.5 w-3.5" /> BLOCKING ADVANCE
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white">Lifecycle Transition History</h3>
            <span className="text-xs text-slate-400">Audit Log</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 text-xs">
              <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white">Advanced to DISPATCH</span>
                  <span className="text-slate-400">Yesterday, 18:40</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">By Commissioning Lead • All FAT cleared</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white">Advanced to MANUFACTURING</span>
                  <span className="text-slate-400">Mar 01, 2026</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">By Project Manager • Engineering design approved</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white">Advanced to ENGINEERING</span>
                  <span className="text-slate-400">Feb 10, 2026</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">By Procurement Lead • BOQ finalized</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formal Deviation Modal */}
      {deviationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="h-6 w-6" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Register Lifecycle Deviation</h3>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rolling back a project stage breaks the standard sequential pipeline and writes an immutable audit record to the executive register.
            </p>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">
                  Target Rollback Stage
                </label>
                <select
                  value={targetStage}
                  onChange={(e) => setTargetStage(e.target.value as LifecycleStage)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                >
                  {STAGE_ORDER.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">
                  Reason for Deviation / Failure Mode
                </label>
                <textarea
                  rows={3}
                  value={deviationReason}
                  onChange={(e) => setDeviationReason(e.target.value)}
                  placeholder="e.g. Critical engineering redesign required after client civil foundation dimension mismatch..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">
                  Corrective Action Plan
                </label>
                <textarea
                  rows={3}
                  value={correctiveAction}
                  onChange={(e) => setCorrectiveAction(e.target.value)}
                  placeholder="e.g. Re-issue GA drawings within 48 hours and re-route cabling trenches..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setDeviationModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setDeviationModal(false)}>
                Confirm & Record Deviation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
