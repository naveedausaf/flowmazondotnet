import { Meta, StoryObj } from '@storybook/nextjs';
import ProductList from './ProductList';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof ProductList> = {
  title: 'Screens/ProductList',
  component: ProductList,
};
export default meta;
type Story = StoryObj<typeof ProductList>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {},
};

/**
 * There should be a Hero Product card that is a section with aria label "Featured Product"
 */
export const FeaturedProductExists: Story = {
  args: {
    ariaLabel: 'Featured Product',
  },
};
