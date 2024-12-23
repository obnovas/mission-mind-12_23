import React from 'react';

interface NotesSectionProps {
  value: string;
  onChange: (notes: string) => void;
  label: string;
}

export function NotesSection({ value, onChange, label }: NotesSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg text-neutral-900">Notes</h3>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
        placeholder={`Add notes about this ${label.toLowerCase()}...`}
      />
    </div>
  );
}