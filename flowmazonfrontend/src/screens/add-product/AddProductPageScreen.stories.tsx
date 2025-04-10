import { faker } from '@faker-js/faker/locale/en';
import type { Meta, StoryObj } from '@storybook/react';

import AddProductPageScreen from './AddProductPageScreen';

const meta: Meta<typeof AddProductPageScreen> = {
  component: AddProductPageScreen,
};

export default meta;

type Story = StoryObj<typeof AddProductPageScreen>;

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
  args: primaryArgs,
};

export const ErrorNameMaxLength: Story = {
  args: {
    ...primaryArgs,
    hasError: {
      ...primaryArgs.hasError,
      name: true,
    },
    errors: {
      ...primaryArgs.errors,
      name: 'hello',
    },
  },
};

// export const ErrorNameIsRequired: Story = {};

// export const DescriptionIsRequired: Story = {};

// export const ErrorImageURLInvalidURL: Story = {};

// export const ErrorImageURLRequired: Story = {};

// export const ErrorPriceIsRequired: Story = {};

// export const ErrorPriceMustBeZeroOrGreater = {};

// export const ErrorPriceMustBeNumber = {};
