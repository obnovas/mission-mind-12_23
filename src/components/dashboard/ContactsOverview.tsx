import React from 'react';
import { Contact, PrayerRequest, CheckIn } from '../../types';
import { Users, HeartHandshake, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/dates';
import { useCheckInStore } from '../../store/checkInStore';
import { useSettingsStore } from '../../store/settingsStore';

interface ContactsOverviewProps {
  contacts: Contact[];
  prayerRequests: PrayerRequest[];
}

export function ContactsOverview({ contacts, prayerRequests }: ContactsOverviewProps) {
  const navigate = useNavigate();
  const { items: checkIns } = useCheckInStore();
  const { settings } = useSettingsStore();

  // Get recently added contacts
  const recentContacts = [...contacts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Get contacts that need attention
  const contactsNeedingAttention = React.useMemo(() => {
    return contacts.map(contact => {
      const activePrayers = prayerRequests.filter(pr => 
        pr.contact_id === contact.id && pr.status === 'Active'
      ).length;

      const recentMissedCheckIn = checkIns.find(ci => 
        ci.contact_id === contact.id && 
        ci.status === 'Missed' &&
        new Date(ci.check_in_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
      );

      return {
        contact,
        activePrayers,
        recentMissedCheckIn,
        attentionScore: (activePrayers * 2) + (recentMissedCheckIn ? 3 : 0)
      };
    })
    .filter(item => item.attentionScore > 0)
    .sort((a, b) => b.attentionScore - a.attentionScore)
    .slice(0, 3);
  }, [contacts, prayerRequests, checkIns]);

  return (
    <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-sage-500 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Users className="h-5 w-5 text-sage-600 mr-2" />
          <h2 className="text-xl font-roboto font-semibold text-neutral-900">Contacts</h2>
        </div>

        <div className="space-y-8">
          {/* Recently Added */}
          <div>
            <h3 className="text-lg font-medium text-neutral-900 mb-4">Recently Added</h3>
            <div className="space-y-2">
              {recentContacts.map(contact => (
                <div
                  key={contact.id}
                  onClick={() => navigate(`/contacts/${contact.id}`)}
                  className="flex items-center justify-between p-3 bg-sage-50 rounded-lg border border-sage-200 hover:border-sage-300 transition-colors duration-200 cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-neutral-900">{contact.name}</p>
                    <p className="text-xs text-neutral-500">
                      Added {formatDate(contact.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keep in Mind */}
          <div>
            <div className="flex items-center mb-4">
              <HeartHandshake className="h-4 w-4 text-coral-600 mr-2" />
              <h3 className="text-lg font-medium text-neutral-900">Keep in Mind</h3>
            </div>
            <div className="space-y-2">
              {contactsNeedingAttention.map(({ contact, activePrayers, recentMissedCheckIn }) => (
                <div
                  key={contact.id}
                  onClick={() => navigate(`/contacts/${contact.id}`)}
                  className="flex items-center justify-between p-3 bg-coral-50 rounded-lg border border-coral-200 hover:border-coral-300 transition-colors duration-200 cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-neutral-900">{contact.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {activePrayers > 0 && (
                        <span className="text-xs text-coral-600">
                          {activePrayers} active prayer{activePrayers !== 1 ? 's' : ''}
                        </span>
                      )}
                      {recentMissedCheckIn && (
                        <div className="flex items-center gap-1 text-xs text-coral-600">
                          <AlertCircle className="h-3 w-3" />
                          <span>Missed {settings.checkInLabel.toLowerCase()} on {formatDate(recentMissedCheckIn.check_in_date)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {contactsNeedingAttention.length === 0 && (
                <p className="text-center text-neutral-500 py-4">
                  No contacts needing attention
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}