import type { Meta, StoryObj } from '@storybook/react';

import AddProductScreen from './AddProductScreen';
import { fn } from '@storybook/test';
import { allModes } from '../../../.storybook/modes.js';

//import { ErrorCases } from '@/pageStories/add-product/index.stories';
//import { action } from '@storybook/addon-actions';

const meta: Meta<typeof AddProductScreen> = {
  component: AddProductScreen,
  args: {
    onBlur: fn(),
    onChange: fn(),
    onSubmit: fn(),
  },
  parameters: {
    // 👇 Set default viewport for all component stories
    viewport: { defaultViewport: 'xl' },
    chromatic: {
      modes: { ...allModes },
    },
  },
};

export default meta;

type Story = StoryObj<typeof AddProductScreen>;

const primaryArgs = {
  errors: {},
  values: {
    name: '',
    description: '',
    imageUrl: '',
    price: '',
  },
  hasError: {
    name: false,
    description: false,
    imageUrl: false,
    price: false,
  },
};

export const Primary: Story = {
  args: { ...primaryArgs },
};

// export const ErrorNameMaxLength: Story = {
//   args: {
//     ...primaryArgs,
//     values: {
//       ...primaryArgs.values,
//       //name: ErrorCases.name.NameMaxLength.InvalidValue,
//     },
//     hasError: {
//       ...primaryArgs.hasError,
//       name: true,
//     },
//     errors: {
//       ...primaryArgs.errors,
//       //name: ErrorCases.name.NameMaxLength.ErrorMessage,
//     },
//   },
// };

// export const ErrorNameIsRequired: Story = {};

// export const DescriptionIsRequired: Story = {};

// export const ErrorImageURLInvalidURL: Story = {};

// export const ErrorImageURLRequired: Story = {};

// export const ErrorPriceIsRequired: Story = {};

// export const ErrorPriceMustBeZeroOrGreater = {};

// export const ErrorPriceMustBeNumber = {};
