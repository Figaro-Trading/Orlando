import { selectedJ4Option, activeTemplateId, activeParkKey } from "../../state/app-state";
import { ALL_TEMPLATES } from "../../data/templates";
import type { DayAlternative, ParkKey } from "../../types";

interface Props {
  alternatives: DayAlternative[];
}

export function DayTemplatePicker({ alternatives }: Props) {
  if (alternatives.length === 0) return null;

  const handleChange = (e: Event) => {
    const templateId = (e.target as HTMLSelectElement).value;
    selectedJ4Option.value = templateId;
    activeTemplateId.value = templateId;
    const template = ALL_TEMPLATES[templateId];
    if (template) activeParkKey.value = template.park;
  };

  return (
    <div class="template-picker">
      <div class="settings-label">Jour bonus : quel parc ?</div>
      <select class="settings-select" value={selectedJ4Option.value ?? ""} onChange={handleChange}>
        <option value="" disabled>Choisir un parc...</option>
        {alternatives.map((alt) => (
          <option key={alt.templateId} value={alt.templateId}>
            {alt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
