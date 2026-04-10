import { currentView } from "../../state/app-state";

export function NextMoveButton() {
  return (
    <button class="fab-next" onClick={() => { currentView.value = "nextmove"; }}>
      Que fait-on maintenant ?
    </button>
  );
}
