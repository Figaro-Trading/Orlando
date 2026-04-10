import { currentView } from "../../state/app-state";
import type { AppView } from "../../state/app-state";

function NavItem({ view, icon, label }: { view: AppView; icon: string; label: string }) {
  const isActive = currentView.value === view;
  return (
    <button
      class={`nav-item ${isActive ? "active" : ""}`}
      aria-current={isActive ? "page" : undefined}
      onClick={() => { currentView.value = view; }}
    >
      <span class="nav-icon" aria-hidden="true">{icon}</span>
      {label}
    </button>
  );
}

export function NavBar() {
  return (
    <nav class="navbar" aria-label="Main navigation">
      <NavItem view="dashboard" icon="📊" label="Today" />
      <NavItem view="park" icon="🏰" label="Live" />
      <button
        class="nav-item next-btn"
        aria-label="Next move recommendation"
        onClick={() => { currentView.value = "nextmove"; }}
      >
        Next?
      </button>
      <NavItem view="planning" icon="📅" label="Plan" />
      <NavItem view="settings" icon="⚙️" label="Settings" />
    </nav>
  );
}
