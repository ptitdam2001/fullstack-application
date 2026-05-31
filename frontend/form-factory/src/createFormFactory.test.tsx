import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { z } from 'zod'
import { createFormFactory } from './createFormFactory'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const playersSchema = z.object({
  players: z.array(z.object({ name: z.string().min(1) })),
})

const loginFactory = createFormFactory({ schema: loginSchema })
const playersFactory = createFormFactory({ schema: playersSchema })

// ─── Field tests ─────────────────────────────────────────────────────────────

describe('createFormFactory — Field', () => {
  it('returns form, Field, and FieldArray from useForm()', () => {
    function Fixture() {
      const { form, Field, FieldArray } = loginFactory.useForm()
      return (
        <form>
          <span data-testid="has-form">{String(!!form)}</span>
          <span data-testid="has-field">{String(!!Field)}</span>
          <span data-testid="has-field-array">{String(!!FieldArray)}</span>
        </form>
      )
    }
    render(<Fixture />)
    expect(screen.getByTestId('has-form').textContent).toBe('true')
    expect(screen.getByTestId('has-field').textContent).toBe('true')
    expect(screen.getByTestId('has-field-array').textContent).toBe('true')
  })

  it('Field renders children with field and fieldState', () => {
    function Fixture() {
      const { form, Field } = loginFactory.useForm()
      return (
        <form>
          <Field name="email">
            {({ field, fieldState }) => (
              <>
                <input data-testid="input" {...field} />
                <span data-testid="invalid">{String(fieldState.invalid)}</span>
              </>
            )}
          </Field>
          <input type="hidden" ref={form.register('password').ref} />
        </form>
      )
    }
    render(<Fixture />)
    expect(screen.getByTestId('input')).toBeInTheDocument()
    expect(screen.getByTestId('invalid').textContent).toBe('false')
  })

  it('handleSubmit triggers with valid values', async () => {
    const onSubmit = vi.fn()
    function Fixture() {
      const { form, Field } = loginFactory.useForm()
      return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Field name="email">
            {({ field }) => <input data-testid="email" {...field} />}
          </Field>
          <Field name="password">
            {({ field }) => <input data-testid="password" type="password" {...field} />}
          </Field>
          <button type="submit">Submit</button>
        </form>
      )
    }
    render(<Fixture />)

    await userEvent.type(screen.getByTestId('email'), 'user@example.com')
    await userEvent.type(screen.getByTestId('password'), 'secret123')
    await userEvent.click(screen.getByRole('button'))

    expect(onSubmit).toHaveBeenCalledWith({ email: 'user@example.com', password: 'secret123' }, expect.anything())
  })

  it('formState.errors populated when Zod schema rejects data', async () => {
    function Fixture() {
      const { form, Field } = loginFactory.useForm({ mode: 'onSubmit' })
      return (
        <form onSubmit={form.handleSubmit(() => {})}>
          <Field name="email">
            {({ field, fieldState }) => (
              <>
                <input data-testid="email" {...field} />
                {fieldState.error && <span data-testid="email-error">{fieldState.error.message}</span>}
              </>
            )}
          </Field>
          <Field name="password">
            {({ field }) => <input data-testid="password" {...field} />}
          </Field>
          <button type="submit">Submit</button>
        </form>
      )
    }
    render(<Fixture />)

    await userEvent.type(screen.getByTestId('email'), 'not-an-email')
    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByTestId('email-error')).toBeInTheDocument()
  })

  it('Field shows error message from fieldState', async () => {
    function Fixture() {
      const { form, Field } = loginFactory.useForm({ mode: 'onSubmit' })
      return (
        <form onSubmit={form.handleSubmit(() => {})}>
          <Field name="password">
            {({ field, fieldState }) => (
              <>
                <input data-testid="password" {...field} />
                {fieldState.error && <span data-testid="pw-error">{fieldState.error.message}</span>}
              </>
            )}
          </Field>
          <Field name="email">
            {({ field }) => <input data-testid="email" {...field} />}
          </Field>
          <button type="submit">Submit</button>
        </form>
      )
    }
    render(<Fixture />)
    await userEvent.type(screen.getByTestId('email'), 'x@x.com')
    await userEvent.type(screen.getByTestId('password'), 'short')
    await userEvent.click(screen.getByRole('button'))

    expect(await screen.findByTestId('pw-error')).toBeInTheDocument()
  })

  it('Field has stable reference between re-renders', () => {
    const fieldRefs: unknown[] = []

    function Fixture() {
      const [count, setCount] = React.useState(0)
      const { Field } = loginFactory.useForm()
      fieldRefs.push(Field)
      return (
        <div>
          <button onClick={() => setCount((c) => c + 1)}>Re-render {count}</button>
        </div>
      )
    }
    render(<Fixture />)
    act(() => {
      screen.getByRole('button').click()
      screen.getByRole('button').click()
    })
    expect(fieldRefs.length).toBeGreaterThanOrEqual(2)
    expect(fieldRefs.every((ref) => ref === fieldRefs[0])).toBe(true)
  })

  it('two factories are independent and do not share state', async () => {
    const schemaA = z.object({ name: z.string().min(1) })
    const schemaB = z.object({ age: z.number().int().positive() })
    const factoryA = createFormFactory({ schema: schemaA })
    const factoryB = createFormFactory({ schema: schemaB })

    const submitA = vi.fn()
    const submitB = vi.fn()

    function FixtureA() {
      const { form, Field } = factoryA.useForm()
      return (
        <form data-testid="form-a" onSubmit={form.handleSubmit(submitA)}>
          <Field name="name">
            {({ field }) => <input data-testid="name" {...field} />}
          </Field>
          <button type="submit">Submit A</button>
        </form>
      )
    }

    function FixtureB() {
      const { form, Field } = factoryB.useForm()
      return (
        <form data-testid="form-b" onSubmit={form.handleSubmit(submitB)}>
          <Field name="age">
            {({ field }) => <input data-testid="age" type="number" {...field} valueAsNumber />}
          </Field>
          <button type="submit">Submit B</button>
        </form>
      )
    }

    render(
      <>
        <FixtureA />
        <FixtureB />
      </>,
    )

    await userEvent.type(screen.getByTestId('name'), 'Alice')
    await userEvent.click(screen.getAllByRole('button')[0])
    expect(submitA).toHaveBeenCalledWith({ name: 'Alice' }, expect.anything())
    expect(submitB).not.toHaveBeenCalled()
  })
})

