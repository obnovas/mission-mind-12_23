import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContactStore } from '../store/contactStore';
import { useJourneyStore } from '../store/journeyStore';
import { useCheckInStore } from '../store/checkInStore';
import { useContactJourneyStore } from '../store/contactJourneyStore';
import { useJourneyManagement } from '../hooks/useJourneyManagement';
import { ContactJourneyProgress } from '../components/journeys/ContactJourneyProgress';
import { ContactRelationships } from '../components/contacts/ContactRelationships';
import { ContactMeetings } from '../components/contacts/ContactMeetings';
import { SelectJourneyDialog } from '../components/contacts/journey/SelectJourneyDialog';
import { SelectStageDialog } from '../components/contacts/journey/SelectStageDialog';
import { CheckInDialog } from '../components/contacts/CheckInDialog';
import { EditContactDialog } from '../components/contacts/EditContactDialog';
import { Mail, Phone, MapPin, ArrowLeft, Plus, Edit2 } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';

export function ContactDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCheckingIn, setIsCheckingIn] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [selectedCheckIn, setSelectedCheckIn] = React.useState<any>(null);
  const { settings } = useSettingsStore();
  
  const {
    isSelectingJourney,
    isSelectingStage,
    selectedJourney,
    startJourneySelection,
    handleJourneySelect,
    handleCancel,
  } = useJourneyManagement();

  const { items: contacts } = useContactStore();
  const { items: journeys } = useJourneyStore();
  const { items: checkIns } = useCheckInStore();
  const { removeFromJourney } = useContactJourneyStore();

  const contact = contacts?.find(c => c.id === id);
  const contactCheckIns = checkIns.filter(ci => ci.contact_id === id);

  if (!contact) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">Contact not found.</p>
        <button
          onClick={() => navigate('/contacts')}
          className="mt-4 text-accent-600 hover:text-accent-700 transition-colors duration-200"
        >
          Return to Contacts
        </button>
      </div>
    );
  }

  const handleRemoveFromJourney = async (journeyId: string) => {
    try {
      await removeFromJourney({
        contactId: contact.id,
        journeyId,
      });
      await useContactStore.getState().fetch();
    } catch (err) {
      console.error('Error removing from journey:', err);
    }
  };

  const contactJourneys = contact.journeys?.map(contactJourney => ({
    journey: journeys.find(j => j.id === contactJourney.journey_id)!,
    details: contactJourney,
  })) || [];

  const existingJourneyIds = contact.journeys?.map(j => j.journey_id) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">{contact.name}</h1>
            <span className={`inline-block mt-1 px-3 py-1 text-sm font-medium rounded-full ${
              contact.type === 'Individual' ? 'bg-ocean-100 text-ocean-800' :
              contact.type === 'Organization' ? 'bg-sage-100 text-sage-800' :
              'bg-coral-100 text-coral-800'
            }`}>
              {contact.type}
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 transition-colors duration-200"
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Edit Contact
        </button>
      </div>

      {/* Contact Info & Relationships - Mobile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information Card */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-4 sm:mb-6">Contact Information</h2>
          <div className="space-y-4">
            {contact.email && (
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-accent-500 mr-3" />
                <a href={`mailto:${contact.email}`} className="text-neutral-900 hover:text-accent-600">
                  {contact.email}
                </a>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-accent-500 mr-3" />
                <a href={`tel:${contact.phone}`} className="text-neutral-900 hover:text-accent-600">
                  {contact.phone}
                </a>
              </div>
            )}
            {contact.address && (
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-accent-500 mr-3" />
                <span className="text-neutral-900">{contact.address}</span>
              </div>
            )}
          </div>
        </div>

        <ContactRelationships contact={contact} allContacts={contacts} />
      </div>

      {/* Meetings Section */}
      <ContactMeetings 
        contact={contact}
        checkIns={contactCheckIns}
        onAddMeeting={() => {
          setSelectedCheckIn(null);
          setIsCheckingIn(true);
        }}
        onEditMeeting={(checkIn) => {
          setSelectedCheckIn(checkIn);
          setIsCheckingIn(true);
        }}
      />

      {/* Journeys Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">Journey Progress</h2>
          <button
            onClick={startJourneySelection}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Journey
          </button>
        </div>
        
        <div className="space-y-6">
          {contactJourneys.length > 0 ? (
            contactJourneys.map(({ journey, details }) => (
              <ContactJourneyProgress
                key={journey.id}
                contact={contact}
                journey={journey}
                contactJourney={details}
                onRemove={handleRemoveFromJourney}
              />
            ))
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border border-neutral-200">
              <p className="text-neutral-500">This contact is not part of any journeys yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <SelectJourneyDialog
        isOpen={isSelectingJourney}
        onClose={handleCancel}
        onSelect={handleJourneySelect}
        existingJourneyIds={existingJourneyIds}
      />

      {selectedJourney && (
        <SelectStageDialog
          isOpen={isSelectingStage}
          onClose={handleCancel}
          journey={selectedJourney}
          contactId={contact.id}
        />
      )}

      <CheckInDialog
        isOpen={isCheckingIn}
        onClose={() => {
          setIsCheckingIn(false);
          setSelectedCheckIn(null);
        }}
        contact={contact}
        checkIn={selectedCheckIn}
      />

      <EditContactDialog
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        contact={contact}
      />
    </div>
  );
}