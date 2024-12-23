import React from 'react';
import { NetworkGraph } from './NetworkGraph';
import { GraphControls } from './GraphControls';
import { GraphLegend } from './GraphLegend';
import { useNetworkData } from './hooks/useNetworkData';
import { Contact } from '../../../types';

interface InfluenceGraphProps {
  contacts: (Contact & { influenceScore: number })[];
}

export function InfluenceGraph({ contacts }: InfluenceGraphProps) {
  const [selectedGroup, setSelectedGroup] = React.useState<string | null>(null);
  const [selectedType, setSelectedType] = React.useState<string | 'all'>('all');
  const [showZeroScores, setShowZeroScores] = React.useState(false);

  // Filter out zero scores unless explicitly shown
  const filteredContacts = React.useMemo(() => {
    return contacts.filter(contact => 
      showZeroScores || contact.influenceScore > 0
    );
  }, [contacts, showZeroScores]);

  const { nodes, links } = useNetworkData(filteredContacts, selectedGroup, selectedType);

  return (
    <div className="relative w-full">
      <div className="absolute top-4 right-4 z-10">
        <GraphControls
          selectedGroup={selectedGroup}
          selectedType={selectedType}
          showZeroScores={showZeroScores}
          onGroupChange={setSelectedGroup}
          onTypeChange={setSelectedType}
          onShowZeroScoresChange={setShowZeroScores}
          totalContacts={contacts.length}
          visibleContacts={filteredContacts.length}
        />
      </div>
      <div className="absolute top-4 left-4 z-10">
        <GraphLegend />
      </div>
      <div className="w-full" style={{ height: 'calc(100vh - 300px)' }}>
        <NetworkGraph nodes={nodes} links={links} />
      </div>
    </div>
  );
}