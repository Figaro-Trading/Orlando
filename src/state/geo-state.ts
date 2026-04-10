import { signal } from "@preact/signals";

export type GpsPosition = {
  lat: number;
  lon: number;
  accuracy: number;
  timestamp: number;
};

export type GpsErrorInfo = {
  code: number;
  message: string;
};

export const userPosition = signal<GpsPosition | null>(null);
export const gpsAvailable = signal<boolean>(false);
export const gpsError = signal<GpsErrorInfo | null>(null);
export const gpsWatchId = signal<number | null>(null);
export const gpsPermissionState = signal<
  "prompt" | "granted" | "denied" | "unknown"
>("unknown");
