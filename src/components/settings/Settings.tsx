import { activeParkKey, parkMode, maxWaitThreshold, maxPopularityThreshold, themeMode } from "../../state/app-state";
import { resetProgress } from "../../state/user-progress";
import { gpsAvailable, gpsPermissionState } from "../../state/geo-state";
import { PARKS, PARK_KEYS } from "../../data/parks";
import { LandPicker } from "./LandPicker";
import type { ParkKey } from "../../types";

export function Settings() {
  const handleParkModeChange = (value: string) => {
    if (value === "auto") {
      parkMode.value = "auto";
    } else if (value in PARKS) {
      parkMode.value = value as ParkKey;
      activeParkKey.value = value as ParkKey;
    }
  };

  return (
    <div class="panel active">
      <h2 style="font-size:1.2rem;margin-bottom:1rem;">Settings</h2>

      <div class="settings-section">
        <div class="settings-label">Default park</div>
        <select class="settings-select" value={parkMode.value}
          onChange={(e) => handleParkModeChange((e.target as HTMLSelectElement).value)}>
          <option value="auto">Auto (GPS)</option>
          {PARK_KEYS.map((k) => <option key={k} value={k}>{PARKS[k].name}</option>)}
        </select>
        {parkMode.value === "auto" && gpsAvailable.value && (
          <div style="font-size:0.72rem;color:var(--low);margin-top:0.3rem;">
            Detected: {PARKS[activeParkKey.value].name}
          </div>
        )}
        {parkMode.value === "auto" && gpsPermissionState.value === "denied" && (
          <div style="font-size:0.72rem;color:var(--high);margin-top:0.3rem;">
            GPS denied — pick a park manually
          </div>
        )}
      </div>

      <div class="settings-section">
        <div class="settings-label">
          Current land
          {gpsAvailable.value && <span style="color:var(--low);font-size:0.72rem;"> (GPS active)</span>}
        </div>
        <LandPicker />
      </div>

      <div class="settings-section">
        <div class="settings-label">Max wait: {maxWaitThreshold.value} min</div>
        <input type="range" class="settings-range" min="15" max="180" step="5"
          value={maxWaitThreshold.value}
          onInput={(e) => { maxWaitThreshold.value = Number((e.target as HTMLInputElement).value); }} />
      </div>

      <div class="settings-section">
        <div class="settings-label">Max crowd level: {maxPopularityThreshold.value}/10</div>
        <input type="range" class="settings-range" min="1" max="10" step="1"
          value={maxPopularityThreshold.value}
          onInput={(e) => { maxPopularityThreshold.value = Number((e.target as HTMLInputElement).value); }} />
      </div>

      <div class="settings-section">
        <div class="settings-label">Theme</div>
        <div class="theme-toggle">
          {(["light", "dark", "auto"] as const).map((mode) => (
            <button
              key={mode}
              class={`theme-btn ${themeMode.value === mode ? "active" : ""}`}
              onClick={() => { themeMode.value = mode; }}
            >
              {mode === "light" ? "Light" : mode === "dark" ? "Dark" : "Auto"}
            </button>
          ))}
        </div>
      </div>

      <div class="settings-section">
        <button class="settings-reset-btn"
          onClick={() => { if (confirm("Reset all progress?")) resetProgress(); }}>
          Reset progress
        </button>
      </div>
    </div>
  );
}
