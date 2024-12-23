import React from 'react';
import { Rocket } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-sand-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-coral-100 p-3">
            <Rocket className="h-12 w-12 text-coral-600" />
          </div>
          <h1 className="mt-3 text-2xl font-black text-coral-600 font-roboto tracking-tight">
            MISSION MIND
          </h1>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-neutral-900">
          {title}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-neutral-200">
          {children}
        </div>
      </div>
    </div>
  );
}