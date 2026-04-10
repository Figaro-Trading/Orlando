import type { TimeFeasibility, PlanEntry } from "../types";
import { SCORE_WEIGHTS } from "./weights";

export type ScoringInput = {
  entityId: string;
  name: string;
  planEntry: PlanEntry | null;
  feasibility: TimeFeasibility;
  isOnPlan: boolean;
  currentZone: number | null;
  entityZone: number | null;
  parkClosingTime: Date | null;
  now: Date;
};

export function scoreEntity(input: ScoringInput): number {
  const W = SCORE_WEIGHTS;
  let score = 0;

  const waitMinutes = input.feasibility.waitMinutes ?? 0;
  score += waitMinutes * W.wait;
  score += input.feasibility.walkMinutes * W.walk;

  if (!input.isOnPlan) score += W.offPlanPenalty;

  if (input.planEntry?.priority === 3) score += W.lowPriorityPenalty;

  if (input.currentZone != null && input.entityZone != null && input.currentZone !== input.entityZone) {
    score += W.zoneCrossoverPenalty;
  }

  if (
    input.feasibility.arrivalSlackMinutes !== undefined &&
    input.feasibility.arrivalSlackMinutes < W.minShowSlackMinutes &&
    input.feasibility.arrivalSlackMinutes >= 0
  ) {
    score += W.tightSlackPenalty;
  }

  if (input.planEntry) {
    const p = input.planEntry.priority ?? 3;
    score -= W.priorityBonus[p as 1 | 2 | 3] ?? 0;
  }

  if (
    input.feasibility.minutesUntilStart !== undefined &&
    input.feasibility.minutesUntilStart > 0 &&
    input.feasibility.minutesUntilStart <= 30 &&
    input.feasibility.arrivalSlackMinutes !== undefined &&
    input.feasibility.arrivalSlackMinutes >= W.minShowSlackMinutes
  ) {
    score -= W.showUrgencyBonus;
  }

  if (input.planEntry?.isReride) score += W.rerideDiscount;

  if (input.planEntry?.coupefile) {
    score -= W.coupefileBonus[input.planEntry.coupefile] ?? 0;
  }

  if (input.parkClosingTime) {
    const minutesUntilClose = (input.parkClosingTime.getTime() - input.now.getTime()) / 60000;
    if (minutesUntilClose > 0 && minutesUntilClose <= W.closingSoonBonusMinutes) {
      if (waitMinutes + input.feasibility.walkMinutes < minutesUntilClose) {
        score -= W.closingSoonBonus;
      }
    }
  }

  return Math.max(0, score);
}
