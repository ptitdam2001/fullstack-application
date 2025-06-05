import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],

  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-docs"
  ],

  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },

  staticDirs: ['../public'],

  typescript: {
    reactDocgen: "react-docgen-typescript"
  }
};
export default config;