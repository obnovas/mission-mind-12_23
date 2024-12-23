import React from 'react';
import { useDrop } from 'react-dnd';
import { Contact } from '../../../types';
import { UserPlus, ArrowDown, FileText } from 'lucide-react';
import { ContactCard } from '../cards/ContactCard';
import { ColorFamily } from '../types';
import { StageNotesDialog } from '../StageNotesDialog';

interface VerticalStageProps {
  stage: string;
  contacts: Contact[];
  journeyId: string;
  onAddContact: () => void;
  onMoveContact: (contactId: string, toStage: string) => void;
  colorFamily: ColorFamily;
  stageIndex: number;
  isLastStage?: boolean;
  notes: string;
  onUpdateNotes: (notes: string) => void;
}

export function VerticalStage({
  stage,
  contacts,
  journeyId,
  onAddContact,
  onMoveContact,
  colorFamily,
  stageIndex,
  isLastStage = false,
  notes,
  onUpdateNotes,
}: VerticalStageProps) {
  const [isNotesOpen, setIsNotesOpen] = React.useState(false);
  const [{ isOver }, drop] = useDrop({
    accept: 'CONTACT',
    drop: (item: { contactId: string }) => {
      onMoveContact(item.contactId, stage);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <>
      <div className="relative">
        <div
          ref={drop}
          className={`p-4 rounded-lg border ${
            isOver ? 'border-accent-300 bg-accent-50' : 'border-neutral-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-neutral-900">{stage}</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsNotesOpen(true)}
                className="md:hidden p-1 rounded-full hover:bg-white/50 transition-colors duration-200"
                title="Stage Notes"
              >
                <FileText className="h-4 w-4" />
              </button>
              <button
                onClick={onAddContact}
                className="p-1 rounded-full hover:bg-white/50 transition-colors duration-200"
                title="Add contact to this stage"
              >
                <UserPlus className="h-4 w-4" />
              </button>
            </div>
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

        {!isLastStage && (
          <div className="flex justify-center my-2">
            <ArrowDown className="h-6 w-6 text-neutral-400" />
          </div>
        )}
      </div>

      <StageNotesDialog
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        stageName={stage}
        notes={notes}
        onUpdate={onUpdateNotes}
      />
    </>
  );
}