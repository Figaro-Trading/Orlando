import type {
  NextMoveResult,
  RecommendedItem,
  ReasoningSummary,
  PlanEntry,
  DayTemplate,
  TripDay,
  LiveEntity,
  ParkAlert,
  CompletionEvent,
} from "../types";
import { SCORE_WEIGHTS } from "./weights";
import { shouldExclude, exclusionReason, type FilterContext } from "./filters";
import { computeFeasibility } from "./feasibility";
import { scoreEntity } from "./scoring";
import { evaluateShows, findNextShowtime } from "./show-logic";
import { analyzePlan } from "./plan-awareness";
import { generateReason } from "./reasons";
import { findEntityIdForPlanEntry, findPlanEntryForEntityId } from "../utils/matching";
import { liveEntityMap } from "../state/live-cache";

export type NextMoveInput = {
  activeTemplate: DayTemplate;
  tripDay: TripDay;
  completedIds: Set<string>;
  completedEntityIds: Set<string>;
  skippedIds: Set<string>;
  userLat: number | null;
  userLon: number | null;
  maxWaitThreshold: number;
  alerts: ParkAlert[];
  parkClosingTime: Date | null;
  manualLand: string | null;
  entityPositions: Map<string, { lat: number; lon: number }>;
};

export function computeNextMove(input: NextMoveInput): NextMoveResult {
  const now = new Date();

  const filterContext: FilterContext = {
    completedIds: input.completedIds,
    completedEntityIds: input.completedEntityIds,
    skippedIds: input.skippedIds,
    currentPark: "",
    maxWaitThreshold: input.maxWaitThreshold,
    alerts: input.alerts,
    now,
    parkClosingTime: input.parkClosingTime ?? undefined,
  };

  // Step 1: Plan Analysis
  const plan = analyzePlan({
    activeTemplate: input.activeTemplate,
    tripDay: input.tripDay,
    completedIds: input.completedIds,
    skippedIds: input.skippedIds,
    now,
  });
  filterContext.currentPark = plan.activePark;

  // Step 2: Planned Next
  let plannedNext: RecommendedItem | null = null;
  const nextEntry = plan.nextPlannedEntry;

  if (nextEntry) {
    const entityId = findEntityIdForPlanEntry(nextEntry);
    const liveData = entityId ? liveEntityMap.value.get(entityId) ?? null : null;
    const pos = entityId ? input.entityPositions.get(entityId) ?? null : null;

    let nextShowtime: Date | null = null;
    if (nextEntry.type === "show") nextShowtime = findNextShowtime(liveData, now);

    const feasibility = computeFeasibility({
      entityId: entityId ?? nextEntry.id,
      liveData,
      planEntry: nextEntry,
      userLat: input.userLat,
      userLon: input.userLon,
      entityLat: pos?.lat ?? null,
      entityLon: pos?.lon ?? null,
      now,
      nextShowtime,
    });

    const isExcluded = shouldExclude(entityId ?? nextEntry.id, nextEntry, liveData, filterContext);
    const excReason = isExcluded
      ? exclusionReason(entityId ?? nextEntry.id, nextEntry, liveData, filterContext)
      : null;

    const score = isExcluded
      ? Infinity
      : scoreEntity({
          entityId: entityId ?? nextEntry.id,
          name: nextEntry.name,
          planEntry: nextEntry,
          feasibility,
          isOnPlan: true,
          currentZone: plan.currentZone,
          entityZone: plan.nextPlannedZone,
          parkClosingTime: input.parkClosingTime,
          now,
        });

    const status: "recommended" | "possible" | "not_recommended" = isExcluded
      ? "not_recommended"
      : score > 60
        ? "possible"
        : "recommended";

    plannedNext = {
      entityId: entityId ?? "",
      planEntryId: nextEntry.id,
      name: nextEntry.name,
      park: plan.activePark,
      land: nextEntry.land,
      type: nextEntry.type,
      waitTime: feasibility.waitMinutes,
      feasibility,
      score,
      reason: "",
      status,
      isOnPlan: true,
      priority: nextEntry.priority,
      coupefile: nextEntry.coupefile,
    };
  }

  // Step 3: Score all eligible entities
  const scoredEntities: RecommendedItem[] = [];

  for (const [entityId, liveData] of liveEntityMap.value) {
    if (liveData.entityType !== "ATTRACTION") continue;
    const planEntry = findPlanEntryForEntityId(entityId, input.activeTemplate);
    if (shouldExclude(entityId, planEntry, liveData, filterContext)) continue;

    const pos = input.entityPositions.get(entityId) ?? null;
    const feasibility = computeFeasibility({
      entityId,
      liveData,
      planEntry,
      userLat: input.userLat,
      userLon: input.userLon,
      entityLat: pos?.lat ?? null,
      entityLon: pos?.lon ?? null,
      now,
    });

    let entityZone: number | null = null;
    if (planEntry) {
      for (const zone of input.activeTemplate.zones) {
        if (zone.entries.some((e) => e.id === planEntry.id)) {
          entityZone = zone.number;
          break;
        }
      }
    }

    const score = scoreEntity({
      entityId,
      name: liveData.name,
      planEntry,
      feasibility,
      isOnPlan: planEntry !== null,
      currentZone: plan.currentZone,
      entityZone,
      parkClosingTime: input.parkClosingTime,
      now,
    });

    scoredEntities.push({
      entityId,
      planEntryId: planEntry?.id,
      name: liveData.name,
      park: plan.activePark,
      land: planEntry?.land,
      type: planEntry?.type ?? "ride",
      waitTime: feasibility.waitMinutes,
      feasibility,
      score,
      reason: "",
      status: score <= 40 ? "recommended" : "possible",
      isOnPlan: planEntry !== null,
      priority: planEntry?.priority,
      coupefile: planEntry?.coupefile,
    });
  }

  scoredEntities.sort((a, b) => a.score - b.score);
  let nearbyOptions = scoredEntities.slice(0, SCORE_WEIGHTS.nearbyMaxResults);

  // Step 4: Show suggestion
  const showEntities = Array.from(liveEntityMap.value.entries())
    .filter(([_, ld]) => ld.entityType === "SHOW")
    .map(([entityId, liveData]) => {
      const planEntry = findPlanEntryForEntityId(entityId, input.activeTemplate);
      const pos = input.entityPositions.get(entityId) ?? null;
      let entityZone: number | null = null;
      if (planEntry) {
        for (const zone of input.activeTemplate.zones) {
          if (zone.entries.some((e) => e.id === planEntry.id)) {
            entityZone = zone.number;
            break;
          }
        }
      }
      return { entityId, name: liveData.name, planEntry, liveData, entityLat: pos?.lat ?? null, entityLon: pos?.lon ?? null, entityZone };
    });

  const showSuggestion = evaluateShows(showEntities, input.userLat, input.userLon, filterContext, plan.currentZone, input.parkClosingTime);

  // Step 5: Best overall choice
  const allCandidates: RecommendedItem[] = [];
  if (plannedNext && plannedNext.status !== "not_recommended") allCandidates.push(plannedNext);
  allCandidates.push(...nearbyOptions);
  if (showSuggestion) allCandidates.push(showSuggestion);
  allCandidates.sort((a, b) => a.score - b.score);

  let bestOverallChoice: RecommendedItem | null = null;
  if (allCandidates.length > 0) {
    bestOverallChoice = { ...allCandidates[0] };
    nearbyOptions = nearbyOptions.filter((o) => o.entityId !== bestOverallChoice!.entityId).slice(0, SCORE_WEIGHTS.nearbyMaxResults);
  }

  // Step 6: Generate reasons
  const getZone = (entry: PlanEntry | null | undefined): number | null => {
    if (!entry) return null;
    for (const zone of input.activeTemplate.zones) {
      if (zone.entries.some((e) => e.id === entry.id)) return zone.number;
    }
    return null;
  };

  if (plannedNext) {
    plannedNext.reason = generateReason({
      isOnPlan: true,
      planEntry: nextEntry ?? null,
      feasibility: plannedNext.feasibility,
      score: plannedNext.score,
      zoneNumber: plan.nextPlannedZone,
      isPlannedNext: true,
      isBestChoice: false,
      isShow: nextEntry?.type === "show",
      isNearby: false,
      entityName: plannedNext.name,
      waitTime: plannedNext.waitTime,
      status: plannedNext.status,
      exclusionReason: plannedNext.status === "not_recommended"
        ? exclusionReason(plannedNext.entityId ?? "", nextEntry ?? null, liveEntityMap.value.get(plannedNext.entityId ?? "") ?? null, filterContext)
        : null,
    });
  }

  if (bestOverallChoice) {
    const bpe = bestOverallChoice.entityId ? findPlanEntryForEntityId(bestOverallChoice.entityId, input.activeTemplate) : null;
    bestOverallChoice.reason = generateReason({
      isOnPlan: bestOverallChoice.isOnPlan,
      planEntry: bpe,
      feasibility: bestOverallChoice.feasibility,
      score: bestOverallChoice.score,
      zoneNumber: getZone(bpe),
      isPlannedNext: false,
      isBestChoice: true,
      isShow: bestOverallChoice.type === "show",
      isNearby: false,
      entityName: bestOverallChoice.name,
      waitTime: bestOverallChoice.waitTime,
      status: bestOverallChoice.status,
      exclusionReason: null,
    });
  }

  for (const option of nearbyOptions) {
    const ope = option.entityId ? findPlanEntryForEntityId(option.entityId, input.activeTemplate) : null;
    option.reason = generateReason({
      isOnPlan: option.isOnPlan,
      planEntry: ope,
      feasibility: option.feasibility,
      score: option.score,
      zoneNumber: getZone(ope),
      isPlannedNext: false,
      isBestChoice: false,
      isShow: false,
      isNearby: true,
      entityName: option.name,
      waitTime: option.waitTime,
      status: option.status,
      exclusionReason: null,
    });
  }

  if (showSuggestion) {
    const spe = showSuggestion.entityId ? findPlanEntryForEntityId(showSuggestion.entityId, input.activeTemplate) : null;
    showSuggestion.reason = generateReason({
      isOnPlan: showSuggestion.isOnPlan,
      planEntry: spe,
      feasibility: showSuggestion.feasibility,
      score: showSuggestion.score,
      zoneNumber: getZone(spe),
      isPlannedNext: false,
      isBestChoice: false,
      isShow: true,
      isNearby: false,
      entityName: showSuggestion.name,
      waitTime: undefined,
      status: showSuggestion.status,
      exclusionReason: null,
    });
  }

  // Step 7: Reasoning summary
  const skippedPlannedItemIds: string[] = [];
  for (const zone of input.activeTemplate.zones) {
    for (const entry of zone.entries) {
      if (input.skippedIds.has(entry.id)) skippedPlannedItemIds.push(entry.id);
    }
  }

  const blockingFactors: string[] = [];
  if (plannedNext?.status === "not_recommended") blockingFactors.push(`${plannedNext.name} : ${plannedNext.reason}`);
  for (const t of plan.criticalTimings) blockingFactors.push(t.message);

  const reasoning: ReasoningSummary = {
    currentPark: plan.activePark,
    currentLand: plan.currentZoneLabel ?? input.manualLand ?? undefined,
    currentZone: plan.currentZone ?? undefined,
    currentTime: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    gpsPosition: input.userLat != null && input.userLon != null ? { lat: input.userLat, lon: input.userLon } : undefined,
    skippedPlannedItemIds,
    blockingFactors,
    dayProgress: `${plan.completedEntries}/${plan.totalEntries} activités faites`,
  };

  return { plannedNext, bestOverallChoice, nearbyOptions, showSuggestion, reasoning };
}
