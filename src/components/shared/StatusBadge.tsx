import { STATUS_LBL } from "../../data/labels";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const cls = status === "REFURBISHMENT" ? "b-refurb" : status === "DOWN" ? "b-down" : "b-closed";
  return <span class={`bsm ${cls}`}>{STATUS_LBL[status] || status}</span>;
}
