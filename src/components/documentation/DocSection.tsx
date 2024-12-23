import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DocSectionProps {
  title: string;
  icon: LucideIcon;
  link: string;
  color: string;
  description: string;
  features: string[];
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export function DocSection({ 
  title, 
  icon: Icon, 
  link, 
  color, 
  description, 
  features, 
  questions 
}: DocSectionProps) {
  return (
    <div className={`prose max-w-none border-l-4 border-${color}-500 pl-6`}>
      <div className="flex items-center space-x-2">
        <Icon className={`h-5 w-5 text-${color}-600`} />
        <Link to={link} className="text-2xl font-semibold text-neutral-900 no-underline">
          {title}
        </Link>
      </div>

      <p className="text-neutral-600">{description}</p>

      <ul className="list-disc pl-6">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>

      <h4>Common Questions</h4>
      <div className="space-y-4">
        {questions.map((q, index) => (
          <div key={index}>
            <p className="font-medium">Q: {q.question}</p>
            <p className="text-neutral-600">A: {q.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}