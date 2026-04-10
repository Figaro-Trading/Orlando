import { signal } from "@preact/signals";

export type AppView = "dashboard" | "park" | "planning" | "nextmove" | "settings";

export type EntityFilters = {
  ATTRACTION: boolean;
  SHOW: boolean;
  RESTAURANT: boolean;
};

export const currentView = signal<AppView>("dashboard");
export const activeParkKey = signal<string>("mk");
export const currentLand = signal<string | null>(null);
export const activeZone = signal<number | null>(null);
export const filters = signal<EntityFilters>({
  ATTRACTION: true,
  SHOW: true,
  RESTAURANT: false,
});
export const maxWaitThreshold = signal<number>(90);
export const selectedJ4Option = signal<string | null>(null);
export const activeTemplateId = signal<string>("");