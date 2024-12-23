import React from 'react';
import { Dialog } from '@headlessui/react';
import { CheckCircle } from 'lucide-react';

interface SignUpSuccessProps {
  isOpen: boolean;
  email: string;
  onContinue: () => void;
}

export function SignUpSuccess({ isOpen, email, onContinue }: SignUpSuccessProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={() => {}}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        
        <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6 text-center">
          <div className="mb-4">
            <CheckCircle className="mx-auto h-12 w-12 text-sage-600" />
          </div>
          
          <Dialog.Title className="text-lg font-medium text-neutral-900 mb-2">
            Welcome to Mission Mind!
          </Dialog.Title>
          
          <p className="text-sm text-neutral-600 mb-6">
            Thank you for creating an account! You can sign in using your email address
            (<span className="font-medium">{email}</span>) and password.
          </p>

          <button
            onClick={onContinue}
            className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700"
          >
            Continue to Sign In
          </button>
        </div>
      </div>
    </Dialog>
  );
}