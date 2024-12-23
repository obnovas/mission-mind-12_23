import React from 'react';
import { CheckInType } from '../../../types';
import { Calendar, Lightbulb } from 'lucide-react';
import { Tooltip } from '../../common/Tooltip';

interface CheckInTypeIndicatorProps {
  type: CheckInType;
  showTooltip?: boolean;
  size?: number;
}

export function CheckInTypeIndicator({ type, showTooltip = true, size = 16 }: CheckInTypeIndicatorProps) {
  const Icon = type === 'planned' ? Calendar : Lightbulb;
  const tooltip = type === 'planned' ? 'Planned session' : 'Suggested session';
  const color = type === 'planned' ? 'text-accent-600' : 'text-neutral-500';
  
  const iconElement = <Icon className={color} style={{ width: size, height: size }} />;

  if (!showTooltip) {
    return iconElement;
  }

  return (
    <Tooltip content={tooltip}>
      {iconElement}
    </Tooltip>
  );
}