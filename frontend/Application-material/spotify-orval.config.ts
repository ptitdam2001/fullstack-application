export default {
  'sdk': {
    input: {
      target: 'https://developer.spotify.com/reference/web-api/open-api-schema.yaml',
    },
    output: {
      client: 'react-query',
      target: './src/spotify/generated/sdk.ts',
      schemas: './src/spotify/generated/model',
      override: {
        mutator: {
          path: './src/spotify/useSpotifyAxiosInstance.ts',
          name: 'useSpotifyAxiosInstance',
        },
      },
      mock: {
        type: 'msw',
        delay: false,
        useExamples: false,
      },
      allParamsOptional: true,
    }
  },
};
