import React from 'react';
import { Contact } from '../../types';
import { Heart, Plus, CheckCircle, Archive, RotateCw, Edit2, Trash2 } from 'lucide-react';
import { usePrayerRequestStore } from '../../store/prayerRequestStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatDate } from '../../utils/dates';
import { PrayerRequestForm } from '../prayer-requests/PrayerRequestForm';
import { PrayerRequestEditDialog } from '../prayer-requests/PrayerRequestEditDialog';

interface ContactPrayerRequestsProps {
  contact: Contact;
}

export function ContactPrayerRequests({ contact }: ContactPrayerRequestsProps) {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingRequest, setEditingRequest] = React.useState<any>(null);
  const { items: prayerRequests, loading, error, fetch, update, remove } = usePrayerRequestStore();
  const { settings } = useSettingsStore();

  React.useEffect(() => {
    fetch();
  }, []);

  // Filter prayer requests for this contact
  const contactRequests = prayerRequests
    .filter(request => request.contact_id === contact.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const handleStatusChange = async (id: string, status: 'Active' | 'Answered' | 'Archived') => {
    try {
      await update(id, {
        status,
        updated_at: new Date().toISOString(),
      });
      fetch(); // Refresh the list
    } catch (err) {
      console.error('Error updating status:', err);
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

  const getStatusColor = (status: 'Active' | 'Answered' | 'Archived') => {
    switch (status) {
      case 'Active':
        return 'bg-ocean-100 text-ocean-800';
      case 'Answered':
        return 'bg-sage-100 text-sage-800';
      case 'Archived':
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getStatusActions = (status: 'Active' | 'Answered' | 'Archived') => {
    switch (status) {
      case 'Active':
        return [
          {
            icon: CheckCircle,
            label: 'Mark as Answered',
            onClick: (id: string) => handleStatusChange(id, 'Answered'),
            className: 'text-sage-600 hover:text-sage-900',
          },
          {
            icon: Archive,
            label: 'Archive',
            onClick: (id: string) => handleStatusChange(id, 'Archived'),
            className: 'text-neutral-600 hover:text-neutral-900',
          },
        ];
      case 'Answered':
      case 'Archived':
        return [
          {
            icon: RotateCw,
            label: 'Reactivate',
            onClick: (id: string) => handleStatusChange(id, 'Active'),
            className: 'text-ocean-600 hover:text-ocean-900',
          },
        ];
    }
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Heart className="h-6 w-6 text-accent-600 mr-2" />
          <h2 className="text-xl font-semibold text-neutral-900">{settings.featureLabel}</h2>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {settings.featureLabel.slice(0, -1)}
        </button>
      </div>

      <div className="space-y-1">
        {contactRequests.map((request, index) => (
          <div
            key={request.id}
            className={`flex items-center justify-between py-2 px-3 rounded-md transition-colors duration-200 ${
              index % 2 === 0 ? 'bg-neutral-50' : 'bg-white'
            } hover:bg-honey-50`}
          >
            <div className="flex-grow">
              <p className="text-sm text-neutral-900">{request.request}</p>
              {request.answer_notes && request.status === 'Answered' && (
                <p className="text-sm text-sage-600 mt-1">Answer: {request.answer_notes}</p>
              )}
              <p className="text-xs text-neutral-500 mt-0.5">
                {formatDate(request.created_at)}
              </p>
            </div>
            <div className="flex items-center ml-4 space-x-2">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setEditingRequest(request)}
                  className="p-1 rounded-full hover:bg-white/50 text-accent-600 hover:text-accent-700"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                {getStatusActions(request.status).map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => action.onClick(request.id)}
                    className={`p-1 rounded-full hover:bg-white/50 ${action.className}`}
                    title={action.label}
                  >
                    <action.icon className="h-4 w-4" />
                  </button>
                ))}
                <button
                  onClick={() => handleDelete(request.id)}
                  className="p-1 rounded-full hover:bg-white/50 text-coral-600 hover:text-coral-700"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {contactRequests.length === 0 && (
          <p className="text-center text-neutral-500 py-4">
            No {settings.featureLabel.toLowerCase()} yet
          </p>
        )}
      </div>

      <PrayerRequestForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        contacts={[contact]} // Only show this contact
        preSelectedContact={contact} // Pre-select this contact
      />

      <PrayerRequestEditDialog
        isOpen={!!editingRequest}
        onClose={() => setEditingRequest(null)}
        request={editingRequest}
        contacts={[contact]} // Only show this contact
      />
    </div>
  );
}