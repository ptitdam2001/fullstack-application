import { act, renderHook } from '@testing-library/react'
import { useToggle } from './useToggle'

it('returns the value isOpen', () => {
  const { result } = renderHook(useToggle, { initialProps: true })

  expect(result.current.isOpen).toBeDefined()
  expect(result.current.isOpen).toBeTruthy()
})

it('has a toggle function to change with contrary', () => {
  const { result } = renderHook(useToggle, { initialProps: true })

  expect(result.current.isOpen).toBeTruthy()
  expect(result.current.toggleOpen).toBeTypeOf('function')
  expect(result.current.toggleOpen).toBeDefined()

  act(() => result.current.toggleOpen())

  expect(result.current.isOpen).toBeFalsy()
})

it('has a function setIsOpen to specify value', () => {
  const { result } = renderHook(useToggle, { initialProps: true })

  expect(result.current.isOpen).toBeTruthy()

  expect(result.current.setIsOpen).toBeDefined()
  expect(result.current.setIsOpen).toBeTypeOf('function')

  act(() => result.current.setIsOpen(false))

  expect(result.current.isOpen).toBeFalsy()
})
