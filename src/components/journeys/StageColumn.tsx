import React from 'react';
import { useDrop } from 'react-dnd';
import { Contact } from '../../types';
import { Plus } from 'lucide-react';
import { ContactCard } from './cards/ContactCard';
import { ColorFamily } from './types';

interface StageColumnProps {
  stage: string;
  contacts: Contact[];
  journeyId: string;
  onAddContact: () => void;
  colorFamily: ColorFamily;
  stageIndex: number;
  onMoveContact: (contactId: string, toStage: string) => void;
}

export function StageColumn({
  stage,
  contacts,
  journeyId,
  onAddContact,
  colorFamily,
  stageIndex,
  onMoveContact,
}: StageColumnProps) {
  const [{ isOver }, drop] = useDrop({
    accept: 'CONTACT',
    drop: () => ({ stage }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const colorIntensity = Math.min(100 + (stageIndex * 100), 900);
  const bgColor = colorFamily.colors[50];
  const borderColor = colorFamily.colors[colorIntensity];

  return (
    <div
      ref={drop}
      className={`flex-1 min-w-[250px] rounded-lg p-4 ${
        isOver ? 'bg-opacity-70' : ''
      }`}
      style={{ 
        backgroundColor: bgColor,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'rgba(0,0,0,0.1)',
        borderLeftWidth: '4px',
        borderLeftColor: borderColor
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-900">{stage}</h3>
        <button
          onClick={onAddContact}
          className="p-1 rounded-full hover:bg-white/50 transition-colors duration-200"
          title="Add contact to this stage"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-2">
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            stage={stage}
            journeyId={journeyId}
            colorFamily={colorFamily}
            stageIndex={stageIndex}
            onMoveContact={onMoveContact}
          />
        ))}
      </div>
    </div>
  );
}