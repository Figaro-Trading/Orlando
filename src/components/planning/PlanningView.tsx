import { signal } from "@preact/signals";
import { activeTemplateId } from "../../state/app-state";
import { ALL_TEMPLATES } from "../../data/templates";
import { ZoneSection } from "./ZoneSection";

const viewMode = signal<"day">("day");

export function PlanningView() {
  const template = ALL_TEMPLATES[activeTemplateId.value];

  if (!template) {
    return (
      <div class="panel active">
        <div style="padding: 2rem; text-align: center; color: var(--muted);">
          Pas de planning parc aujourd'hui
        </div>
      </div>
    );
  }

  return (
    <div class="panel active">
      <div style="font-size:1.1rem;font-weight:700;margin-bottom:0.75rem;">
        {template.label}
      </div>
      {template.zones.map((zone) => (
        <ZoneSection key={zone.number} zone={zone} />
      ))}
    </div>
  );
}
