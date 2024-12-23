import { CheckIn } from '../../types';

export function getNextMeeting(checkIns: CheckIn[]): { planned: CheckIn[]; suggested: CheckIn[] } {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  // Filter for scheduled meetings in the future and sort by date
  const upcomingMeetings = checkIns
    .filter(ci => 
      ci.status === 'Scheduled' && 
      new Date(ci.check_in_date) > now
    )
    .sort((a, b) => new Date(a.check_in_date).getTime() - new Date(b.check_in_date).getTime());

  // Separate by type and limit each to 5
  const planned = upcomingMeetings
    .filter(m => m.check_in_type === 'planned')
    .slice(0, 5);
    
  const suggested = upcomingMeetings
    .filter(m => m.check_in_type === 'suggested')
    .slice(0, 5);

  return { planned, suggested };
}

export function getMissedMeetings(checkIns: CheckIn[]): CheckIn[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return checkIns
    .filter(ci => 
      (ci.status === 'Scheduled' || ci.status === 'Missed') && 
      new Date(ci.check_in_date) < now
    )
    .sort((a, b) => new Date(b.check_in_date).getTime() - new Date(a.check_in_date).getTime())
    .slice(0, 5);
}