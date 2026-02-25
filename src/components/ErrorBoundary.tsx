import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-serif font-light">Something went wrong</h1>
            <p className="text-gray-400 text-sm">Please refresh the page to try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-white/70 border border-white/20 px-6 py-2 hover:border-white/50 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
