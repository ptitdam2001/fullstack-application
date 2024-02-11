import { UserConfig, defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import macrosPlugin from 'vite-plugin-babel-macros'
import appPackageJson from './package.json'

const ALIASES = {
  '@Common': path.resolve(__dirname, './src/common'),
  '@Application': path.resolve(__dirname, './src/application'),
};

export const TEST_CONFIG = {
  globals: true,
  coverage: {
      enabled: false,
      reporter: ['html', 'text', 'clover', 'json'],
      provider: 'istanbul',
      extension: ['tsx', 'ts'],
      all: true,
      exclude: [
          'config/**',
          'coverage/**',
          'dist/**',
          'packages/*/test{,s}/**',
          '**/*.d.ts',
          'cypress/**',
          'test{,s}/**',
          'test{,-*}.{js,cjs,mjs,ts,tsx,jsx}',
          '**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}',
          '**/*{.,-}spec.{js,cjs,mjs,ts,tsx,jsx}',
          '**/*-in-memory-service.ts',
          '**/*-memory-service.ts',
          '**/__tests__/**',
          '**/{karma,rollup,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
          '**/.{eslint,mocha,prettier}rc.{js,cjs,yml}',
          /** To uncomment when we won't have component in index.tsx */
          // '**/index.{ts,tsx}',
          '**/*.stories.{ts,tsx}',
          '.storybook',
          './*.{ts,tsx}',
          '**/*.mock.ts',
          '**/testing/*.{ts,tsx}',
          '**/ui/testing/**',
      ],
      /** To define after increase coverage what level we want to cover */
      watermarks: {
          statements: [50, 80],
          functions: [50, 80],
          branches: [50, 80],
          lines: [50, 80],
      },
      reportsDirectory: './coverage/all',
  },
  environment: 'jsdom',
  setupFiles: ['./config/vitest/setup.ts'],
  globalSetup: ['./config/vitest/setup-global.ts'],
  include: ['./src/**/*.test.{ts,tsx}'],
  typecheck: {
      tsconfig: './tsconfig.json',
  },
  alias: ALIASES,
  testTimeout: 10000,
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), macrosPlugin()],
  test: TEST_CONFIG,
  server: {
    port: 3000,
    strictPort: true,
    proxy: appPackageJson.proxy,
  },
  resolve: {
    alias: {
        ...ALIASES,
    },
},
} as Partial<UserConfig>)
