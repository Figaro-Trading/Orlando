import { useSignal } from "@preact/signals";
import {
  currentView,
  activeParkKey,
  currentLand,
  maxWaitThreshold,
  activeTemplateId,
} from "../../state/app-state";
import {
  completedIds,
  completedEntityIds,
  skippedIds,
  markCompleted,
} from "../../state/user-progress";
import { liveEntityMap, entityLocations } from "../../state/live-cache";
import { userPosition, gpsAvailable } from "../../state/geo-state";
import { ALL_TEMPLATES } from "../../data/templates";
import { PARK_ALERTS } from "../../data/alerts";
import { computeNextMove } from "../../engine/next-move";
import {
  findNearbyExitCandidates,
  suggestExitCandidate,
} from "../../engine/nearby";
import { switchToHighAccuracy, switchToLowAccuracy } from "../../services/geolocation";
import type { NextMoveResult, PlanEntry, ParkKey } from "../../types";
import type { NearbyCandidate } from "../../engine/nearby";
import { ExitPicker } from "./ExitPicker";
import { BlockA } from "./BlockA";
import { BlockB } from "./BlockB";
import { BlockC } from "./BlockC";
import { BlockD } from "./BlockD";
import { useEffect } from "preact/hooks";

export function NextMoveOverlay() {
  const phase = useSignal<"exit-pick" | "results">("exit-pick");
  const selectedExitId = useSignal<string | null>(null);
  const result = useSignal<NextMoveResult | null>(null);
  const exitCandidates = useSignal<NearbyCandidate[]>([]);
  const suggestedExit = useSignal<NearbyCandidate | null>(null);

  const templateId = activeTemplateId.value as ParkKey;
  const template = templateId ? ALL_TEMPLATES[templateId] ?? null : null;

  // Switch to high accuracy GPS on mount
  useEffect(() => {
    switchToHighAccuracy();
    return () => switchToLowAccuracy();
  }, []);

  // Compute exit candidates when GPS is available
  useEffect(() => {
    if (!template || !userPosition.value) return;
    const pk = activeParkKey.value;
    const locs = entityLocations.value[pk];
    if (!locs?.length) return;

    const validLocs = locs
      .filter((l) => l.location && l.location.latitude != null && l.location.longitude != null)
      .map((l) => ({
        id: l.id,
        name: l.name,
        location: l.location as { latitude: number; longitude: number },
      }));

    const candidates = findNearbyExitCandidates(
      userPosition.value.lat,
      userPosition.value.lon,
      validLocs,
      template,
      completedIds.value,
    );
    exitCandidates.value = candidates;

    const suggested = suggestExitCandidate(candidates, completedIds.value);
    suggestedExit.value = suggested;
    if (suggested) selectedExitId.value = suggested.entityId;
  }, [userPosition.value?.lat, template]);

  const handleClose = () => {
    currentView.value = "dashboard";
  };

  const handleExitSelect = (id: string | null) => {
    selectedExitId.value = id;
  };

  const handleExitConfirm = () => {
    if (selectedExitId.value === null) return;

    // Mark completed if not "none"
    if (selectedExitId.value !== "none") {
      markCompleted({
        planEntryId: selectedExitId.value,
        entityId: selectedExitId.value,
        completedAt: new Date().toISOString(),
        park: activeParkKey.value,
        land: currentLand.value ?? undefined,
        gpsPosition: userPosition.value
          ? { lat: userPosition.value.lat, lon: userPosition.value.lon }
          : undefined,
      });
    }

    if (!template) return;

    // Build entity positions map
    const entityPositions = new Map<string, { lat: number; lon: number }>();
    const pk = activeParkKey.value;
    const locs = entityLocations.value[pk];
    if (locs) {
      for (const loc of locs) {
        if (loc.location?.latitude != null && loc.location?.longitude != null) {
          entityPositions.set(loc.id, {
            lat: loc.location.latitude,
            lon: loc.location.longitude,
          });
        }
      }
    }

    // Run engine
    result.value = computeNextMove({
      activeTemplate: template,
      completedIds: completedIds.value,
      completedEntityIds: completedEntityIds.value,
      skippedIds: skippedIds.value,
      userLat: userPosition.value?.lat ?? null,
      userLon: userPosition.value?.lon ?? null,
      maxWaitThreshold: maxWaitThreshold.value,
      alerts: PARK_ALERTS,
      parkClosingTime: null,
      manualLand: currentLand.value,
      entityPositions,
    });

    phase.value = "results";
  };

  // Edge case: no trip day or template
  if (!template) {
    return (
      <div class="overlay">
        <button class="overlay-close" aria-label="Close" onClick={handleClose}>
          ✕
        </button>
        <div style="padding:3rem 1rem;text-align:center;color:var(--muted);">
          No park day today
        </div>
      </div>
    );
  }

  // Get current zone entries for manual fallback
  const currentZoneEntries: PlanEntry[] = [];
  if (template.zones.length > 0) {
    for (const zone of template.zones) {
      for (const entry of zone.entries) {
        if (!completedIds.value.has(entry.id) && !skippedIds.value.has(entry.id)) {
          currentZoneEntries.push(entry);
        }
      }
    }
  }

  return (
    <div class="overlay">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <span style="font-size:1.1rem;font-weight:700;">What's next?</span>
        <button class="overlay-close" style="position:static;" aria-label="Close" onClick={handleClose}>
          ✕
        </button>
      </div>

      {phase.value === "exit-pick" ? (
        <ExitPicker
          candidates={exitCandidates.value}
          suggestedId={suggestedExit.value?.entityId ?? null}
          selectedId={selectedExitId.value}
          onSelect={handleExitSelect}
          onConfirm={handleExitConfirm}
          gpsAvailable={gpsAvailable.value}
          currentZoneEntries={currentZoneEntries}
        />
      ) : result.value ? (
        <>
          <div style="font-size:0.78rem;color:var(--muted);margin-bottom:0.75rem;">
            {result.value.reasoning.dayProgress}
            {result.value.reasoning.blockingFactors.length > 0 && (
              <div style="color:var(--high);margin-top:0.3rem;">
                {result.value.reasoning.blockingFactors.join(" · ")}
              </div>
            )}
          </div>

          {result.value.plannedNext && <BlockA item={result.value.plannedNext} />}
          {result.value.bestOverallChoice && <BlockB item={result.value.bestOverallChoice} />}
          {result.value.nearbyOptions.length > 0 && <BlockC items={result.value.nearbyOptions} />}
          {result.value.showSuggestion && <BlockD item={result.value.showSuggestion} />}

          {!result.value.plannedNext &&
            !result.value.bestOverallChoice &&
            result.value.nearbyOptions.length === 0 && (
              <div style="padding:2rem;text-align:center;color:var(--muted);">
                All done for today!
              </div>
            )}
        </>
      ) : (
        <div class="loading">
          <div class="spinner" />
          <div>Finding your next move...</div>
        </div>
      )}
    </div>
  );
}
