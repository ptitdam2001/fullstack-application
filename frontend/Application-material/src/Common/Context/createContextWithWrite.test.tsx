import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createContextWithWrite } from './createContextWithWrite'

describe('createContextWithWrite', () => {
  // Test with simple counter context
  type CounterState = { count: number }
  type CounterAction = { type: 'INCREMENT' } | { type: 'DECREMENT' }

  const counterReducer = (state: CounterState, action: CounterAction): CounterState => {
    switch (action.type) {
      case 'INCREMENT':
        return { count: state.count + 1 }
      case 'DECREMENT':
        return { count: state.count - 1 }
      default:
        return state
    }
  }

  const CounterContext = createContextWithWrite<CounterState, CounterAction>('Counter', counterReducer)

  const CounterProvider = ({ children }: { children: React.ReactNode }) => (
    <CounterContext.Provider value={{ count: 0 }}>{children}</CounterContext.Provider>
  )

  const CounterComponent = () => {
    const count = CounterContext.useValue()
    const dispatch = CounterContext.useDispatch()

    return (
      <div>
        <span data-testid="count">{count.count}</span>
        <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment</button>
        <button onClick={() => dispatch({ type: 'DECREMENT' })}>Decrement</button>
      </div>
    )
  }

  it('should provide initial value through context', () => {
    render(
      <CounterProvider>
        <CounterComponent />
      </CounterProvider>
    )

    expect(screen.getByTestId('count').textContent).toEqual('0')
  })

  it('should update value when actions are dispatched', () => {
    render(
      <CounterProvider>
        <CounterComponent />
      </CounterProvider>
    )

    const incrementButton = screen.getByText('Increment')
    const decrementButton = screen.getByText('Decrement')
    const countDisplay = screen.getByTestId('count')

    fireEvent.click(incrementButton)
    expect(countDisplay.textContent).toEqual('1')

    fireEvent.click(decrementButton)
    expect(countDisplay.textContent).toEqual('0')
  })

  it('should throw error when useValue is used outside provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<CounterComponent />)
    }).toThrow('useCounterValue is used outside of its CounterProvider')

    consoleError.mockRestore()
  })

  it('should throw error when useDispatch is used outside provider', () => {
    const TestComponent = () => {
      CounterContext.useDispatch()
      return null
    }

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useCounterDispatch is used outside of its CounterProvider')

    consoleError.mockRestore()
  })

  // Test with complex state
  type TodoState = {
    todos: Array<{ id: number; text: string; completed: boolean }>
  }
  type TodoAction =
    | { type: 'ADD_TODO'; payload: string }
    | { type: 'TOGGLE_TODO'; payload: number }
    | { type: 'REMOVE_TODO'; payload: number }

  const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
    switch (action.type) {
      case 'ADD_TODO':
        return {
          todos: [...state.todos, { id: Date.now(), text: action.payload, completed: false }],
        }
      case 'TOGGLE_TODO':
        return {
          todos: state.todos.map(todo => (todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo)),
        }
      case 'REMOVE_TODO':
        return {
          todos: state.todos.filter(todo => todo.id !== action.payload),
        }
      default:
        return state
    }
  }

  const TodoContext = createContextWithWrite<TodoState, TodoAction>('Todo', todoReducer)

  const TodoProvider = ({ children }: { children: React.ReactNode }) => (
    <TodoContext.Provider value={{ todos: [] }}>{children}</TodoContext.Provider>
  )

  const TodoComponent = () => {
    const { todos } = TodoContext.useValue()
    const dispatch = TodoContext.useDispatch()

    const addTodo = () => {
      dispatch({ type: 'ADD_TODO', payload: 'New Todo' })
    }

    return (
      <div>
        <button onClick={addTodo}>Add Todo</button>
        <ul data-testid="todo-list">
          {todos.map(todo => (
            <li key={todo.id} data-testid={`todo-${todo.id}`}>
              {todo.text}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  it('should handle complex state updates', () => {
    render(
      <TodoProvider>
        <TodoComponent />
      </TodoProvider>
    )

    const addButton = screen.getByText('Add Todo')
    const todoList = screen.getByTestId('todo-list')

    fireEvent.click(addButton)
    expect(todoList.children).toHaveLength(1)
    expect(screen.getByTestId('todo-list').textContent).toEqual('New Todo')
  })
})
