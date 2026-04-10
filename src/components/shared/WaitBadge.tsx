import { wc } from "../../utils/format";

interface WaitBadgeProps {
  waitTime: number;
  trendDir?: "up" | "down" | null;
}

export function WaitBadge({ waitTime, trendDir }: WaitBadgeProps) {
  const trendLabel = trendDir === "up" ? ", increasing" : trendDir === "down" ? ", decreasing" : "";
  return (
    <span class={`wb ${wc(waitTime)}`} aria-label={`Wait: ${waitTime} minutes${trendLabel}`}>
      <span aria-hidden="true">{waitTime} min</span>
      {trendDir === "up" && <span class="trend t-up" aria-hidden="true">▲</span>}
      {trendDir === "down" && <span class="trend t-dn" aria-hidden="true">▼</span>}
    </span>
  );
}
