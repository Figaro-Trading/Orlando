interface ReasonBadgeProps {
  reason: string;
  status: "recommended" | "possible" | "not_recommended";
}

export function ReasonBadge({ reason, status }: ReasonBadgeProps) {
  const color =
    status === "recommended"
      ? "var(--low)"
      : status === "possible"
        ? "var(--mid)"
        : "var(--high)";

  return (
    <div class="rec-reason" style={`color:${color};font-size:0.78rem;margin-top:0.3rem;`}>
      {reason}
    </div>
  );
}
