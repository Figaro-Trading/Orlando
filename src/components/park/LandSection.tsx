import { ICONS } from "../../data/lands";
import { EntityCard } from "./EntityCard";
import type { LiveEntity, ParkKey } from "../../types";

interface Props { landName: string; entities: LiveEntity[]; parkKey: ParkKey; }

export function LandSection({ landName, entities, parkKey }: Props) {
  if (entities.length === 0) return null;
  return (
    <div class="land-section">
      <div class="land-hdr">
        <span class="ico">{ICONS[landName] || "📍"}</span>
        {landName}
      </div>
      <div class="elist">
        {entities.map((e) => <EntityCard key={e.id} entity={e} parkKey={parkKey} />)}
      </div>
    </div>
  );
}
