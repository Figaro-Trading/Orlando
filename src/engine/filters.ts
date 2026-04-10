import type { PlanEntry, LiveEntity, ParkAlert } from "../types";
import { entityBelongsToPark } from "../utils/entity";

export type FilterContext = {
  completedIds: Set<string>;
  completedEntityIds: Set<string>;
  skippedIds: Set<string>;
  currentPark: string;
  maxWaitThreshold: number;
  alerts: ParkAlert[];
  now: Date;
  parkClosingTime?: Date;
};

export function shouldExclude(
  entityId: string,
  planEntry: PlanEntry | null,
  liveData: LiveEntity | null,
  context: FilterContext,
): boolean {
  if (
    context.completedEntityIds.has(entityId) ||
    context.completedIds.has(entityId) ||
    (planEntry && context.completedIds.has(planEntry.id))
  ) {
    return true;
  }

  if (context.skippedIds.has(entityId) || (planEntry && context.skippedIds.has(planEntry.id))) {
    return true;
  }

  if (liveData && liveData.status !== "OPERATING") {
    return true;
  }

  const waitTime = liveData?.queue?.STANDBY?.waitTime;
  if (waitTime != null && waitTime > context.maxWaitThreshold) {
    return true;
  }

  if (
    context.alerts.some(
      (a) =>
        a.type === "closure" &&
        a.park === context.currentPark &&
        a.attraction === (planEntry?.name ?? liveData?.name) &&
        a.severity === "critical",
    )
  ) {
    return true;
  }

  if (context.parkClosingTime && context.now >= context.parkClosingTime) {
    return true;
  }

  if (planEntry && ["walk", "transport", "logistics"].includes(planEntry.type)) {
    return true;
  }

  return false;
}

export function exclusionReason(
  entityId: string,
  planEntry: PlanEntry | null,
  liveData: LiveEntity | null,
  context: FilterContext,
): string | null {
  if (
    context.completedEntityIds.has(entityId) ||
    context.completedIds.has(entityId) ||
    (planEntry && context.completedIds.has(planEntry.id))
  ) {
    return "Déjà fait";
  }

  if (liveData && liveData.status !== "OPERATING") {
    if (liveData.status === "DOWN") return "Attraction en panne";
    if (liveData.status === "CLOSED") return "Fermée actuellement";
    if (liveData.status === "REFURBISHMENT") return "En rénovation";
  }

  const waitTime = liveData?.queue?.STANDBY?.waitTime;
  if (waitTime != null && waitTime > context.maxWaitThreshold) {
    return `Attente trop élevée (${waitTime} min > seuil de ${context.maxWaitThreshold} min)`;
  }

  if (
    context.alerts.some(
      (a) =>
        a.type === "closure" &&
        a.park === context.currentPark &&
        a.attraction === (planEntry?.name ?? liveData?.name) &&
        a.severity === "critical",
    )
  ) {
    return "Fermeture confirmée";
  }

  if (context.parkClosingTime && context.now >= context.parkClosingTime) {
    return "Le parc est fermé";
  }

  return null;
}
