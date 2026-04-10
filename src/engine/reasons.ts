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
    return ctx.exclusionReason ?? "Non recommandée actuellement";
  }

  if (ctx.isShow) {
    const slack = ctx.feasibility.arrivalSlackMinutes;
    const until = ctx.feasibility.minutesUntilStart;
    if (slack !== undefined && until !== undefined) {
      if (slack >= SCORE_WEIGHTS.minShowSlackMinutes) {
        parts.push(`Début dans ${until} min`, `${ctx.feasibility.walkMinutes} min de marche`, `${slack} min de marge`);
      } else {
        parts.push(`Début dans ${until} min — marge serrée (${slack} min)`);
      }
    }
    if (ctx.isOnPlan) parts.push("prévu au planning");
    return capitalize(parts.join(", "));
  }

  if (ctx.isPlannedNext && ctx.isOnPlan) {
    parts.push("Prochaine prévue au planning");
    if (ctx.zoneNumber) parts.push(`Zone ${ctx.zoneNumber}`);
    if (ctx.planEntry?.coupefile && ctx.planEntry.coupefile !== "—") {
      parts.push(`${ctx.planEntry.coupefile} disponible`);
    }
    if (ctx.waitTime !== undefined) parts.push(`${ctx.waitTime} min d'attente`);
    if (ctx.feasibility.walkMinutes > 0) parts.push(`${ctx.feasibility.walkMinutes} min de marche`);
    return capitalize(parts.join(", "));
  }

  if (ctx.isBestChoice && !ctx.isOnPlan) {
    parts.push("Bonne opportunité");
    if (ctx.feasibility.walkMinutes <= 3) parts.push("toute proche");
    else if (ctx.feasibility.walkMinutes <= 5) parts.push("à proximité");
    if (ctx.waitTime !== undefined && ctx.waitTime <= 10) parts.push(`seulement ${ctx.waitTime} min d'attente`);
    else if (ctx.waitTime !== undefined) parts.push(`${ctx.waitTime} min d'attente`);
    return capitalize(parts.join(", "));
  }

  if (ctx.isBestChoice && ctx.isOnPlan) {
    parts.push("Meilleur choix maintenant");
    if (ctx.planEntry?.priority === 1) parts.push("priorité haute");
    if (ctx.waitTime !== undefined) parts.push(`${ctx.waitTime} min d'attente`);
    if (ctx.feasibility.walkMinutes > 0) parts.push(`${ctx.feasibility.walkMinutes} min de marche`);
    if (ctx.planEntry?.coupefile && ctx.planEntry.coupefile !== "—") parts.push(ctx.planEntry.coupefile);
    return capitalize(parts.join(", "));
  }

  if (ctx.isNearby) {
    parts.push(`À ${ctx.feasibility.walkMinutes} min de marche`);
    if (ctx.waitTime !== undefined && ctx.waitTime <= 10) parts.push(`seulement ${ctx.waitTime} min d'attente`);
    else if (ctx.waitTime !== undefined) parts.push(`${ctx.waitTime} min d'attente`);
    if (ctx.isOnPlan) parts.push("prévue au planning");
    if (ctx.planEntry?.coupefile && ctx.planEntry.coupefile !== "—") parts.push(ctx.planEntry.coupefile);
    return capitalize(parts.join(", "));
  }

  if (ctx.waitTime !== undefined) {
    return `${ctx.waitTime} min d'attente, ${ctx.feasibility.walkMinutes} min de marche`;
  }

  return "Disponible";
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
