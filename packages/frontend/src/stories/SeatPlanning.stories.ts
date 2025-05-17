import type { Meta, StoryObj } from '@storybook/react';
import { SeatPlanning } from '../components/SeatPlanning';

// Default export: metadata for the component
const meta = {
  title: 'MedRevue/SeatPlanning',
  component: SeatPlanning,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SeatPlanning>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
