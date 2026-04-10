import { activeParkKey, maxWaitThreshold } from "../../state/app-state";
import { resetProgress } from "../../state/user-progress";
import { gpsAvailable, gpsPermissionState } from "../../state/geo-state";
import { PARKS, PARK_KEYS } from "../../data/parks";
import { LandPicker } from "./LandPicker";
import type { ParkKey } from "../../types";

export function Settings() {
  return (
    <div class="panel active">
      <h2 style="font-size:1.2rem;margin-bottom:1rem;">Réglages</h2>

      <div class="settings-section">
        <div class="settings-label">Parc actif</div>
        <select class="settings-select" value={activeParkKey.value}
          onChange={(e) => { activeParkKey.value = (e.target as HTMLSelectElement).value; }}>
          {PARK_KEYS.map((k) => <option key={k} value={k}>{PARKS[k].name}</option>)}
        </select>
      </div>

      <div class="settings-section">
        <div class="settings-label">
          Land actuel
          {gpsAvailable.value && <span style="color:var(--low);font-size:0.72rem;"> (GPS actif)</span>}
          {gpsPermissionState.value === "denied" && <span style="color:var(--high);font-size:0.72rem;"> (GPS refusé)</span>}
        </div>
        <LandPicker />
      </div>

      <div class="settings-section">
        <div class="settings-label">Seuil attente max : {maxWaitThreshold.value} min</div>
        <input type="range" class="settings-range" min="15" max="180" step="5"
          value={maxWaitThreshold.value}
          onInput={(e) => { maxWaitThreshold.value = Number((e.target as HTMLInputElement).value); }} />
      </div>

      <div class="settings-section">
        <button class="settings-reset-btn"
          onClick={() => { if (confirm("Réinitialiser toute la progression ?")) resetProgress(); }}>
          Réinitialiser la progression
        </button>
      </div>
    </div>
  );
}
