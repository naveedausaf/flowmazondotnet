import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TestCase } from './testdata';
import ServerError from './AlertDialog';

const meta: Meta<typeof ServerError> = {
  component: ServerError,
  args: {
    //automatically shows in Actions addon's panel
    //everytime this is invoked in the dialog (when
    //it is closed))
    resetErrorBoundary: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof ServerError>;

export const Primary: Story = {
  args: {
    ...TestCase,
  },
};
