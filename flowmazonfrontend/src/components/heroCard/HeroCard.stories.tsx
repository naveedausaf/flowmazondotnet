import { Meta, StoryObj } from '@storybook/nextjs';
import HeroCard from './HeroCard';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof HeroCard> = {
  title: 'Components/HeroCard',
  component: HeroCard,
};
export default meta;
type Story = StoryObj<typeof HeroCard>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {},
};
