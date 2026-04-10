interface CoupefileChipProps {
  label: string;
}

export function CoupefileChip({ label }: CoupefileChipProps) {
  return <span class="bsm b-ll">{label}</span>;
}
