import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Map, HeartHandshake, Network, Home, Calendar, Wrench, Menu, X, Rocket, LogOut, Settings } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useAuth } from '../../hooks/useAuth';
import clsx from 'clsx';

export function Navigation() {
  const location = useLocation();
  const { settings } = useSettingsStore();
  const { signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Contacts', href: '/contacts', icon: Users },
    { name: 'Journeys', href: '/journeys', icon: Map },
    { name: settings.featureLabel, href: '/prayer-requests', icon: HeartHandshake },
    { name: `${settings.networkGroupLabel}s`, href: '/network-groups', icon: Network },
    { name: `${settings.checkInLabel}s`, href: '/check-ins', icon: Calendar },
    { name: 'Tools', href: '/tools', icon: Wrench },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-coral-500 to-coral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="rounded-full bg-coral-100 p-2">
                <Rocket className="h-6 w-6 text-coral-600" />
              </div>
              <span className="text-xl font-black text-white font-roboto">MISSION MIND</span>
            </Link>

            {/* Main Navigation */}
            <div className="hidden md:flex md:items-center md:ml-4">
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
          </div>

          {/* Settings and Logout Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            <Link
              to="/profile"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-coral-50 hover:text-white transition-colors duration-200"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-coral-50 hover:text-white transition-colors duration-200"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-coral-50 hover:text-white"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={clsx('md:hidden', isMenuOpen ? 'block' : 'hidden')}>
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
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
          <Link
            to="/profile"
            className="block pl-3 pr-4 py-2 text-base font-medium border-l-4 border-transparent text-coral-50 hover:text-white hover:bg-coral-500 hover:border-coral-300"
          >
            <div className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </div>
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full text-left pl-3 pr-4 py-2 text-base font-medium border-l-4 border-transparent text-coral-50 hover:text-white hover:bg-coral-500 hover:border-coral-300"
          >
            <div className="flex items-center">
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}