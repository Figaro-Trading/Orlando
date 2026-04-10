import { signal } from "@preact/signals";
import type { ParkKey } from "../types";

export type AppView = "dashboard" | "park" | "planning" | "nextmove" | "settings";

export type EntityFilters = {
  ATTRACTION: boolean;
  SHOW: boolean;
  RESTAURANT: boolean;
};

export const currentView = signal<AppView>("dashboard");
export const activeParkKey = signal<ParkKey>("mk");
export const parkMode = signal<"auto" | ParkKey>("auto");
export const currentLand = signal<string | null>(null);
export const activeZone = signal<number | null>(null);
export const filters = signal<EntityFilters>({
  ATTRACTION: true,
  SHOW: true,
  RESTAURANT: false,
});
export const maxWaitThreshold = signal<number>(90);
export const maxPopularityThreshold = signal<number>(10);
export const themeMode = signal<"light" | "dark" | "auto">("dark");
export const activeTemplateId = signal<string>("");
