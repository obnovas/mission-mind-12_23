import React from 'react';
import { Dialog } from '@headlessui/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'warning';
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  type = 'danger'
}: ConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        
        <div className="relative bg-white rounded-lg max-w-md w-full mx-4">
          <div className={`${
            type === 'danger' ? 'bg-coral-50' : 'bg-honey-50'
          } rounded-t-lg border-b border-neutral-200 p-6`}>
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-xl font-semibold text-neutral-900 flex items-center">
                <AlertTriangle className={`h-6 w-6 ${
                  type === 'danger' ? 'text-coral-600' : 'text-honey-600'
                } mr-2`} />
                {title}
              </Dialog.Title>
              <button 
                onClick={onClose} 
                className="text-neutral-500 hover:text-neutral-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-neutral-600">{message}</div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition-colors duration-200"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  type === 'danger'
                    ? 'bg-coral-600 hover:bg-coral-700'
                    : 'bg-honey-600 hover:bg-honey-700'
                } transition-colors duration-200`}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}