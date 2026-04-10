import { completedIds, skippedIds, markCompleted, markSkipped } from "../../state/user-progress";
import { activeParkKey } from "../../state/app-state";
import { userPosition } from "../../state/geo-state";
import { wc } from "../../utils/format";
import { CoupefileChip } from "../shared/CoupefileChip";
import type { PlanEntry } from "../../types";

const TYPE_LABELS: Record<string, string> = {
  ride: "Attraction", show: "Spectacle", meal: "Repas", walk: "Marche",
  explore: "Exploration", meet: "Rencontre", experience: "Expérience",
  transport: "Transport", logistics: "Logistique", alert: "Alerte",
};

const TYPE_COLORS: Record<string, string> = {
  ride: "s-open", show: "s-down", meal: "s-refurb",
};

interface Props { entry: PlanEntry; }

export function PlanEntryCard({ entry }: Props) {
  const isDone = completedIds.value.has(entry.id);
  const isSkipped = skippedIds.value.has(entry.id);
  const isActionable = !["walk", "transport", "logistics", "alert"].includes(entry.type);

  const handleDone = () => {
    markCompleted({
      planEntryId: entry.id,
      completedAt: new Date().toISOString(),
      park: activeParkKey.value,
      land: entry.land,
      gpsPosition: userPosition.value ? { lat: userPosition.value.lat, lon: userPosition.value.lon } : undefined,
    });
  };

  return (
    <div class={`ecard ${isDone || isSkipped ? "is-done" : ""}`}>
      <div class={`sbar ${TYPE_COLORS[entry.type] || "s-closed"}`} />
      <div class="ecard-in">
        <div class="einfo">
          <div class="ename">
            {entry.time && <span style="color:var(--muted);font-size:0.78rem;margin-right:0.4rem;">{entry.time}</span>}
            {entry.isNew && "🆕 "}{entry.isReride && "🔄 "}{entry.isMustSee && "⭐ "}
            {entry.name}
          </div>
          <div class="esub">
            <span class="etype">{TYPE_LABELS[entry.type] || entry.type}</span>
            {entry.land && <span class="eupd">· {entry.land}</span>}
            {entry.duration && <span class="eupd">· {entry.duration}min</span>}
            {entry.notes && <span class="eupd" style="color:#c084fc;">· {entry.notes}</span>}
          </div>
        </div>
        <div class="emeta">
          {entry.coupefile && entry.coupefile !== "—" && <CoupefileChip label={entry.coupefile} />}
          {entry.estimatedWait != null && <span class={`wb ${wc(entry.estimatedWait)}`}>{entry.estimatedWait} min</span>}
          {!isDone && !isSkipped && isActionable && (
            <>
              <button class="done-btn" onClick={handleDone}>Fait !</button>
              <button class="done-btn" style="border-color:var(--muted);color:var(--muted);" onClick={() => markSkipped(entry.id)}>Skip</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
