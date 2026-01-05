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
        <div className="border border-red-200 rounded-lg p-4 bg-red-50">
          <h2 className="text-red-800 font-semibold mb-2">Something went wrong</h2>
          <p className="text-red-600 text-sm mb-3">{this.state.error?.message || 'An unexpected error occurred'}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
