import { LANDS } from "../data/lands";
import type { ParkKey } from "../types";

export function findLand(pk: ParkKey, name: string): string | null {
  const m = LANDS[pk];
  if (!m) return null;
  for (const [land, names] of Object.entries(m)) {
    if (names.some((n) => name.includes(n) || n.includes(name))) {
      return land;
    }
  }
  return null;
}

export function trend(entity: {
  forecast?: Array<{ time: string; waitTime: number }>;
}): "up" | "down" | null {
  const f = entity.forecast;
  if (!f || f.length < 2) return null;

  const now = Date.now();
  let ci = 0;
  let cd = Infinity;

  f.forEach((x, i) => {
    const d = Math.abs(new Date(x.time).getTime() - now);
    if (d < cd) {
      cd = d;
      ci = i;
    }
  });

  if (ci <= 0) return null;

  const diff = f[ci].waitTime - f[ci - 1].waitTime;
  if (diff > 5) return "up";
  if (diff < -5) return "down";
  return null;
}

export function entityBelongsToPark(entityName: string, parkKey: string): boolean {
  return findLand(parkKey as ParkKey, entityName) !== null;
}
