import type { LiveEntity, PlanEntry, RecommendedItem } from "../types";
import { computeFeasibility } from "./feasibility";
import { scoreEntity } from "./scoring";
import { shouldExclude, type FilterContext } from "./filters";
import { SCORE_WEIGHTS } from "./weights";

export type ShowCandidate = {
  entityId: string;
  name: string;
  planEntry: PlanEntry | null;
  liveData: LiveEntity | null;
  nextShowtime: Date;
  score: number;
};

export function findNextShowtime(liveData: LiveEntity | null, now: Date): Date | null {
  if (!liveData?.showtimes?.length) return null;

  const future: Date[] = [];
  for (const st of liveData.showtimes) {
    if (!st.startTime) continue;
    const parsed = new Date(st.startTime);
    if (!isNaN(parsed.getTime()) && parsed > now) {
      future.push(parsed);
    }
  }

  if (future.length === 0) return null;
  future.sort((a, b) => a.getTime() - b.getTime());
  return future[0];
}

export function evaluateShows(
  showEntities: Array<{
    entityId: string;
    name: string;
    planEntry: PlanEntry | null;
    liveData: LiveEntity | null;
    entityLat: number | null;
    entityLon: number | null;
    entityZone: number | null;
  }>,
  userLat: number | null,
  userLon: number | null,
  filterContext: FilterContext,
  currentZone: number | null,
  parkClosingTime: Date | null,
): RecommendedItem | null {
  const now = filterContext.now;
  const candidates: ShowCandidate[] = [];

  for (const show of showEntities) {
    if (shouldExclude(show.entityId, show.planEntry, show.liveData, filterContext)) continue;

    const nextShowtime = findNextShowtime(show.liveData, now);
    if (!nextShowtime) continue;

    const minutesUntil = (nextShowtime.getTime() - now.getTime()) / 60000;
    if (minutesUntil > SCORE_WEIGHTS.showWindowMaxMinutes || minutesUntil < 0) continue;

    const feasibility = computeFeasibility({
      entityId: show.entityId,
      liveData: show.liveData,
      planEntry: show.planEntry,
      userLat,
      userLon,
      entityLat: show.entityLat,
      entityLon: show.entityLon,
      now,
      nextShowtime,
    });

    if (!feasibility.isReachable) continue;

    const score = scoreEntity({
      entityId: show.entityId,
      name: show.name,
      planEntry: show.planEntry,
      feasibility,
      isOnPlan: show.planEntry !== null,
      currentZone,
      entityZone: show.entityZone,
      parkClosingTime,
      now,
    });

    candidates.push({ entityId: show.entityId, name: show.name, planEntry: show.planEntry, liveData: show.liveData, nextShowtime, score });
  }

  candidates.sort((a, b) => a.score - b.score);
  if (candidates.length === 0) return null;

  const best = candidates[0];
  const feasibility = computeFeasibility({
    entityId: best.entityId,
    liveData: best.liveData,
    planEntry: best.planEntry,
    userLat,
    userLon,
    entityLat: null,
    entityLon: null,
    now,
    nextShowtime: best.nextShowtime,
  });

  return {
    entityId: best.entityId,
    planEntryId: best.planEntry?.id,
    name: best.name,
    park: filterContext.currentPark,
    land: best.planEntry?.land,
    type: "show",
    waitTime: undefined,
    feasibility,
    score: best.score,
    reason: "",
    status:
      feasibility.arrivalSlackMinutes !== undefined && feasibility.arrivalSlackMinutes >= SCORE_WEIGHTS.minShowSlackMinutes
        ? "recommended"
        : "possible",
    isOnPlan: best.planEntry !== null,
    priority: best.planEntry?.priority,
    coupefile: best.planEntry?.coupefile,
  };
}
