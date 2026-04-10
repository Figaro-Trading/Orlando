import { todayOrlando } from "./time";

export function isToday(date: string): boolean {
  return date === todayOrlando();
}
