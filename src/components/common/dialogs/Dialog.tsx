import React from 'react';
import { Dialog as HeadlessDialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { Button } from '../buttons/Button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  color?: 'ocean' | 'coral' | 'sage' | 'sunset';
  primaryAction?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
    disabled?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
}

export function Dialog({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  color = 'ocean',
  primaryAction,
  secondaryAction,
}: DialogProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  const headerColorClasses = {
    ocean: 'bg-ocean-50',
    coral: 'bg-coral-50',
    sage: 'bg-sage-50',
    sunset: 'bg-sunset-50',
  };

  return (
    <HeadlessDialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <HeadlessDialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        
        <div className={`relative bg-white rounded-lg w-full mx-4 ${maxWidthClasses[maxWidth]}`}>
          <div className={`${headerColorClasses[color]} rounded-t-lg border-b border-neutral-200 p-6`}>
            <div className="flex justify-between items-center">
              <HeadlessDialog.Title className="text-xl font-semibold text-neutral-900">
                {title}
              </HeadlessDialog.Title>
              <button
                onClick={onClose}
                className="text-neutral-500 hover:text-neutral-700 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {children}
          </div>

          {(primaryAction || secondaryAction) && (
            <div className="flex justify-end space-x-3 px-6 py-4 bg-neutral-50 border-t border-neutral-200">
              {secondaryAction && (
                <Button
                  variant="secondary"
                  onClick={secondaryAction.onClick}
                  disabled={secondaryAction.disabled}
                >
                  {secondaryAction.label}
                </Button>
              )}
              {primaryAction && (
                <Button
                  variant="primary"
                  onClick={primaryAction.onClick}
                  loading={primaryAction.loading}
                  disabled={primaryAction.disabled}
                >
                  {primaryAction.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </HeadlessDialog>
  );
}