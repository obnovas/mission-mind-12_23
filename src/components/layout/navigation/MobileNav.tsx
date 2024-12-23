import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Map, HeartHandshake, Network, Calendar, Wrench, Settings, Home, HelpCircle, Rocket } from 'lucide-react';
import { useSettingsStore } from '../../../store/settingsStore';
import clsx from 'clsx';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const location = useLocation();
  const { settings } = useSettingsStore();

  const navigation = [
    { name: 'Contacts', href: '/contacts', icon: Users },
    { name: 'Journeys', href: '/journeys', icon: Map },
    { name: settings.featureLabel, href: '/prayer-requests', icon: HeartHandshake },
    { name: `${settings.networkGroupLabel}s`, href: '/network-groups', icon: Network },
    { name: `${settings.checkInLabel}s`, href: '/check-ins', icon: Calendar },
    { name: 'Tools', href: '/tools', icon: Wrench },
    { name: 'Settings', href: '/profile', icon: Settings },
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Help & Documentation', href: '/documentation', icon: HelpCircle },
  ];

  return (
    <div className={clsx('md:hidden', isOpen ? 'block' : 'hidden')}>
      <div className="pt-2 pb-3 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={clsx(
                'block pl-3 pr-4 py-2 text-base font-medium border-l-4',
                location.pathname === item.href
                  ? 'border-white text-white bg-coral-600'
                  : 'border-transparent text-coral-50 hover:text-white hover:bg-coral-500 hover:border-coral-300'
              )}
            >
              <div className="flex items-center">
                <Icon className="h-5 w-5 mr-2" />
                {item.name}
              </div>
            </Link>
          );
        })}
        <a
          href="https://get.missionmind.app"
          target="_blank"
          rel="noopener noreferrer"
          className="block pl-3 pr-4 py-2 text-base font-medium border-l-4 border-transparent text-coral-50 hover:text-white hover:bg-coral-500 hover:border-coral-300"
        >
          <div className="flex items-center">
            <Rocket className="h-5 w-5 mr-2" />
            Mission Mind Home
          </div>
        </a>
      </div>
    </div>
  );
}