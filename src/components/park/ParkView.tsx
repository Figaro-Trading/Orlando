import { activeParkKey, filters } from "../../state/app-state";
import { liveData } from "../../state/live-cache";
import { LANDS } from "../../data/lands";
import { findLand } from "../../utils/entity";
import { ParkBanner } from "./ParkBanner";
import { FilterBar } from "./FilterBar";
import { LandSection } from "./LandSection";
import type { LiveEntity } from "../../types";
import type { ParkKey } from "../../types";

export function ParkView() {
  const pk = activeParkKey.value as ParkKey;
  const data = liveData.value[pk];

  if (!data) {
    return (
      <div class="panel active">
        <div class="loading"><div class="spinner" /><div>Chargement des données...</div></div>
      </div>
    );
  }

  const typeKey = (et: string) => et as keyof typeof filters.value;
  const ents = data.liveData.filter(
    (e) => e.entityType !== "PARK" && (filters.value[typeKey(e.entityType)] ?? true),
  );

  const groups: Record<string, LiveEntity[]> = {};
  const other: LiveEntity[] = [];

  for (const e of ents) {
    const land = findLand(pk, e.name);
    if (land) {
      (groups[land] ??= []).push(e);
    } else {
      other.push(e);
    }
  }

  const orderedLands = Object.keys(LANDS[pk] || {});

  return (
    <div class="panel active">
      <ParkBanner parkKey={pk} />
      <FilterBar />
      {orderedLands.map((name) =>
        groups[name]?.length ? (
          <LandSection key={name} landName={name} entities={groups[name]} parkKey={pk} />
        ) : null,
      )}
      {other.length > 0 && <LandSection landName="Autres" entities={other} parkKey={pk} />}
    </div>
  );
}
