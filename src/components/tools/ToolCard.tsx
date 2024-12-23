import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, Download } from 'lucide-react';
import { ToolButton } from './ToolButton';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: 'ocean' | 'coral' | 'sage' | 'sunset' | 'lavender';
  link?: string;
  report?: {
    label: string;
    type: 'daily' | 'monthly' | 'prayer-week';
  };
  onGenerateReport?: (type: 'daily' | 'monthly' | 'prayer-week') => void;
  isGenerating?: boolean;
}

export function ToolCard({
  title,
  description,
  icon: Icon,
  color,
  link,
  report,
  onGenerateReport,
  isGenerating
}: ToolCardProps) {
  const iconColorClasses = {
    ocean: 'text-ocean-600',
    coral: 'text-coral-600',
    sage: 'text-sage-600',
    sunset: 'text-sunset-600',
    lavender: 'text-lavender-600'
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Icon className={`h-6 w-6 ${iconColorClasses[color]} mr-2`} />
            <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
          </div>
        </div>
        <p className="text-neutral-600 mb-6">{description}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          {link && (
            <ToolButton
              variant="secondary"
              color={color}
              to={link}
            >
              Open Tool
            </ToolButton>
          )}
          {report && onGenerateReport && (
            <ToolButton
              variant="primary"
              color={color}
              onClick={() => onGenerateReport(report.type)}
              disabled={isGenerating}
              icon={Download}
            >
              {isGenerating ? 'Generating...' : report.label}
            </ToolButton>
          )}
        </div>
      </div>
    </div>
  );
}