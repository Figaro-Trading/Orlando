import { todayCompletions } from "../../state/user-progress";

interface TripProgressProps {
  totalEntries: number;
}

export function TripProgress({ totalEntries }: TripProgressProps) {
  const completed = todayCompletions.value.length;
  const pct = totalEntries > 0 ? (completed / totalEntries) * 100 : 0;

  return (
    <div class="dash-card">
      <div class="dash-progress">
        <div class="progress-bar">
          <div class="progress-fill" style={`width:${pct}%`} />
        </div>
        <span class="progress-label">{completed}/{totalEntries} activités</span>
      </div>
    </div>
  );
}
