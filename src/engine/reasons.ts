import type { TimeFeasibility, PlanEntry } from "../types";
import { SCORE_WEIGHTS } from "./weights";

export type ReasonContext = {
  isOnPlan: boolean;
  planEntry: PlanEntry | null;
  feasibility: TimeFeasibility;
  score: number;
  zoneNumber: number | null;
  isPlannedNext: boolean;
  isBestChoice: boolean;
  isShow: boolean;
  isNearby: boolean;
  entityName: string;
  waitTime: number | undefined;
  status: "recommended" | "possible" | "not_recommended";
  exclusionReason: string | null;
};

export function generateReason(ctx: ReasonContext): string {
  const parts: string[] = [];

  if (ctx.status === "not_recommended") {
    return ctx.exclusionReason ?? "Not recommended right now";
  }

  if (ctx.isShow) {
    const slack = ctx.feasibility.arrivalSlackMinutes;
    const until = ctx.feasibility.minutesUntilStart;
    if (slack !== undefined && until !== undefined) {
      if (slack >= SCORE_WEIGHTS.minShowSlackMinutes) {
        parts.push(`Starts in ${until} min`, `${ctx.feasibility.walkMinutes} min walk`, `${slack} min buffer`);
      } else {
        parts.push(`Starts in ${until} min — tight buffer (${slack} min)`);
      }
    }
    if (ctx.isOnPlan) parts.push("on the plan");
    return capitalize(parts.join(", "));
  }

  if (ctx.isPlannedNext && ctx.isOnPlan) {
    parts.push("Next planned on schedule");
    if (ctx.zoneNumber) parts.push(`Zone ${ctx.zoneNumber}`);
    if (ctx.planEntry?.skipPass && ctx.planEntry.skipPass !== "—") {
      parts.push(`${ctx.planEntry.skipPass} available`);
    }
    if (ctx.waitTime !== undefined) parts.push(`${ctx.waitTime} min wait`);
    if (ctx.feasibility.walkMinutes > 0) parts.push(`${ctx.feasibility.walkMinutes} min walk`);
    return capitalize(parts.join(", "));
  }

  if (ctx.isBestChoice && !ctx.isOnPlan) {
    parts.push("Good opportunity");
    if (ctx.feasibility.walkMinutes <= 3) parts.push("very close");
    else if (ctx.feasibility.walkMinutes <= 5) parts.push("nearby");
    if (ctx.waitTime !== undefined && ctx.waitTime <= 10) parts.push(`only ${ctx.waitTime} min wait`);
    else if (ctx.waitTime !== undefined) parts.push(`${ctx.waitTime} min wait`);
    return capitalize(parts.join(", "));
  }

  if (ctx.isBestChoice && ctx.isOnPlan) {
    parts.push("Best choice right now");
    if (ctx.planEntry?.priority === 1) parts.push("high priority");
    if (ctx.waitTime !== undefined) parts.push(`${ctx.waitTime} min wait`);
    if (ctx.feasibility.walkMinutes > 0) parts.push(`${ctx.feasibility.walkMinutes} min walk`);
    if (ctx.planEntry?.skipPass && ctx.planEntry.skipPass !== "—") parts.push(ctx.planEntry.skipPass);
    return capitalize(parts.join(", "));
  }

  if (ctx.isNearby) {
    parts.push(`${ctx.feasibility.walkMinutes} min walk`);
    if (ctx.waitTime !== undefined && ctx.waitTime <= 10) parts.push(`only ${ctx.waitTime} min wait`);
    else if (ctx.waitTime !== undefined) parts.push(`${ctx.waitTime} min wait`);
    if (ctx.isOnPlan) parts.push("on the plan");
    if (ctx.planEntry?.skipPass && ctx.planEntry.skipPass !== "—") parts.push(ctx.planEntry.skipPass);
    return capitalize(parts.join(", "));
  }

  if (ctx.waitTime !== undefined) {
    return `${ctx.waitTime} min wait, ${ctx.feasibility.walkMinutes} min walk`;
  }

  return "Available";
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
