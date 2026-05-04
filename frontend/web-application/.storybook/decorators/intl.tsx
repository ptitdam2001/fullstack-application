import { Suspense } from 'react'
import type { Decorator } from '@storybook/react-vite'
import { IntlProvider } from '@I18n/'

export const intlDecorator: Decorator = Story => (
  <Suspense fallback={null}>
    <IntlProvider>
      <Story />
    </IntlProvider>
  </Suspense>
)
