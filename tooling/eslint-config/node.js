import globals from 'globals'
import baseConfig from './base.js'

export default [
  ...baseConfig,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },
]
