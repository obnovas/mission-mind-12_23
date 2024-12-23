import React from 'react';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg text-neutral-900">{title}</h3>
      {children}
    </div>
  );
}