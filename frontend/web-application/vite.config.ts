/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

const dirname = import.meta.dirname

const ALIASES = {
  '@Auth': path.resolve(dirname, './src/Auth'),
  '@Layouts': path.resolve(dirname, './src/Layouts/'),
  '@Theme': path.resolve(dirname, './src/Theme'),
  '@Common': path.resolve(dirname, './src/Common'),
  '@Teams': path.resolve(dirname, './src/Teams'),
  '@Player': path.resolve(dirname, './src/Player'),
  '@Game': path.resolve(dirname, './src/Game'),
  '@Calendar': path.resolve(dirname, './src/Calendar'),
  '@Application': path.resolve(dirname, './src/Application'),
  '@Sdk': path.resolve(dirname, './src/sdk/generated'),
  '@Settings': path.resolve(dirname, './src/Settings'),
  '@Dashboard': path.resolve(dirname, './src/Dashboard'),
  '@Admin': path.resolve(dirname, './src/Admin'),
  '@AgeCategory': path.resolve(dirname, './src/AgeCategory'),
  '@Season': path.resolve(dirname, './src/Season'),
  '@Championship': path.resolve(dirname, './src/Championship'),
  '@Match': path.resolve(dirname, './src/Match'),
  '@Area': path.resolve(dirname, './src/Area'),
  '@': path.resolve(dirname, './src'),
  '@Config': path.resolve(dirname, './config'),
  '@I18n': path.resolve(dirname, './src/I18n'),
}

const storybookPlugins = await storybookTest({ configDir: path.join(dirname, '.storybook') })

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    fs: {
      allow: ['../'],
    },
  },
  optimizeDeps: {
    include: ['@repo/design-system', '@repo/form-factory'],
  },
  resolve: {
    alias: {
      ...ALIASES,
    },
  },
  test: {
    globals: true,
    reporters: ['default', 'html', 'json'],
    outputFile: './coverage/report.html',
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          setupFiles: ['./tests/setup.ts'],
          include: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
          exclude: ['**/node_modules/**', '**/dist/**', '**/src/sdk/**', '**/src/mocks/**', 'e2e/**'],
        },
      },
      {
        extends: true,
        plugins: storybookPlugins,
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['./.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
})
