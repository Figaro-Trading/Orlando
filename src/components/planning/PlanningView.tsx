import { activeTemplateId, activeParkKey } from "../../state/app-state";
import { PARKS, TEMPLATE_KEYS, TEMPLATE_TO_PARK } from "../../data/parks";
import { LANDS } from "../../data/lands";
import { ALL_TEMPLATES } from "../../data/templates";
import { userPlans, addPlanRow, removePlanRow, updatePlanRow, resetParkPlan } from "../../state/user-plan";
import type { TemplateKey, PlanEntry } from "../../types";

const EMPTY_VALUE = "__empty__";

const TAB_LABELS: Record<TemplateKey, string> = {
  hs: "HS",
  mk1: "MK \u2460",
  mk2: "MK \u2461",
  epcot: "EPCOT",
  ioa: "IOA",
  usf: "USF",
  epic1: "EPIC \u2460",
  epic2: "EPIC \u2461",
  ak: "AK",
};

function makePlanEntry(templateKey: TemplateKey, name: string, land: string): PlanEntry {
  return {
    id: `${templateKey}-custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
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
  const tk = activeTemplateId.value as TemplateKey;
  const pk = TEMPLATE_TO_PARK[tk] ?? activeParkKey.value;
  const plan = userPlans.value[tk] ?? [];
  const lands = LANDS[pk] ?? {};

  const handleTemplateChange = (key: TemplateKey) => {
    activeTemplateId.value = key;
    activeParkKey.value = TEMPLATE_TO_PARK[key];
  };

  const handleRowChange = (index: number, value: string) => {
    if (value === EMPTY_VALUE) return;
    let foundLand = "";
    for (const [landName, activities] of Object.entries(lands)) {
      if (activities.includes(value)) {
        foundLand = landName;
        break;
      }
    }
    const entry = makePlanEntry(tk, value, foundLand);
    updatePlanRow(tk, index, entry);
  };

  const handleAdd = () => {
    const entry = makePlanEntry(tk, "", "");
    addPlanRow(tk, entry);
  };

  const handleRemove = (index: number) => {
    removePlanRow(tk, index);
  };

  const handleReset = () => {
    if (confirm("Reset plan to default template?")) {
      resetParkPlan(tk);
    }
  };

  return (
    <div class="panel active">
      {/* Template tabs */}
      <div class="plan-tabs">
        {TEMPLATE_KEYS.map((k) => (
          <button
            key={k}
            class={`plan-tab ${k === tk ? "active" : ""}`}
            onClick={() => handleTemplateChange(k)}
          >
            {TAB_LABELS[k]}
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
