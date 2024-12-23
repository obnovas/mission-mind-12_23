import React from 'react';
import { DashboardCard } from '../DashboardCard';
import { LucideIcon } from 'lucide-react';

interface MetricsSectionProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description: string;
  color: 'ocean' | 'coral' | 'sage' | 'sunset';
  link?: string;
  tooltip: string;
  staggerIndex?: number;
}

export function MetricsSection({
  title,
  value,
  icon,
  description,
  color,
  link,
  tooltip,
  staggerIndex = 0
}: MetricsSectionProps) {
  return (
    <DashboardCard
      title={title}
      value={value}
      icon={icon}
      description={description}
      color={color}
      link={link}
      tooltip={tooltip}
      staggerIndex={staggerIndex}
    />
  );
}