// ──────────────���───────────────────────
// Plan Entry Types
// ──────────────────────────────────────

export type PlanEntryType =
  | "ride"
  | "show"
  | "meal"
  | "walk"
  | "explore"
  | "meet"
  | "experience"
  | "transport"
  | "logistics"
  | "alert";

export type PlanEntry = {
  id: string;
  time?: string;
  name: string;
  type: PlanEntryType;
  land?: string;
  duration?: number;

  rideType?: string;
  skipPass?: string;
  popularity?: number;
  estimatedWait?: number;
  rating?: number;
  score?: number;

  heightReq?: string;

  isNew: boolean;
  isReride: boolean;
  isMustSee: boolean;
  priority: 1 | 2 | 3;
  isOptional: boolean;
  isRopeDrop: boolean;

  notes?: string;
};

// ──────────────────────────────────────
// Template Types
// ───��──────────────────────────────────

export type TemplateZone = {
  number: number;
  label: string;
  entries: PlanEntry[];
};

export type DayTemplate = {
  id: string;
  label: string;
  park: string;
  parkAlt?: string;
  transitionTime?: string;
  openingHours: string;
  skipPass: string;
  zones: TemplateZone[];
  alerts: string[];
};

// ────────────────────────────────────
// User Progress Types
// ──────────────���───────────────────────

export type CompletionEvent = {
  entityId?: string;
  planEntryId: string;
  completedAt: string;
  park: string;
  land?: string;
  gpsPosition?: { lat: number; lon: number };
};

// ──────────────────────────────────────
// Reference Data Types
// ──────────────────��───────────────────

export type ParkAlert = {
  type: "closure" | "height" | "express" | "timing" | "rule" | "reliability";
  park: string;
  attraction?: string;
  message: string;
  severity: "critical" | "warning" | "info";
};

export type LLPurchase = {
  purchaseDate: string;
  purchaseTime: string;
  parkDate: string;
  park: string;
  product: string;
  type: "multi_pass" | "single_pass";
  cost: string;
  priority?: string;
};

export type MustSeeItem = {
  name: string;
  park: string;
  priority: "must-do" | "recommended";
  isPlanned: boolean;
  plannedDays: string[];
  suggestion?: string;
};

export type Reservation = {
  type: "flight" | "hotel" | "car" | "admin";
  provider: string;
  dates: string;
  details: string;
};

// ──────────────────────────────────────
// Engine Types (defined now, used later)
// ��─────────────────────────────────────

export type TimeFeasibility = {
  walkMinutes: number;
  waitMinutes?: number;
  minutesUntilStart?: number;
  arrivalSlackMinutes?: number;
  latestDepartureTime?: string;
  isReachable: boolean;
};

export type RecommendedItem = {
  entityId?: string;
  planEntryId?: string;
  name: string;
  park: string;
  land?: string;
  type: PlanEntryType;
  waitTime?: number;
  feasibility: TimeFeasibility;
  score: number;
  reason: string;
  status: "recommended" | "possible" | "not_recommended";
  isOnPlan: boolean;
  priority?: 1 | 2 | 3;
  skipPass?: string;
};

export type ReasoningSummary = {
  currentPark: string;
  currentLand?: string;
  currentZone?: number;
  currentTime: string;
  gpsPosition?: { lat: number; lon: number };
  skippedPlannedItemIds: string[];
  blockingFactors: string[];
  dayProgress: string;
};

export type NextMoveResult = {
  plannedNext: RecommendedItem | null;
  bestOverallChoice: RecommendedItem | null;
  nearbyOptions: RecommendedItem[];
  showSuggestion: RecommendedItem | null;
  reasoning: ReasoningSummary;
};

// ���─────────────────────────────────────
// Park & API Types
// ──���───────────���───────────────────────

export type ParkConfig = {
  id: string;
  name: string;
  short: string;
  center: { lat: number; lon: number };
};

export type ParkKey = "mk" | "epcot" | "hs" | "ak" | "usf" | "ioa" | "epic";

export type LandsMap = Record<string, string[]>;

// ─��────────────────────────────────────
// API Types (from https://api.themeparks.wiki/docs/v1/)
// ─��────────────────���───────────────────

export type ApiEntityType = "DESTINATION" | "PARK" | "ATTRACTION" | "RESTAURANT" | "HOTEL" | "SHOW";

export type EntityStatus = "OPERATING" | "DOWN" | "CLOSED" | "REFURBISHMENT";

export type QueueType = "STANDBY" | "SINGLE_RIDER" | "RETURN_TIME" | "PAID_RETURN_TIME" | "BOARDING_GROUP" | "PAID_STANDBY";

export type QueueReturnState = "AVAILABLE" | "TEMP_FULL" | "FINISHED";

export type BoardingAllocationStatus = "AVAILABLE" | "PAUSED" | "CLOSED";

export type ScheduleType = "OPERATING" | "TICKETED_EVENT" | "PRIVATE_EVENT" | "EXTRA_HOURS" | "INFO";

export type PriceData = {
  amount: number;
  currency: string;
  formatted?: string;
};

export type LiveEntity = {
  id: string;
  name: string;
  entityType: ApiEntityType;
  status: EntityStatus;
  lastUpdated: string;
  queue?: {
    STANDBY?: { waitTime: number | null };
    SINGLE_RIDER?: { waitTime: number | null };
    RETURN_TIME?: {
      state: QueueReturnState;
      returnStart: string | null;
      returnEnd: string | null;
    };
    PAID_RETURN_TIME?: {
      state: QueueReturnState;
      returnStart: string | null;
      returnEnd: string | null;
      price: PriceData;
    };
    BOARDING_GROUP?: {
      allocationStatus: BoardingAllocationStatus;
      currentGroupStart: number | null;
      currentGroupEnd: number | null;
      nextAllocationTime: string | null;
      estimatedWait: number | null;
    };
    PAID_STANDBY?: { waitTime: number | null };
  };
  showtimes?: Array<{ type: string; startTime: string | null; endTime: string | null }>;
  operatingHours?: Array<{ type: string; startTime: string | null; endTime: string | null }>;
  diningAvailability?: Array<{ partySize: number | null; waitTime: number | null }>;
  forecast?: Array<{ time: string; waitTime: number }>;
};

export type LiveResponse = {
  id: string;
  name: string;
  liveData: LiveEntity[];
};

export type ScheduleEntry = {
  date: string;
  type: ScheduleType;
  openingTime: string;
  closingTime: string;
  description?: string;
  purchases?: Array<{
    type?: "ADMISSION" | "PACKAGE" | "ATTRACTION" | null;
    id?: string;
    name?: string;
    price?: PriceData;
    available?: boolean;
  }>;
};

export type ScheduleResponse = {
  id: string;
  name: string;
  schedule: ScheduleEntry[];
};

export type EntityLocation = {
  id: string;
  name: string;
  entityType: ApiEntityType;
  externalId?: string;
  parentId?: string;
  location: { latitude: number | null; longitude: number | null } | null;
};
