import reactConfig from '@repo/eslint-config/react'

export default [
  { ignores: ['public/mockServiceWorker.js', 'src/sdk/generated/**'] },
  ...reactConfig,
  {
    files: ['__mocks__/**'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
]
