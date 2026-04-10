import type { DayTemplate } from "../../types";
import type { ParkKey } from "../../types";

import { mk } from "./mk";
import { hs } from "./hs";
import { epcot } from "./epcot";
import { ak } from "./ak";
import { usf } from "./usf";
import { ioa } from "./ioa";
import { epic } from "./epic";

export const ALL_TEMPLATES: Record<ParkKey, DayTemplate> = {
  mk,
  hs,
  epcot,
  ak,
  usf,
  ioa,
  epic,
};

export function getTemplate(id: string): DayTemplate | null {
  return ALL_TEMPLATES[id as ParkKey] ?? null;
}
