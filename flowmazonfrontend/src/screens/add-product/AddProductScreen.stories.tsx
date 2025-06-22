import type { Meta, StoryObj } from '@storybook/nextjs';

import AddProductScreen from './AddProductScreen';
import { fn } from 'storybook/test';
import { allModes } from '../../../.storybook/modes.js';

import { ErrorCase, ErrorCases } from '@/pageStories/add-product/testdata';

const meta: Meta<typeof AddProductScreen> = {
  component: AddProductScreen,
  args: { onBlur: fn(), onChange: fn(), onSubmit: fn() },
  parameters: {
    // 👇 Set default viewport for all component stories
    viewport: { defaultViewport: 'xl' },
    chromatic: { modes: { ...allModes } },
  },
};

export default meta;

type Story = StoryObj<typeof AddProductScreen>;

const primaryArgs = {
  errors: { name: '', description: '', imageUrl: '', price: '' },
  required: { name: true, description: true, imageUrl: true, price: true },
  values: { name: '', description: '', imageUrl: '', price: '' },
  hasError: { name: false, description: false, imageUrl: false, price: false },
  ids: {
    name: 'name',
    description: 'description',
    imageUrl: 'imageUrl',
    price: 'price',
  },
};

export const Primary: Story = { args: { ...primaryArgs } };

function makeArgs<TInput>(arg: string, errorCase: ErrorCase<TInput>) {
  return {
    ...primaryArgs, //redundant to do this
    values: { ...primaryArgs.values, [arg]: errorCase.InvalidValue },
    hasError: { ...primaryArgs.hasError, [arg]: true },
    errors: { ...primaryArgs.errors, [arg]: errorCase.ErrorMessage },
  };
}

export const ErrorNameIsRequired: Story = {
  args: makeArgs('name', ErrorCases.name.NameRequired),
};

export const ErrorDescriptionMaxLength: Story = {
  args: makeArgs('description', ErrorCases.description.DescriptionMaxLength),
};

export const ErrorDescriptionIsRequried: Story = {
  args: makeArgs('description', ErrorCases.description.DescriptionRequired),
};

export const ErrorImageURLInvalidURL: Story = {
  args: makeArgs('imageUrl', ErrorCases.imageUrl.ImageUrlIsValidUrl),
};

export const ErrorImageURLRequired: Story = {
  args: makeArgs('imageUrl', ErrorCases.imageUrl.ImageUrlRequired),
};

export const ErrorImageUrlMaxLength: Story = {
  args: makeArgs('imageUrl', ErrorCases.imageUrl.ImageUrlMaxLength),
};

export const ErrorPriceIsRequired: Story = {
  args: makeArgs('price', ErrorCases.price.PriceRequired),
};

export const ErrorPriceBelowMin: Story = {
  args: makeArgs('price', ErrorCases.price.PriceBelowMin),
};

export const ErrorPriceAboveMax: Story = {
  args: makeArgs('price', ErrorCases.price.PriceAboveMax),
};

export const ErrorPriceNotMoney: Story = {
  args: makeArgs('price', ErrorCases.price.PriceNotMoney),
};

export const ErrorPriceNotNumeric: Story = {
  args: makeArgs('price', ErrorCases.price.PriceNotNumeric),
};
