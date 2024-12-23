import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface ToolButtonProps {
  children: React.ReactNode;
  variant: 'primary' | 'secondary';
  color: 'ocean' | 'coral' | 'sage' | 'sunset' | 'lavender';
  to?: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: LucideIcon;
}

export function ToolButton({
  children,
  variant,
  color,
  to,
  onClick,
  disabled,
  icon: Icon
}: ToolButtonProps) {
  // Define color mappings
  const colorClasses = {
    ocean: {
      primary: 'bg-ocean-600 hover:bg-ocean-700 text-white',
      secondary: 'bg-white text-ocean-700 border-ocean-200 hover:bg-ocean-50'
    },
    coral: {
      primary: 'bg-coral-600 hover:bg-coral-700 text-white',
      secondary: 'bg-white text-coral-700 border-coral-200 hover:bg-coral-50'
    },
    sage: {
      primary: 'bg-sage-600 hover:bg-sage-700 text-white',
      secondary: 'bg-white text-sage-700 border-sage-200 hover:bg-sage-50'
    },
    sunset: {
      primary: 'bg-sunset-600 hover:bg-sunset-700 text-white',
      secondary: 'bg-white text-sunset-700 border-sunset-200 hover:bg-sunset-50'
    },
    lavender: {
      primary: 'bg-lavender-600 hover:bg-lavender-700 text-white',
      secondary: 'bg-white text-lavender-700 border-lavender-200 hover:bg-lavender-50'
    }
  };

  const baseClasses = clsx(
    'inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200',
    variant === 'secondary' && 'border',
    colorClasses[color][variant],
    disabled && 'opacity-50 cursor-not-allowed'
  );

  const content = (
    <>
      {Icon && <Icon className="h-4 w-4 mr-2" />}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {disabled && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
      )}
      {!disabled && content}
    </button>
  );
}