import type { PlanEntry } from "../../types";
import type { NearbyCandidate } from "../../engine/nearby";

interface ExitPickerProps {
  candidates: NearbyCandidate[];
  suggestedId: string | null;
  selectedId: string | null;
  onSelect: (entityId: string | null) => void;
  onConfirm: () => void;
  gpsAvailable: boolean;
  currentZoneEntries?: PlanEntry[];
}

function isActionable(e: PlanEntry): boolean {
  return !["walk", "transport", "logistics", "alert"].includes(e.type);
}

export function ExitPicker({
  candidates,
  suggestedId,
  selectedId,
  onSelect,
  onConfirm,
  gpsAvailable,
  currentZoneEntries,
}: ExitPickerProps) {
  const buttonLabel =
    selectedId === "none"
      ? "What's next"
      : selectedId
        ? "Done! → What's next"
        : "Pick one first";

  return (
    <div class="exit-picker">
      <div class="exit-picker-title">What did you just finish?</div>

      {gpsAvailable && candidates.length > 0 ? (
        candidates.map((c) => (
          <div
            key={c.entityId}
            class={`exit-option ${selectedId === c.entityId ? "selected" : ""}`}
            onClick={() => onSelect(c.entityId)}
          >
            <span class="exit-name">
              {c.entityId === suggestedId ? "► " : ""}
              {c.name}
            </span>
            <span class="exit-distance">{c.walkMinutes} min</span>
          </div>
        ))
      ) : (
        <>
          <div style="font-size:0.78rem;color:var(--muted);margin-bottom:0.5rem;">
            {gpsAvailable
              ? "No nearby attractions"
              : "GPS unavailable — manual selection"}
          </div>
          {currentZoneEntries
            ?.filter(isActionable)
            .map((entry) => (
              <div
                key={entry.id}
                class={`exit-option ${selectedId === entry.id ? "selected" : ""}`}
                onClick={() => onSelect(entry.id)}
              >
                <span class="exit-name">{entry.name}</span>
                <span class="exit-distance">{entry.land || ""}</span>
              </div>
            ))}
        </>
      )}

      <div
        class={`exit-option ${selectedId === "none" ? "selected" : ""}`}
        onClick={() => onSelect("none")}
      >
        <span class="exit-name">Skip / Other</span>
      </div>

      <button
        class="fab-next"
        style="position:static;width:100%;margin-top:0.75rem;"
        onClick={onConfirm}
        disabled={selectedId === null}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
