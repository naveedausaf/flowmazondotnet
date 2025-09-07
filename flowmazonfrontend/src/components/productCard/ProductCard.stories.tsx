import type { Meta, StoryObj } from '@storybook/nextjs';
import { allModes } from '../../../.storybook/modes';

import ProductCard from './ProductCard';

/**
 * In designing this card I keep the following in mind:
 */
//  1. [Content within an <a> tag _should_indicate the link's destination](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#technical_summary:~:text=Content%20within%20each%20%3Ca%3E%20should%20indicate%20the%20link%27s%20destination.)

//  2. Permitted content in an <a> tag as as follows:

//  "Transparent, except that no descendant may be interactive content or an <a> element, and no descendant may have a specified tabindex attribute".

//   In this case, Transparent content is pretty much any HTML content

// 3.From [Inclusive Components Card component](https://inclusive-components.design/cards/):

//  Cards are often list items. This is certainly the case with Product cards shown on the Product List page.

//  4. An <li> permits any Flow content (from <li> documentation).
//  */
const meta = {
  component: ProductCard,
  decorators: [
    (Story) => (
      <div className='grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        <Story />
      </div>
    ),
  ],
  parameters: {
    chromatic: {
      modes: {
        ...allModes,
      },
    },
    viewport: { defaultViewport: 'xl' },
  },
} satisfies Meta<typeof ProductCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    product: {
      id: '1',
      name: 'Waterizer Water Bottle',
      description: 'Rubberised ultra-durable metal water bottle.',
      imageUrl:
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      imageWidth: 687,
      imageHeight: 687,
      price: 29.99,
      currencySymbol: '$',
      isNew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
};
