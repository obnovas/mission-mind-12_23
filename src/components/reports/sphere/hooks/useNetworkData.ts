import { useMemo } from 'react';
import { Contact } from '../../../../types';
import { useNetworkGroupStore } from '../../../../store/networkGroupStore';
import { Node, Link } from '../types';

export function useNetworkData(
  contacts: (Contact & { influenceScore: number })[],
  selectedGroup: string | null,
  selectedType: string | 'all'
) {
  const { items: groups } = useNetworkGroupStore();

  return useMemo(() => {
    // Filter contacts based on selected group and type
    let filteredContacts = [...contacts];
    
    if (selectedGroup) {
      const group = groups.find(g => g.id === selectedGroup);
      if (group) {
        filteredContacts = filteredContacts.filter(c => group.members.includes(c.id));
      }
    }

    if (selectedType !== 'all') {
      filteredContacts = filteredContacts.filter(c => c.type === selectedType);
    }

    // Create nodes
    const nodes: Node[] = filteredContacts.map(contact => ({
      id: contact.id,
      name: contact.name,
      type: contact.type,
      influenceScore: contact.influenceScore,
      email: contact.email,
      phone: contact.phone,
    }));

    // Create links between nodes
    const links: Link[] = [];
    
    // Add links between group members
    groups.forEach(group => {
      const groupMembers = group.members
        .map(id => nodes.find(n => n.id === id))
        .filter((n): n is Node => n !== undefined);

      for (let i = 0; i < groupMembers.length; i++) {
        for (let j = i + 1; j < groupMembers.length; j++) {
          if (groupMembers[i].influenceScore > 0 && groupMembers[j].influenceScore > 0) {
            links.push({
              source: groupMembers[i].id,
              target: groupMembers[j].id,
              value: Math.min(groupMembers[i].influenceScore, groupMembers[j].influenceScore),
              isGroupConnection: true,
            });
          }
        }
      }
    });

    // Add influence-based links
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].influenceScore > 0 && nodes[j].influenceScore > 0) {
          // Check if a group connection already exists
          const existingLink = links.find(
            l => (l.source === nodes[i].id && l.target === nodes[j].id) ||
                 (l.source === nodes[j].id && l.target === nodes[i].id)
          );

          if (!existingLink) {
            links.push({
              source: nodes[i].id,
              target: nodes[j].id,
              value: Math.min(nodes[i].influenceScore, nodes[j].influenceScore),
              isGroupConnection: false,
            });
          }
        }
      }
    }

    return { nodes, links };
  }, [contacts, selectedGroup, selectedType, groups]);
}