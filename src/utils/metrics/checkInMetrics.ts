import { CheckIn } from '../../types';

export function getUpcomingCheckIns(checkIns: CheckIn[]): CheckIn[] {
  const now = new Date();
  return checkIns
    .filter(ci => 
      ci.status === 'Scheduled' && 
      new Date(ci.check_in_date) > now
    )
    .sort((a, b) => new Date(a.check_in_date).getTime() - new Date(b.check_in_date).getTime());
}

export function getMissedCheckIns(checkIns: CheckIn[]): CheckIn[] {
  const now = new Date();
  return checkIns
    .filter(ci => 
      (ci.status === 'Scheduled' || ci.status === 'Missed') && 
      new Date(ci.check_in_date) < now
    )
    .sort((a, b) => new Date(b.check_in_date).getTime() - new Date(a.check_in_date).getTime());
}

export function getRecentCheckIns(checkIns: CheckIn[]): CheckIn[] {
  return checkIns
    .filter(ci => ci.status === 'Completed')
    .sort((a, b) => new Date(b.check_in_date).getTime() - new Date(a.check_in_date).getTime());
}