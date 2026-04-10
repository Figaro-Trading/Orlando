import { isLoading } from "../../state/live-cache";
import { TRIP_DAYS } from "../../data/trip";
import { todayOrlando } from "../../utils/time";
import { dayOfTrip } from "../../utils/date";
import { ALL_TEMPLATES } from "../../data/templates";
import { activeTemplateId } from "../../state/app-state";
import { DayCard } from "./DayCard";
import { TripProgress } from "./TripProgress";
import { AlertBanner } from "./AlertBanner";
import { DayTemplatePicker } from "./DayTemplatePicker";
import { NextMoveButton } from "./NextMoveButton";

export function Dashboard() {
  const today = todayOrlando();
  const tripDay = TRIP_DAYS.find((d) => d.date === today);

  if (!tripDay || tripDay.templates.length === 0) {
    const d = dayOfTrip();
    return (
      <div class="panel active">
        <div style="padding: 2rem; text-align: center; color: var(--muted);">
          {d < 0 ? `J${d} — Le voyage commence bientôt !` : "Pas de jour parc aujourd'hui"}
        </div>
      </div>
    );
  }

  const template = ALL_TEMPLATES[activeTemplateId.value];
  const totalEntries = template
    ? template.zones.reduce((sum, z) => sum + z.entries.filter((e) => e.type === "ride" || e.type === "show" || e.type === "meet").length, 0)
    : 0;

  const hasAlternatives = tripDay.alternatives && tripDay.alternatives.length > 0;

  return (
    <div class="panel active">
      {isLoading.value ? (
        <div class="loading"><div class="spinner" /><div>Chargement...</div></div>
      ) : (
        <>
          <DayCard tripDay={tripDay} />
          <TripProgress totalEntries={totalEntries} />
          <AlertBanner />
          {hasAlternatives && <DayTemplatePicker alternatives={tripDay.alternatives!} />}
          <NextMoveButton />
        </>
      )}
    </div>
  );
}
