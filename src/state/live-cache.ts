import { signal, computed } from "@preact/signals";
import type {
  LiveEntity,
  LiveResponse,
  ScheduleEntry,
  ScheduleResponse,
  EntityLocation,
} from "../types";

export type {
  LiveEntity,
  LiveResponse,
  ScheduleEntry,
  ScheduleResponse,
  EntityLocation,
};

export const liveData = signal<Record<string, LiveResponse | null>>({});
export const schedData = signal<Record<string, ScheduleResponse | null>>({});
export const entityLocations = signal<Record<string, EntityLocation[]>>({});
export const liveTimestamps = signal<Record<string, number>>({});
export const schedTimestamps = signal<Record<string, number>>({});
export const locationTimestamps = signal<Record<string, number>>({});
export const isLoading = signal<boolean>(false);
export const lastError = signal<string | null>(null);

const LIVE_STALE_MS = 5 * 60 * 1000;
const SCHED_STALE_MS = 60 * 60 * 1000;
const LOC_STALE_MS = 24 * 60 * 60 * 1000;

export const isStaleLive = computed(() => {
  const result: Record<string, boolean> = {};
  const ts = liveTimestamps.value;
  for (const key of Object.keys(ts)) {
    result[key] = Date.now() - ts[key] > LIVE_STALE_MS;
  }
  return result;
});

export const isStaleSchedule = computed(() => {
  const result: Record<string, boolean> = {};
  const ts = schedTimestamps.value;
  for (const key of Object.keys(ts)) {
    result[key] = Date.now() - ts[key] > SCHED_STALE_MS;
  }
  return result;
});

export const isStaleLocations = computed(() => {
  const result: Record<string, boolean> = {};
  const ts = locationTimestamps.value;
  for (const key of Object.keys(ts)) {
    result[key] = Date.now() - ts[key] > LOC_STALE_MS;
  }
  return result;
});

export const liveEntityMap = computed<Map<string, LiveEntity>>(() => {
  const map = new Map<string, LiveEntity>();
  for (const parkData of Object.values(liveData.value)) {
    if (!parkData) continue;
    for (const entity of parkData.liveData) {
      if (entity.entityType !== "PARK") {
        map.set(entity.id, entity);
      }
    }
  }
  return map;
});

export function setLive(parkKey: string, data: LiveResponse): void {
  liveData.value = { ...liveData.value, [parkKey]: data };
  liveTimestamps.value = { ...liveTimestamps.value, [parkKey]: Date.now() };
}

export function setSchedule(parkKey: string, data: ScheduleResponse): void {
  schedData.value = { ...schedData.value, [parkKey]: data };
  schedTimestamps.value = { ...schedTimestamps.value, [parkKey]: Date.now() };
}

export function setLocations(parkKey: string, data: EntityLocation[]): void {
  entityLocations.value = { ...entityLocations.value, [parkKey]: data };
  locationTimestamps.value = {
    ...locationTimestamps.value,
    [parkKey]: Date.now(),
  };
}

export function getLiveEntitiesForPark(parkKey: string): LiveEntity[] {
  const data = liveData.value[parkKey];
  if (!data) return [];
  return data.liveData.filter((e) => e.entityType !== "PARK");
}
