import { activeParkKey, currentLand } from "../../state/app-state";
import { LANDS } from "../../data/lands";
import type { ParkKey } from "../../types";

export function LandPicker() {
  const pk = activeParkKey.value as ParkKey;
  const landNames = Object.keys(LANDS[pk] || {});
  return (
    <select class="settings-select" value={currentLand.value ?? ""}
      onChange={(e) => { currentLand.value = (e.target as HTMLSelectElement).value || null; }}>
      <option value="">Auto (GPS)</option>
      {landNames.map((name) => <option key={name} value={name}>{name}</option>)}
    </select>
  );
}
