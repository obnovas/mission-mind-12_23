import React from 'react';
import { Key, Copy, RefreshCw, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { useSettingsStore } from '../../../store/settingsStore';
import { generateApiKey } from '../../../api/auth/service';

export function ApiKeySection() {
  const [showKey, setShowKey] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { user } = useAuthStore();
  const { settings, updateSettings } = useSettingsStore();

  const handleGenerateKey = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const response = await generateApiKey(user.id);
      if (response.success && response.data) {
        await updateSettings({ apiKey: response.data.key });
        setShowKey(true);
      } else {
        throw new Error(response.error?.message || 'Failed to generate API key');
      }
    } catch (err) {
      console.error('Error generating API key:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate API key');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!settings.apiKey) return;
    try {
      await navigator.clipboard.writeText(settings.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Key className="h-5 w-5 text-accent-600" />
          <h3 className="text-sm font-medium text-neutral-700">API Key</h3>
        </div>
        <button
          onClick={handleGenerateKey}
          disabled={loading}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-white bg-accent-600 hover:bg-accent-700 disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-1.5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Generate New Key
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-start">
          <AlertCircle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {settings.apiKey && (
        <div className="p-3 bg-neutral-50 rounded-md">
          <div className="flex items-center justify-between">
            <code className="text-sm font-mono break-all">
              {showKey ? settings.apiKey : '••••••••••••••••••••••••••••••••'}
            </code>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowKey(!showKey)}
                className="p-1 text-neutral-500 hover:text-neutral-700"
                title={showKey ? 'Hide API key' : 'Show API key'}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                onClick={handleCopy}
                className="p-1 text-neutral-500 hover:text-neutral-700"
                title="Copy API key"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
          {copied && (
            <p className="mt-1 text-xs text-sage-600">Copied to clipboard!</p>
          )}
          <p className="mt-2 text-xs text-neutral-500">
            Keep this key secure. You can generate a new key at any time, which will invalidate the old one.
          </p>
        </div>
      )}

      <div className="text-sm text-neutral-600">
        <p>Use this API key to authenticate requests to the Mission Mind API.</p>
        <p className="mt-1">
          <a 
            href="/api-docs" 
            className="text-accent-600 hover:text-accent-700"
          >
            View API documentation →
          </a>
        </p>
      </div>
    </div>
  );
}