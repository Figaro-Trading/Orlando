import { TRIP_START, TRIP_END } from "../data/config";
import { todayOrlando } from "./time";

export function tripDates(): string[] {
  const dates: string[] = [];
  const d = new Date(TRIP_START + "T12:00:00Z");
  const end = new Date(TRIP_END + "T12:00:00Z");
  while (d <= end) {
    dates.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

export function isToday(date: string): boolean {
  return date === todayOrlando();
}

export function dayOfTrip(date?: string): number {
  const target = date ?? todayOrlando();
  const dates = tripDates();
  const idx = dates.indexOf(target);
  if (idx >= 0) return idx + 1;

  if (target < TRIP_START) {
    const diffMs = new Date(TRIP_START + "T12:00:00Z").getTime() - new Date(target + "T12:00:00Z").getTime();
    return -Math.ceil(diffMs / 86_400_000);
  }

  return -1;
}
