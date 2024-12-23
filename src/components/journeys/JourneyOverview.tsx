import React from 'react';
import { Journey, Contact } from '../../types';
import { Users, ArrowRight } from 'lucide-react';

interface JourneyOverviewProps {
  journey: Journey;
  contacts: Contact[];
  onContactClick: (contact: Contact) => void;
}

export function JourneyOverview({ journey, contacts, onContactClick }: JourneyOverviewProps) {
  const journeyContacts = contacts.filter(
    (contact) => contact.journeyName === journey.name
  );

  const contactsByStage = journey.stages.reduce((acc, stage) => {
    acc[stage] = journeyContacts.filter(
      (contact) => contact.journeyStage === stage
    );
    return acc;
  }, {} as Record<string, Contact[]>);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{journey.name}</h2>
          <p className="text-sm text-gray-500 mt-1">{journey.description}</p>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-5 w-5 mr-1" />
          <span>{journeyContacts.length} contacts</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {journey.stages.map((stage) => {
          const stageContacts = contactsByStage[stage] || [];
          
          return (
            <div key={stage} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">{stage}</h3>
              <div className="space-y-3">
                {stageContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => onContactClick(contact)}
                    className="w-full text-left bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-500">{contact.email}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                ))}
                {stageContacts.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">
                    No contacts in this stage
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}