import { activeTemplateId } from "../../state/app-state";
import { sbc } from "../../utils/format";
import { ft } from "../../utils/time";
import { trend, findLand } from "../../utils/entity";
import { findPlanEntryForEntityId } from "../../utils/matching";
import { getTemplate } from "../../data/templates";
import { isPlanEntryInPlan, addPlanRow } from "../../state/user-plan";
import { TYPE_LBL } from "../../data/labels";
import { WaitBadge } from "../shared/WaitBadge";
import { StatusBadge } from "../shared/StatusBadge";
import { ShowtimePills } from "../shared/ShowtimePills";
import type { LiveEntity, ParkKey, PlanEntry } from "../../types";

interface Props { entity: LiveEntity; parkKey: ParkKey; }

export function EntityCard({ entity, parkKey }: Props) {
  const waitTime = entity.queue?.STANDBY?.waitTime ?? null;
  const sr = entity.queue?.SINGLE_RIDER?.waitTime;
  const rt = entity.queue?.RETURN_TIME;
  const prt = entity.queue?.PAID_RETURN_TIME;
  const bg = entity.queue?.BOARDING_GROUP;

  // Enriched data from template
  const template = getTemplate(activeTemplateId.value);
  const planEntry = template ? findPlanEntryForEntityId(entity.id, template) : null;
  const isInPlan = isPlanEntryInPlan(parkKey, entity.name);

  const handleAddToPlan = (e: Event) => {
    e.stopPropagation();
    const land = findLand(parkKey, entity.name) ?? "";
    const entry: PlanEntry = {
      id: `${parkKey}-add-${Date.now()}`,
      name: entity.name,
      type: entity.entityType === "SHOW" ? "show" : entity.entityType === "RESTAURANT" ? "meal" : "ride",
      land,
      duration: planEntry?.duration,
      rideType: planEntry?.rideType,
      popularity: planEntry?.popularity,
      estimatedWait: planEntry?.estimatedWait,
      rating: planEntry?.rating,
      isNew: false,
      isReride: false,
      isMustSee: false,
      priority: 3,
      isOptional: false,
      isRopeDrop: false,
    };
    addPlanRow(parkKey, entry);
  };

  return (
    <div class="ecard">
      <div class={`sbar ${sbc(entity.status)}`} aria-hidden="true" />
      <span class="sr-only">{entity.status === "OPERATING" ? "Open" : entity.status === "CLOSED" ? "Closed" : entity.status === "DOWN" ? "Temporarily down" : "Refurbishment"}</span>
      <div class="ecard-in">
        <div class="einfo">
          <div class="ename">{entity.name}</div>
          <div class="esub">
            <span class="etype">{TYPE_LBL[entity.entityType] || entity.entityType}</span>
            {planEntry?.rideType && (
              <span class="etype">· {planEntry.rideType}</span>
            )}
            {planEntry?.duration && (
              <span class="etype">· {planEntry.duration}min</span>
            )}
            {planEntry?.popularity && (
              <span class={`bsm ${planEntry.popularity >= 7 ? "b-pop-high" : planEntry.popularity >= 4 ? "b-pop-mid" : "b-pop-low"}`}>
                Pop. {planEntry.popularity.toFixed(1)}
              </span>
            )}
            {planEntry?.rating && (
              <span class="etype">· ★{planEntry.rating.toFixed(1)}</span>
            )}
            <span class="eupd">· Upd {ft(entity.lastUpdated)}</span>
          </div>
        </div>
        <div class="emeta">
          {entity.status === "OPERATING" ? (
            <>
              {waitTime != null && waitTime >= 0 && (
                <WaitBadge waitTime={waitTime} trendDir={trend(entity)} />
              )}
              {planEntry?.estimatedWait && waitTime == null && (
                <span class="bsm" style="color:var(--muted)">~{planEntry.estimatedWait}min</span>
              )}
              {sr != null && <span class="bsm b-sr">SR {sr}min</span>}
              {rt?.state === "AVAILABLE" && rt.returnStart && (
                <span class="bsm b-ll">LL-M {ft(rt.returnStart)}</span>
              )}
              {prt?.state === "AVAILABLE" && prt.returnStart && (
                <span class="bsm b-ill">LL-S {ft(prt.returnStart)}</span>
              )}
              {bg?.allocationStatus === "AVAILABLE" && bg.currentGroupStart != null && (
                <span class="bsm b-vq">VQ gr.{bg.currentGroupStart}-{bg.currentGroupEnd}</span>
              )}
              {entity.showtimes && entity.showtimes.length > 0 && (
                <ShowtimePills showtimes={entity.showtimes} />
              )}
            </>
          ) : (
            <StatusBadge status={entity.status} />
          )}
          {!isInPlan && entity.status === "OPERATING" && (
            <button class="add-plan-btn" onClick={handleAddToPlan} aria-label="Add to plan">+</button>
          )}
        </div>
      </div>
    </div>
  );
}
