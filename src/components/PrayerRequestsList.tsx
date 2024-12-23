import React from 'react';
import { Heart, CheckCircle, Archive, RotateCcw, ExternalLink } from 'lucide-react';
import { Contact } from '../types';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { usePrayerRequestStore } from '../store/prayerRequestStore';
import { useSettingsStore } from '../store/settingsStore';

interface PrayerRequestsListProps {
  contacts: Contact[];
}

export function PrayerRequestsList({ contacts }: PrayerRequestsListProps) {
  const navigate = useNavigate();
  const { items: prayerRequests, update } = usePrayerRequestStore();
  const { settings } = useSettingsStore();

  // Get active prayer requests and sort by most recent
  const activePrayerRequests = React.useMemo(() => {
    return (prayerRequests || [])
      .filter(request => request.status === 'Active')
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5); // Show only the 5 most recent
  }, [prayerRequests]);

  const handleStatusChange = async (requestId: string, newStatus: 'Active' | 'Answered' | 'Archived') => {
    await update(requestId, { 
      status: newStatus,
      updated_at: new Date().toISOString()
    });
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Heart className="h-5 w-5 text-accent-600 mr-2" />
          <h3 className="text-lg font-semibold text-neutral-900">Active {settings.featureLabel}</h3>
        </div>
        <button
          onClick={() => navigate('/prayer-requests')}
          className="text-sm text-accent-600 hover:text-accent-700 transition-colors duration-200"
        >
          View all
        </button>
      </div>
      <div className="space-y-4">
        {activePrayerRequests.map((request) => {
          const contact = contacts?.find(c => c.id === request.contact_id);
          if (!contact) return null;

          return (
            <div 
              key={request.id} 
              className="p-4 bg-neutral-50 rounded-lg border border-neutral-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span 
                        className="font-medium text-neutral-900 hover:text-accent-600 cursor-pointer"
                        onClick={() => navigate(`/contacts/${contact.id}`)}
                      >
                        {contact.name}
                      </span>
                      <ExternalLink 
                        className="h-4 w-4 ml-2 text-neutral-400 hover:text-accent-600 cursor-pointer"
                        onClick={() => navigate(`/contacts/${contact.id}`)}
                      />
                    </div>
                    <span className="text-sm text-neutral-500">
                      {format(new Date(request.updated_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">{request.request}</p>
                </div>
              </div>
              <div className="mt-3 flex justify-end space-x-2">
                <button
                  onClick={() => handleStatusChange(request.id, 'Answered')}
                  className="p-1 text-sage-600 hover:text-sage-700 transition-colors duration-200"
                  title="Mark as Answered"
                >
                  <CheckCircle className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleStatusChange(request.id, 'Archived')}
                  className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors duration-200"
                  title="Archive"
                >
                  <Archive className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
        {(!activePrayerRequests || activePrayerRequests.length === 0) && (
          <p className="text-center text-neutral-500 py-4">No active {settings.featureLabel.toLowerCase()}</p>
        )}
      </div>
    </div>
  );
}