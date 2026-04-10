import { API_BASE, API_TIMEOUT_MS } from "../data/config";
import { PARKS } from "../data/parks";
import type {
  LiveResponse,
  ScheduleResponse,
  EntityLocation,
  ParkKey,
} from "../types";

const CHILDREN_TIMEOUT_MS = 10_000;
const CACHE_PREFIX = "orl:apicache:";

export type ApiResult<T> = {
  data: T;
  source: "network" | "cache";
};

type CacheEntry<T> = {
  data: T;
  fetchedAt: number;
};

async function fetchWithTimeout(
  url: string,
  timeoutMs: number = API_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

function readCache<T>(cacheKey: string): CacheEntry<T> | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + cacheKey);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEntry<T>;
  } catch {
    return null;
  }
}

function writeCache<T>(cacheKey: string, data: T): void {
  try {
    localStorage.setItem(
      CACHE_PREFIX + cacheKey,
      JSON.stringify({ data, fetchedAt: Date.now() }),
    );
  } catch {
    /* QuotaExceeded — silently ignore */
  }
}

function getParkId(parkKey: string): string {
  const park = PARKS[parkKey as ParkKey];
  if (!park) throw new Error(`Unknown parkKey: ${parkKey}`);
  return park.id;
}

export async function fetchLive(
  parkKey: string,
): Promise<ApiResult<LiveResponse>> {
  const parkId = getParkId(parkKey);
  const url = `${API_BASE}/entity/${parkId}/live`;

  try {
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      if ([429, 500, 502, 503].includes(response.status)) {
        const cached = readCache<LiveResponse>("live:" + parkKey);
        if (cached) return { data: cached.data, source: "cache" };
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data: LiveResponse = await response.json();
    writeCache("live:" + parkKey, data);
    return { data, source: "network" };
  } catch (e) {
    const cached = readCache<LiveResponse>("live:" + parkKey);
    if (cached) return { data: cached.data, source: "cache" };
    throw e;
  }
}

export async function fetchSchedule(
  parkKey: string,
): Promise<ApiResult<ScheduleResponse>> {
  const parkId = getParkId(parkKey);
  const url = `${API_BASE}/entity/${parkId}/schedule`;

  try {
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      if ([429, 500, 502, 503].includes(response.status)) {
        const cached = readCache<ScheduleResponse>("sched:" + parkKey);
        if (cached) return { data: cached.data, source: "cache" };
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data: ScheduleResponse = await response.json();
    writeCache("sched:" + parkKey, data);
    return { data, source: "network" };
  } catch (e) {
    const cached = readCache<ScheduleResponse>("sched:" + parkKey);
    if (cached) return { data: cached.data, source: "cache" };
    throw e;
  }
}

export async function fetchChildren(
  parkKey: string,
): Promise<ApiResult<EntityLocation[]>> {
  const parkId = getParkId(parkKey);
  const url = `${API_BASE}/entity/${parkId}/children`;

  try {
    const response = await fetchWithTimeout(url, CHILDREN_TIMEOUT_MS);

    if (!response.ok) {
      if ([429, 500, 502, 503].includes(response.status)) {
        const cached = readCache<EntityLocation[]>("children:" + parkKey);
        if (cached) return { data: cached.data, source: "cache" };
      }
      throw new Error(`HTTP ${response.status}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: any = await response.json();
    const locations: EntityLocation[] = (raw.children || []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (child: any) => ({
        id: child.id,
        name: child.name,
        entityType: child.entityType,
        location: child.location
          ? {
              latitude: child.location.latitude,
              longitude: child.location.longitude,
            }
          : null,
      }),
    );

    writeCache("children:" + parkKey, locations);
    return { data: locations, source: "network" };
  } catch (e) {
    const cached = readCache<EntityLocation[]>("children:" + parkKey);
    if (cached) return { data: cached.data, source: "cache" };
    throw e;
  }
}
