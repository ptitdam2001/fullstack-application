import reactConfig from '@repo/eslint-config/react'

// Modules whose barrel (src/<Module>/index.ts) is their only public API: another module imports
// from '@<Module>', never from '@<Module>/<layer>/...'.
const barrelOnlyModules = ['AgeCategory', 'User']

const deepImportPatterns = modules =>
  modules.map(module => ({
    group: [`@${module}/*`],
    message: `Import from the '@${module}' barrel (src/${module}/index.ts) instead of a deep path. Re-export what you need from the barrel.`,
  }))

// The application reaches react-aria only through the design system, which re-exports every primitive it needs.
const restrictedImportPaths = [
  {
    name: 'react-aria-components',
    message: "Import from '@repo/design-system' instead: the design system re-exports the react-aria primitives.",
  },
]

const restrictedImports = modules => ['error', { paths: restrictedImportPaths, patterns: deepImportPatterns(modules) }]

// Flat config replaces a rule's options instead of merging them: every `files` block below
// repeats these selectors before adding its own.
const formatMessageSelectors = [
  {
    selector:
      "CallExpression[callee.property.name='formatMessage'] > :matches(Literal, TemplateLiteral):first-child, CallExpression[callee.name='formatMessage'] > :matches(Literal, TemplateLiteral):first-child",
    message:
      "formatMessage takes a descriptor, { id: '...' }: a bare id passes tsc but throws 'An id must be provided to format a message' at render.",
  },
]

const cssClassAssertionSelectors = [
  {
    selector: "CallExpression[callee.property.name='toHaveClass'], MemberExpression[property.name='className']",
    message:
      'Do not assert on CSS classes: target the element by role, then by a semantic attribute (aria-*, data-*), then by data-testid.',
  },
]

const apiRouteInterceptSelectors = [
  {
    selector: "CallExpression[callee.object.name='page'][callee.property.name='route']",
    message:
      'page.route() never sees the API calls: the MSW service worker answers them first. Use mockMsw() / applyMswOverride() from e2e/mockMsw.ts.',
  },
]

export default [
  { ignores: ['public/mockServiceWorker.js', 'src/sdk/generated/**'] },
  ...reactConfig,
  {
    files: ['__mocks__/**'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictedImports(barrelOnlyModules),
      'no-restricted-syntax': ['error', ...formatMessageSelectors],
    },
  },
  // A module is free to reach its own internals; only the other modules' deep paths stay forbidden.
  ...barrelOnlyModules.map(module => ({
    files: [`src/${module}/**`],
    rules: {
      'no-restricted-imports': restrictedImports(barrelOnlyModules.filter(other => other !== module)),
    },
  })),
  {
    files: ['**/*.test.{ts,tsx}', '**/*.page.{ts,tsx}', '**/*.stories.tsx'],
    rules: {
      'no-restricted-syntax': ['error', ...formatMessageSelectors, ...cssClassAssertionSelectors],
    },
  },
  {
    files: ['e2e/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        ...formatMessageSelectors,
        ...cssClassAssertionSelectors,
        ...apiRouteInterceptSelectors,
      ],
    },
  },
]
