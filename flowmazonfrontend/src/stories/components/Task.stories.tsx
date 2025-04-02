import type { Meta, StoryObj } from "@storybook/react";

import { fn, userEvent, within, expect } from "@storybook/test";

import Task from "./Task";

export const ActionsData = {
  onArchiveTask: fn(),
  onPinTask: fn(),
};

const meta = {
  component: Task,
  title: "Task",
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
  args: {
    ...ActionsData,
  },
} satisfies Meta<typeof Task>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    task: {
      id: "1",
      title: "Test Task",
      state: "TASK_INBOX",
    },
  },
  play: async ({ canvasElement }) => {},
};

export const Pinned: Story = {
  args: {
    task: {
      ...Default.args.task,
      state: "TASK_PINNED",
    },
  },
};

export const Archived: Story = {
  args: {
    task: {
      ...Default.args.task,
      state: "TASK_ARCHIVED",
    },
  },
};
