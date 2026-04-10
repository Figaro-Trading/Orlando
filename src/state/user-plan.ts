import { signal, computed } from "@preact/signals";
import { ALL_TEMPLATES } from "../data/templates";
import { activeParkKey } from "./app-state";
import { PARK_KEYS } from "../data/parks";
import type { PlanEntry, ParkKey } from "../types";

// Build default plans from templates
function buildDefaultPlans(): Record<ParkKey, PlanEntry[]> {
  const plans = {} as Record<ParkKey, PlanEntry[]>;
  for (const pk of PARK_KEYS) {
    const template = ALL_TEMPLATES[pk];
    if (template) {
      plans[pk] = template.zones.flatMap((z) =>
        z.entries.filter((e) => !["walk", "transport", "logistics", "alert"].includes(e.type))
      );
    } else {
      plans[pk] = [];
    }
  }
  return plans;
}

export const userPlans = signal<Record<ParkKey, PlanEntry[]>>(buildDefaultPlans());

export const activePlan = computed(() => userPlans.value[activeParkKey.value] ?? []);

export function initParkPlan(parkKey: ParkKey): void {
  const template = ALL_TEMPLATES[parkKey];
  if (!template) return;
  const entries = template.zones.flatMap((z) =>
    z.entries.filter((e) => !["walk", "transport", "logistics", "alert"].includes(e.type))
  );
  userPlans.value = { ...userPlans.value, [parkKey]: entries };
}

export function resetParkPlan(parkKey: ParkKey): void {
  initParkPlan(parkKey);
}

export function addPlanRow(parkKey: ParkKey, entry: PlanEntry, index?: number): void {
  const current = [...(userPlans.value[parkKey] ?? [])];
  if (index !== undefined && index >= 0 && index <= current.length) {
    current.splice(index, 0, entry);
  } else {
    current.push(entry);
  }
  userPlans.value = { ...userPlans.value, [parkKey]: current };
}

export function removePlanRow(parkKey: ParkKey, index: number): void {
  const current = [...(userPlans.value[parkKey] ?? [])];
  if (index >= 0 && index < current.length) {
    current.splice(index, 1);
    userPlans.value = { ...userPlans.value, [parkKey]: current };
  }
}

export function updatePlanRow(parkKey: ParkKey, index: number, entry: PlanEntry): void {
  const current = [...(userPlans.value[parkKey] ?? [])];
  if (index >= 0 && index < current.length) {
    current[index] = entry;
    userPlans.value = { ...userPlans.value, [parkKey]: current };
  }
}

export function isPlanEntryInPlan(parkKey: ParkKey, entryName: string): boolean {
  const plan = userPlans.value[parkKey] ?? [];
  return plan.some((e) => e.name === entryName);
}
