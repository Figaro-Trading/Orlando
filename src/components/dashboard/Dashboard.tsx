import { activeTemplateId, activeParkKey } from "../../state/app-state";
import { completedIds, markCompleted, removeCompletion } from "../../state/user-progress";
import { userPosition } from "../../state/geo-state";
import { ALL_TEMPLATES } from "../../data/templates";
import { PARKS, TEMPLATE_TO_PARK } from "../../data/parks";
import { TripProgress } from "./TripProgress";
import { AlertBanner } from "./AlertBanner";
import { NextMoveButton } from "./NextMoveButton";
import type { PlanEntry, TemplateKey } from "../../types";

const TYPE_LABELS: Record<string, string> = {
  ride: "Ride",
  show: "Show",
  meal: "Dining",
  meet: "Character Meet",
  experience: "Experience",
  explore: "Explore",
};

const TYPE_COLORS: Record<string, string> = {
  ride: "var(--low)",
  show: "var(--high)",
  meal: "var(--mid)",
  meet: "#c084fc",
  experience: "#5eaaff",
  explore: "#6bd88b",
};

function isActionable(type: string): boolean {
  return !["walk", "transport", "logistics", "alert"].includes(type);
}

export function Dashboard() {
  const tk = activeTemplateId.value as TemplateKey;
  const pk = TEMPLATE_TO_PARK[tk] ?? activeParkKey.value;
  const template = ALL_TEMPLATES[tk];

  if (!template) {
    return (
      <div class="panel active">
        <div style="padding: 2rem; text-align: center; color: var(--muted);">
          No plan available
        </div>
      </div>
    );
  }

  const entries: PlanEntry[] = template.zones.flatMap((z) =>
    z.entries.filter((e) => isActionable(e.type)),
  );

  const handleToggle = (entry: PlanEntry) => {
    if (completedIds.value.has(entry.id)) {
      removeCompletion(entry.id);
    } else {
      markCompleted({
        planEntryId: entry.id,
        completedAt: new Date().toISOString(),
        park: pk,
        land: entry.land,
        gpsPosition: userPosition.value
          ? { lat: userPosition.value.lat, lon: userPosition.value.lon }
          : undefined,
      });
    }
  };

  return (
    <div class="panel active">
      <div style="font-size:1.1rem;font-weight:700;margin-bottom:0.75rem;">
        {PARKS[pk].name}
      </div>

      <div aria-live="polite">
        <TripProgress totalEntries={entries.length} />
      </div>
      <AlertBanner />

      <ul class="checklist" role="list">
        {entries.map((entry) => {
          const isDone = completedIds.value.has(entry.id);
          return (
            <li key={entry.id} class={`checklist-row ${isDone ? "is-done" : ""}`}>
              <div class="checklist-info">
                <div class="checklist-name">
                  {entry.isMustSee && <span style="color:var(--mid);margin-right:4px;">★</span>}
                  {entry.name}
                </div>
                <div class="checklist-meta">
                  <span
                    class="checklist-type"
                    style={`color:${TYPE_COLORS[entry.type] ?? "var(--muted)"}`}
                  >
                    {TYPE_LABELS[entry.type] ?? entry.type}
                  </span>
                  {entry.land && (
                    <span class="checklist-land">· {entry.land}</span>
                  )}
                  {entry.duration && (
                    <span class="checklist-dur">· {entry.duration}min</span>
                  )}
                </div>
              </div>
              {isDone ? (
                <button class="undo-btn" onClick={() => handleToggle(entry)}>Undo</button>
              ) : (
                <button class="done-btn" onClick={() => handleToggle(entry)}>Done!</button>
              )}
            </li>
          );
        })}
      </ul>

      <NextMoveButton />
    </div>
  );
}
