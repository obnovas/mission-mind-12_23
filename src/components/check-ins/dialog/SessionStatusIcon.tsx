import React from 'react';
import { CheckInStatus, CheckInType } from '../../../types';
import { Calendar, Lightbulb, Check, X } from 'lucide-react';
import { Tooltip } from '../../common/Tooltip';

interface SessionStatusIconProps {
  status: CheckInStatus;
  type: CheckInType;
  showTooltip?: boolean;
  size?: number;
}

export function SessionStatusIcon({ status, type, showTooltip = true, size = 16 }: SessionStatusIconProps) {
  const getStatusConfig = () => {
    // For scheduled status, use type-specific icon
    if (status === 'Scheduled') {
      return {
        icon: type === 'planned' ? Calendar : Lightbulb,
        color: 'text-ocean-600',
        tooltip: `${type === 'planned' ? 'Planned' : 'Suggested'} session scheduled`
      };
    }

    // For other statuses, use status-specific icon
    switch (status) {
      case 'Completed':
        return {
          icon: Check,
          color: 'text-sage-600',
          tooltip: `${type === 'planned' ? 'Planned' : 'Suggested'} session completed`
        };
      case 'Missed':
        return {
          icon: X,
          color: 'text-coral-600',
          tooltip: `${type === 'planned' ? 'Planned' : 'Suggested'} session missed`
        };
      default:
        return {
          icon: Calendar,
          color: 'text-neutral-600',
          tooltip: 'Unknown status'
        };
    }
  };

  const { icon: Icon, color, tooltip } = getStatusConfig();
  const iconElement = <Icon className={`${color}`} style={{ width: size, height: size }} />;

  if (!showTooltip) {
    return iconElement;
  }

  return (
    <Tooltip content={tooltip}>
      {iconElement}
    </Tooltip>
  );
}