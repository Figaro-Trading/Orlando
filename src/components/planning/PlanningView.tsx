import { activeParkKey } from "../../state/app-state";
import { PARKS, PARK_KEYS } from "../../data/parks";
import { LANDS } from "../../data/lands";
import { ALL_TEMPLATES } from "../../data/templates";
import { userPlans, addPlanRow, removePlanRow, updatePlanRow, resetParkPlan } from "../../state/user-plan";
import type { ParkKey, PlanEntry } from "../../types";

const EMPTY_VALUE = "__empty__";

function makePlanEntry(parkKey: ParkKey, name: string, land: string): PlanEntry {
  return {
    id: `${parkKey}-custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    type: "ride",
    land,
    isNew: false,
    isReride: false,
    isMustSee: false,
    priority: 3,
    isOptional: false,
    isRopeDrop: false,
  };
}

export function PlanningView() {
  const pk = activeParkKey.value as ParkKey;
  const plan = userPlans.value[pk] ?? [];
  const lands = LANDS[pk] ?? {};

  const handleParkChange = (key: ParkKey) => {
    activeParkKey.value = key;
  };

  const handleRowChange = (index: number, value: string) => {
    if (value === EMPTY_VALUE) return;
    // Find the land for this activity
    let foundLand = "";
    for (const [landName, activities] of Object.entries(lands)) {
      if (activities.includes(value)) {
        foundLand = landName;
        break;
      }
    }
    const entry = makePlanEntry(pk, value, foundLand);
    updatePlanRow(pk, index, entry);
  };

  const handleAdd = () => {
    const entry = makePlanEntry(pk, "", "");
    addPlanRow(pk, entry);
  };

  const handleRemove = (index: number) => {
    removePlanRow(pk, index);
  };

  const handleReset = () => {
    if (confirm("Reset plan to default template?")) {
      resetParkPlan(pk);
    }
  };

  return (
    <div class="panel active">
      {/* Park tabs */}
      <div class="plan-tabs">
        {PARK_KEYS.map((k) => (
          <button
            key={k}
            class={`plan-tab ${k === pk ? "active" : ""}`}
            onClick={() => handleParkChange(k)}
          >
            {PARKS[k].short}
          </button>
        ))}
      </div>

      <div style="font-size:1rem;font-weight:700;margin:0.75rem 0 0.5rem;">
        {PARKS[pk].name} — {plan.length} activities
      </div>

      {/* Planning rows */}
      <div class="plan-rows">
        {plan.map((entry, i) => (
          <div key={`${entry.id}-${i}`} class="plan-row">
            <span class="plan-row-num">{i + 1}</span>
            <select
              class="plan-row-select"
              value={entry.name}
              onChange={(e) => handleRowChange(i, (e.target as HTMLSelectElement).value)}
            >
              {entry.name ? (
                <option value={entry.name}>{entry.name}</option>
              ) : (
                <option value={EMPTY_VALUE}>— Choose —</option>
              )}
              {Object.entries(lands).map(([landName, activities]) => (
                <optgroup key={landName} label={landName}>
                  {activities.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <button class="plan-row-remove" aria-label="Remove" onClick={() => handleRemove(i)}>
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div class="plan-actions">
        <button class="plan-add-btn" onClick={handleAdd}>
          + Add activity
        </button>
        <button class="plan-reset-btn" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}
