import type { TimeFeasibility } from "../../types";

interface FeasibilityChipProps {
  feasibility: TimeFeasibility;
}

export function FeasibilityChip({ feasibility }: FeasibilityChipProps) {
  const waitClass =
    (feasibility.waitMinutes ?? 0) <= 10
      ? "b-sr"
      : (feasibility.waitMinutes ?? 0) <= 30
        ? "b-ill"
        : "b-closed";

  const slackClass =
    (feasibility.arrivalSlackMinutes ?? 0) >= 5 ? "b-sr" : "b-closed";

  return (
    <div style="display:flex;gap:0.3rem;flex-wrap:wrap;">
      <span class="bsm b-sr">🚶 {Math.round(feasibility.walkMinutes)} min</span>

      {feasibility.waitMinutes != null && (
        <span class={`bsm ${waitClass}`}>⏳ {feasibility.waitMinutes} min</span>
      )}

      {feasibility.arrivalSlackMinutes != null && (
        <span class={`bsm ${slackClass}`}>
          {feasibility.arrivalSlackMinutes >= 5 ? "✓" : "⚠"} Buffer{" "}
          {feasibility.arrivalSlackMinutes} min
        </span>
      )}

      {feasibility.latestDepartureTime && (
        <span class="bsm b-show">Leave by {feasibility.latestDepartureTime}</span>
      )}
    </div>
  );
}
