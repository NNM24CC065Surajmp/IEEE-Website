import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    // Automatically reset when location changes (e.g. user navigates away or hits back)
    if (this.state.hasError && this.props.resetKey !== prevProps.resetKey) {
      this.setState({ hasError: false, error: null });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="pt-32 sm:pt-40 pb-24 max-w-lg mx-auto px-5 text-center">
          <div className="p-8 sm:p-10 rounded-2xl border border-red-500/20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-5 text-red-500">
              <AlertTriangle size={32} />
            </div>
            
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              Something went wrong
            </h2>
            
            <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed mb-6">
              We encountered an unexpected error while loading this page. You can try refreshing the view or return to the home page.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#00629B] hover:bg-[#00527f] text-white text-xs font-bold uppercase tracking-wider font-mono transition shadow-lg shadow-[#00629B]/25 cursor-pointer"
              >
                <RefreshCw size={14} />
                Try Again
              </button>

              <button
                type="button"
                onClick={() => {
                  this.handleReset();
                  if (this.props.onNavigateHome) {
                    this.props.onNavigateHome();
                  } else {
                    window.location.href = '/';
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-wider font-mono hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                <Home size={14} />
                Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
