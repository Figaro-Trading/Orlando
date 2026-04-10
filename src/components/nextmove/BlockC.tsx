import { ReasonBadge } from "./ReasonBadge";
import { FeasibilityChip } from "./FeasibilityChip";
import { CoupefileChip } from "../shared/CoupefileChip";
import { WaitBadge } from "../shared/WaitBadge";
import type { RecommendedItem } from "../../types";

interface BlockCProps {
  items: RecommendedItem[];
}

export function BlockC({ items }: BlockCProps) {
  return (
    <div>
      <div class="rec-block-label" style="padding:0.5rem 0;">
        Alternatives proches
      </div>
      {items.map((item) => (
        <div
          class="rec-block"
          style="padding:0.75rem;margin-bottom:0.4rem;"
          key={item.entityId ?? item.planEntryId}
        >
          <div style="display:flex;justify-content:space-between;align-items:start;">
            <div>
              <div class="rec-entity-name" style="font-size:0.95rem;">
                {item.name}
              </div>
              {item.land && (
                <div style="font-size:0.7rem;color:var(--muted);">
                  {item.land}
                </div>
              )}
            </div>
            {item.waitTime != null && <WaitBadge waitTime={item.waitTime} />}
          </div>
          <ReasonBadge reason={item.reason} status={item.status} />
          <div class="rec-chips">
            <FeasibilityChip feasibility={item.feasibility} />
            {item.coupefile && item.coupefile !== "—" && (
              <CoupefileChip label={item.coupefile} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
