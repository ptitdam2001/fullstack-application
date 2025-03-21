import { describe, it, expect } from 'vitest'
import { render, renderHook } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createContextWithRead } from './createContextWithRead'

describe('createContextWithRead', () => {
  // Define a test context type
  type TestContextType = {
    message: string
    count: number
  }

  it('should create a context with Provider and useValue hook', () => {
    const TestContext = createContextWithRead<TestContextType>('Test')

    // Verify Provider exists
    expect(TestContext.Provider).toBeDefined()
    // Verify useValue hook exists
    expect(TestContext.useValue).toBeDefined()
  })

  it('should provide context value to children', () => {
    const TestContext = createContextWithRead<TestContextType>('Test')
    const testValue = { message: 'Hello', count: 42 }

    const TestComponent = () => {
      const value = TestContext.useValue()
      return <div>{value.message}</div>
    }

    const { getByText } = render(
      <TestContext.Provider value={testValue}>
        <TestComponent />
      </TestContext.Provider>
    )

    expect(getByText('Hello')).toBeInTheDocument()
  })

  it('should throw error when useValue is called outside Provider', () => {
    const TestContext = createContextWithRead<TestContextType>('Test')

    expect(() => {
      renderHook(() => TestContext.useValue(), {
        wrapper: ({ children }) => children,
      })
    }).toThrow('useTestValue is used outside of its TestProvider')
  })

  it('should update context value when Provider value changes', () => {
    const TestContext = createContextWithRead<TestContextType>('Test')
    const initialValue = { message: 'Initial', count: 0 }
    const updatedValue = { message: 'Updated', count: 1 }

    const TestComponent = () => {
      const value = TestContext.useValue()
      return <div>{value.message}</div>
    }

    const { getByText, rerender } = render(
      <TestContext.Provider value={initialValue}>
        <TestComponent />
      </TestContext.Provider>
    )

    expect(getByText('Initial')).toBeInTheDocument()

    rerender(
      <TestContext.Provider value={updatedValue}>
        <TestComponent />
      </TestContext.Provider>
    )

    expect(getByText('Updated')).toBeInTheDocument()
  })

  it('should handle nested context providers', () => {
    const TestContext = createContextWithRead<TestContextType>('Test')
    const outerValue = { message: 'Outer', count: 1 }
    const innerValue = { message: 'Inner', count: 2 }

    const TestComponent = () => {
      const value = TestContext.useValue()
      return <div>{value.message}</div>
    }

    const { getByText } = render(
      <TestContext.Provider value={outerValue}>
        <TestContext.Provider value={innerValue}>
          <TestComponent />
        </TestContext.Provider>
      </TestContext.Provider>
    )

    expect(getByText('Inner')).toBeInTheDocument()
  })
})
