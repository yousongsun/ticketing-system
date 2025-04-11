import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from '../components/Button';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'MedRevue/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    children: { control: 'text' },
    type: { control: 'radio', options: ['button', 'submit', 'reset'] },
    className: { control: 'text' },
    onClick: { action: 'clicked' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    onClick: fn(),
    children: 'Button',
    type: 'button',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary button story
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    className: 'bg-blue-500', // Custom class for styling
  },
};

// Secondary button story
export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    className: 'bg-gray-500', // Custom class for styling
  },
};

// Large button story
export const Large: Story = {
  args: {
    children: 'Large Button',
    className: 'text-xl py-4 px-8', // Large button with custom padding
  },
};

// Small button story
export const Small: Story = {
  args: {
    children: 'Small Button',
    className: 'text-sm py-1 px-2', // Small button with custom padding
  },
};

// Submit button story
export const Submit: Story = {
  args: {
    children: 'Submit Button',
    type: 'submit', // Submit type for form submissions
    className: 'bg-green-500',
  },
};

// Disabled button story
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    className: 'cursor-not-allowed opacity-50',
    onClick: undefined, // No action when clicked
  },
};
