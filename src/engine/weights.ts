export const SCORE_WEIGHTS = {
  wait: 1.0,
  walk: 2.0,

  offPlanPenalty: 15,
  lowPriorityPenalty: 8,
  tightSlackPenalty: 10,
  zoneCrossoverPenalty: 5,

  priorityBonus: { 1: 25, 2: 15, 3: 5 } as Record<1 | 2 | 3, number>,
  showUrgencyBonus: 10,
  rerideDiscount: -5,
  coupefileBonus: {
    "LL SP": 15,
    "LL T1": 10,
    "LL T2": 8,
    "LL MP": 8,
    Express: 12,
  } as Record<string, number>,
  closingSoonBonus: 8,

  minShowSlackMinutes: 5,
  nearbyRadiusMinutes: 5,
  maxWaitDefault: 90,
  showWindowMaxMinutes: 60,
  nearbyMaxResults: 5,
  closingSoonBonusMinutes: 45,
} as const;
