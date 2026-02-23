import { createContextWithWrite } from '@Common/Context/createContextWithWrite'

import { useLocalStorage } from '@Common/hooks/useLocalstorage'
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, SupportedLocale } from '../intl.config'
import { IntlProvider as ReactIntlProvider } from 'react-intl'
import { getDictionary } from './intl.helper'
import { Suspense, use } from 'react'
import { reactQueryClient } from '@Config/reactQueryClient'

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

  const dictionaryPromise = reactQueryClient.ensureQueryData({
    queryKey: ['i18n', 'messages', lsLocale],
    queryFn: () => getDictionary(lsLocale),
  })

  const currentDictionary = use(dictionaryPromise)

  return (
    <Suspense fallback={<div>Loading Locale Messages...</div>}>
      <BaseIntlContext.Provider value={{ locale: lsLocale, localeMessages: currentDictionary }}>
        <IntlStateProvider>{children}</IntlStateProvider>
      </BaseIntlContext.Provider>
    </Suspense>
  )
}

// Hook to change the current locale
const useSetLocale = () => {
  const dispatch = BaseIntlContext.useDispatch()
  const [, setToStore] = useLocalStorage(LOCALE_STORAGE_KEY, DEFAULT_LOCALE)

  return async (locale: SupportedLocale) => {
    const loadedDictionary = await reactQueryClient.ensureQueryData({
      queryKey: ['i18n', 'messages', locale],
      queryFn: () => getDictionary(locale),
    })

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
