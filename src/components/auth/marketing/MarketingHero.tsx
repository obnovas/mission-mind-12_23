import React from 'react';
import { Rocket } from 'lucide-react';

export function MarketingHero() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center p-2 bg-coral-100 rounded-full mb-6 animate-bounce">
        <Rocket className="h-8 w-8 text-coral-600" />
      </div>
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-neutral-900 font-roboto tracking-tight animate-fade-in">
          MISSION MIND
        </h1>
        <div className="flex flex-col items-center space-y-2 animate-slide-up">
          <div className="px-4 py-1 bg-coral-100 text-coral-800 rounded-full text-sm font-medium">
            BETA ACCESS NOW AVAILABLE
          </div>
          <p className="text-lg text-neutral-600 max-w-xl">
            Designed to help people-centric missions to be consistent, insightful, and mindful.
          </p>
        </div>
      </div>
    </div>
  );
}