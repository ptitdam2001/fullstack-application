
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:3000/schema.graphql",
  documents: "./src/**/*.graphql",
  generates: {
    "src/api/hooks.ts": {
      // preset: "client",
      plugins: [
        {
          add: {
            content: '/* eslint-disable */'
          }
        },
        'typescript',
        'typescript-operations',
        'typescript-react-query',
      ]
    }
  },
  config: {
    fetcher: 'graphql-request',
    namingConvention: {
      enumValues: 'keep',
    },
    reactQueryVersion: 5,
  }
};

export default config;
