import type { Meta, StoryObj } from '@storybook/nextjs';
import { getRouter } from '@storybook/nextjs/router.mock';
import { within, userEvent, expect } from '@storybook/test';
//THIS MUST BE A RELATIVE IMPORT, otherwise
//Storybook fails to update or hangs on refresh
// on stories in this file.
import { allModes } from '../../../.storybook/modes';
import { computeSizesValue } from '@/config/breakpoints';
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
  decorators: [
    (Story) => (
      <main className='m-auto min-h-screen max-w-7xl min-w-[300px] p-4'>
        <div className='grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          <Story />
        </div>
      </main>
    ),
  ],
  args: {
    product: {
      id: '1',
      name: 'Waterizer Water Bottle',
      description: 'Rubberised ultra-durable metal water bottle.',
      imageUrl:
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      imageWidth: 687,
      imageHeight: 687,
      imagePlaceholderDataUrl:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      price: 29.99,
      currencySymbol: '$',
      isNew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    sizes: computeSizesValue({ sm: '50vw', md: '33vw', lg: '25vw' }, '100vw'),
  },
};

export const LinkGoesToProductDetailsPage: Story = {
  decorators: Primary.decorators,
  args: Primary.args,
  beforeEach: () => {
    //It only seems reasonable to assume (with no documentation on this anywhere to be found) that the router mock would be create at least once per stories file if not once every story. This would give us per-story isolation by clearing a mock within getRouter() that we need to use as is done below.
    //Bear in mind that test-runner runs multiple files in parallel but within a single file, it runs stories sequentially.
    getRouter().push.mockClear();
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const productLink = canvas.getByRole('link', {
      name: args.product.name,
      description: new RegExp(
        `${args.product.description} \\${args.product.currencySymbol}${args.product.price.toString()}`,
        'i',
      ),
    });
    productLink.focus();
    await userEvent.keyboard('{enter}');

    await expect(getRouter().push).toHaveBeenCalledTimes(1);
    await expect(getRouter().push.mock.calls[0][0]).toBe(
      //TODO: This is duplicated in HeroCard.tsx also, we need a separate function for computing this URL
      `/products/${args.product.id}`,
    );
  },
};

//TODO Make linting rule for Next.js images and this should be caught by it:

// export const LowQualityImagePlaceholder: Story = {
//   args: {
//     ...Primary.args,
//   },
//   decorators: Primary.decorators,
//   play: /* async */ (/* { canvasElement } */) => {
//     throw new Error('Not implemented yet');
//   },
// };
