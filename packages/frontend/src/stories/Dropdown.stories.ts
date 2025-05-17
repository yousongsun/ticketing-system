import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Dropdown } from '../components/Dropdown/Dropdown';

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],

  args: {
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    placeholderText: 'Select an Option',
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  },
};

export const Secondary: Story = {
  args: {
    options: [
      { value: 'Option 1', label: 'Option 1' },
      { value: 'Option 2', label: 'Option 2' },
      { value: 'Option 3', label: 'Option 3' },
    ],
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.getByRole('button', {
      name: 'Select an Option',
    });
    await userEvent.click(button);

    const button1 = await canvas.getByRole('button', {
      name: 'Option 1',
    });
    await userEvent.click(button1);

    await expect(button).toHaveTextContent('Option 1');
  },
};
