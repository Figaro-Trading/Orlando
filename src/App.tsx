import { Header } from "./components/layout/Header";
import { NavBar } from "./components/layout/NavBar";
import { ViewSwitch } from "./components/layout/ViewSwitch";
import "./styles/global.css";

export function App() {
  return (
    <div id="app-root">
      <Header />
      <main>
        <ViewSwitch />
      </main>
      <NavBar />
    </div>
  );
}
