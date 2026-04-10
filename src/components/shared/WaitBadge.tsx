import { wc } from "../../utils/format";

interface WaitBadgeProps {
  waitTime: number;
  trendDir?: "up" | "down" | null;
}

export function WaitBadge({ waitTime, trendDir }: WaitBadgeProps) {
  return (
    <span class={`wb ${wc(waitTime)}`}>
      {waitTime} min
      {trendDir === "up" && <span class="trend t-up">▲</span>}
      {trendDir === "down" && <span class="trend t-dn">▼</span>}
    </span>
  );
}
