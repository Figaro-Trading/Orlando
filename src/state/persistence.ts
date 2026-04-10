import { effect } from "@preact/signals";
import { completionHistory, skippedIds } from "./user-progress";
import {
  currentView,
  activeParkKey,
  parkMode,
  currentLand,
  activeZone,
  filters,
  maxWaitThreshold,
  maxPopularityThreshold,
  themeMode,
  activeTemplateId,
} from "./app-state";
import type { AppView, EntityFilters } from "./app-state";
import { ALL_TEMPLATES } from "../data/templates";
import { todayOrlando } from "../utils/time";
import {
  liveData,
  schedData,
  entityLocations,
  liveTimestamps,
  schedTimestamps,
  locationTimestamps,
} from "./live-cache";
import { PARKS } from "../data/parks";
import type { CompletionEvent, ParkKey } from "../types";

// ── Hydration ────────────────────────────────────────────

export function hydrateFromStorage(): void {
  try {
    hydrateCompletionHistory();
    hydrateSkippedIds();
    hydrateAppState();
    hydrateLiveCache();
    purgeOldCompletions();
    resolveActiveTemplate();
  } catch (e) {
    console.warn("[persistence] hydrateFromStorage error:", e);
  }
}

function hydrateCompletionHistory(): void {
  const raw = localStorage.getItem("orl:completionHistory");
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw) as CompletionEvent[];
    if (Array.isArray(parsed)) {
      completionHistory.value = parsed.filter(
        (e) => e.planEntryId && e.completedAt,
      );
    }
  } catch {
    /* ignore */
  }
}

function hydrateSkippedIds(): void {
  const raw = localStorage.getItem("orl:skippedIds");
  if (!raw) return;
  try {
    const arr = JSON.parse(raw) as string[];
    if (Array.isArray(arr)) {
      skippedIds.value = new Set(arr);
    }
  } catch {
    /* ignore */
  }
}

function hydrateAppState(): void {
  const rawView = localStorage.getItem("orl:currentView");
  if (
    rawView &&
    ["dashboard", "park", "planning", "nextmove", "settings"].includes(rawView)
  ) {
    currentView.value = rawView as AppView;
  }

  const rawPark = localStorage.getItem("orl:activeParkKey");
  if (rawPark && rawPark in PARKS) {
    activeParkKey.value = rawPark as ParkKey;
  }

  const rawParkMode = localStorage.getItem("orl:parkMode");
  if (rawParkMode) {
    if (rawParkMode === "auto" || rawParkMode in PARKS) {
      parkMode.value = rawParkMode as "auto" | ParkKey;
    }
  }

  const rawLand = localStorage.getItem("orl:currentLand");
  if (rawLand && rawLand !== "null") {
    currentLand.value = rawLand;
  }

  const rawZone = localStorage.getItem("orl:activeZone");
  if (rawZone && rawZone !== "null") {
    const zone = parseInt(rawZone);
    if (!isNaN(zone)) activeZone.value = zone;
  }

  const rawFilters = localStorage.getItem("orl:filters");
  if (rawFilters) {
    try {
      const parsed = JSON.parse(rawFilters) as EntityFilters;
      if (
        parsed.ATTRACTION !== undefined &&
        parsed.SHOW !== undefined &&
        parsed.RESTAURANT !== undefined
      ) {
        filters.value = parsed;
      }
    } catch {
      /* ignore */
    }
  }

  const rawThreshold = localStorage.getItem("orl:maxWaitThreshold");
  if (rawThreshold) {
    const num = parseInt(rawThreshold);
    if (!isNaN(num) && num > 0 && num <= 300) {
      maxWaitThreshold.value = num;
    }
  }

  const rawPopThreshold = localStorage.getItem("orl:maxPopularityThreshold");
  if (rawPopThreshold) {
    const num = parseInt(rawPopThreshold);
    if (!isNaN(num) && num >= 1 && num <= 10) {
      maxPopularityThreshold.value = num;
    }
  }

  const rawTheme = localStorage.getItem("orl:themeMode");
  if (rawTheme && ["light", "dark", "auto"].includes(rawTheme)) {
    themeMode.value = rawTheme as "light" | "dark" | "auto";
  }
}

