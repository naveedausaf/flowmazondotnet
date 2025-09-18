import { Meta, StoryObj } from '@storybook/nextjs';
import HeroCard from './HeroCard';
import { Primary as ProductCardPrimary } from '../productCard/ProductCard.stories';

//THIS MUST BE A RELATIVE IMPORT, otherwise
//Storybook fails to update or hangs on refresh
// on stories in this file.
import { allModes } from '../../../.storybook/modes';

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
  args: Primary.args,
  play: /* async */ (/* { canvasElement } */) => {
    //implement using same story in ProductCard.stories.tsx
    //if possible
    throw new Error('Not implemented yet');
  },
};

//TODO: Write custom ESLint rule to enforce that all Next.js Image components have a sizes prop and that any sizes prop anywhere should not be an empty string.
