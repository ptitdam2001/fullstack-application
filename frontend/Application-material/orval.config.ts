import { faker } from '@faker-js/faker'

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
        operations: {
          countTeams: {
            mock: {
              data: faker.number.int({ min: 10, max: 250 }),

            },
          },
        },
        mock: {
          properties: {
            '/name/': () => faker.person.fullName(),
            '/color/': () => faker.color.rgb(),
          },
          delay: 500,
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
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
};
