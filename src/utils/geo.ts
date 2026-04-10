import { WALK_SPEED_M_PER_MIN, WALK_SINUOSITY } from "../data/config";

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6_371_000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function walkTimeMinutes(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const dist = haversineDistance(lat1, lon1, lat2, lon2);
  return Math.round(((dist * WALK_SINUOSITY) / WALK_SPEED_M_PER_MIN) * 10) / 10;
}

type GeoEntity = {
  id?: string;
  name: string;
  location?: { latitude: number; longitude: number } | null;
};

export function entitiesWithinWalkTime<T extends GeoEntity>(
  userLat: number,
  userLon: number,
  entities: T[],
  maxMinutes: number,
): Array<T & { walkTime: number }> {
  const results: Array<T & { walkTime: number }> = [];

  for (const e of entities) {
    if (!e.location) continue;
    const wt = walkTimeMinutes(userLat, userLon, e.location.latitude, e.location.longitude);
    if (wt <= maxMinutes) {
      results.push({ ...e, walkTime: wt });
    }
  }

  return results.sort((a, b) => a.walkTime - b.walkTime);
}

export function nearestEntity<T extends GeoEntity>(
  userLat: number,
  userLon: number,
  entities: T[],
): (T & { walkTime: number }) | null {
  let best: (T & { walkTime: number }) | null = null;
  let bestTime = Infinity;

  for (const e of entities) {
    if (!e.location) continue;
    const wt = walkTimeMinutes(userLat, userLon, e.location.latitude, e.location.longitude);
    if (wt < bestTime) {
      bestTime = wt;
      best = { ...e, walkTime: wt };
    }
  }

  return best;
}

export function detectCurrentLand(
  userLat: number,
  userLon: number,
  entities: Array<GeoEntity & { land?: string | null }>,
): string | null {
  const nearest = nearestEntity(userLat, userLon, entities);
  if (!nearest) return null;
  return (nearest as GeoEntity & { land?: string | null }).land ?? null;
}
