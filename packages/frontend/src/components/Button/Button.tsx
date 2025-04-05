import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  className,
  type = 'button',
  children,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:opacity-80 transition-all',
        className,
        {
          'cursor-not-allowed hover:opacity-100':
            children === 'Hello Auckland Med Revue!',
          'bg-purple-500': children === 'Increment' || children === 'Decrement',
        },
      )}
    >
      {children}
    </button>
  );
};
