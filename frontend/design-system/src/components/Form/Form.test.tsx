import * as React from 'react'
import { describe, it, expect } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { Form, FormField } from './Form'
import { FormItem } from './FormItem'
import { FormLabel } from './FormLabel'
import { FormDescription } from './FormDescription'
import { FormMessage } from './FormMessage'

type Fields = { username: string }

function Wrapper({ children }: { children: React.ReactNode }) {
  const form = useForm<Fields>({ defaultValues: { username: '' } })
  return (
    <Form {...form}>
      <form>
        <FormField
          name="username"
          control={form.control}
          render={() => <FormItem>{children}</FormItem>}
        />
      </form>
    </Form>
  )
}

function WrapperWithError({ children }: { children: React.ReactNode }) {
  const form = useForm<Fields>({ defaultValues: { username: '' } })
  React.useEffect(() => {
    form.setError('username', { type: 'manual', message: 'Username is required' })
  }, [form])
  return (
    <Form {...form}>
      <form>
        <FormField
          name="username"
          control={form.control}
          render={() => <FormItem>{children}</FormItem>}
        />
      </form>
    </Form>
  )
}

describe('FormItem', () => {
  it('sets data-slot="form-item"', () => {
    const { container } = render(<Wrapper><span /></Wrapper>)
    expect(container.querySelector('[data-slot="form-item"]')).toBeInTheDocument()
  })

  it('forwards className', () => {
    const { container } = render(<Wrapper><FormItem className="custom"><span /></FormItem></Wrapper>)
    expect(container.querySelector('.custom')).toBeInTheDocument()
  })

  it('renders children', () => {
    const { getByText } = render(<Wrapper><span>inside</span></Wrapper>)
    expect(getByText('inside')).toBeInTheDocument()
  })
})

describe('FormLabel', () => {
  it('sets data-slot="form-label"', () => {
    const { container } = render(<Wrapper><FormLabel>Name</FormLabel></Wrapper>)
    expect(container.querySelector('[data-slot="form-label"]')).toBeInTheDocument()
  })

  it('renders label text', () => {
    const { getByText } = render(<Wrapper><FormLabel>Username</FormLabel></Wrapper>)
    expect(getByText('Username')).toBeInTheDocument()
  })

  it('sets data-error=true when field has error', async () => {
    const { container } = render(
      <WrapperWithError><FormLabel>Username</FormLabel></WrapperWithError>
    )
    await waitFor(() =>
      expect(container.querySelector('[data-slot="form-label"]')).toHaveAttribute('data-error', 'true')
    )
  })
})

describe('FormDescription', () => {
  it('sets data-slot="form-description"', () => {
    const { container } = render(<Wrapper><FormDescription>Hint</FormDescription></Wrapper>)
    expect(container.querySelector('[data-slot="form-description"]')).toBeInTheDocument()
  })

  it('renders description text', () => {
    const { getByText } = render(<Wrapper><FormDescription>Helper text</FormDescription></Wrapper>)
    expect(getByText('Helper text')).toBeInTheDocument()
  })

  it('id matches formDescriptionId pattern', () => {
    const { container } = render(<Wrapper><FormDescription>Hint</FormDescription></Wrapper>)
    const el = container.querySelector('[data-slot="form-description"]')
    expect(el?.id).toMatch(/-form-item-description$/)
  })
})

describe('FormMessage', () => {
  it('returns null when no error and no children', () => {
    const { container } = render(<Wrapper><FormMessage /></Wrapper>)
    expect(container.querySelector('[data-slot="form-message"]')).not.toBeInTheDocument()
  })

  it('renders children when no error', () => {
    const { getByText } = render(<Wrapper><FormMessage>Static hint</FormMessage></Wrapper>)
    expect(getByText('Static hint')).toBeInTheDocument()
  })

  it('sets data-slot="form-message"', () => {
    const { container } = render(<Wrapper><FormMessage>Text</FormMessage></Wrapper>)
    expect(container.querySelector('[data-slot="form-message"]')).toBeInTheDocument()
  })

  it('renders error message when field has error', async () => {
    const { getByText } = render(
      <WrapperWithError><FormMessage /></WrapperWithError>
    )
    await waitFor(() => expect(getByText('Username is required')).toBeInTheDocument())
  })

  it('id matches formMessageId pattern', () => {
    const { container } = render(<Wrapper><FormMessage>msg</FormMessage></Wrapper>)
    const el = container.querySelector('[data-slot="form-message"]')
    expect(el?.id).toMatch(/-form-item-message$/)
  })
})
