import { currentView } from "../../state/app-state";
import { Dashboard } from "../dashboard/Dashboard";
import { ParkView } from "../park/ParkView";
import { PlanningView } from "../planning/PlanningView";
import { Settings } from "../settings/Settings";
import { NextMoveOverlay } from "../nextmove/NextMoveOverlay";

export function ViewSwitch() {
  const v = currentView.value;
  if (v === "dashboard") return <Dashboard />;
  if (v === "park") return <ParkView />;
  if (v === "planning") return <PlanningView />;
  if (v === "settings") return <Settings />;
  if (v === "nextmove") return <NextMoveOverlay />;
  return null;
}
