import type { TimeFeasibility, LiveEntity, PlanEntry } from "../types";
import { walkTimeMinutes } from "../utils/geo";
import { ft } from "../utils/time";

export type FeasibilityInput = {
  entityId: string;
  liveData: LiveEntity | null;
  planEntry: PlanEntry | null;
  userLat: number | null;
  userLon: number | null;
  entityLat: number | null;
  entityLon: number | null;
  now: Date;
  nextShowtime?: Date | null;
};

export function computeFeasibility(input: FeasibilityInput): TimeFeasibility {
  const result: TimeFeasibility = {
    walkMinutes: 0,
    waitMinutes: undefined,
    minutesUntilStart: undefined,
    arrivalSlackMinutes: undefined,
    latestDepartureTime: undefined,
    isReachable: true,
  };

  // Walk time
  if (input.userLat != null && input.userLon != null && input.entityLat != null && input.entityLon != null) {
    result.walkMinutes = walkTimeMinutes(input.userLat, input.userLon, input.entityLat, input.entityLon);
  } else if (input.userLat == null) {
    result.walkMinutes = 7; // GPS unavailable fallback
  } else {
    result.walkMinutes = 5; // entity has no location
  }

  // Wait time
  const standbyWait = input.liveData?.queue?.STANDBY?.waitTime;
  if (standbyWait != null) {
    result.waitMinutes = standbyWait;
  } else if (input.planEntry?.estimatedWait) {
    result.waitMinutes = input.planEntry.estimatedWait;
  }

  // Show timing
  if (input.nextShowtime) {
    const diffMs = input.nextShowtime.getTime() - input.now.getTime();
    result.minutesUntilStart = Math.floor(diffMs / 60000);
    result.arrivalSlackMinutes = result.minutesUntilStart - result.walkMinutes;

    const latestDeparture = new Date(input.nextShowtime.getTime() - result.walkMinutes * 60000);
    result.latestDepartureTime = ft(latestDeparture.toISOString());

    result.isReachable = result.arrivalSlackMinutes >= 0;
  }

  return result;
}
