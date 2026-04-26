// components/ErrorBoundary.js
import React, { Component } from 'react'

type Props = {
  children: React.ReactNode
}
type State = Readonly<{
  hasError: boolean
  error: Error | null
}>

export class ErrorBoundary extends Component<Props> {
  state: State

  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error }
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error('Error caught by boundary:', error, errorInfo)
    // You could log this to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h2 className="mb-2 font-semibold text-red-800">Something went wrong</h2>
          <p className="mb-3 text-sm text-red-600">{this.state.error?.message || 'An unexpected error occurred'}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
