import React from 'react';
import { Contact, CheckIn } from '../../types';
import { InfluenceGraph } from './sphere/InfluenceGraph';
import { TypeFilter } from './sphere/TypeFilter';
import { useContactStore } from '../../store/contactStore';
import { useCheckInStore } from '../../store/checkInStore';
import { calculateInfluenceScore } from '../../utils/reports/influenceScore';

export function SphereOfInfluenceReport() {
  const [selectedType, setSelectedType] = React.useState<string | 'all'>('all');
  const { items: contacts } = useContactStore();
  const { items: checkIns } = useCheckInStore();
  
  // Filter completed check-ins only
  const completedCheckIns = checkIns.filter(ci => ci.status === 'Completed');
  
  // Get unique contact types
  const contactTypes = Array.from(new Set(contacts.map(c => c.type)));
  
  // Calculate influence scores and filter by type
  const contactsWithScores = contacts
    .map(contact => ({
      ...contact,
      influenceScore: calculateInfluenceScore(contact.id, completedCheckIns)
    }))
    .filter(contact => selectedType === 'all' || contact.type === selectedType)
    .sort((a, b) => b.influenceScore - a.influenceScore);

  return (
    <div className="w-full bg-white rounded-lg border border-neutral-200 border-l-4 border-l-lavender-500 overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">Sphere of Influence</h2>
          <TypeFilter
            types={contactTypes}
            selectedType={selectedType}
            onChange={setSelectedType}
          />
        </div>
        
        <div className="w-full" style={{ height: 'calc(100vh - 300px)' }}>
          <InfluenceGraph contacts={contactsWithScores} />
        </div>
      </div>
    </div>
  );
}