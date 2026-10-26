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

const restrictedImports = (modules, extraPaths = [], extraPatterns = []) => [
  'error',
  { paths: [...restrictedImportPaths, ...extraPaths], patterns: [...deepImportPatterns(modules), ...extraPatterns] },
]

// ui/ and pages/ reach the SDK only through the hooks of application/ (and the types of domain/).
// Tests, stories and page objects stay free to mock or import infrastructure/ at the network boundary.
const uiLayerFiles = root => [`${root}/ui/**`, `${root}/pages/**`]
const uiLayerIgnores = ['**/*.test.{ts,tsx}', '**/*.stories.tsx', '**/*.page.{ts,tsx}']
const infrastructureImportPatterns = [
  {
    regex: '(^|/)infrastructure(/|$)',
    message:
      'ui/ and pages/ do not import infrastructure/: go through a hook of application/, or move a pure helper to domain/.',
  },
]

// A mocked e2e spec takes `test` from e2e/fixtures/test.ts, which fails the test on an uncaught page error or a console warning.
const playwrightTestImportPaths = [
  {
    name: '@playwright/test',
    importNames: ['test'],
    message:
      "Import test and expect from './fixtures/test': its test fails on an uncaught page error or a console warning, which the final DOM never shows.",
  },
]

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
  {
    files: uiLayerFiles('src/*'),
    ignores: uiLayerIgnores,
    rules: {
      'no-restricted-imports': restrictedImports(barrelOnlyModules, [], infrastructureImportPatterns),
    },
  },
  // A module is free to reach its own internals; only the other modules' deep paths stay forbidden.
  // Its ui/ and pages/ keep the infrastructure ban, which the first block would otherwise drop.
  ...barrelOnlyModules.flatMap(module => {
    const otherModules = barrelOnlyModules.filter(other => other !== module)
    return [
      {
        files: [`src/${module}/**`],
        rules: { 'no-restricted-imports': restrictedImports(otherModules) },
      },
      {
        files: uiLayerFiles(`src/${module}`),
        ignores: uiLayerIgnores,
        rules: { 'no-restricted-imports': restrictedImports(otherModules, [], infrastructureImportPatterns) },
      },
    ]
  }),
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
  {
    files: ['e2e/*.spec.ts'],
    rules: {
      'no-restricted-imports': restrictedImports(barrelOnlyModules, playwrightTestImportPaths),
    },
  },
]
