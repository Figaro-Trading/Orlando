import { filters } from "../../state/app-state";
import type { EntityFilters } from "../../state/app-state";

export function FilterBar() {
  const toggle = (type: keyof EntityFilters) => {
    filters.value = { ...filters.value, [type]: !filters.value[type] };
  };
  return (
    <div class="filters">
      <button class={`fchip ${filters.value.ATTRACTION ? "on" : ""}`} onClick={() => toggle("ATTRACTION")}>Attractions</button>
      <button class={`fchip ${filters.value.SHOW ? "on" : ""}`} onClick={() => toggle("SHOW")}>Spectacles</button>
      <button class={`fchip ${filters.value.RESTAURANT ? "on" : ""}`} onClick={() => toggle("RESTAURANT")}>Restaurants</button>
    </div>
  );
}
