import { PARK_ALERTS } from "../../data/alerts";
import { LL_CALENDAR } from "../../data/ll-calendar";
import { activeParkKey } from "../../state/app-state";
import { PARKS } from "../../data/parks";
import type { ParkAlert, LLPurchase, ParkKey } from "../../types";

export function AlertBanner() {
  const pk = activeParkKey.value;
  const parkName = PARKS[pk as ParkKey]?.name ?? "";

  const parkAlerts: ParkAlert[] = PARK_ALERTS.filter((a) => a.park === pk || a.park === "all");
  const parkLL: LLPurchase[] = LL_CALENDAR.filter((ll) => ll.park === parkName);

  if (parkAlerts.length === 0 && parkLL.length === 0) return null;

  const icon = (severity: string) =>
    severity === "critical" ? "🔴" : severity === "warning" ? "🟡" : "ℹ️";

  return (
    <div class="alert-banner">
      {parkAlerts.map((alert, i) => (
        <div class="alert-banner-item" key={`a-${i}`}>
          {icon(alert.severity)} {alert.message}
        </div>
      ))}
      {parkLL.map((ll, i) => (
        <div class="alert-banner-item" key={`ll-${i}`} style="color:var(--low)">
          💳 {ll.product} ({ll.cost}) — {ll.purchaseTime}
        </div>
      ))}
    </div>
  );
}
