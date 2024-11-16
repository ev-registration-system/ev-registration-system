import { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset';
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  isLoading?: boolean;
  colour?: string;
  hover?: string;
}

// Button Component
const Button: React.FC<ButtonProps> = ({
  type = 'button',
  children,
  onClick,
  className = '',
  style = {},
  isLoading = false,
  colour = 'bg-primary',
  hover = 'bg-accent',
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${
        isLoading ? hover : colour
      } rounded-md w-full px-4 py-3 text-white hover:bg-accent transition-all duration-300 ${className}`}
      style={style}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

export default Button;