import React from 'react';
import { CalendarDays, Copy, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { getFeedUrl } from '../../utils/ics/generateFeedToken';

export function CalendarFeedCard() {
  const [feedUrl, setFeedUrl] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const { user } = useAuthStore();
  const { settings } = useSettingsStore();

  const fetchFeedUrl = React.useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const url = await getFeedUrl(user.id);
      setFeedUrl(url);
    } catch (err) {
      console.error('Error fetching feed URL:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    fetchFeedUrl();
  }, [fetchFeedUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(feedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  const handleRefresh = () => {
    fetchFeedUrl();
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-sage-500 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CalendarDays className="h-5 w-5 text-sage-600 mr-2" />
            <h2 className="text-xl font-semibold text-neutral-900">Calendar Feed</h2>
          </div>
        </div>
        <p className="text-neutral-600 mb-6">
          Add your {settings.checkInLabel.toLowerCase()}s to your calendar app by subscribing to this feed URL. The feed will automatically update when changes are made.
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={feedUrl}
              readOnly
              className="flex-1 rounded-md border-neutral-300 bg-neutral-50 focus:border-sage-500 focus:ring-sage-500"
            />
            <button
              onClick={handleCopy}
              className="p-2 text-sage-600 hover:text-sage-700 transition-colors duration-200"
              title="Copy URL"
            >
              <Copy className="h-5 w-5" />
            </button>
            <button
              onClick={handleRefresh}
              className="p-2 text-sage-600 hover:text-sage-700 transition-colors duration-200"
              title="Generate new URL"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>

          {copied && (
            <p className="text-sm text-sage-600">
              URL copied to clipboard!
            </p>
          )}

          <div className="text-sm text-neutral-500">
            <h3 className="font-medium text-neutral-700 mb-2">How to use:</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Copy the feed URL above</li>
              <li>In your calendar app, look for an option to "Add Calendar" or "Subscribe to Calendar"</li>
              <li>Choose "Add by URL" or "Subscribe by URL"</li>
              <li>Paste the feed URL and save</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}