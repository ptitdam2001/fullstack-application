import { SupportedLocale } from '../intl.config'
import { flatten } from 'flat'

type NestedMessages = Record<string, Record<string, string> | string>

/** Load messages for a locale dynamically (code-splitting). */
const loadMessages = (locale: SupportedLocale): Promise<NestedMessages> => {
  switch (locale) {
    case 'fr':
      return import('../locales/fr.json').then(m => m.default as NestedMessages)
    case 'en':
    default:
      return import('../locales/en.json').then(m => m.default as NestedMessages)
  }
}

export const getDictionary = async (currentLocale: SupportedLocale): Promise<Record<string, string>> =>
  flatten(await loadMessages(currentLocale))
