import { ReasonBadge } from "./ReasonBadge";
import { FeasibilityChip } from "./FeasibilityChip";
import { SkipPassChip } from "../shared/SkipPassChip";
import { WaitBadge } from "../shared/WaitBadge";
import type { RecommendedItem } from "../../types";

interface BlockAProps {
  item: RecommendedItem;
}

export function BlockA({ item }: BlockAProps) {
  const isExcluded = item.status === "not_recommended";

  return (
    <div class="rec-block">
      <div class="rec-block-label">Up next</div>
      <div
        class="rec-entity-name"
        style={isExcluded ? "opacity:0.5;text-decoration:line-through;" : ""}
      >
        {item.name}
      </div>
      <ReasonBadge reason={item.reason} status={item.status} />
      <div class="rec-chips">
        <FeasibilityChip feasibility={item.feasibility} />
        {item.waitTime != null && <WaitBadge waitTime={item.waitTime} />}
        {item.skipPass && item.skipPass !== "—" && (
          <SkipPassChip label={item.skipPass} />
        )}
        {item.priority === 1 && <span class="bsm b-ll">Must-do</span>}
      </div>
    </div>
  );
}
