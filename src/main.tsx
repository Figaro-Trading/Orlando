import { render } from "preact";
import {
  hydrateFromStorage,
  startPersistence,
} from "./state/persistence";
import { refreshActivePark, startAutoRefresh } from "./services/refresh";
import { requestPermission, startWatching } from "./services/geolocation";

// 1. Hydrate signals from localStorage (synchronous)
hydrateFromStorage();

// 2. Start persistence effects
startPersistence();

// 3. Render app (shows cached data immediately)
import { App } from "./App";

render(<App />, document.getElementById("app")!);

// 4. Load active park data
refreshActivePark();

// 5. Start auto-refresh every 5 min
startAutoRefresh();

// 6. Start GPS (if not denied)
requestPermission().then((state) => {
  if (state !== "denied") startWatching();
});
