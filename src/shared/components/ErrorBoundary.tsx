"use client";

import React, { Component, ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import type { Props, State } from "@/shared/types/types";

// Error boundary component to catch runtime errors in the component tree
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Updates state when an error is thrown
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // Logs error information
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // In production this would send to an error tracking service
    // like Sentry or LogRocket
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by boundary:", error, errorInfo);
    }
  }

  // Resets the error boundary state
  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-900/20 border border-red-800 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-red-400" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-center mb-4">
                <span className="bg-linear-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  Something went wrong
                </span>
              </h1>

              {/* Description */}
              <p className="text-gray-400 text-center mb-6">
                We're sorry, but something unexpected happened. Our team has
                been notified and we're working to fix the issue.
              </p>

              {/* Error Details (Development only) */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 mb-6 overflow-auto">
                  <p className="text-red-400 text-sm font-mono mb-2">
                    {this.state.error.name}: {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <pre className="text-xs text-gray-500 overflow-x-auto">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={this.handleReset}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </button>
                <Link
                  href="/"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold rounded-lg transition-all"
                >
                  <Home className="w-5 h-5" />
                  Go Home
                </Link>
              </div>

              {/* Support Info */}
              <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
                <p className="text-sm text-gray-500">
                  If the problem persists, please{" "}
                  <Link
                    href="/about"
                    className="text-amber-400 hover:text-amber-300 underline"
                  >
                    contact support
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
