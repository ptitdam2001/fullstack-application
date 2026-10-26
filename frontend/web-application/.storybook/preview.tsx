import type { Preview } from '@storybook/react-vite'
import { QueryClientProvider } from '@tanstack/react-query'
import { mswLoader } from 'msw-storybook-addon/csf3'
import { setupWorker } from 'msw/browser'

import '../src/index.css'
import React from 'react'
import { reactQueryClient } from '../config/reactQueryClient'
import { ThemeProvider } from '@Theme/Provider/ThemeProvider'
import { Toast } from '@repo/design-system'
import { localStorageDecorator } from './decorators/localstorage'
import { intlDecorator } from './decorators/intl'
import { preloadDictionaries } from '@I18n/'

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
const setupMsw = async () => {
  const worker = setupWorker()
  await worker.start({ onUnhandledRequest: 'bypass' })
  return worker
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    screen: {
      fullScreen: true,
    },
  },

  decorators: [
    storyFn => (
      <QueryClientProvider client={reactQueryClient}>
        <ThemeProvider>
          <Toast.Provider>{storyFn()}</Toast.Provider>
        </ThemeProvider>
      </QueryClientProvider>
    ),
    intlDecorator,
    localStorageDecorator,
  ],

  // 👈 Add the MSW loader to all stories
  // preloadDictionaries: the i18n decorator then renders the first frame of a story without suspending
  loaders: [mswLoader(setupMsw), preloadDictionaries],

  tags: ['autodocs'],
}

export default preview
