import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SphereOfInfluenceReport } from '../components/reports/SphereOfInfluenceReport';
import { useContactStore } from '../store/contactStore';
import { useCheckInStore } from '../store/checkInStore';

export function SphereOfInfluencePage() {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    useContactStore.getState().fetch();
    useCheckInStore.getState().fetch();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-accent-500 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/tools')}
              className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-roboto font-bold text-neutral-900">
              Sphere of Influence Report
            </h1>
          </div>
        </div>
      </div>

      <SphereOfInfluenceReport />
    </div>
  );
}