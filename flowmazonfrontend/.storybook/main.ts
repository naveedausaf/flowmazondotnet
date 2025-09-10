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
    //Since this addon must be declared after addon-actions or addon-essentials, I added addon-actions as well. But when I added that I started getting error to say this is already included in Storybook v9. So I removed that.
    //
    //@storybook/addon-interactions package is in v8 and I believe this too not longer required in storybook v9 and is bundled in and enabled by default. The Storybook Component testing page for version 8.1 mentions setting this up but if you switch to v9 documentation, there is no section on configuring this addon.
    // But there is the lingering issue that if a test fails, the badge still says PASS
    //
    //Given how flaky Storybook build is, if there are problems, remove this addon from here as well as from package.json.
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
