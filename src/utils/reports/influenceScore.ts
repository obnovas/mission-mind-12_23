import { CheckIn } from '../../types';
import { differenceInDays } from 'date-fns';
import { useNetworkGroupStore } from '../../store/networkGroupStore';

export function calculateInfluenceScore(contactId: string, checkIns: CheckIn[]): number {
  const { items: groups } = useNetworkGroupStore.getState();
  
  // Only consider completed check-ins
  const completedCheckIns = checkIns.filter(ci => 
    ci.contact_id === contactId && 
    ci.status === 'Completed'
  );
  
  // If no completed check-ins, return 0
  if (completedCheckIns.length === 0) {
    return 0;
  }

  // Base influence from check-ins
  const checkInScore = completedCheckIns.reduce((score, checkIn) => {
    const daysAgo = differenceInDays(new Date(), new Date(checkIn.check_in_date));
    
    // Base score for each check-in
    let checkInScore = 1;
    
    // Recency bonus (exponential decay)
    const recencyBonus = Math.exp(-daysAgo / 30); // Half-life of 30 days
    checkInScore *= (1 + recencyBonus);
    
    // Bonus for meaningful interactions (with notes)
    if (checkIn.check_in_notes?.trim()) {
      checkInScore *= 1.5;
    }
    
    return score + checkInScore;
  }, 0);

  // Group membership bonus
  const groupBonus = groups.reduce((bonus, group) => {
    if (group.members.includes(contactId)) {
      // Add bonus for each group membership
      bonus += 2;
      
      // Additional bonus for larger groups
      bonus += Math.log(group.members.length) / 2;
    }
    return bonus;
  }, 0);

  return checkInScore + groupBonus;
}