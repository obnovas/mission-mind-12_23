import React from 'react';

interface NestedSectionProps {
  title?: string;
  children: React.ReactNode;
}

export function NestedSection({ title, children }: NestedSectionProps) {
  return (
    <div className="bg-neutral-50 rounded-lg p-6">
      {title && (
        <h3 className="text-sm font-medium text-neutral-900 mb-4">{title}</h3>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}