import nodeConfig from '@repo/eslint-config/node'
import yml from 'eslint-plugin-yml'

export default [
  ...nodeConfig,
  {
    // Status codes of the responses blocks: one spelling ('404':), ascending order.
    // A script or a search that targets one spelling, or assumes the order, misses the rest.
    files: ['openapi.yml'],
    plugins: { yml },
    language: 'yml/yaml',
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "YAMLPair[key.value='responses'] > YAMLMapping > YAMLPair > YAMLScalar.key[style='plain'][raw=/^\\d/]",
          message: "Quote the status code: write '404':, not 404:.",
        },
      ],
      'yml/sort-keys': [
        'error',
        {
          pathPattern: '^paths\\[.+\\]\\.[a-z]+\\.responses$',
          order: { type: 'asc', natural: true },
        },
      ],
    },
  },
]
