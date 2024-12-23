import { CheckInType, CheckInStatus } from '../../types';
import { colors } from '../../styles/colors';

interface CheckInStyles {
  bg: string;
  text: string;
  border: string;
  hover: string;
}

export function getCheckInStyles(type: CheckInType, status: CheckInStatus): CheckInStyles {
  // Base styles for suggested check-ins
  if (type === 'suggested') {
    return {
      bg: 'bg-neutral-50',
      text: 'text-neutral-900',
      border: 'border-neutral-200',
      hover: 'hover:border-neutral-300',
    };
  }

  // Enhanced styles for planned check-ins
  switch (status) {
    case 'Scheduled':
      return {
        bg: 'bg-ocean-50',
        text: 'text-ocean-900',
        border: 'border-ocean-200',
        hover: 'hover:border-ocean-300',
      };
    case 'Completed':
      return {
        bg: 'bg-sage-50',
        text: 'text-sage-900',
        border: 'border-sage-200',
        hover: 'hover:border-sage-300',
      };
    case 'Missed':
      return {
        bg: 'bg-coral-50',
        text: 'text-coral-900',
        border: 'border-coral-200',
        hover: 'hover:border-coral-300',
      };
    default:
      return {
        bg: 'bg-neutral-50',
        text: 'text-neutral-900',
        border: 'border-neutral-200',
        hover: 'hover:border-neutral-300',
      };
  }
}

export function getStatusColor(status: CheckInStatus): string {
  switch (status) {
    case 'Scheduled':
      return colors.ocean[500];
    case 'Completed':
      return colors.sage[500];
    case 'Missed':
      return colors.coral[500];
    default:
      return colors.neutral[500];
  }
}

export function getStatusBadgeClasses(status: CheckInStatus): string {
  switch (status) {
    case 'Scheduled':
      return 'bg-ocean-100 text-ocean-800';
    case 'Completed':
      return 'bg-sage-100 text-sage-800';
    case 'Missed':
      return 'bg-coral-100 text-coral-800';
    default:
      return 'bg-neutral-100 text-neutral-800';
  }
}