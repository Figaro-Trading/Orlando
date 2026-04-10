interface SkipPassChipProps {
  label: string;
}

export function SkipPassChip({ label }: SkipPassChipProps) {
  return <span class="bsm b-ll">{label}</span>;
}
