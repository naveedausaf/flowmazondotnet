import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    parameters: {
      actions: { argTypesRegex: '^on.*' },
    },
  },

  tags: ['autodocs'],
};

export default preview;
