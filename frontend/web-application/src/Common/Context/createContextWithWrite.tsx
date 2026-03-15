import React, { createContext, Dispatch, ProviderProps, useContext, useReducer } from 'react'

const noProvider = Symbol('no provider')

type ContextWithWriteReturn<T, A> = {
  Provider: ({ children, value }: ProviderProps<T>) => React.ReactElement
  useValue: () => T
  useDispatch: () => Dispatch<A>
}

/**
 * Factory function to create a React context with write capabilities using useReducer.
 * This follows the pattern used in the project's existing contexts and provides
 * a type-safe way to create contexts with both read and write access through actions.
 *
 * @example
 * ```tsx
 * // Define your context type and actions
 * type ThemeContextType = {
 *   isDark: boolean;
 *   fontSize: number;
 * }
 *
 * type ThemeAction =
 *   | { type: 'TOGGLE_THEME' }
 *   | { type: 'SET_FONT_SIZE'; payload: number }
 *
 * // Create reducer
 * function themeReducer(state: ThemeContextType, action: ThemeAction): ThemeContextType {
 *   switch (action.type) {
 *     case 'TOGGLE_THEME':
 *       return { ...state, isDark: !state.isDark }
 *     case 'SET_FONT_SIZE':
 *       return { ...state, fontSize: action.payload }
 *     default:
 *       return state
 *   }
 * }
 *
 * // Create the context
 * const ThemeContext = createContextWithWrite<ThemeContextType, ThemeAction>('Theme', themeReducer)
 *
 * // Use in your app
 * function App() {
 *   return (
 *     <ThemeContext.Provider value={{ isDark: false, fontSize: 16 }}>
 *       <YourComponents />
 *     </ThemeContext.Provider>
 *   )
 * }
 *
 * // Use in child components
 * function ChildComponent() {
 *   const theme = ThemeContext.useValue()
 *   const dispatch = ThemeContext.useDispatch()
 *
 *   const toggleTheme = () => {
 *     dispatch({ type: 'TOGGLE_THEME' })
 *   }
 *
 *   const increaseFontSize = () => {
 *     dispatch({ type: 'SET_FONT_SIZE', payload: theme.fontSize + 1 })
 *   }
 *
 *   return (
 *     <div style={{
 *       backgroundColor: theme.isDark ? 'black' : 'white',
 *       fontSize: theme.fontSize
 *     }}>
 *       <button onClick={toggleTheme}>Toggle Theme</button>
 *       <button onClick={increaseFontSize}>Increase Font Size</button>
 *     </div>
 *   )
 * }
 * ```
 *
 * @param name - The name of the context, used for display names and error messages
 * @param stateFunc - A reducer function that takes the current state and an action, and returns the new state
 * @returns An object containing:
 *   - Provider: A React component that provides the context value
 *   - useValue: A hook to read the context value
 *   - useDispatch: A hook to dispatch actions to update the context value
 */

function updateState<S, A>(state: S, action: A): S {
  if (typeof action === 'object') {
    return { ...state, ...action }
  }

  return action as unknown as S
}

const defaultReducer = <State, Action>(state: State, action: Action): State => updateState(state, action)

export function createContextWithWrite<T, A>(
  name: string,
  stateFunc: (state: T, action: A) => T = defaultReducer,
  WithProviderLogic: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  )

  // nestedChildren: (children: React.FC) => React.ReactNode = children => <>{children}</>
): ContextWithWriteReturn<T, A> {
  const context = createContext<T | typeof noProvider>(noProvider)
  context.displayName = `${name}Context`

  const dispatchContext = createContext<Dispatch<A> | typeof noProvider>(noProvider)
  dispatchContext.displayName = `${name}DispatchContext`

  const useValue = () => {
    const value = useContext(context)

    if (value === noProvider) {
      throw new Error(`use${name}Value is used outside of its ${name}Provider`)
    }

    return value
  }

  const useDispatch = () => {
    const value = useContext(dispatchContext)

    if (value === noProvider) {
      throw new Error(`use${name}Dispatch is used outside of its ${name}Provider`)
    }

    return value
  }

  const Provider = ({ children, value: defaultValue }: ProviderProps<T>) => {
    const [state, dispatch] = useReducer(stateFunc, defaultValue)

    return (
      <context.Provider value={state}>
        <dispatchContext.Provider value={dispatch}>
          <WithProviderLogic>{children}</WithProviderLogic>
        </dispatchContext.Provider>
      </context.Provider>
    )
  }

  return {
    Provider,
    useValue,
    useDispatch,
  }
}
