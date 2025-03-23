import React, { createContext, ProviderProps, useContext } from 'react'

const noProvider = Symbol('no provider')

type ContextWithReadReturn<T> = {
  Provider: ({ children, value }: ProviderProps<T>) => React.ReactElement
  useValue: () => T
}

/**
 * Factory function to create a React context with write capabilities
 *
 * @example
 * ```tsx
 * // Define your context type
 * type ThemeContextType = {
 *   isDark: boolean
 *   fontSize: number
 * }
 *
 * // Create the context
 * const ThemeContext = createContextWithRead<ThemeContextType>('Theme')
 *
 * // Use in your app
 * function App() {
 *   return (
 *     <ThemeContext.Provider value={{ isDark: false, fontSize: 16 }}>
 *       <MyComponents />
 *     </ThemeContext.Provider>
 *   )
 * }
 *
 * // Use in child components
 * function MyComponent() {
 *   const theme = ThemeContext.useValue()
 *
 *   return (
 *     <div style={{
 *       backgroundColor: theme.isDark ? 'black' : 'white',
 *       fontSize: theme.fontSize
 *     }}>
 *     </div>
 *   )
 * }
 * ```
 *
 * @param name - The name of the context, used for display names and error messages
 * @returns An object containing the Provider component and hooks for reading/writing the context
 */
export function createContextWithRead<T>(name: string): ContextWithReadReturn<T> {
  const context = createContext<T | typeof noProvider>(noProvider)
  context.displayName = `${name}Context`

  const useValue = () => {
    const value = useContext(context)

    if (value === noProvider) {
      throw new Error(`use${name}Value is used outside of its ${name}Provider`)
    }

    return value
  }

  const Provider = ({ children, value: defaultValue }: ProviderProps<T>) => (
    <context.Provider value={defaultValue}>{children}</context.Provider>
  )

  return {
    Provider,
    useValue,
  }
}
