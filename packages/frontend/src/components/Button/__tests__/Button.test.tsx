import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { Button } from '../Button';

describe('Button Component', () => {
  test('renders the button with children text', () => {
    render(<Button>Click me</Button>);

    // Check if the button renders the correct children text
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('applies the correct default className', () => {
    render(<Button>Click me</Button>);

    // Check if the button has the default class names
    const button = screen.getByText('Click me');
    expect(button).toHaveClass(
      'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
    );
  });

  test('applies additional className if passed', () => {
    render(<Button className="custom-class">Click me</Button>);

    // Check if the custom className is applied
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('custom-class');
  });

  test('calls the onClick function when clicked', () => {
    const handleClick = vi.fn(); // Use `vi.fn()` for mocking functions in Vitest
    render(<Button onClick={handleClick}>Click me</Button>);

    // Simulate a button click
    fireEvent.click(screen.getByText('Click me'));

    // Check if the onClick handler is called
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies specific classes for certain children', () => {
    render(<Button>Increment</Button>);

    // Check if the 'bg-purple-500' class is applied when the text is 'Increment'
    const button = screen.getByText('Increment');
    expect(button).toHaveClass('bg-purple-500');

    render(<Button>Hello Auckland Med Revue!</Button>);

    // Check if the 'cursor-not-allowed' class is applied for the specific text
    const disabledButton = screen.getByText('Hello Auckland Med Revue!');
    expect(disabledButton).toHaveClass('cursor-not-allowed');
  });
});
