import React from 'react';
import { NetworkGroup, Contact } from '../../types';
import { Edit2, Trash2, Users, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface NetworkGroupListProps {
  groups: NetworkGroup[];
  contacts: Contact[];
  onEdit: (group: NetworkGroup) => void;
  onDelete: (group: NetworkGroup) => void;
}

export function NetworkGroupList({
  groups,
  contacts,
  onEdit,
  onDelete,
}: NetworkGroupListProps) {
  const navigate = useNavigate();

  const getGroupEmailLink = (members: string[]) => {
    const memberEmails = members
      .map(memberId => contacts.find(c => c.id === memberId)?.email)
      .filter(email => email)
      .join(',');
    return `mailto:?bcc=${memberEmails}`;
  };

  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const groupMembers = contacts.filter((contact) =>
          group.members.includes(contact.id)
        );

        return (
          <div
            key={group.id}
            className="bg-white rounded-lg border border-neutral-200 overflow-hidden"
          >
            <div className="bg-ocean-50 p-6 border-b border-neutral-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900">
                    {group.name}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    {group.description}
                  </p>
                  <p className="mt-2 text-sm text-neutral-500">
                    Created {format(new Date(group.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <a
                    href={getGroupEmailLink(group.members)}
                    className="text-accent-600 hover:text-accent-700 transition-colors duration-200"
                    title="Email Group"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                  <button
                    onClick={() => onEdit(group)}
                    className="text-accent-600 hover:text-accent-700 transition-colors duration-200"
                    title="Edit"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(group)}
                    className="text-coral-600 hover:text-coral-700 transition-colors duration-200"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center text-sm text-neutral-600 mb-4">
                <Users className="h-5 w-5 text-accent-600 mr-2" />
                <span>{groupMembers.length} members</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => navigate(`/contacts/${member.id}`)}
                    className="flex items-center p-4 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-accent-300 transition-colors duration-200 cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-neutral-900">
                        {member.name}
                      </p>
                      <p className="text-sm text-neutral-600">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {groups.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-neutral-200">
          <Users className="mx-auto h-12 w-12 text-neutral-400" />
          <h3 className="mt-2 text-sm font-medium text-neutral-900">No groups</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Get started by creating a new network group.
          </p>
        </div>
      )}
    </div>
  );
}