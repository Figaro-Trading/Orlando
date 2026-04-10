import { ft } from "../../utils/time";

interface ShowtimePillsProps {
  showtimes: Array<{ type: string; startTime: string | null; endTime: string | null }>;
}

export function ShowtimePills({ showtimes }: ShowtimePillsProps) {
  const upcoming = showtimes.filter((s) => {
    if (!s.startTime) return false;
    return new Date(s.startTime).getTime() >= Date.now() - 600000;
  });

  if (upcoming.length === 0) return null;

  return (
    <div class="stimes">
      {upcoming.slice(0, 4).map((s, idx) => (
        <span key={idx} class="bsm b-show">{ft(s.startTime)}</span>
      ))}
    </div>
  );
}
