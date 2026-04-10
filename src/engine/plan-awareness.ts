import type { DayTemplate, TemplateZone, PlanEntry } from "../types";

export type PlanContext = {
  activeTemplate: DayTemplate;
  completedIds: Set<string>;
  skippedIds: Set<string>;
  now: Date;
};

export type CriticalTiming = {
  planEntryId: string;
  name: string;
  type: "placement" | "sprint" | "reservation" | "closing";
  targetTime: string;
  minutesUntilTarget: number;
  message: string;
};

export type PlanAwarenessResult = {
  currentZone: number | null;
  currentZoneLabel: string | null;
  nextPlannedEntry: PlanEntry | null;
  nextPlannedZone: number | null;
  activePark: string;
  isBeforeTransition: boolean;
  isAfterTransition: boolean;
  transitionTime: string | null;
  secondaryPark: string | null;
  criticalTimings: CriticalTiming[];
  totalEntries: number;
  completedEntries: number;
  remainingEntries: PlanEntry[];
};

export function analyzePlan(context: PlanContext): PlanAwarenessResult {
  const { activeTemplate, completedIds, skippedIds, now } = context;

  const { zoneNumber, zoneLabel } = determineCurrentZone(activeTemplate, completedIds);
  const { isBeforeTransition, isAfterTransition, transitionTime } = evaluateTransition(activeTemplate, now);

  let activePark = activeTemplate.park;
  const secondaryPark = activeTemplate.parkAlt ?? null;
  if (isAfterTransition && secondaryPark) activePark = secondaryPark;

  const nextPlannedEntry = findNextPlannedEntry(activeTemplate, completedIds, skippedIds, activePark);

  let nextPlannedZone: number | null = null;
  if (nextPlannedEntry) {
    for (const zone of activeTemplate.zones) {
      if (zone.entries.some((e) => e.id === nextPlannedEntry.id)) {
        nextPlannedZone = zone.number;
        break;
      }
    }
  }

  const criticalTimings = scanCriticalTimings(activeTemplate, completedIds, now);
  const allActionable = flattenActionable(activeTemplate);
  const completed = allActionable.filter((e) => completedIds.has(e.id)).length;
  const remaining = allActionable.filter((e) => !completedIds.has(e.id) && !skippedIds.has(e.id));

  return {
    currentZone: zoneNumber,
    currentZoneLabel: zoneLabel,
    nextPlannedEntry,
    nextPlannedZone,
    activePark,
    isBeforeTransition,
    isAfterTransition,
    transitionTime,
    secondaryPark,
    criticalTimings,
    totalEntries: allActionable.length,
    completedEntries: completed,
    remainingEntries: remaining,
  };
}

export function determineCurrentZone(
  template: DayTemplate,
  completedIds: Set<string>,
): { zoneNumber: number | null; zoneLabel: string | null } {
  let last: number | null = null;
  let lastLabel: string | null = null;

  for (const zone of template.zones) {
    for (const entry of zone.entries) {
      if (completedIds.has(entry.id)) {
        last = zone.number;
        lastLabel = zone.label;
      }
    }
  }

  if (last === null && template.zones.length > 0) {
    return { zoneNumber: template.zones[0].number, zoneLabel: template.zones[0].label };
  }
  return { zoneNumber: last, zoneLabel: lastLabel };
}

export function findNextPlannedEntry(
  template: DayTemplate,
  completedIds: Set<string>,
  skippedIds: Set<string>,
  _currentPark: string,
): PlanEntry | null {
  for (const zone of template.zones) {
    for (const entry of zone.entries) {
      if (completedIds.has(entry.id)) continue;
      if (skippedIds.has(entry.id)) continue;
      if (["walk", "transport", "logistics", "alert"].includes(entry.type)) continue;
      return entry;
    }
  }
  return null;
}

export function evaluateTransition(
  template: DayTemplate,
  now: Date,
): { isBeforeTransition: boolean; isAfterTransition: boolean; transitionTime: string | null } {
  if (!template.transitionTime) {
    return { isBeforeTransition: true, isAfterTransition: false, transitionTime: null };
  }

  const [hours, minutes] = template.transitionTime.split(":").map((s) => parseInt(s, 10));
  const transitionDate = new Date(now);
  transitionDate.setHours(hours, minutes, 0, 0);

  return {
    isBeforeTransition: now < transitionDate,
    isAfterTransition: now >= transitionDate,
    transitionTime: template.transitionTime,
  };
}

function scanCriticalTimings(template: DayTemplate, completedIds: Set<string>, now: Date): CriticalTiming[] {
  const timings: CriticalTiming[] = [];

  for (const zone of template.zones) {
    for (const entry of zone.entries) {
      if (completedIds.has(entry.id) || !entry.time) continue;

      const isPlacement = entry.notes?.toLowerCase().includes("placement") || entry.name.toLowerCase().includes("fantasmic");
      const isSprint = entry.notes?.toLowerCase().includes("sprint");

      if (!isPlacement && !isSprint) continue;

      const target = parseTimeToday(entry.time, now);
      const minutesUntil = (target.getTime() - now.getTime()) / 60000;

      if (minutesUntil <= 0) continue;

      if (isPlacement && minutesUntil <= 120) {
        timings.push({
          planEntryId: entry.id,
          name: entry.name,
          type: "placement",
          targetTime: entry.time,
          minutesUntilTarget: Math.floor(minutesUntil),
          message: `Placement ${entry.name} dans ${Math.floor(minutesUntil)} min`,
        });
      }

      if (isSprint && minutesUntil <= 60) {
        timings.push({
          planEntryId: entry.id,
          name: entry.name,
          type: "sprint",
          targetTime: entry.time,
          minutesUntilTarget: Math.floor(minutesUntil),
          message: `Sprint vers ${entry.name} dans ${Math.floor(minutesUntil)} min`,
        });
      }
    }
  }

  return timings;
}

function flattenActionable(template: DayTemplate): PlanEntry[] {
  const entries: PlanEntry[] = [];
  for (const zone of template.zones) {
    for (const entry of zone.entries) {
      if (!["walk", "transport", "logistics", "alert"].includes(entry.type)) {
        entries.push(entry);
      }
    }
  }
  return entries;
}

function parseTimeToday(timeStr: string, now: Date): Date {
  const [hours, minutes] = timeStr.split(":").map((s) => parseInt(s, 10));
  const result = new Date(now);
  result.setHours(hours, minutes, 0, 0);
  return result;
}
