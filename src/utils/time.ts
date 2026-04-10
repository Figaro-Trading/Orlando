import { TZ } from "../data/config";

export function ft(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  });
}

export function nowOrlando(): string {
  return new Date().toLocaleString("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function todayOrlando(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: TZ });
}

export function relTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "maintenant";
  if (m < 60) return `${m}min`;
  return `${Math.floor(m / 60)}h`;
}
