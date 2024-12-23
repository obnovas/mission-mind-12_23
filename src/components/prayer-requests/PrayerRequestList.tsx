import React from 'react';
import { PrayerRequest, Contact } from '../../types';
import { Edit2, Trash2, CheckCircle, Archive, RotateCw, ExternalLink } from 'lucide-react';
import { formatDate } from '../../utils/dates';
import { useNavigate } from 'react-router-dom';
import { usePrayerRequestStore } from '../../store/prayerRequestStore';
import { PrayerRequestEditDialog } from './PrayerRequestEditDialog';

interface PrayerRequestListProps {
  requests: PrayerRequest[];
  contacts: Contact[];
  onStatusChange: (id: string, status: PrayerRequest['status']) => void;
}

export function PrayerRequestList({
  requests,
  contacts,
  onStatusChange,
}: PrayerRequestListProps) {
  const navigate = useNavigate();
  const { remove, fetch } = usePrayerRequestStore();
  const [editingRequest, setEditingRequest] = React.useState<PrayerRequest | null>(null);

  const getStatusColor = (status: PrayerRequest['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-ocean-100 text-ocean-800';
      case 'Answered':
        return 'bg-sage-100 text-sage-800';
      case 'Archived':
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getStatusActions = (request: PrayerRequest) => {
    switch (request.status) {
      case 'Active':
        return [
          {
            icon: CheckCircle,
            label: 'Mark as Answered',
            onClick: () => onStatusChange(request.id, 'Answered'),
            className: 'text-sage-600 hover:text-sage-900',
          },
          {
            icon: Archive,
            label: 'Archive',
            onClick: () => onStatusChange(request.id, 'Archived'),
            className: 'text-neutral-600 hover:text-neutral-900',
          },
        ];
      case 'Answered':
      case 'Archived':
        return [
          {
            icon: RotateCw,
            label: 'Reactivate',
            onClick: () => onStatusChange(request.id, 'Active'),
            className: 'text-ocean-600 hover:text-ocean-900',
          },
        ];
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      fetch(); // Refresh the list
    } catch (err) {
      console.error('Error deleting prayer request:', err);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        {/* Mobile View */}
        <div className="md:hidden">
          {requests.map((request) => {
            const contact = contacts.find((c) => c.id === request.contact_id);
            if (!contact) return null;

            return (
              <div
                key={request.id}
                onClick={() => setEditingRequest(request)}
                className="p-4 border-b border-neutral-200 hover:bg-neutral-50 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-neutral-900">{contact.name}</h3>
                    <p className="text-sm text-neutral-600 mt-1">{request.request}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs text-neutral-500">
                    {formatDate(request.created_at)}
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusActions(request).map((action, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick();
                        }}
                        className={`p-1 rounded-full hover:bg-neutral-100 ${action.className}`}
                        title={action.label}
                      >
                        <action.icon className="h-4 w-4" />
                      </button>
                    ))}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(request.id);
                      }}
                      className="p-1 rounded-full hover:bg-neutral-100 text-coral-600 hover:text-coral-700"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {requests.length === 0 && (
            <div className="p-4 text-center text-neutral-500">
              No prayer requests found
            </div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Request
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {requests.map((request) => {
                const contact = contacts.find((c) => c.id === request.contact_id);
                if (!contact) return null;

                return (
                  <tr 
                    key={request.id}
                    onClick={() => setEditingRequest(request)}
                    className="hover:bg-neutral-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-900">
                          {contact.name}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/contacts/${contact.id}`);
                          }}
                          className="ml-2 text-accent-600 hover:text-accent-700 transition-colors duration-200"
                          title="View Contact"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-neutral-900">{request.request}</div>
                      {request.answer_notes && request.status === 'Answered' && (
                        <div className="text-sm text-sage-600 mt-1">
                          Answer: {request.answer_notes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {formatDate(request.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div 
                        className="flex items-center space-x-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setEditingRequest(request)}
                          className="text-accent-600 hover:text-accent-700"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        {getStatusActions(request).map((action, index) => (
                          <button
                            key={index}
                            onClick={action.onClick}
                            className={action.className}
                            title={action.label}
                          >
                            <action.icon className="h-4 w-4" />
                          </button>
                        ))}
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="text-coral-600 hover:text-coral-700"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-neutral-500">
                    No prayer requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PrayerRequestEditDialog
        isOpen={!!editingRequest}
        onClose={() => setEditingRequest(null)}
        request={editingRequest}
        contacts={contacts}
      />
    </>
  );
}