import React from 'react';
import { Filter, Users, Eye } from 'lucide-react';
import { useNetworkGroupStore } from '../../../store/networkGroupStore';
import { useContactStore } from '../../../store/contactStore';

interface GraphControlsProps {
  selectedGroup: string | null;
  selectedType: string | 'all';
  showZeroScores: boolean;
  onGroupChange: (groupId: string | null) => void;
  onTypeChange: (type: string | 'all') => void;
  onShowZeroScoresChange: (show: boolean) => void;
  totalContacts: number;
  visibleContacts: number;
}

export function GraphControls({
  selectedGroup,
  selectedType,
  showZeroScores,
  onGroupChange,
  onTypeChange,
  onShowZeroScoresChange,
  totalContacts,
  visibleContacts,
}: GraphControlsProps) {
  const { items: groups } = useNetworkGroupStore();
  const { items: contacts } = useContactStore();
  const types = Array.from(new Set(contacts.map(c => c.type)));

  React.useEffect(() => {
    useNetworkGroupStore.getState().fetch();
  }, []);

  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-lg border border-neutral-200">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-neutral-500" />
        <select
          value={selectedGroup || 'all'}
          onChange={(e) => onGroupChange(e.target.value === 'all' ? null : e.target.value)}
          className="rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 text-sm"
        >
          <option value="all">All Groups</option>
          {groups.map(group => (
            <option key={group.id} value={group.id}>{group.name}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-neutral-500" />
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 text-sm"
        >
          <option value="all">All Types</option>
          {types.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4 text-neutral-500" />
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={showZeroScores}
            onChange={(e) => onShowZeroScoresChange(e.target.checked)}
            className="rounded border-neutral-300 text-accent-600 focus:ring-accent-500"
          />
          Show Inactive Contacts
        </label>
      </div>

      <div className="text-xs text-neutral-500 border-t border-neutral-200 pt-2 mt-2">
        Showing {visibleContacts} of {totalContacts} contacts
      </div>
    </div>
  );
}