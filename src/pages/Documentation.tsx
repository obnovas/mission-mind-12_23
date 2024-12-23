import React from 'react';
import { Home, Users, Map, Heart, Network, Wrench } from 'lucide-react';
import { DocSection } from '../components/documentation/DocSection';
import { dashboardDocs } from '../data/documentation/dashboardDocs';
import { toolsDocs } from '../data/documentation/toolsDocs';
import { contactsDocs } from '../data/documentation/contactsDocs';
import { journeysDocs } from '../data/documentation/journeysDocs';
import { prayersDocs } from '../data/documentation/prayersDocs';
import { networkDocs } from '../data/documentation/networkDocs';

const sections = [
  { ...dashboardDocs, icon: Home },
  { ...contactsDocs, icon: Users },
  { ...journeysDocs, icon: Map },
  { ...prayersDocs, icon: Heart },
  { ...networkDocs, icon: Network },
  { ...toolsDocs, icon: Wrench },
];

export function Documentation() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-neutral-900">Help & Documentation</h1>

      {sections.map((section) => (
        <DocSection
          key={section.title}
          title={section.title}
          icon={section.icon}
          link={section.link}
          color={section.color}
          description={section.description}
          features={section.features}
          questions={section.questions}
        />
      ))}
    </div>
  );
}