import { useLocalStorage } from '@Common/hooks/useLocalstorage'
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, type SupportedLocale } from '../intl.config'
import { IntlProvider as ReactIntlProvider } from 'react-intl'
import { getDictionary } from './intl.helper'
import { use } from 'react'
import { reactQueryClient } from '@Config/reactQueryClient'
import { createContextWithWrite } from '@repo/design-system'

type IntlContextType = {
  locale: SupportedLocale
  localeMessages: Record<string, string>
}

type IntlAction =
  | { type: 'SET_LOCALE'; payload: SupportedLocale }
  | { type: 'SET_LOCALE_MESSAGES'; payload: Record<string, string> }
  | { type: 'INIT'; payload: { locale: SupportedLocale; messages: Record<string, string> } }

const intlReducer = (state: IntlContextType, action: IntlAction): IntlContextType => {
  switch (action.type) {
    case 'SET_LOCALE':
      return { ...state, locale: action.payload }
    case 'SET_LOCALE_MESSAGES':
      return { ...state, localeMessages: action.payload }
    case 'INIT':
      return { ...state, locale: action.payload.locale, localeMessages: action.payload.messages }
  }
}

const dictionaryQuery = (locale: SupportedLocale) => ({
  queryKey: ['i18n', 'messages', locale],
  queryFn: () => getDictionary(locale),
})

/** Loads the dictionary of a locale into the query cache: IntlProvider then renders it without suspending. */
const loadDictionary = (locale: SupportedLocale) => reactQueryClient.ensureQueryData(dictionaryQuery(locale))

const BaseIntlContext = createContextWithWrite<IntlContextType, IntlAction>('Intl', intlReducer)

const IntlStateProvider = ({ children }: { children: React.ReactNode }) => {
  const { locale, localeMessages } = BaseIntlContext.useValue()

  return (
    <ReactIntlProvider locale={locale} messages={localeMessages} defaultLocale={DEFAULT_LOCALE}>
      {children}
    </ReactIntlProvider>
  )
}

type IntlProviderProps = {
  children: React.ReactNode
}

const IntlProvider = ({ children }: IntlProviderProps) => {
  const [lsLocale] = useLocalStorage(LOCALE_STORAGE_KEY, DEFAULT_LOCALE)

  // ensureQueryData always returns a pending promise, even on a cache hit: read the cache first so that a loaded
  // dictionary never suspends the render
  const currentDictionary =
    reactQueryClient.getQueryData<Record<string, string>>(dictionaryQuery(lsLocale).queryKey) ??
    use(loadDictionary(lsLocale))

  return (
    <BaseIntlContext.Provider value={{ locale: lsLocale, localeMessages: currentDictionary }}>
      <IntlStateProvider>{children}</IntlStateProvider>
    </BaseIntlContext.Provider>
  )
}

// Hook to change the current locale
const useSetLocale = () => {
  const dispatch = BaseIntlContext.useDispatch()
  const [, setToStore] = useLocalStorage(LOCALE_STORAGE_KEY, DEFAULT_LOCALE)

  return async (locale: SupportedLocale) => {
    const loadedDictionary = await loadDictionary(locale)

    dispatch({ type: 'INIT', payload: { locale, messages: loadedDictionary } })

    setToStore(locale)
  }
}

const useLocale = () => {
  const { locale } = BaseIntlContext.useValue()
  return locale
}

// eslint-disable-next-line react-refresh/only-export-components
export { IntlProvider, useSetLocale, useLocale }
