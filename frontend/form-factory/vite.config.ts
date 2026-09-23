/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const dirname = import.meta.dirname

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
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
    ],
  },
})