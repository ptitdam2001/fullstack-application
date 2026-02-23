# i18n setup with react-intl

This project uses `react-intl` for internationalization, with support for English (en) and French (fr).

## Installation

If the package is not installed yet, run:

```bash
pnpm add react-intl
```

## Structure

```
src/I18n/
├── components
|   └── LanguageSwitcher.tsx  # Component to switch languages
├── locales/
│   ├── en.json    # English translations
│   └── fr.json    # French translations
├── providers/
|   └── IntlProvider.tsx      # React Intl provider with locale state

└── index.ts              # Configuration and exports
```

## Usage

### Using translations in your components

#### Method 1: `useIntl` hook

```tsx
import { useIntl } from '@I18n/'

function MyComponent() {
  const intl = useIntl()

  return (
    <div>
      <h1>{intl.formatMessage({ id: 'common.welcome' })}</h1>
      <p>{intl.formatMessage({ id: 'auth.login' })}</p>
    </div>
  )
}
```

#### Method 2: `FormattedMessage` component

```tsx
import { FormattedMessage } from '@I18n/'

function MyComponent() {
  return (
    <div>
      <h1>
        <FormattedMessage id="common.welcome" />
      </h1>
      <p>
        <FormattedMessage id="auth.login" />
      </p>
    </div>
  )
}
```

### Changing the language

```tsx
import { useLocale, useSetLocale } from '@I18n/'

function LanguageSelector() {
  const locale = useLocale()
  const setLocale = useSetLocale()

  return (
    <div>
      <button onClick={() => setLocale('en')}>English</button>
      <button onClick={() => setLocale('fr')}>Français</button>
    </div>
  )
}
```

### Using the `LanguageSwitcher` component

```tsx
import { LanguageSwitcher } from '@i18n/'

function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  )
}
```

## Adding new translations

1. Add keys to `locales/en.json` and `locales/fr.json`
2. Use the dot-separated hierarchical structure (e.g. `common.save`, `auth.login`)

Example:

```json
// locales/en.json
{
  "myFeature": {
    "title": "My Feature",
    "description": "This is my feature"
  }
}

// locales/fr.json
{
  "myFeature": {
    "title": "Ma fonctionnalité",
    "description": "Ceci est ma fonctionnalité"
  }
}
```

Then use:

```tsx
<FormattedMessage id="myFeature.title" />
```

## Advanced formatting

### Numbers

```tsx
import { FormattedNumber } from '@I18n/'
;<FormattedNumber value={1234.56} style="currency" currency="EUR" />
```

### Dates

```tsx
import { FormattedDate } from '@I18n/'
;<FormattedDate value={new Date()} year="numeric" month="long" day="numeric" />
```

### Messages with variables

```json
// locales/en.json
{
  "greeting": "Hello, {name}!"
}

// locales/fr.json
{
  "greeting": "Bonjour, {name} !"
}
```

```tsx
<FormattedMessage id="greeting" values={{ name: 'John' }} />
```

## Default language

The default language is English (`en`). The system uses:

1. The language saved in localStorage
2. The default language (`en`) if none is available

The selected language is automatically saved to localStorage and restored on the next visit.
