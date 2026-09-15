"use client";

import React, { useState } from "react";
import {
  Network,
  Play,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  FileCheck2,
  Plus,
  Radio,
  Cpu,
} from "lucide-react";
import { StepStatus, StepType } from "@systrol/types";
import { Button, KpiCard } from "@/components/ui";

interface Step {
  id: string;
  order: number;
  title: string;
  description: string;
  stepType: StepType;
  status: StepStatus;
  dependsOn: string[];
  durationHours: number;
  signoff?: {
    signedBy: string;
    role: string;
    signedAt: string;
    comments?: string;
  };
}

const mockSteps: Step[] = [
  {
    id: "step-1",
    order: 1,
    title: "Cold Cable Meggering & Point-to-Point IO Check",
    description: "Insulation testing across main motor feeds and 24V IO field junction boxes.",
    stepType: StepType.PRE_COMM_AUDIT,
    status: StepStatus.COMPLETED,
    dependsOn: [],
    durationHours: 16,
    signoff: {
      signedBy: "Vikram Rathore",
      role: "FIELD_ENGINEER",
      signedAt: "2026-03-10T11:00:00Z",
      comments: "All IO loops verified with zero earth faults.",
    },
  },
  {
    id: "step-2",
    order: 2,
    title: "PLC & Drives Hardware-in-the-Loop (HIL) Simulation",
    description: "Run digital twin simulation verifying emergency trip sequencing and interlocks.",
    stepType: StepType.HIL_SIMULATION,
    status: StepStatus.COMPLETED,
    dependsOn: ["step-1"],
    durationHours: 24,
    signoff: {
      signedBy: "Preet Tripathi",
      role: "COMMISSIONING_LEAD",
      signedAt: "2026-03-12T16:45:00Z",
      comments: "Failsafe estop response time < 40ms.",
    },
  },
  {
    id: "step-3",
    order: 3,
    title: "Stand 1-3 Main Drive Master-Follower Speed Sync",
    description: "Tuning tension control and angular synchronization between roughing stands.",
    stepType: StepType.STAND_TUNING,
    status: StepStatus.IN_PROGRESS,
    dependsOn: ["step-2"],
    durationHours: 32,
  },
  {
    id: "step-4",
    order: 4,
    title: "Hydraulic AGC Fast Valve Closed-Loop Position Tuning",
    description: "Servo valve frequency response and position control loop optimization.",
    stepType: StepType.LOOP_TUNING,
    status: StepStatus.PENDING,
    dependsOn: ["step-2"],
    durationHours: 20,
  },
  {
    id: "step-5",
    order: 5,
    title: "Integrated Mill Tandem Jogging & Bar Threading Test",
    description: "Full mill synchronized rotation test prior to hot billet charging.",
    stepType: StepType.STAND_TUNING,
    status: StepStatus.PENDING,
    dependsOn: ["step-3", "step-4"],
    durationHours: 40,
  },
];

