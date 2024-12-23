import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FormField } from '../common/forms/FormField';
import { Button } from '../common/buttons/Button';
import { AuthError } from '../common/AuthError';
import { GoogleSignInButton } from './GoogleSignInButton';
import { Mail, Lock } from 'lucide-react';

export function SignInForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { signIn, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by useAuth hook
      console.error('Sign in error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthError error={error} />

        <FormField
          id="email"
          name="email"
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          icon={Mail}
        />

        <FormField
          id="password"
          name="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          icon={Lock}
        />

        <div className="flex items-center justify-between">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-accent-600 hover:text-accent-500"
          >
            Forgot your password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          fullWidth
        >
          Sign in
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-neutral-500">Or continue with</span>
        </div>
      </div>

      <GoogleSignInButton />

      <div className="text-sm text-center">
        <Link to="/signup" className="font-medium text-accent-600 hover:text-accent-500">
          Don't have an account? Sign up
        </Link>
      </div>
    </div>
  );
}