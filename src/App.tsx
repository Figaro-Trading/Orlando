import { Component } from "preact";
import { Header } from "./components/layout/Header";
import { NavBar } from "./components/layout/NavBar";
import { ViewSwitch } from "./components/layout/ViewSwitch";
import "./styles/global.css";

class ErrorBoundary extends Component<{ children: preact.ComponentChildren }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string }) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div class="errmsg" role="alert">
          <div style="font-size:1.2rem;font-weight:700;margin-bottom:0.5rem;">Something went wrong</div>
          <div style="font-size:0.85rem;margin-bottom:1rem;">{this.state.error.message}</div>
          <button class="refresh-btn" onClick={() => this.setState({ error: null })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  return (
    <ErrorBoundary>
      <div id="app-root">
        <a href="#main-content" class="sr-only">Skip to content</a>
        <Header />
        <main id="main-content">
          <ViewSwitch />
        </main>
        <NavBar />
      </div>
    </ErrorBoundary>
  );
}
