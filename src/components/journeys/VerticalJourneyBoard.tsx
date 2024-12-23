import React from 'react';
import { useDrop } from 'react-dnd';
import { Contact, Journey } from '../../types';
import { UserPlus, Edit2, ArrowDown } from 'lucide-react';
import { ContactCard } from './cards/ContactCard';
import { ColorFamily } from './types';
import { useJourneyStore } from '../../store/journeyStore';

// ... rest of the code remains the same, just update the add contact button:

<button
  onClick={onAddContact}
  className="p-1 rounded-full hover:bg-white/50 transition-colors duration-200"
  title="Add contact to this stage"
>
  <UserPlus className="h-4 w-4" />
</button>

// ... rest of the code remains the same