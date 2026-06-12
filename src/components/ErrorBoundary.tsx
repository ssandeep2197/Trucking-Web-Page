import { Component, type ReactNode } from "react";

type State = { error: Error | null };

export default class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  State
> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string }) {
    // eslint-disable-next-line no-console
    console.error("[App ErrorBoundary]", error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    if (this.props.fallback) return this.props.fallback;
    return (
      <div className="grid min-h-screen place-items-center bg-ink-950 p-6 text-cream-50">
        <div className="max-w-xl rounded-3xl border border-red-500/30 bg-red-500/[0.06] p-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-red-300">
            Runtime error
          </div>
          <h1 className="mt-1 font-display text-2xl font-semibold">
            Something broke while rendering
          </h1>
          <pre className="mt-4 max-h-64 overflow-auto rounded-xl bg-ink-900 p-3 font-mono text-xs text-red-200">
            {String(this.state.error?.stack || this.state.error?.message || this.state.error)}
          </pre>
          <div className="mt-4 flex gap-2">
            <button onClick={this.reset} className="btn-secondary !py-2 !px-4 text-sm">
              Try again
            </button>
            <a href="#/admin" className="btn-primary !py-2 !px-4 text-sm">
              Open admin
            </a>
          </div>
        </div>
      </div>
    );
  }
}
