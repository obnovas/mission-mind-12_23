import React from 'react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { SignUpForm } from '../components/auth/SignUpForm';
import { MarketingHero } from '../components/auth/marketing/MarketingHero';
import { MissionNotes } from '../components/auth/marketing/MissionNotes';

export function SignUp() {
  return (
    <div className="min-h-screen bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <MarketingHero />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <MissionNotes />
          
          <div className="bg-white rounded-lg shadow-xl border border-neutral-200 p-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-8">Create your account</h2>
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}