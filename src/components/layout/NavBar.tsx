import { currentView } from "../../state/app-state";
import type { AppView } from "../../state/app-state";

function NavItem({ view, icon, label }: { view: AppView; icon: string; label: string }) {
  return (
    <button
      class={`nav-item ${currentView.value === view ? "active" : ""}`}
      onClick={() => { currentView.value = view; }}
    >
      <span class="nav-icon">{icon}</span>
      {label}
    </button>
  );
}

export function NavBar() {
  return (
    <nav class="navbar">
      <NavItem view="dashboard" icon="📊" label="Accueil" />
      <NavItem view="park" icon="🏰" label="Parc" />
      <button
        class="nav-item next-btn"
        onClick={() => { currentView.value = "nextmove"; }}
      >
        Next?
      </button>
      <NavItem view="planning" icon="📅" label="Planning" />
      <NavItem view="settings" icon="⚙️" label="Réglages" />
    </nav>
  );
}
