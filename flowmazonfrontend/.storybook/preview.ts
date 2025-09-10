import type { Preview } from '@storybook/nextjs';
import '../src/styles/globals.css';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';
import { initialize, mswLoader } from 'msw-storybook-addon';
import React from 'react';

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize();

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        // 👇 Default options
        //dark: { name: 'Dark', value: '#333' },
        light: { name: 'Light', value: '#e3e6e6' },
      },
    },
    viewport: {
      viewports: {
        sm: {
          // based on aspect ratio of Pixel XL viewport in
          // Storybook default viewports
          name: 'sm (Tailwind default)',
          styles: {
            height: '1138px',
            width: '640px',
          },
          type: 'mobile',
        },
        md: {
          // based on aspect ratio of iPad viewport in
          // Storybook default viewports
          name: 'md (Tailwind default)',
          styles: {
            height: '1024px',
            width: '768px',
          },
          type: 'tablet',
        },
        lg: {
          // I would have based on aspect ratio of
          // iPad Pro 12.9 in viewport in Storybook defaults
          // BUT this is the max width of inner content
          // contaioner that I use on my pages.
          // THEREFORE to make comparison easier between this
          //and the render at next wider viewport, i.e. to
          // ensure that the width really has stopped growing,
          //I give this the same height as the next
          // wider viewport.
          name: 'lg (Tailwind default)',
          styles: {
            height: '1024px',
            width: '1024px',
          },
          type: 'desktop',
        },
        xl: {
          // many dsktop monitors have this size in px
          name: 'xl (Tailwind default)',
          styles: {
            height: '1024px',
            width: '1280px',
          },
          type: 'desktop',
        },
      },
    },

    docs: {
      codePanel: true,
    },
  },
  initialGlobals: {
    // 👇 Set the initial background color
    backgrounds: { value: 'light' },
  },
  tags: ['autodocs'],
  loaders: [mswLoader],
};

export default preview;
