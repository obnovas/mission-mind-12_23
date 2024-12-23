import React from 'react';
import { Contact } from '../../../../types';
import { usePrayerRequestStore } from '../../../../store/prayerRequestStore';
import { useSettingsStore } from '../../../../store/settingsStore';
import { formatDate } from '../../../../utils/dates';
import { Heart } from 'lucide-react';

interface PrayerRequestsSectionProps {
  contact: Contact;
}

export function PrayerRequestsSection({ contact }: PrayerRequestsSectionProps) {
  const { items: prayerRequests } = usePrayerRequestStore();
  const { settings } = useSettingsStore();

  // Get active prayer requests for this contact
  const activePrayers = React.useMemo(() => 
    prayerRequests
      .filter(pr => pr.contact_id === contact.id && pr.status === 'Active')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [prayerRequests, contact.id]
  );

  return (
    <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4">
      <div className="flex items-center mb-4">
        <Heart className="h-4 w-4 text-accent-500 mr-2" />
        <h3 className="font-medium text-lg text-neutral-900">
          Active {settings.featureLabel}
        </h3>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {activePrayers.length > 0 ? (
          activePrayers.map(prayer => (
            <div
              key={prayer.id}
              className="p-2 bg-white rounded border border-neutral-200"
            >
              <p className="text-sm text-neutral-600">{prayer.request}</p>
              <p className="text-xs text-neutral-500 mt-1">
                Added {formatDate(prayer.created_at)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-neutral-500 text-center py-2">
            No active {settings.featureLabel.toLowerCase()}
          </p>
        )}
      </div>
    </div>
  );
}