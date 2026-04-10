import { completedIds } from "../../state/user-progress";
import { PlanEntryCard } from "./PlanEntryCard";
import type { TemplateZone } from "../../types";

interface Props { zone: TemplateZone; }

export function ZoneSection({ zone }: Props) {
  const doneCount = zone.entries.filter((e) => completedIds.value.has(e.id)).length;
  return (
    <div class="land-section">
      <div class="land-hdr">
        <span class="ico">📍</span>
        Zone {zone.number} — {zone.label}
        <span style="margin-left:auto;font-size:0.72rem;color:var(--muted);">
          {doneCount}/{zone.entries.length}
        </span>
      </div>
      <div class="elist">
        {zone.entries.map((entry) => <PlanEntryCard key={entry.id} entry={entry} />)}
      </div>
    </div>
  );
}
