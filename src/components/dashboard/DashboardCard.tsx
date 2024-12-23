import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '../common/Tooltip';

interface DashboardCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description: string;
  color: 'ocean' | 'coral' | 'sage' | 'sunset';
  link?: string;
  tooltip: string;
  staggerIndex?: number;
}

export function DashboardCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  color, 
  link,
  tooltip,
  staggerIndex = 0
}: DashboardCardProps) {
  const navigate = useNavigate();
  
  const colorMap = {
    ocean: {
      bg: 'bg-ocean-50',
      border: 'border-ocean-200',
      icon: 'text-ocean-600',
      hover: 'hover:border-ocean-300',
    },
    coral: {
      bg: 'bg-coral-50',
      border: 'border-coral-200',
      icon: 'text-coral-600',
      hover: 'hover:border-coral-300',
    },
    sage: {
      bg: 'bg-sage-50',
      border: 'border-sage-200',
      icon: 'text-sage-600',
      hover: 'hover:border-sage-300',
    },
    sunset: {
      bg: 'bg-sunset-50',
      border: 'border-sunset-200',
      icon: 'text-sunset-600',
      hover: 'hover:border-sunset-300',
    },
  };

  const colors = colorMap[color];
  const cardClasses = `w-full rounded-lg border ${colors.border} ${colors.bg} ${colors.hover} transition-colors duration-200 p-8 ${link ? 'cursor-pointer' : ''} animate-scale stagger-${staggerIndex}`;

  const card = (
    <div 
      onClick={() => link && navigate(link)}
      className={cardClasses}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-medium text-neutral-700">{title}</h3>
        <Icon className={`w-4 h-4 ${colors.icon}`} />
      </div>
      <p className="text-5xl font-black text-neutral-900 mb-3 font-roboto tracking-tight">
        {value}
      </p>
      <p className="text-sm text-neutral-600">{description}</p>
    </div>
  );

  if (!tooltip) return card;

  return (
    <Tooltip 
      content={tooltip}
      delay={300}
      className="bg-white shadow-lg border border-neutral-200"
    >
      {card}
    </Tooltip>
  );
}