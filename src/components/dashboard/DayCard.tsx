import { PARKS } from "../../data/parks";
import { ALL_TEMPLATES } from "../../data/templates";
import { activeTemplateId } from "../../state/app-state";
import type { TripDay, ParkKey } from "../../types";

interface DayCardProps {
  tripDay: TripDay;
}

export function DayCard({ tripDay }: DayCardProps) {
  const template = ALL_TEMPLATES[activeTemplateId.value];
  const parkName = template ? PARKS[template.park as ParkKey]?.name ?? template.park : "";

  return (
    <div class="dash-card">
      <div style="font-size:1.3rem;font-weight:700;">
        J{tripDay.dayIndex} — {parkName}
      </div>
      {template && (
        <div style="color:var(--muted);font-size:0.82rem;margin-top:0.3rem;">
          {template.label}
        </div>
      )}
      {tripDay.isMultiPark && template?.transitionTime && (
        <div style="font-size:0.78rem;color:#c084fc;margin-top:0.3rem;">
          Multi-parc : transition à {template.transitionTime}
        </div>
      )}
    </div>
  );
}
