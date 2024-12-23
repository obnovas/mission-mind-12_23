import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SettingsCardProps {
  title: string;
  icon: LucideIcon;
  color: 'ocean' | 'coral' | 'sage' | 'sunset' | 'lavender' | 'mint' | 'berry' | 'honey';
  children: React.ReactNode;
}

export function SettingsCard({ 
  title, 
  icon: Icon, 
  color, 
  children,
}: SettingsCardProps) {
  const colorMap = {
    ocean: {
      bg: 'bg-ocean-50',
      border: 'border-l-ocean-500',
      icon: 'text-ocean-600',
    },
    coral: {
      bg: 'bg-coral-50',
      border: 'border-l-coral-500',
      icon: 'text-coral-600',
    },
    sage: {
      bg: 'bg-sage-50',
      border: 'border-l-sage-500',
      icon: 'text-sage-600',
    },
    sunset: {
      bg: 'bg-sunset-50',
      border: 'border-l-sunset-500',
      icon: 'text-sunset-600',
    },
    lavender: {
      bg: 'bg-lavender-50',
      border: 'border-l-lavender-500',
      icon: 'text-lavender-600',
    },
    mint: {
      bg: 'bg-mint-50',
      border: 'border-l-mint-500',
      icon: 'text-mint-600',
    },
    berry: {
      bg: 'bg-berry-50',
      border: 'border-l-berry-500',
      icon: 'text-berry-600',
    },
    honey: {
      bg: 'bg-honey-50',
      border: 'border-l-honey-500',
      icon: 'text-honey-600',
    },
  };

  const colors = colorMap[color];

  return (
    <div className="bg-white rounded-lg border border-neutral-200 border-l-4 overflow-hidden">
      <div className={`${colors.bg} p-6 border-b border-neutral-200`}>
        <div className="flex items-center space-x-2">
          <Icon className={`h-5 w-5 ${colors.icon}`} />
          <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
        </div>
      </div>
      <div className="p-6">
        {/* Remove nested card borders when inside a settings card */}
        <div className="[&>div>div]:border-0 [&>div>div]:shadow-none space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}