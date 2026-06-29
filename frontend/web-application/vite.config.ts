/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

const ALIASES = {
  '@Auth': path.resolve(__dirname, './src/Auth'),
  '@Layouts': path.resolve(__dirname, './src/Layouts/'),
  '@Theme': path.resolve(__dirname, './src/Theme'),
  '@Common': path.resolve(__dirname, './src/Common'),
  '@Teams': path.resolve(__dirname, './src/Teams'),
  '@Player': path.resolve(__dirname, './src/Player'),
  '@Game': path.resolve(__dirname, './src/Game'),
  '@Calendar': path.resolve(__dirname, './src/Calendar'),
  '@Application': path.resolve(__dirname, './src/Application'),
  '@Sdk': path.resolve(__dirname, './src/sdk/generated'),
  '@Settings': path.resolve(__dirname, './src/Settings'),
  '@Dashboard': path.resolve(__dirname, './src/Dashboard'),
  '@Admin': path.resolve(__dirname, './src/Admin'),
  '@AgeCategory': path.resolve(__dirname, './src/AgeCategory'),
  '@': path.resolve(__dirname, './src'),
  '@Config': path.resolve(__dirname, './config'),
  '@I18n': path.resolve(__dirname, './src/I18n'),
}

const storybookPlugins = await storybookTest({ configDir: path.join(__dirname, '.storybook') })

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
