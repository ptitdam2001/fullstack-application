/// <reference types="vitest/config" />
import path from 'node:path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

const dirname = import.meta.dirname

const storybookPlugins = await storybookTest({ configDir: path.join(dirname, '.storybook') })

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: [
      {
        find: /^use-sync-external-store(\/.*)?$/,
        replacement: resolve(dirname, 'src/stubs/use-sync-external-store.ts'),
      },
    ],
  },
  build: {
    lib: {
      entry: resolve(dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'tailwindcss'],
      output: {
        preserveModules: false,
      },
    },
    sourcemap: true,
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit test',
          environment: 'jsdom',
          globals: true,
          setupFiles: ['./tests/setup.ts'],
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['**/node_modules/**', '**/dist/**'],
        },
      },
      {
        extends: true,
        plugins: storybookPlugins,
        // react-stately's Virtualizer reads process.env.VIRT_ON when NODE_ENV is 'test'. Chromium has no
        // `process`: replace the flag in the pre-bundled dependencies, and keep the real virtualization since
        // the browser has a real layout. Not a top-level `define`: Vitest copies a `process.env.*` define
        // into the Node process, where it would also switch the virtualization on for the jsdom unit tests.
        optimizeDeps: { rolldownOptions: { transform: { define: { 'process.env.VIRT_ON': 'true' } } } },
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
          include: ['src/**/*.stories.{ts,tsx}'],
        },
      },
    ],
  },
})
