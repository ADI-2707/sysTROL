"use client";

import React, { useState } from "react";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { ProcessStep } from "@/types";
import { Badge } from "../Badge/Badge";
import styles from "./Stepper.module.css";

export interface StepperProps {
  steps: ProcessStep[];
  initialStep?: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, initialStep = 0 }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(initialStep);
  const activeStep = steps[activeStepIndex] || steps[0];

  return (
    <div className={styles.container}>
      <div className={styles.stepNav} role="tablist" aria-label="Process Steps">
        {steps.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          return (
            <button
              key={step.step}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.stepButton} ${isActive ? styles.stepActive : ""}`}
              onClick={() => setActiveStepIndex(idx)}
            >
              <div className={styles.stepNumber}>{step.step}</div>
              <div className={styles.stepTitle}>{step.title}</div>
              <div className={styles.stepSubtitle}>{step.shortDesc}</div>
            </button>
          );
        })}
      </div>

      <div className={styles.detailPanel} role="tabpanel">
        <div className={styles.panelHeader}>
          <div>
            <Badge variant="accent" size="sm">
              Phase {activeStep.step} of {steps.length}
            </Badge>
            <h3 className={styles.panelTitle} style={{ marginTop: "8px" }}>
              {activeStep.title}
            </h3>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              disabled={activeStepIndex === 0}
              onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
              style={{
                padding: "8px 16px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface-0)",
                color: "var(--color-ink-700)",
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                opacity: activeStepIndex === 0 ? 0.4 : 1,
                cursor: activeStepIndex === 0 ? "not-allowed" : "pointer",
              }}
            >
              Previous
            </button>
            <button
              type="button"
              disabled={activeStepIndex === steps.length - 1}
              onClick={() => setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
              style={{
                padding: "8px 16px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-brand-green-600)",
                backgroundColor: "var(--color-brand-green-600)",
                color: "var(--color-surface-0)",
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                opacity: activeStepIndex === steps.length - 1 ? 0.4 : 1,
                cursor: activeStepIndex === steps.length - 1 ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>Next Phase</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <p className={styles.panelDescription}>{activeStep.detailedDesc}</p>

        <div>
          <h4 className={styles.deliverablesTitle}>Key Engineering Deliverables</h4>
          <ul className={styles.deliverableList}>
            {activeStep.deliverables.map((item, idx) => (
              <li key={idx} className={styles.deliverableItem}>
                <CheckCircle2 size={16} color="var(--color-brand-green-600)" style={{ flexShrink: 0 }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
