import { activeParkKey } from "../../state/app-state";
import { isLoading, liveTimestamps, isStaleLive } from "../../state/live-cache";
import { refreshActivePark } from "../../services/refresh";
import { dayOfTrip } from "../../utils/date";

export function Header() {
  const d = dayOfTrip();
  const todayMarker = d > 0 ? `Jour ${d}/11` : d < 0 ? `J${d}` : "";

  const ts = liveTimestamps.value[activeParkKey.value];
  const lastUpdate = ts
    ? `MAJ ${new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
    : "";

  const isStale = isStaleLive.value[activeParkKey.value] ?? false;

  return (
    <header>
      <h1>Orlando - 12 au 22 avril</h1>
      <div class="trip-info">
        En vadrouille !{" · "}
        <span class="today-marker">{todayMarker}</span>
      </div>
      <div class="header-actions">
        <button
          class="refresh-btn"
          onClick={() => refreshActivePark()}
          disabled={isLoading.value}
        >
          {isLoading.value ? "Chargement..." : "Actualiser"}
        </button>
        <span class="last-update">{lastUpdate}</span>
        {isStale && <span class="stale-badge">Données anciennes</span>}
      </div>
    </header>
  );
}
