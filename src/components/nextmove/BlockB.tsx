import { ReasonBadge } from "./ReasonBadge";
import { FeasibilityChip } from "./FeasibilityChip";
import { CoupefileChip } from "../shared/CoupefileChip";
import { WaitBadge } from "../shared/WaitBadge";
import type { RecommendedItem } from "../../types";

interface BlockBProps {
  item: RecommendedItem;
}

export function BlockB({ item }: BlockBProps) {
  return (
    <div class="rec-block highlight">
      <div class="rec-block-label">Meilleur choix maintenant</div>
      <div class="rec-entity-name">{item.name}</div>
      {item.land && (
        <div style="font-size:0.75rem;color:var(--muted);margin-top:0.15rem;">
          {item.land}
        </div>
      )}
      <ReasonBadge reason={item.reason} status={item.status} />
      <div class="rec-chips">
        <FeasibilityChip feasibility={item.feasibility} />
        {item.waitTime != null && <WaitBadge waitTime={item.waitTime} />}
        {item.coupefile && item.coupefile !== "—" && (
          <CoupefileChip label={item.coupefile} />
        )}
        {item.isOnPlan && <span class="bsm b-ll">Sur le planning</span>}
      </div>
    </div>
  );
}
