export function fp(p: { formatted?: string; amount?: number } | null | undefined): string {
  if (!p) return "";
  return p.formatted || (p.amount != null ? `$${(p.amount / 100).toFixed(0)}` : "");
}

export function wc(w: number): "low" | "mid" | "high" {
  return w <= 20 ? "low" : w <= 45 ? "mid" : "high";
}

export function sbc(s: string): string {
  if (s === "OPERATING") return "s-open";
  if (s === "DOWN") return "s-down";
  if (s === "REFURBISHMENT") return "s-refurb";
  return "s-closed";
}
