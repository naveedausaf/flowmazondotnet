import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-a11y',
    '@storybook/addon-coverage',
    '@storybook/addon-docs',

    //NOTE: I only added the two addons below because even if an interaction test failed, the Interaction panel still showed PASS badge. The tes itself still showed as failed in the panel.
    //
    //Since this addon must be declared after addon-actions or addon-essentials, I added addon-actions as well.
    //
    //But both of these addons are v8 and I believe are not longer required in storybook v9 and are bundled in and enabled by default. The Storybook Component testing page for version 8.1 mentions setting this up but if you switch to v9 documentation, there is no section on configuring this addon.
    // But there is the lingering issue that if a test fails, the badge still says PASS
    //
    //Given how flaky Storybook build is, if there are problems, remove these addons from here as well as from package.json.
    '@storybook/addon-actions',
    '@storybook/addon-interactions',
  ],
  docs: {
    defaultName: 'Documentation',
  },
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
  core: {
    disableTelemetry: true, // 👈 Disables telemetry
  },
};
export default config;
