import { filters } from "../../state/app-state";
import type { EntityFilters } from "../../state/app-state";

export function FilterBar() {
  const toggle = (type: keyof EntityFilters) => {
    filters.value = { ...filters.value, [type]: !filters.value[type] };
  };
  return (
    <div class="filters" role="group" aria-label="Filter by type">
      <button class={`fchip ${filters.value.ATTRACTION ? "on" : ""}`} aria-pressed={filters.value.ATTRACTION} onClick={() => toggle("ATTRACTION")}>Attractions</button>
      <button class={`fchip ${filters.value.SHOW ? "on" : ""}`} aria-pressed={filters.value.SHOW} onClick={() => toggle("SHOW")}>Shows</button>
      <button class={`fchip ${filters.value.RESTAURANT ? "on" : ""}`} aria-pressed={filters.value.RESTAURANT} onClick={() => toggle("RESTAURANT")}>Restaurants</button>
    </div>
  );
}
