import { describe, it, expect } from 'vitest'
import { useTestId } from './useTestId'

describe('useTestId', () => {
  it('should return an object with test IDs for given elements', () => {
    const prefix = 'my-component'
    const elements: string[] = ['button', 'input', 'label']

    const result = useTestId(prefix, elements)

    expect(result).toEqual({
      button: 'my-component.button',
      input: 'my-component.input',
      label: 'my-component.label',
    })
  })

  it('should handle a single element', () => {
    const prefix = 'form'
    const elements: string[] = ['submit']

    const result = useTestId(prefix, elements)

    expect(result).toEqual({
      submit: 'form.submit',
    })
  })

  it('should handle an empty array', () => {
    const prefix = 'empty'
    const elements: string[] = []

    const result = useTestId(prefix, elements)

    expect(result).toEqual({})
  })

  it('should handle elements with special characters', () => {
    const prefix = 'component'
    const elements: string[] = ['button-primary', 'input_email', 'label.name']

    const result = useTestId(prefix, elements)

    expect(result).toEqual({
      'button-primary': 'component.button-primary',
      input_email: 'component.input_email',
      'label.name': 'component.label.name',
    })
  })

  it('should handle numeric elements', () => {
    const prefix = 'item'
    const elements: string[] = ['1', '2', '3']

    const result = useTestId(prefix, elements)

    expect(result).toEqual({
      '1': 'item.1',
      '2': 'item.2',
      '3': 'item.3',
    })
  })

  it('should handle different prefixes', () => {
    const elements: string[] = ['button']

    const result1 = useTestId('prefix1', elements)
    const result2 = useTestId('prefix2', elements)

    expect(result1).toEqual({ button: 'prefix1.button' })
    expect(result2).toEqual({ button: 'prefix2.button' })
  })

  it('should preserve element order', () => {
    const prefix = 'ordered'
    const elements: string[] = ['first', 'second', 'third']

    const result = useTestId(prefix, elements)

    const keys = Object.keys(result)
    expect(keys).toEqual(['first', 'second', 'third'])
  })

  it('should handle duplicate elements by keeping the last one', () => {
    const prefix = 'duplicate'
    const elements: string[] = ['button', 'button']

    const result = useTestId(prefix, elements)

    // Object.fromEntries will keep the last value for duplicate keys
    expect(result).toEqual({
      button: 'duplicate.button',
    })
  })

  it('should work with generic string types', () => {
    type ButtonTypes = 'primary' | 'secondary' | 'danger'
    const prefix = 'button'
    const elements: ButtonTypes[] = ['primary', 'secondary', 'danger']

    const result = useTestId(prefix, elements)

    expect(result).toEqual({
      primary: 'button.primary',
      secondary: 'button.secondary',
      danger: 'button.danger',
    })
  })

  it('should return undefined if no prefix is provided', () => {
    const elements: string[] = ['button']
    const result = useTestId(undefined, elements)
    expect(result).toEqual({ button: undefined })
  })

  it('should return undefined if no elements are provided', () => {
    const prefix = 'component'
    const elements: string[] = []
    const result = useTestId(prefix, elements)
    expect(result).toEqual({})
  })
})
