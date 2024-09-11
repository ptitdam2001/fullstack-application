import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import dts from 'vite-plugin-dts'

const ALIASES = {
  '@Components': path.resolve(__dirname, './src/components'),
  '@Contexts': path.resolve(__dirname, './src/contexts'),
  '@Hooks': path.resolve(__dirname, './src/hooks/'),
  '@Utils': path.resolve(__dirname, './src/utils/'),
}

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
  },
  esbuild: {
    // https://github.com/vitejs/vite/issues/8644#issuecomment-1159308803
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-macros', 'babel-plugin-styled-components'],
      },
    }),
    dts(),
  ],
  test: {
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
        'test{,s}/**',
        'test{,-*}.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}spec.{js,cjs,mjs,ts,tsx,jsx}',
        '**/{karma,rollup,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
        '**/.{eslint,mocha,prettier}rc.{js,cjs,yml}',
        /** To uncomment when we won't have component in index.tsx */
        // '**/index.{ts,tsx}',
        '**/*.stories.{ts,tsx}',
        '.storybook',
        './*.{ts,tsx}',
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
  },
  resolve: {
    alias: {
      ...ALIASES,
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src', 'index.ts'),
      formats: ['es', 'cjs'],
      name: 'dsu-react-common',
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
    target: 'esnext',
  },
})