// ─── FieldArray tests ─────────────────────────────────────────────────────────

describe('createFormFactory — FieldArray', () => {
  it('FieldArray renders children with fields, append, and remove', () => {
    function Fixture() {
      const { FieldArray } = playersFactory.useForm({ defaultValues: { players: [{ name: 'Alice' }] } })
      return (
        <FieldArray name="players">
          {({ fields, append, remove }) => (
            <>
              <span data-testid="count">{fields.length}</span>
              {fields.map((item, i) => (
                <button key={item.id} onClick={() => remove(i)}>remove {i}</button>
              ))}
              <button onClick={() => append({ name: '' })}>append</button>
            </>
          )}
        </FieldArray>
      )
    }
    render(<Fixture />)
    expect(screen.getByTestId('count').textContent).toBe('1')
    expect(screen.getByRole('button', { name: 'append' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'remove 0' })).toBeInTheDocument()
  })

  it('append adds an item and remove deletes one', async () => {
    function Fixture() {
      const { FieldArray } = playersFactory.useForm({ defaultValues: { players: [] } })
      return (
        <FieldArray name="players">
          {({ fields, append, remove }) => (
            <>
              <span data-testid="count">{fields.length}</span>
              {fields.map((item, i) => (
                <button key={item.id} data-testid={`remove-${i}`} onClick={() => remove(i)}>
                  remove {i}
                </button>
              ))}
              <button data-testid="append" onClick={() => append({ name: 'New' })}>
                append
              </button>
            </>
          )}
        </FieldArray>
      )
    }
    render(<Fixture />)

    expect(screen.getByTestId('count').textContent).toBe('0')
    await userEvent.click(screen.getByTestId('append'))
    expect(screen.getByTestId('count').textContent).toBe('1')
    await userEvent.click(screen.getByTestId('append'))
    expect(screen.getByTestId('count').textContent).toBe('2')
    await userEvent.click(screen.getByTestId('remove-0'))
    expect(screen.getByTestId('count').textContent).toBe('1')
  })

  it('each field item has a stable id', () => {
    const ids: string[] = []

    function Fixture() {
      const { FieldArray } = playersFactory.useForm({
        defaultValues: { players: [{ name: 'A' }, { name: 'B' }] },
      })
      return (
        <FieldArray name="players">
          {({ fields }) => {
            fields.forEach((f) => ids.push(f.id))
            return <span data-testid="count">{fields.length}</span>
          }}
        </FieldArray>
      )
    }
    render(<Fixture />)
    expect(screen.getByTestId('count').textContent).toBe('2')
    const firstRenderIds = [...ids]
    expect(firstRenderIds.every((id) => typeof id === 'string' && id.length > 0)).toBe(true)
  })

  it('FieldArray has stable reference between re-renders', () => {
    const arrayRefs: unknown[] = []

    function Fixture() {
      const [count, setCount] = React.useState(0)
      const { FieldArray } = playersFactory.useForm()
      arrayRefs.push(FieldArray)
      return <button onClick={() => setCount((c) => c + 1)}>Re-render {count}</button>
    }
    render(<Fixture />)
    act(() => {
      screen.getByRole('button').click()
      screen.getByRole('button').click()
    })
    expect(arrayRefs.length).toBeGreaterThanOrEqual(2)
    expect(arrayRefs.every((ref) => ref === arrayRefs[0])).toBe(true)
  })

  it('Field nested inside FieldArray with indexed name', async () => {
    function Fixture() {
      const { form, Field, FieldArray } = playersFactory.useForm({
        defaultValues: { players: [{ name: '' }] },
      })
      return (
        <form onSubmit={form.handleSubmit(() => {})}>
          <FieldArray name="players">
            {({ fields }) =>
              fields.map((item, i) => (
                <Field key={item.id} name={`players.${i}.name` as const}>
                  {({ field }) => <input data-testid={`player-${i}`} {...field} />}
                </Field>
              ))
            }
          </FieldArray>
        </form>
      )
    }
    render(<Fixture />)
    expect(screen.getByTestId('player-0')).toBeInTheDocument()
    await userEvent.type(screen.getByTestId('player-0'), 'Alice')
    expect((screen.getByTestId('player-0') as HTMLInputElement).value).toBe('Alice')
  })
})