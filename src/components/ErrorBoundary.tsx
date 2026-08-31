import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  /**
   * What to show on top of the fallback (e.g. "This page"). Defaults to
   * "Something". Lets a nested boundary (e.g. around a single route) give a
   * more specific message than the top-level app boundary.
   */
  label?: string;
  /**
   * Called after the fallback renders and the person clicks "Try again".
   * Use this to reset any state the caller owns (e.g. re-fetch, clear a
   * selection) in addition to the boundary's own reset.
   */
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches render-time errors anywhere in its subtree so a single bad
 * render (corrupted localStorage data, an unexpected null, a bug in a
 * rarely-hit branch) shows a recoverable message instead of a blank white
 * screen. Deliberately self-contained (no dependency on Card/Button or any
 * app context) so it keeps working even if the crash happened inside a
 * provider or a themed component.
 *
 * Two instances are used in this app: one at the very top (main.tsx, so it
 * also catches a crash inside a context provider) and one around the
 * routed page content only (RootLayout.tsx), so an error on a single page
 * doesn't take the navbar/footer down with it — the person can still
 * navigate away.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("Unhandled render error caught by ErrorBoundary:", error, info.componentStack);
  }

  private handleReset = () => {
    this.props.onReset?.();
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div
        role="alert"
        className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-6 py-16 text-center"
      >
        <AlertTriangle size={32} className="text-error-500" aria-hidden="true" />
        <div>
          <p className="text-base font-semibold text-ink">
            {this.props.label ?? "Something"} went wrong.
          </p>
          <p className="mt-1 max-w-sm text-sm text-ink-soft">
            An unexpected error occurred. You can try again, or reload the
            page if the problem continues.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 rounded border border-brand-500 bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            <RotateCcw size={14} aria-hidden="true" />
            Try again
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center rounded border border-border-strong px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surface"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
