import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

export class DatabaseErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Database error caught:', error);
  }

  handleRetry = () => {
    this.setState(state => ({
      hasError: false,
      error: null,
      retryCount: state.retryCount + 1
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="max-w-md w-full mx-4 p-6 bg-white rounded-lg shadow-lg border border-neutral-200">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-coral-600" />
              <h2 className="text-lg font-semibold text-neutral-900">Connection Error</h2>
            </div>
            <p className="text-neutral-600 mb-4">
              {this.state.error?.message || 'Unable to connect to the database.'}
            </p>
            <p className="text-neutral-600 mb-4">This might be due to:</p>
            <ul className="list-disc list-inside text-neutral-600 mb-6 space-y-2">
              <li>Temporary connection issues</li>
              <li>Server maintenance</li>
              <li>Network connectivity problems</li>
            </ul>
            <button
              onClick={this.handleRetry}
              className="w-full flex items-center justify-center px-4 py-2 bg-accent-600 text-white rounded-md hover:bg-accent-700 transition-colors duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again {this.state.retryCount > 0 && `(${this.state.retryCount})`}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}