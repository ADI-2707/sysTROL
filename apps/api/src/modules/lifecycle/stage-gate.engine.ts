import { LifecycleStage, STAGE_ORDER } from "@systrol/types";

export interface StageGateCheckResult {
  allowed: boolean;
  blockers: string[];
}

export interface StageGateContext {
  project: {
    id: string;
    currentStage: LifecycleStage;
    boqItems?: Array<{ id: string }>;
    purchaseOrders?: Array<{ id: string; status: string }>;
    engineeringDocs?: Array<{ id: string; status: string }>;
    manufacturingBatches?: Array<{ id: string; fatPassed: boolean }>;
    shipments?: Array<{ id: string; deliveredAt: Date | null }>;
    steps?: Array<{ id: string; status: string }>;
    trialRecords?: Array<{ id: string; passed: boolean }>;
    minutesOfMeetings?: Array<{ id: string; signedAt: Date | null }>;
  };
}

export class StageGateEngine {
  /**
   * Evaluates business gate prerequisites for advancing from currentStage to the next sequential stage.
   */
  static evaluateAdvanceGates(ctx: StageGateContext): StageGateCheckResult {
    const { currentStage } = ctx.project;
    const currentIndex = STAGE_ORDER.indexOf(currentStage);

    if (currentIndex === -1) {
      return { allowed: false, blockers: [`Current stage '${currentStage}' is invalid`] };
    }

    if (currentIndex >= STAGE_ORDER.length - 1) {
      return { allowed: false, blockers: ["Project is already at the terminal stage (AMC)"] };
    }

    const nextStage = STAGE_ORDER[currentIndex + 1];
    const blockers: string[] = [];

    switch (currentStage) {
      case LifecycleStage.PROCUREMENT: {
        // Gate to ENGINEERING: BOQ items must exist
        if (!ctx.project.boqItems || ctx.project.boqItems.length === 0) {
          blockers.push("At least one BOQ item must be finalized before advancing from PROCUREMENT.");
        }
        break;
      }

      case LifecycleStage.ENGINEERING: {
        // Gate to MANUFACTURING: All uploaded engineering documents must be approved
        if (ctx.project.engineeringDocs && ctx.project.engineeringDocs.length > 0) {
          const pendingDocs = ctx.project.engineeringDocs.filter(
            (doc) => doc.status !== "APPROVED"
          );
          if (pendingDocs.length > 0) {
            blockers.push(`${pendingDocs.length} engineering drawings/documents are awaiting approval.`);
          }
        }
        break;
      }

      case LifecycleStage.MANUFACTURING: {
        // Gate to DISPATCH: All batches must have passed FAT
        if (!ctx.project.manufacturingBatches || ctx.project.manufacturingBatches.length === 0) {
          blockers.push("No manufacturing batches found. Create and clear FAT for panels first.");
        } else {
          const pendingFAT = ctx.project.manufacturingBatches.filter((b) => !b.fatPassed);
          if (pendingFAT.length > 0) {
            blockers.push(`${pendingFAT.length} panel batches have not completed/passed Factory Acceptance Testing (FAT).`);
          }
        }
        break;
      }

      case LifecycleStage.DISPATCH: {
        // Gate to ERECTION: Shipments must be delivered to plant site
        if (ctx.project.shipments && ctx.project.shipments.length > 0) {
          const undelivered = ctx.project.shipments.filter((s) => !s.deliveredAt);
          if (undelivered.length > 0) {
            blockers.push(`${undelivered.length} shipments are still in transit or awaiting delivery verification.`);
          }
        }
        break;
      }

      case LifecycleStage.COMMISSIONING: {
        // Gate to COLD_TRIAL: Commissioning DAG steps must be COMPLETED
        if (ctx.project.steps && ctx.project.steps.length > 0) {
          const pendingSteps = ctx.project.steps.filter((s) => s.status !== "COMPLETED");
          if (pendingSteps.length > 0) {
            blockers.push(`${pendingSteps.length} commissioning steps remain uncompleted.`);
          }
        }
        break;
      }

      case LifecycleStage.MOM_AND_HANDOVER: {
        // Gate to PAYMENT: MOM must be signed
        if (ctx.project.minutesOfMeetings && ctx.project.minutesOfMeetings.length > 0) {
          const unsigned = ctx.project.minutesOfMeetings.filter((m) => !m.signedAt);
          if (unsigned.length > 0) {
            blockers.push("Minutes of Meeting handover protocol must be formally signed by client.");
          }
        }
        break;
      }

      default:
        break;
    }

    return {
      allowed: blockers.length === 0,
      blockers,
    };
  }

  /**
   * Validates whether a backward or skip transition (deviation) is well-formed.
   */
  static validateDeviation(
    currentStage: LifecycleStage,
    targetStage: LifecycleStage,
    reason: string,
    correctiveAction: string
  ): { valid: boolean; error?: string } {
    if (currentStage === targetStage) {
      return { valid: false, error: "Target stage cannot be identical to the current stage" };
    }

    if (!reason || reason.trim().length < 10) {
      return { valid: false, error: "Deviation reason must be at least 10 characters long" };
    }

    if (!correctiveAction || correctiveAction.trim().length < 10) {
      return { valid: false, error: "Corrective action must be at least 10 characters long" };
    }

    return { valid: true };
  }
}
