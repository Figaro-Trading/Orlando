import { activeParkKey } from "../../state/app-state";
import { isLoading, liveTimestamps, isStaleLive } from "../../state/live-cache";
import { refreshActivePark } from "../../services/refresh";
import { PARKS } from "../../data/parks";
import type { ParkKey } from "../../types";

export function Header() {
  const pk = activeParkKey.value as ParkKey;
  const parkName = PARKS[pk]?.name ?? "Orlando";

  const ts = liveTimestamps.value[pk];
  const lastUpdate = ts
    ? `MAJ ${new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
    : "";

  const isStale = isStaleLive.value[pk] ?? false;

  return (
    <header>
      <h1>🏰 ORLANDO 🏰</h1>
      <div class="trip-info">
        <span class="today-marker">{parkName}</span>
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
