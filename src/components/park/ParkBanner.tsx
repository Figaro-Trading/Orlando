import { liveData } from "../../state/live-cache";
import { ft } from "../../utils/time";
import { PARKS } from "../../data/parks";
import type { ParkKey, LiveEntity } from "../../types";

interface Props { parkKey: ParkKey; }

export function ParkBanner({ parkKey }: Props) {
  const live = liveData.value[parkKey];
  if (!live) return null;

  const pe = live.liveData.find((e) => e.entityType === "PARK");
  const isOpen = pe?.status === "OPERATING";

  const hours = pe?.operatingHours ?? [];

  const attractions = live.liveData.filter((e) => e.entityType === "ATTRACTION");
  const opCount = attractions.filter((e) => e.status === "OPERATING").length;
  const waits = attractions
    .filter((e) => e.status === "OPERATING" && e.queue?.STANDBY?.waitTime != null)
    .map((e) => e.queue!.STANDBY!.waitTime!);
  const avg = waits.length > 0 ? Math.round(waits.reduce((a, b) => a + b, 0) / waits.length) : 0;

  let maxWait = 0;
  let maxName = "";
  for (const a of attractions) {
    const w = a.queue?.STANDBY?.waitTime ?? 0;
    if (w > maxWait) { maxWait = w; maxName = a.name; }
  }

  const avgColor = avg > 90 ? "var(--high)" : avg > 45 ? "var(--mid)" : "var(--low)";

  return (
    <div class="park-banner">
      <div class="park-banner-top">
        <span class={`status-pill ${isOpen ? "open" : "closed"}`}>
          {isOpen ? "Open" : "Closed"}
        </span>
        <span style="font-weight:700;font-size:1.1rem;">{PARKS[parkKey].name}</span>
      </div>
      {hours.length > 0 && (
        <div class="hours-row">
          {hours.map((h, i) => (
            <span key={i} class="chip chip-hours">{ft(h.startTime)} - {ft(h.endTime)}</span>
          ))}
        </div>
      )}
      <div class="park-stats">
        <div class="stat">
          <div class="stat-val">{opCount}/{attractions.length}</div>
          <div class="stat-lbl">Open</div>
        </div>
        {avg > 0 && (
          <div class="stat">
            <div class="stat-val" style={`color:${avgColor}`}>{avg} min</div>
            <div class="stat-lbl">Avg.</div>
          </div>
        )}
        {maxWait > 0 && (
          <div class="stat">
            <div class="stat-val" style="color:var(--high)">{maxWait} min</div>
            <div class="stat-lbl">{maxName}</div>
          </div>
        )}
      </div>
    </div>
  );
}
