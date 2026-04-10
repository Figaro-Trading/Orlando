import { schedData } from "../../state/live-cache";
import { PARKS, PARK_KEYS } from "../../data/parks";
import { JOURS } from "../../data/labels";
import { tripDates, isToday } from "../../utils/date";
import { ft } from "../../utils/time";
import type { ParkKey } from "../../types";

export function PlanningGrid() {
  const dates = tripDates();

  return (
    <div class="planning-grid">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            {PARK_KEYS.map((k) => <th key={k} class={`park-col-${k}`}>{PARKS[k].short}</th>)}
          </tr>
        </thead>
        <tbody>
          {dates.map((dateStr) => {
            const d = new Date(dateStr + "T12:00:00Z");
            const dayIdx = d.getUTCDay();
            return (
              <tr key={dateStr} class={isToday(dateStr) ? "today-row" : ""}>
                <td class="day-cell">{JOURS[dayIdx]} {dateStr.slice(8)}</td>
                {PARK_KEYS.map((pk) => {
                  const sched = schedData.value[pk];
                  if (!sched?.schedule) return <td key={pk}><span style="color:var(--muted)">...</span></td>;
                  const entry = sched.schedule.find((s) => s.date === dateStr);
                  if (!entry) return <td key={pk}><span style="color:var(--high);opacity:0.6">Fermé</span></td>;
                  return (
                    <td key={pk}>
                      <div class="hours-main">{ft(entry.openingTime)} - {ft(entry.closingTime)}</div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
