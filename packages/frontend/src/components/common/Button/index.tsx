import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  className,
  type = 'button',
  children,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:opacity-80 transition-all ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
