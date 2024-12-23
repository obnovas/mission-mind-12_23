import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Map, HeartHandshake, Network, Calendar, Wrench, Settings } from 'lucide-react';
import { useSettingsStore } from '../../../store/settingsStore';
import clsx from 'clsx';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  hideLabel?: boolean;
}

export function MainNav() {
  const location = useLocation();
  const { settings } = useSettingsStore();

  const navigation: NavItem[] = [
    { name: 'Contacts', href: '/contacts', icon: Users },
    { name: 'Journeys', href: '/journeys', icon: Map },
    { name: settings.featureLabel, href: '/prayer-requests', icon: HeartHandshake },
    { name: `${settings.networkGroupLabel}s`, href: '/network-groups', icon: Network },
    { name: `${settings.checkInLabel}s`, href: '/check-ins', icon: Calendar },
    { name: 'Tools', href: '/tools', icon: Wrench },
  ];

  // Settings is separated as a special case
  const settingsItem = { name: 'Settings', href: '/profile', icon: Settings, hideLabel: true };

  return (
    <div className="hidden md:flex md:items-center md:justify-between md:flex-grow">
      <div className="flex items-center md:ml-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                'inline-flex items-center px-3 py-2 text-sm font-medium border-b-2',
                location.pathname === item.href
                  ? 'border-white text-white'
                  : 'border-transparent text-coral-50 hover:text-white hover:border-coral-300'
              )}
            >
              <Icon className="h-5 w-5 mr-1.5" />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Settings button aligned to the right */}
      <Link
        to={settingsItem.href}
        className={clsx(
          'inline-flex items-center px-3 py-2 text-sm font-medium border-b-2 ml-auto',
          location.pathname === settingsItem.href
            ? 'border-white text-white'
            : 'border-transparent text-coral-50 hover:text-white hover:border-coral-300'
        )}
        title="Settings"
      >
        <settingsItem.icon className="h-5 w-5" />
      </Link>
    </div>
  );
}