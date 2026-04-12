import type { DayTemplate, TemplateKey } from "../../types";

import { hs } from "./hs";
import { mk1 } from "./mk1";
import { mk2 } from "./mk2";
import { epcot } from "./epcot";
import { ioa } from "./ioa";
import { usf } from "./usf";
import { epic1 } from "./epic1";
import { epic2 } from "./epic2";
import { ak } from "./ak";

export const ALL_TEMPLATES: Record<TemplateKey, DayTemplate> = {
  hs,
  mk1,
  mk2,
  epcot,
  ioa,
  usf,
  epic1,
  epic2,
  ak,
};

export const TEMPLATE_KEYS: TemplateKey[] = [
  "hs", "mk1", "mk2", "epcot", "ioa", "usf", "epic1", "epic2", "ak",
];

export function getTemplate(id: string): DayTemplate | null {
  return ALL_TEMPLATES[id as TemplateKey] ?? null;
}
