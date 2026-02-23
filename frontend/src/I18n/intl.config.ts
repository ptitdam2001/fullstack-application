export const LOCALE_STORAGE_KEY = 'app-locale'

export type SupportedLocale = 'en' | 'fr'
export const SUPPORTED_LOCALES: SupportedLocale[] = ['en', 'fr']

export const DEFAULT_LOCALE: SupportedLocale = 'en'

export const LOCALE_NAMES: Record<SupportedLocale, { name: string; countryCode: string }> = {
  en: { name: 'English', countryCode: 'GB' },
  fr: { name: 'Français', countryCode: 'FR' },
}
