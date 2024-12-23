import { CheckIn } from '../../types';
import { differenceInDays } from 'date-fns';
import { useNetworkGroupStore } from '../../store/networkGroupStore';

export function calculateInfluenceScore(contactId: string, checkIns: CheckIn[]): number {
  const { items: groups } = useNetworkGroupStore.getState();
  
  const completedCheckIns = checkIns.filter(ci => 
    ci.contact_id === contactId && 
    ci.status === 'Completed'
  );
  
  if (completedCheckIns.length === 0) return 0;

  const checkInScore = completedCheckIns.reduce((score, checkIn) => {
    const daysAgo = differenceInDays(new Date(), new Date(checkIn.check_in_date));
    let checkInScore = 1;
    const recencyBonus = Math.exp(-daysAgo / 30);
    checkInScore *= (1 + recencyBonus);
    
    if (checkIn.check_in_notes?.trim()) {
      checkInScore *= 1.5;
    }
    
    return score + checkInScore;
  }, 0);

  const groupBonus = groups.reduce((bonus, group) => {
    if (group.members.includes(contactId)) {
      bonus += 2;
      bonus += Math.log(group.members.length) / 2;
    }
    return bonus;
  }, 0);

  return checkInScore + groupBonus;
}