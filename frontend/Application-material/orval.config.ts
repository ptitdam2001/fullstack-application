export default {
  'sdk': {
    input: {
      target: '../../backend/openapi.yml',
    },
    output: {
      client: 'react-query',
      target: './src/sdk/generated/sdk.ts',
      schemas: './src/sdk/generated/model',
      override: {
        mutator: {
          path: './config/axios-instance.ts',
          name: 'customAxiosInstance',
        },
      },
      // mock: {
      //   type: 'msw',
      //   delay: false,
      //   useExamples: false,
      // },
      mock: true,
      mode: 'split',
      allParamsOptional: true,
    }
  },
};
