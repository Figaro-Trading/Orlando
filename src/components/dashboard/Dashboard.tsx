import { activeParkKey, activeTemplateId } from "../../state/app-state";
import { completedIds, markCompleted, removeCompletion } from "../../state/user-progress";
import { userPosition } from "../../state/geo-state";
import { ALL_TEMPLATES } from "../../data/templates";
import { PARKS } from "../../data/parks";
import { TripProgress } from "./TripProgress";
import { AlertBanner } from "./AlertBanner";
import { NextMoveButton } from "./NextMoveButton";
import type { PlanEntry, ParkKey } from "../../types";

const TYPE_LABELS: Record<string, string> = {
  ride: "Attraction",
  show: "Spectacle",
  meal: "Repas",
  meet: "Rencontre",
  experience: "Expérience",
  explore: "Exploration",
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
  const pk = activeParkKey.value as ParkKey;
  const template = ALL_TEMPLATES[pk];

  if (!template) {
    return (
      <div class="panel active">
        <div style="padding: 2rem; text-align: center; color: var(--muted);">
          Aucun planning disponible
        </div>
      </div>
    );
  }

  const entries: PlanEntry[] = template.zones.flatMap((z) =>
    z.entries.filter((e) => isActionable(e.type)),
  );

  const completedCount = entries.filter((e) => completedIds.value.has(e.id)).length;

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

      <TripProgress totalEntries={entries.length} />
      <AlertBanner />

      <div class="checklist">
        {entries.map((entry) => {
          const isDone = completedIds.value.has(entry.id);
          return (
            <div
              key={entry.id}
              class={`checklist-row ${isDone ? "is-done" : ""}`}
              onClick={() => handleToggle(entry)}
            >
              <div class={`checklist-check ${isDone ? "checked" : ""}`}>
                {isDone ? "✓" : ""}
              </div>
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
            </div>
          );
        })}
      </div>

      <NextMoveButton />
    </div>
  );
}