export default function CommissioningDAGPage() {
  const [steps, setSteps] = useState<Step[]>(mockSteps);
  const [selectedStep, setSelectedStep] = useState<Step | null>(mockSteps[2]);
  const [liveTelemetry, setLiveTelemetry] = useState({
    standSpeedRpm: 1184.2,
    motorTorqueNm: 489.1,
    loopResponseMs: 18.4,
    busVoltageV: 689.5,
  });

  const criticalPathIds = ["step-1", "step-2", "step-3", "step-5"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Network className="h-6 w-6 text-cyan-500" />
            Commissioning DAG Engine & Live Telemetry
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Directed Acyclic Graph execution engine with automated cycle detection, critical path calculation, and stage sign-offs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-500" />
            <span>PLC Telemetry Connected (Port 8080)</span>
          </div>
          <Button variant="accent" icon={<Plus size={16} />}>
            Add DAG Step
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Stand 1 Motor RPM"
          value={liveTelemetry.standSpeedRpm}
          unit="rpm"
          highlight="blue"
          icon={<Cpu size={18} />}
        />
        <KpiCard
          title="Motor Shaft Torque"
          value={liveTelemetry.motorTorqueNm}
          unit="N·m"
          highlight="neutral"
          icon={<Network size={18} />}
        />
        <KpiCard
          title="Closed Loop Latency"
          value={liveTelemetry.loopResponseMs}
          unit="ms"
          highlight="green"
          icon={<Radio size={18} />}
        />
        <KpiCard
          title="Critical Path Duration"
          value="112"
          unit="hours"
          highlight="blue"
          icon={<TrendingUp size={18} />}
        />
      </div>

      {/* DAG Visual Canvas & Nodes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Commissioning Step DAG Graph</h3>
              <p className="text-xs text-slate-400">
                Topologically ordered execution sequence with highlighted critical path.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-semibold">
                Critical Path Highlighted
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {steps.map((step) => {
              const isCritical = criticalPathIds.includes(step.id);
              const isSelected = selectedStep?.id === step.id;

              return (
                <div
                  key={step.id}
                  onClick={() => setSelectedStep(step)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? "border-cyan-500 bg-cyan-500/5 dark:bg-cyan-500/10 shadow-sm"
                      : isCritical
                      ? "border-indigo-500/40 bg-indigo-500/5 hover:border-indigo-400"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        STEP 0{step.order}
                      </span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {step.stepType.replace(/_/g, " ")}
                      </span>
                      {isCritical && (
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          CRITICAL PATH
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{step.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{step.description}</p>
                    {step.dependsOn.length > 0 && (
                      <p className="text-[11px] text-slate-400">
                        Dependencies: {step.dependsOn.map((d) => `STEP 0${d.replace("step-", "")}`).join(", ")}
                      </p>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2">
                    {step.status === StepStatus.COMPLETED ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        COMPLETED
                      </span>
                    ) : step.status === StepStatus.IN_PROGRESS ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                        <Clock className="h-3.5 w-3.5 animate-spin" />
                        IN PROGRESS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        <AlertCircle className="h-3.5 w-3.5" />
                        PENDING
                      </span>
                    )}
                    <span className="text-xs font-mono text-slate-400">{step.durationHours}h estimated</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Inspector & Formal Signoff */}
        <div>
          {selectedStep ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Step Inspector</h3>
                  <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400">
                    STEP 0{selectedStep.order} — {selectedStep.stepType}
                  </span>
                </div>
                <FileCheck2 className="h-5 w-5 text-slate-400" />
              </div>

              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Title & Objective</span>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{selectedStep.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{selectedStep.description}</p>
              </div>

              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Upstream Dependencies</span>
                {selectedStep.dependsOn.length > 0 ? (
                  <div className="mt-1 space-y-1">
                    {selectedStep.dependsOn.map((dep) => (
                      <div
                        key={dep}
                        className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono"
                      >
                        Prerequisite: {dep}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 mt-1 italic">Root node (no upstream prerequisites).</p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold">Formal Execution Sign-off</span>
                {selectedStep.signoff ? (
                  <div className="mt-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs">
                    <p className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      Signoff Accepted & Recorded
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">
                      Signed by: <span className="font-medium">{selectedStep.signoff.signedBy}</span> ({selectedStep.signoff.role})
                    </p>
                    <p className="text-slate-400 mt-0.5">
                      At: {new Date(selectedStep.signoff.signedAt).toLocaleString()}
                    </p>
                    {selectedStep.signoff.comments && (
                      <p className="text-slate-500 italic mt-2 border-t border-emerald-200 dark:border-emerald-800/40 pt-1">
                        &ldquo;{selectedStep.signoff.comments}&rdquo;
                      </p>
                    )}
                  </div>
                ) : selectedStep.status === StepStatus.IN_PROGRESS ? (
                  <div className="mt-2 space-y-3">
                    <div className="p-3 rounded-lg bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/60 text-xs text-cyan-800 dark:text-cyan-300">
                      Step execution currently live in plant. Complete electrical loop tests before logging signature.
                    </div>
                    <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition">
                      Sign-off & Mark Step Completed
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 space-y-3">
                    <button className="w-full flex items-center justify-center gap-2 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold transition">
                      <Play className="h-3.5 w-3.5" />
                      Start Step Execution
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-slate-400 border border-dashed rounded-xl">
              Select a DAG step node to inspect parameters and signoffs
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
