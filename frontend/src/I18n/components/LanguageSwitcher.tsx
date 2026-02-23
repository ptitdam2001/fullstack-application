import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useLocale, useSetLocale } from '../providers/intl.context'
import React from 'react'
import { Button } from '@/components/ui/button'
import { CheckIcon, GlobeIcon } from 'lucide-react'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import { LOCALE_NAMES, SUPPORTED_LOCALES, SupportedLocale } from '../intl.config'

export const LanguageSwitcher = () => {
  const locale = useLocale()
  const setLocale = useSetLocale()
  const [openPopover, setOpenPopover] = React.useState(false)

  const handleLanguageChange = (newLocale: SupportedLocale) => {
    setLocale(newLocale)
    setOpenPopover(false)
  }

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <span className="relative">
            <GlobeIcon />
            <span className="absolute bottom-1/4 right-1/2">
              {getUnicodeFlagIcon(LOCALE_NAMES[locale].countryCode)}
            </span>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40" sideOffset={5}>
        <ul className="list-none p-0 m-0" role="listbox">
          {SUPPORTED_LOCALES.map(loc => (
            <li
              key={`${loc}-${LOCALE_NAMES[loc].countryCode}`}
              className="flex items-center gap-2 cursor-pointer"
              role="button"
              onClick={() => handleLanguageChange(loc)}
              aria-selected={locale === loc}
              aria-labelledby={`${loc}-${LOCALE_NAMES[loc].countryCode}-label`}
            >
              <span id={`${loc}-${LOCALE_NAMES[loc].countryCode}-label`} className="flex-1">
                {getUnicodeFlagIcon(LOCALE_NAMES[loc].countryCode)} {LOCALE_NAMES[loc].name}
              </span>
              {locale === loc ? <CheckIcon /> : null}
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
