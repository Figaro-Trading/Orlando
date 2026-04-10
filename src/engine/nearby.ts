import type { PlanEntry, LiveEntity, DayTemplate } from "../types";
import { haversineDistance, walkTimeMinutes } from "../utils/geo";
import { SCORE_WEIGHTS } from "./weights";
import { findPlanEntryForEntityId } from "../utils/matching";

export type NearbyCandidate = {
  entityId: string;
  name: string;
  planEntry: PlanEntry | null;
  walkMinutes: number;
  distance: number;
  location: { lat: number; lon: number };
};

export function findNearbyExitCandidates(
  userLat: number,
  userLon: number,
  entityLocations: Array<{ id: string; name: string; location: { latitude: number; longitude: number } | null }>,
  activeTemplate: DayTemplate,
  completedIds: Set<string>,
): NearbyCandidate[] {
  const candidates: NearbyCandidate[] = [];
  const maxRadius = SCORE_WEIGHTS.nearbyRadiusMinutes;

  for (const entity of entityLocations) {
    if (!entity.location) continue;

    const dist = haversineDistance(userLat, userLon, entity.location.latitude, entity.location.longitude);
    const walkMin = walkTimeMinutes(userLat, userLon, entity.location.latitude, entity.location.longitude);

    if (walkMin > maxRadius) continue;

    const planEntry = findPlanEntryForEntityId(entity.id, activeTemplate);

    candidates.push({
      entityId: entity.id,
      name: entity.name,
      planEntry,
      walkMinutes: Math.round(walkMin * 10) / 10,
      distance: Math.round(dist),
      location: { lat: entity.location.latitude, lon: entity.location.longitude },
    });
  }

  candidates.sort((a, b) => a.distance - b.distance);
  return candidates;
}

export function suggestExitCandidate(
  candidates: NearbyCandidate[],
  completedIds: Set<string>,
): NearbyCandidate | null {
  if (candidates.length === 0) return null;

  for (const c of candidates) {
    if (c.planEntry && !completedIds.has(c.planEntry.id) && !completedIds.has(c.entityId)) {
      return c;
    }
  }

  return candidates[0];
}
