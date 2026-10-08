import reactConfig from '@repo/eslint-config/react'

// Modules whose barrel (src/<Module>/index.ts) is their only public API: another module imports
// from '@<Module>', never from '@<Module>/<layer>/...'.
const barrelOnlyModules = ['AgeCategory', 'User']

const deepImportPatterns = modules =>
  modules.map(module => ({
    group: [`@${module}/*`],
    message: `Import from the '@${module}' barrel (src/${module}/index.ts) instead of a deep path. Re-export what you need from the barrel.`,
  }))

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
      'no-restricted-imports': ['error', { patterns: deepImportPatterns(barrelOnlyModules) }],
    },
  },
  // A module is free to reach its own internals; only the other modules' deep paths stay forbidden.
  ...barrelOnlyModules.map(module => ({
    files: [`src/${module}/**`],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: deepImportPatterns(barrelOnlyModules.filter(other => other !== module)) },
      ],
    },
  })),
]
