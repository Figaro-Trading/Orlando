import { render } from "preact";
import {
  hydrateFromStorage,
  startPersistence,
} from "./state/persistence";
import { refreshActivePark, startAutoRefresh } from "./services/refresh";
import { requestPermission, startWatching } from "./services/geolocation";

import { App } from "./App";

try {
  // 1. Hydrate signals from localStorage (synchronous)
  hydrateFromStorage();

  // 2. Start persistence effects
  startPersistence();

  // 3. Render app (shows cached data immediately)
  const root = document.getElementById("app");
  if (root) {
    render(<App />, root);
  } else {
    console.error("Root element #app not found");
  }

  // 4. Load active park data
  refreshActivePark();

  // 5. Start auto-refresh every 5 min
  startAutoRefresh();

  // 6. Start GPS (if not denied)
  requestPermission()
    .then((state) => {
      if (state !== "denied") startWatching();
    })
    .catch((err) => console.warn("[gps] Permission check failed:", err));
} catch (err) {
  console.error("[init] Startup failed:", err);
}
