"use client"

import React from "react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("🚨 Error Boundary caught an error:", error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen liquid-gradient flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="glass-card rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Something went wrong</h1>
        <p className="text-white/80 mb-6 drop-shadow">{error?.message || "An unexpected error occurred"}</p>
        <div className="space-y-2">
          <Button onClick={resetError} className="glass-card hover:glow text-white border-white/30 w-full">
            Try Again
          </Button>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="glass-card text-white border-white/30 w-full"
          >
            Reload Page
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && error && (
          <details className="mt-4 text-left">
            <summary className="text-white/60 cursor-pointer">Error Details</summary>
            <pre className="mt-2 text-xs text-white/60 bg-black/20 p-2 rounded overflow-auto">{error.stack}</pre>
          </details>
        )}
      </div>
    </div>
  )
}
