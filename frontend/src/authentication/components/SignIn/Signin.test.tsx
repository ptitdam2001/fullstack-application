import { screen, withGraphQLRenderer } from '@Testing'
import { BrowserRouter } from 'react-router-dom'
import { expect, describe, it } from 'vitest'
import { Signin } from './Signin'

describe('Signin', () => {
  const onConnectionDone = vi.fn()
  const renderComponent = withGraphQLRenderer(<Signin onConnectionDone={onConnectionDone} />, {
    wrapper: BrowserRouter,
  })

  it('must a Sign in form', () => {
    renderComponent()

    expect(screen.getByText(/Signin/i)).toBeInTheDocument()
  })
})
