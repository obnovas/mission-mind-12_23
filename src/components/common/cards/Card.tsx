import React from 'react';
import { LucideIcon } from 'lucide-react';

type CardColor = 'ocean' | 'coral' | 'sage' | 'sunset' | 'lavender';

interface CardProps {
  title: string;
  icon?: LucideIcon;
  color?: CardColor;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export function Card({
  title,
  icon: Icon,
  color = 'ocean',
  children,
  className = '',
  headerAction,
}: CardProps) {
  const colorClasses = {
    ocean: 'bg-ocean-50 border-ocean-200 text-ocean-600',
    coral: 'bg-coral-50 border-coral-200 text-coral-600',
    sage: 'bg-sage-50 border-sage-200 text-sage-600',
    sunset: 'bg-sunset-50 border-sunset-200 text-sunset-600',
    lavender: 'bg-lavender-50 border-lavender-200 text-lavender-600',
  };

  return (
    <div className={`bg-white rounded-lg border border-neutral-200 overflow-hidden ${className}`}>
      <div className={`p-6 border-b border-neutral-200 ${colorClasses[color]}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {Icon && <Icon className="h-5 w-5" />}
            <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
          </div>
          {headerAction}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}