import { fetchLive, fetchSchedule, fetchChildren } from "./api";
import { PARK_KEYS } from "../data/parks";
import {
  setLive,
  setSchedule,
  setLocations,
  isLoading,
  lastError,
  liveData,
  locationTimestamps,
  isStaleLocations,
} from "../state/live-cache";
import { activeParkKey } from "../state/app-state";

let autoRefreshInterval: ReturnType<typeof setInterval> | null = null;
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;
const STAGGER_DELAY_MS = 300;

export async function loadAll(): Promise<void> {
  if (isLoading.value) return;
  isLoading.value = true;
  lastError.value = null;

  for (const parkKey of PARK_KEYS) {
    const liveP = fetchLive(parkKey)
      .then((r) => setLive(parkKey, r.data))
      .catch((e) =>
        console.warn(`[refresh] live ${parkKey}:`, (e as Error).message),
      );
    const schedP = fetchSchedule(parkKey)
      .then((r) => setSchedule(parkKey, r.data))
      .catch((e) =>
        console.warn(`[refresh] sched ${parkKey}:`, (e as Error).message),
      );

    await Promise.allSettled([liveP, schedP]);

    if (parkKey !== PARK_KEYS[PARK_KEYS.length - 1]) {
      await new Promise((r) => setTimeout(r, STAGGER_DELAY_MS));
    }
  }

  // Fetch children for stale/missing parks
  const parksNeedingLocations = PARK_KEYS.filter(
    (k) => !locationTimestamps.value[k] || isStaleLocations.value[k],
  );

  for (const parkKey of parksNeedingLocations) {
    try {
      const r = await fetchChildren(parkKey);
      setLocations(parkKey, r.data);
    } catch (e) {
      console.warn(`[refresh] children ${parkKey}:`, (e as Error).message);
    }
    await new Promise((r) => setTimeout(r, STAGGER_DELAY_MS));
  }

  isLoading.value = false;

  const hasAnyLive = Object.values(liveData.value).some((v) => v !== null);
  if (!hasAnyLive) {
    lastError.value =
      "Unable to load data. Check your connection.";
  }
}

export async function refreshActivePark(): Promise<void> {
  if (isLoading.value) return;
  const pk = activeParkKey.value;
  isLoading.value = true;

  await Promise.allSettled([
    fetchLive(pk).then((r) => setLive(pk, r.data)),
    fetchSchedule(pk).then((r) => setSchedule(pk, r.data)),
  ]);

  isLoading.value = false;
}

export function startAutoRefresh(): void {
  if (autoRefreshInterval) clearInterval(autoRefreshInterval);
  autoRefreshInterval = setInterval(() => {
    refreshActivePark();
  }, REFRESH_INTERVAL_MS);
}

export function stopAutoRefresh(): void {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = null;
  }
}

export async function loadParkOnDemand(parkKey: string): Promise<void> {
  const ts = locationTimestamps.value[parkKey];
  if (ts && !isStaleLocations.value[parkKey] && liveData.value[parkKey]) {
    return;
  }

  await Promise.allSettled([
    fetchLive(parkKey).then((r) => setLive(parkKey, r.data)),
    fetchSchedule(parkKey).then((r) => setSchedule(parkKey, r.data)),
    fetchChildren(parkKey).then((r) => setLocations(parkKey, r.data)),
  ]);
}
