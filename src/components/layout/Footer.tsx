import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, HelpCircle, ExternalLink, Key } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Footer */}
        <div className="hidden md:flex md:flex-row md:justify-between md:items-center">
          <div className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Mission Mind. All rights reserved.
            <span className="mx-2">•</span>
            <Link to="/privacy-policy" className="hover:text-neutral-700">
              Privacy Policy
            </Link>
            <span className="mx-2">•</span>
            <Link to="/eula" className="hover:text-neutral-700">
              Terms of Use
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              to="/profile"
              className="text-sm text-neutral-600 hover:text-accent-600 flex items-center"
            >
              <Settings className="h-4 w-4 mr-1.5" />
              Settings
            </Link>
            <Link
              to="/documentation"
              className="text-sm text-neutral-600 hover:text-accent-600 flex items-center"
            >
              <HelpCircle className="h-4 w-4 mr-1.5" />
              Help & Documentation
            </Link>
            <Link
              to="/api-docs"
              className="text-sm text-neutral-600 hover:text-accent-600 flex items-center"
            >
              <Key className="h-4 w-4 mr-1.5" />
              Integrations
            </Link>
            <a
              href="https://get.missionmind.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-600 hover:text-accent-600 flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-1.5" />
              Mission Mind Home
            </a>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="md:hidden space-y-4">
          <div className="flex justify-center space-x-4">
            <Link
              to="/profile"
              className="p-2 text-neutral-600 hover:text-accent-600"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </Link>
            <Link
              to="/documentation"
              className="p-2 text-neutral-600 hover:text-accent-600"
              title="Help"
            >
              <HelpCircle className="h-5 w-5" />
            </Link>
            <Link
              to="/api-docs"
              className="p-2 text-neutral-600 hover:text-accent-600"
              title="API"
            >
              <Key className="h-5 w-5" />
            </Link>
            <a
              href="https://get.missionmind.app"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-neutral-600 hover:text-accent-600"
              title="Mission Mind Home"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
          <div className="text-center text-xs text-neutral-500">
            <div className="mb-2">
              © {new Date().getFullYear()} Mission Mind
            </div>
            <div className="flex justify-center space-x-2">
              <Link to="/privacy-policy" className="hover:text-neutral-700">
                Privacy
              </Link>
              <span>•</span>
              <Link to="/eula" className="hover:text-neutral-700">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}