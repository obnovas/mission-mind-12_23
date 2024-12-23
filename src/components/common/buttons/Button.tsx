import React from 'react';
import { LucideIcon } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  onClick,
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200';
  
  const variantClasses = {
    primary: 'bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-500',
    secondary: 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus:ring-accent-500',
    danger: 'bg-coral-600 text-white hover:bg-coral-700 focus:ring-coral-500',
    ghost: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
    ${variant !== 'ghost' ? 'shadow-sm' : ''}
    focus:outline-none focus:ring-2 focus:ring-offset-2
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-neutral-50 border-t-transparent mr-2" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="h-4 w-4 mr-2" />
      ) : null}
      {children}
      {Icon && iconPosition === 'right' && !loading && (
        <Icon className="h-4 w-4 ml-2" />
      )}
    </button>
  );
}