function hydrateLiveCache(): void {
  const pairs: [string, (v: string) => void][] = [
    ["orl:liveData", (v) => (liveData.value = JSON.parse(v))],
    ["orl:schedData", (v) => (schedData.value = JSON.parse(v))],
    ["orl:entityLocations", (v) => (entityLocations.value = JSON.parse(v))],
    ["orl:liveTimestamps", (v) => (liveTimestamps.value = JSON.parse(v))],
    ["orl:schedTimestamps", (v) => (schedTimestamps.value = JSON.parse(v))],
    [
      "orl:locationTimestamps",
      (v) => (locationTimestamps.value = JSON.parse(v)),
    ],
  ];
  for (const [key, setter] of pairs) {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        setter(raw);
      } catch {
        /* ignore */
      }
    }
  }
}

function purgeOldCompletions(): void {
  const today = todayOrlando();
  const current = completionHistory.value;
  const todayOnly = current.filter(
    (e) => e.completedAt.slice(0, 10) === today,
  );
  if (todayOnly.length < current.length) {
    completionHistory.value = todayOnly;
  }
}

function resolveActiveTemplate(): void {
  const pk = activeParkKey.value;
  if (ALL_TEMPLATES[pk]) {
    activeTemplateId.value = pk;
  }
}

// ── Persistence effects ──────────────────────────────────

export function startPersistence(): void {
  // App state
  effect(() => {
    safeWrite("orl:currentView", currentView.value);
    safeWrite("orl:activeParkKey", activeParkKey.value);
    safeWrite("orl:parkMode", parkMode.value);
    safeWrite("orl:currentLand", currentLand.value ?? "null");
    safeWrite(
      "orl:activeZone",
      activeZone.value === null ? "null" : String(activeZone.value),
    );
    safeWrite("orl:filters", JSON.stringify(filters.value));
    safeWrite("orl:maxWaitThreshold", String(maxWaitThreshold.value));
    safeWrite("orl:maxPopularityThreshold", String(maxPopularityThreshold.value));
    safeWrite("orl:themeMode", themeMode.value);
  });

  // Sync activeTemplateId when activeParkKey changes
  effect(() => {
    const pk = activeParkKey.value;
    if (ALL_TEMPLATES[pk]) {
      activeTemplateId.value = pk;
    }
  });

  // Theme application
  effect(() => {
    const mode = themeMode.value;
    const resolved = mode === "auto"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : mode;
    document.documentElement.setAttribute("data-theme", resolved);
  });

  // User progress
  effect(() => {
    safeWrite(
      "orl:completionHistory",
      JSON.stringify(completionHistory.value),
    );
    safeWrite(
      "orl:skippedIds",
      JSON.stringify(Array.from(skippedIds.value)),
    );
  });

  // Live cache (debounced 2s)
  let cacheTimer: ReturnType<typeof setTimeout> | null = null;
  effect(() => {
    const ld = liveData.value;
    const sd = schedData.value;
    const el = entityLocations.value;
    const lt = liveTimestamps.value;
    const st = schedTimestamps.value;
    const lot = locationTimestamps.value;
    if (cacheTimer) clearTimeout(cacheTimer);
    cacheTimer = setTimeout(() => {
      safeWrite("orl:liveData", JSON.stringify(ld));
      safeWrite("orl:schedData", JSON.stringify(sd));
      safeWrite("orl:entityLocations", JSON.stringify(el));
      safeWrite("orl:liveTimestamps", JSON.stringify(lt));
      safeWrite("orl:schedTimestamps", JSON.stringify(st));
      safeWrite("orl:locationTimestamps", JSON.stringify(lot));
    }, 2000);
  });
}

function safeWrite(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      console.warn(
        `[persistence] QuotaExceeded writing ${key}. Evicting cache.`,
      );
      try {
        localStorage.removeItem("orl:liveData");
        localStorage.removeItem("orl:schedData");
        localStorage.removeItem("orl:entityLocations");
        localStorage.setItem(key, value);
      } catch {
        console.error(
          `[persistence] Failed to write ${key} even after eviction.`,
        );
      }
    }
  }
}

export function clearAllStorage(): void {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith("orl:"));
  keys.forEach((k) => localStorage.removeItem(k));
}
