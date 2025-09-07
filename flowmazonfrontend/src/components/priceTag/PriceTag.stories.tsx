// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/nextjs';

import PriceTag from './PriceTag';

const meta = {
  component: PriceTag,
} satisfies Meta<typeof PriceTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    price: 19.99,
    currencySymbol: '$',
  },
};
