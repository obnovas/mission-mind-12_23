import React from 'react';
import { Clipboard, CheckCircle2 } from 'lucide-react';

export function MissionNotes() {
  return (
    <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-6 space-y-4 animate-slide-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clipboard className="h-5 w-5 text-accent-600" />
          <h2 className="font-medium text-neutral-900">MISSION BRIEFING</h2>
        </div>
        <div className="px-3 py-1 bg-sage-100 text-sage-800 text-xs font-medium rounded-full">
          ACTIVE
        </div>
      </div>
      
      <div className="space-y-3">
        <NoteItem>Track and nurture mission-minded relationships</NoteItem>
        <NoteItem>Monitor journeys and growth</NoteItem>
        <NoteItem>Stay consistent with check-ins and follow-ups</NoteItem>
        <NoteItem>Organize and track prayer requests</NoteItem>
        <NoteItem>Manage your entire people-centric mission</NoteItem>
         <NoteItem>Think strategically and act compassionately</NoteItem>
         <NoteItem>Don't let contacts slip through the cracks!</NoteItem>
      </div>

      <div className="pt-4 border-t border-neutral-200">
        <div className="text-sm text-neutral-600">
          <span className="font-medium text-accent-600">BETA ACCESS:</span> Create your free account today and help shape the future of mission management.
        </div>
      </div>
    </div>
  );
}

function NoteItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start space-x-2">
      <CheckCircle2 className="h-5 w-5 text-sage-500 mt-0.5" />
      <span className="text-neutral-700">{children}</span>
    </div>
  );
}