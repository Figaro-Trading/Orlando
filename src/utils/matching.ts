import type { PlanEntry, DayTemplate } from "../types";

// Will be populated by scripts/convert-planning.ts
export const PLAN_TO_ENTITY_MAP: Record<string, string> = {};

function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function findEntityIdForPlanEntry(entry: PlanEntry): string | null {
  const normalized = normalizeName(entry.name);
  return PLAN_TO_ENTITY_MAP[normalized] ?? null;
}

export function findPlanEntryForEntityId(
  entityId: string,
  template: DayTemplate,
  completedIds?: Set<string>,
): PlanEntry | null {
  const targetName = Object.entries(PLAN_TO_ENTITY_MAP).find(
    ([_, eid]) => eid === entityId,
  )?.[0];
  if (!targetName) return null;

  for (const zone of template.zones) {
    for (const entry of zone.entries) {
      if (completedIds?.has(entry.id)) continue;
      if (normalizeName(entry.name) === targetName) return entry;
    }
  }
  return null;
}
