import { Suspense, act } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { reactQueryClient } from '@Config/reactQueryClient'
import { IntlProvider, preloadDictionaries } from './intl.context'
import { getDictionary } from './intl.helper'

vi.mock('./intl.helper', () => ({ getDictionary: vi.fn() }))

const renderProvider = () =>
  render(
    <Suspense fallback={<p>loading</p>}>
      <IntlProvider>
        <p>content</p>
      </IntlProvider>
    </Suspense>
  )

describe('IntlProvider', () => {
  afterEach(() => reactQueryClient.clear())

  it('renders its children on the first render when the dictionary is already cached', () => {
    reactQueryClient.setQueryData(['i18n', 'messages', 'en'], { 'common.save': 'Save' })

    renderProvider()

    expect(screen.getByText('content')).toBeInTheDocument()
    expect(screen.queryByText('loading')).not.toBeInTheDocument()
  })

  it('suspends until the dictionary is loaded when it is not cached', async () => {
    let resolveDictionary: (dictionary: Record<string, string>) => void = () => {}
    vi.mocked(getDictionary).mockReturnValue(new Promise(resolve => (resolveDictionary = resolve)))

    // React only retries a render suspended inside an async act: a sync render (RTL default) never shows the content
    await act(async () => {
      renderProvider()
    })
    expect(screen.getByText('loading')).toBeInTheDocument()

    await act(async () => {
      resolveDictionary({ 'common.save': 'Save' })
    })

    expect(screen.getByText('content')).toBeInTheDocument()
  })
})

describe('preloadDictionaries', () => {
  afterEach(() => reactQueryClient.clear())

  it('caches the dictionary of every supported locale: IntlProvider then renders without suspending', async () => {
    vi.mocked(getDictionary).mockImplementation(async locale => ({ 'common.save': `save-${locale}` }))

    await preloadDictionaries()

    expect(reactQueryClient.getQueryData(['i18n', 'messages', 'en'])).toEqual({ 'common.save': 'save-en' })
    expect(reactQueryClient.getQueryData(['i18n', 'messages', 'fr'])).toEqual({ 'common.save': 'save-fr' })
    renderProvider()
    expect(screen.getByText('content')).toBeInTheDocument()
  })
})
