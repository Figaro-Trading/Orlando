import { signal, computed } from "@preact/signals";
import type { CompletionEvent } from "../types";
import { todayOrlando } from "../utils/time";

export const completionHistory = signal<CompletionEvent[]>([]);
export const skippedIds = signal<Set<string>>(new Set());

export const completedIds = computed(() =>
  new Set(completionHistory.value.map((e) => e.planEntryId)),
);

export const completedEntityIds = computed(() =>
  new Set(
    completionHistory.value.filter((e) => e.entityId).map((e) => e.entityId!),
  ),
);

export const lastCompletion = computed<CompletionEvent | null>(() =>
  completionHistory.value.length > 0
    ? completionHistory.value[completionHistory.value.length - 1]
    : null,
);

export const todayCompletions = computed(() =>
  completionHistory.value.filter(
    (e) => e.completedAt.slice(0, 10) === todayOrlando(),
  ),
);

export const dayProgress = computed(() => {
  const count = todayCompletions.value.length;
  return `${count} activité(s) faites`;
});

export function markCompleted(event: CompletionEvent): void {
  const sanitized = { ...event };
  if (sanitized.gpsPosition) {
    sanitized.gpsPosition = {
      lat: Math.round(sanitized.gpsPosition.lat * 1e5) / 1e5,
      lon: Math.round(sanitized.gpsPosition.lon * 1e5) / 1e5,
    };
  }
  completionHistory.value = [...completionHistory.value, sanitized];
}

export function markSkipped(planEntryId: string): void {
  const next = new Set(skippedIds.value);
  next.add(planEntryId);
  skippedIds.value = next;
}

export function removeCompletion(planEntryId: string): void {
  completionHistory.value = completionHistory.value.filter(
    (e) => e.planEntryId !== planEntryId,
  );
}

export function undoLastCompletion(): void {
  if (completionHistory.value.length === 0) return;
  completionHistory.value = completionHistory.value.slice(0, -1);
}

export function resetProgress(): void {
  completionHistory.value = [];
  skippedIds.value = new Set();
}