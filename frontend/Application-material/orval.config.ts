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
          getTeamPlayers: {
            mock: {
              arrayMin: 10,
              arrayMax: 25,
            }
          },
          getTeam: {
            mock: {
              arrayMin: 10,
              arrayMax: 50,
            }
          }
        },
        mock: {
          properties: {
            name: () => faker.person.fullName(),
            '/jersey/': () => faker.number.int({ min: 0, max: 99 }),
            '/avatar/': () => faker.helpers.arrayElement([faker.image.personPortrait(), undefined]),

          },
          format: {
            color: () => faker.color.rgb(),
            score: () => faker.number.int({ min: 0, max: 60})
          },
          delay: 500,
          delayFunctionLazyExecute: true,
          arrayMin: 6,
          arrayMax: 25,
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
      prettier: true,
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
};
