import React from 'react';
import { useDrag } from 'react-dnd';
import { Contact } from '../../../types';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColorFamily } from '../types';

interface ContactCardProps {
  contact: Contact;
  stage: string;
  journeyId: string;
  colorFamily: ColorFamily;
  stageIndex: number;
  onMoveContact: (contactId: string, toStage: string) => void;
}

export function ContactCard({ 
  contact, 
  stage, 
  journeyId, 
  colorFamily, 
  stageIndex,
  onMoveContact 
}: ContactCardProps) {
  const navigate = useNavigate();
  const [{ isDragging }, drag] = useDrag({
    type: 'CONTACT',
    item: { contactId: contact.id, fromStage: stage },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ stage: string }>();
      if (item && dropResult) {
        onMoveContact(item.contactId, dropResult.stage);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const colorIntensity = Math.min(100 + (stageIndex * 100), 900);
  const bgColor = colorFamily.colors[colorIntensity];

  const handleNavigateToContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/contacts/${contact.id}`);
  };

  return (
    <div
      ref={drag}
      className={`p-4 rounded-lg mb-2 cursor-move transition-all duration-200 ${
        isDragging ? 'opacity-50' : ''
      }`}
      style={{ 
        backgroundColor: bgColor,
        color: stageIndex > 4 ? 'white' : 'inherit',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'rgba(0,0,0,0.1)'
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{contact.name}</h3>
          <p className="text-sm opacity-75">{contact.email}</p>
        </div>
        <button
          onClick={handleNavigateToContact}
          className={`p-1 rounded-full hover:bg-white/20 transition-colors duration-200 ${
            stageIndex > 4 ? 'text-white/80 hover:text-white' : 'text-black/50 hover:text-black'
          }`}
          title="View Contact Details"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}