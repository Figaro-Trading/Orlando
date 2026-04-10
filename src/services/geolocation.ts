import {
  userPosition,
  gpsAvailable,
  gpsError,
  gpsWatchId,
  gpsPermissionState,
} from "../state/geo-state";
import type { GpsPosition, GpsErrorInfo } from "../state/geo-state";
import { currentLand, activeParkKey, parkMode } from "../state/app-state";
import { entityLocations } from "../state/live-cache";
import { haversineDistance, detectCurrentLand } from "../utils/geo";
import { findLand } from "../utils/entity";
import { PARKS, PARK_KEYS } from "../data/parks";
import type { ParkKey } from "../types";

const PARK_DETECTION_RADIUS = 2000; // 2km
const PARK_SWITCH_HYSTERESIS = 500; // 500m closer required to switch

const WATCH_OPTIONS_LOW: PositionOptions = {
  enableHighAccuracy: false,
  maximumAge: 30_000,
  timeout: 20_000,
};

const WATCH_OPTIONS_HIGH: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 5_000,
  timeout: 15_000,
};

let currentAccuracyMode: "low" | "high" = "low";
const MIN_MOVEMENT_THRESHOLD = 10;
const LAND_DETECTION_ACCURACY = 150;

export async function requestPermission(): Promise<
  "granted" | "denied" | "prompt"
> {
  if (navigator.permissions?.query) {
    try {
      const result = await navigator.permissions.query({
        name: "geolocation",
      });
      const state = result.state as "granted" | "denied" | "prompt";
      gpsPermissionState.value = state;
      result.addEventListener("change", () => {
        gpsPermissionState.value = result.state as
          | "granted"
          | "denied"
          | "prompt";
      });
      return state;
    } catch {
      return "prompt";
    }
  }
  return "prompt";
}

export function startWatching(): void {
  if (gpsWatchId.value !== null) return;
  if (!navigator.geolocation) {
    gpsError.value = { code: 2, message: "Geolocation not available" };
    return;
  }

  const opts =
    currentAccuracyMode === "high" ? WATCH_OPTIONS_HIGH : WATCH_OPTIONS_LOW;
  gpsWatchId.value = navigator.geolocation.watchPosition(
    onSuccess,
    onError,
    opts,
  );
}

export function switchToHighAccuracy(): void {
  if (currentAccuracyMode === "high") return;
  currentAccuracyMode = "high";
  stopWatching();
  startWatching();
}

export function switchToLowAccuracy(): void {
  if (currentAccuracyMode === "low") return;
  currentAccuracyMode = "low";
  stopWatching();
  startWatching();
}

export function stopWatching(): void {
  if (gpsWatchId.value !== null) {
    navigator.geolocation.clearWatch(gpsWatchId.value);
    gpsWatchId.value = null;
  }
}

function onSuccess(position: GeolocationPosition): void {
  const newPos: GpsPosition = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    accuracy: position.coords.accuracy,
    timestamp: position.timestamp,
  };

  // Noise filter
  const prev = userPosition.value;
  if (prev) {
    const dist = haversineDistance(prev.lat, prev.lon, newPos.lat, newPos.lon);
    // GPS glitch: 5km jump with worse accuracy
    if (dist > 5000 && newPos.accuracy > prev.accuracy) return;
    // No real movement
    if (dist < MIN_MOVEMENT_THRESHOLD && newPos.accuracy >= prev.accuracy)
      return;
  }

  userPosition.value = newPos;
  gpsAvailable.value = true;
  gpsError.value = null;
  gpsPermissionState.value = "granted";

  // Auto-detect park if in GPS mode
  if (parkMode.value === "auto") {
    let nearestPark: ParkKey | null = null;
    let nearestDist = Infinity;
    for (const k of PARK_KEYS) {
      const c = PARKS[k].center;
      const d = haversineDistance(newPos.lat, newPos.lon, c.lat, c.lon);
      if (d < nearestDist) {
        nearestDist = d;
        nearestPark = k;
      }
    }
    if (nearestPark && nearestDist < PARK_DETECTION_RADIUS) {
      const currentPark = activeParkKey.value as ParkKey;
      if (nearestPark !== currentPark) {
        const currentDist = haversineDistance(
          newPos.lat, newPos.lon,
          PARKS[currentPark].center.lat, PARKS[currentPark].center.lon,
        );
        if (currentDist - nearestDist > PARK_SWITCH_HYSTERESIS) {
          activeParkKey.value = nearestPark;
        }
      }
    }
  }

  // Auto-detect land if accuracy is good enough
  if (newPos.accuracy <= LAND_DETECTION_ACCURACY) {
    const pk = activeParkKey.value as ParkKey;
    const locations = entityLocations.value[pk];
    if (locations && locations.length > 0) {
      const withCoords = locations
        .filter(
          (loc) =>
            loc.location &&
            loc.location.latitude != null &&
            loc.location.longitude != null,
        )
        .map((loc) => ({
          id: loc.id,
          name: loc.name,
          location: loc.location as { latitude: number; longitude: number },
          land: findLand(pk, loc.name),
        }));
      const detectedLand = detectCurrentLand(
        newPos.lat,
        newPos.lon,
        withCoords,
      );
      if (detectedLand) currentLand.value = detectedLand;
    }
  }
}

function onError(error: GeolocationPositionError): void {
  const errorInfo: GpsErrorInfo = {
    code: error.code,
    message: error.message,
  };
  gpsError.value = errorInfo;

  if (error.code === 1) {
    gpsPermissionState.value = "denied";
    gpsAvailable.value = false;
    userPosition.value = null;
    stopWatching();
  }
}
