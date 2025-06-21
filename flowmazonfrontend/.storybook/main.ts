import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-coverage',
    '@storybook/addon-docs'
  ],

  docs: {
    defaultName: 'Documentation'
  },

  framework: {
    name: '@storybook/nextjs',
    options: {},
  },

  staticDirs: ['..\\public'],

  core: {
    disableTelemetry: true, // 👈 Disables telemetry
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};
export default config;
