import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Home, HelpCircle } from 'lucide-react';

export function BrandMenu() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-3 text-white hover:text-coral-50 transition-colors duration-200"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Rocket className="h-8 w-8" />
        <span className="text-xl font-black font-roboto">MISSION MIND</span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <Link
            to="/"
            className="flex items-center px-4 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-accent-600"
          >
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
          <Link
            to="/documentation"
            className="flex items-center px-4 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-accent-600"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Help & Documentation
          </Link>
          <a
            href="https://get.missionmind.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-accent-600"
          >
            <Rocket className="h-4 w-4 mr-2" />
            Mission Mind Home
          </a>
        </div>
      )}
    </div>
  );
}