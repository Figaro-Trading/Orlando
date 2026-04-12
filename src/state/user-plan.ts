import { signal, computed } from "@preact/signals";
import { ALL_TEMPLATES, TEMPLATE_KEYS } from "../data/templates";
import { activeTemplateId } from "./app-state";
import type { PlanEntry, TemplateKey } from "../types";

// Build default plans from templates
function buildDefaultPlans(): Record<TemplateKey, PlanEntry[]> {
  const plans = {} as Record<TemplateKey, PlanEntry[]>;
  for (const tk of TEMPLATE_KEYS) {
    const template = ALL_TEMPLATES[tk];
    if (template) {
      plans[tk] = template.zones.flatMap((z) =>
        z.entries.filter((e) => !["walk", "transport", "logistics", "alert"].includes(e.type))
      );
    } else {
      plans[tk] = [];
    }
  }
  return plans;
}

export const userPlans = signal<Record<TemplateKey, PlanEntry[]>>(buildDefaultPlans());

export const activePlan = computed(() => userPlans.value[activeTemplateId.value as TemplateKey] ?? []);

export function initParkPlan(templateKey: TemplateKey): void {
  const template = ALL_TEMPLATES[templateKey];
  if (!template) return;
  const entries = template.zones.flatMap((z) =>
    z.entries.filter((e) => !["walk", "transport", "logistics", "alert"].includes(e.type))
  );
  userPlans.value = { ...userPlans.value, [templateKey]: entries };
}

export function resetParkPlan(templateKey: TemplateKey): void {
  initParkPlan(templateKey);
}

export function addPlanRow(templateKey: TemplateKey, entry: PlanEntry, index?: number): void {
  const current = [...(userPlans.value[templateKey] ?? [])];
  if (index !== undefined && index >= 0 && index <= current.length) {
    current.splice(index, 0, entry);
  } else {
    current.push(entry);
  }
  userPlans.value = { ...userPlans.value, [templateKey]: current };
}

export function removePlanRow(templateKey: TemplateKey, index: number): void {
  const current = [...(userPlans.value[templateKey] ?? [])];
  if (index >= 0 && index < current.length) {
    current.splice(index, 1);
    userPlans.value = { ...userPlans.value, [templateKey]: current };
  }
}

export function updatePlanRow(templateKey: TemplateKey, index: number, entry: PlanEntry): void {
  const current = [...(userPlans.value[templateKey] ?? [])];
  if (index >= 0 && index < current.length) {
    current[index] = entry;
    userPlans.value = { ...userPlans.value, [templateKey]: current };
  }
}

export function isPlanEntryInPlan(templateKey: TemplateKey, entryName: string): boolean {
  const plan = userPlans.value[templateKey] ?? [];
  return plan.some((e) => e.name === entryName);
}
