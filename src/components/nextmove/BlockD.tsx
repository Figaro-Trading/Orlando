import { ReasonBadge } from "./ReasonBadge";
import { FeasibilityChip } from "./FeasibilityChip";
import type { RecommendedItem } from "../../types";

interface BlockDProps {
  item: RecommendedItem;
}

export function BlockD({ item }: BlockDProps) {
  return (
    <div class="rec-block" style="border-color:rgba(192,132,252,0.3);">
      <div class="rec-block-label">Show coming up</div>
      <div class="rec-entity-name">{item.name}</div>
      <ReasonBadge reason={item.reason} status={item.status} />
      <div class="rec-chips">
        <FeasibilityChip feasibility={item.feasibility} />
        {item.isOnPlan && <span class="bsm b-ll">Planned</span>}
      </div>
    </div>
  );
}
