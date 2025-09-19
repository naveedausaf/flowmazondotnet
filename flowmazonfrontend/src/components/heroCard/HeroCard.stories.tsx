import { Meta, StoryObj } from '@storybook/nextjs';
import HeroCard from './HeroCard';
import { Primary as ProductCardPrimary } from '../productCard/ProductCard.stories';

//THIS MUST BE A RELATIVE IMPORT, otherwise
//Storybook fails to update or hangs on refresh
// on stories in this file.
import { allModes } from '../../../.storybook/modes';
import { getRouter } from '@storybook/nextjs/router.mock';
import { within, userEvent, expect } from '@storybook/test';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof HeroCard> = {
  title: 'Components/HeroCard',
  component: HeroCard,
  decorators: [
    (Story) => (
      <main className='m-auto min-h-screen max-w-7xl min-w-[300px] p-4'>
        <Story />
      </main>
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
};
export default meta;
type Story = StoryObj<typeof HeroCard>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    ...ProductCardPrimary.args,
  },
};

/**
 * The card should be rendered as a section element with aria label "Featured Product"
 */
export const Defaults: Story = {
  args: {
    ...ProductCardPrimary.args,
  },
  play: /* async */ (/* { canvasElement } */) => {
    throw new Error('Not implemented yet');
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
      name: new RegExp(`^${args.product.name}`, 'i'),
      description: new RegExp(args.product.description, 'i'),
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

//TODO: Write custom ESLint rule to enforce that all Next.js Image components have a sizes prop and that any sizes prop anywhere should not be an empty string.
