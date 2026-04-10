import { completedEntityIds, markCompleted } from "../../state/user-progress";
import { activeParkKey, activeTemplateId } from "../../state/app-state";
import { userPosition } from "../../state/geo-state";
import { sbc } from "../../utils/format";
import { ft } from "../../utils/time";
import { trend, findLand } from "../../utils/entity";
import { findPlanEntryForEntityId } from "../../utils/matching";
import { getTemplate } from "../../data/templates";
import { TYPE_LBL } from "../../data/labels";
import { WaitBadge } from "../shared/WaitBadge";
import { StatusBadge } from "../shared/StatusBadge";
import { ShowtimePills } from "../shared/ShowtimePills";
import type { LiveEntity, ParkKey } from "../../types";

interface Props { entity: LiveEntity; parkKey: ParkKey; }

export function EntityCard({ entity, parkKey }: Props) {
  const isDone = completedEntityIds.value.has(entity.id);
  const waitTime = entity.queue?.STANDBY?.waitTime ?? null;
  const sr = entity.queue?.SINGLE_RIDER?.waitTime;
  const rt = entity.queue?.RETURN_TIME;
  const prt = entity.queue?.PAID_RETURN_TIME;
  const bg = entity.queue?.BOARDING_GROUP;

  const handleDone = () => {
    const template = getTemplate(activeTemplateId.value);
    let planEntryId = entity.id;
    if (template) {
      const pe = findPlanEntryForEntityId(entity.id, template);
      if (pe) planEntryId = pe.id;
    }
    markCompleted({
      entityId: entity.id,
      planEntryId,
      completedAt: new Date().toISOString(),
      park: activeParkKey.value,
      land: findLand(parkKey, entity.name) ?? undefined,
      gpsPosition: userPosition.value ? { lat: userPosition.value.lat, lon: userPosition.value.lon } : undefined,
    });
  };

  return (
    <div class={`ecard ${isDone ? "is-done" : ""}`}>
      <div class={`sbar ${sbc(entity.status)}`} />
      <div class="ecard-in">
        <div class="einfo">
          <div class="ename">{entity.name}</div>
          <div class="esub">
            <span class="etype">{TYPE_LBL[entity.entityType] || entity.entityType}</span>
            <span class="eupd">· Maj {ft(entity.lastUpdated)}</span>
          </div>
        </div>
        <div class="emeta">
          {entity.status === "OPERATING" ? (
            <>
              {waitTime != null && waitTime >= 0 && (
                <WaitBadge waitTime={waitTime} trendDir={trend(entity)} />
              )}
              {sr != null && <span class="bsm b-sr">SR {sr}min</span>}
              {rt?.state === "AVAILABLE" && rt.returnStart && (
                <span class="bsm b-ll">LL {ft(rt.returnStart)}</span>
              )}
              {prt?.state === "AVAILABLE" && prt.returnStart && (
                <span class="bsm b-ill">ILL {ft(prt.returnStart)}</span>
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
          {!isDone && entity.status === "OPERATING" && (
            <button class="done-btn" onClick={handleDone}>Fait !</button>
          )}
        </div>
      </div>
    </div>
  );
}
