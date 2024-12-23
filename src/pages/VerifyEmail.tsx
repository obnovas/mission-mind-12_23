import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Mail } from 'lucide-react';

export function VerifyEmail() {
  const location = useLocation();
  const email = location.state?.email;
  const message = location.state?.message;

  return (
    <AuthLayout title="Verify Your Email">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-100">
          <Mail className="h-6 w-6 text-accent-600" />
        </div>
        <h2 className="mt-3 text-lg font-medium text-neutral-900">Check your email</h2>
        <p className="mt-2 text-sm text-neutral-600">
          {message || `We sent a verification link to ${email || 'your email address'}`}
        </p>
        <div className="mt-6">
          <Link
            to="/signin"
            className="text-sm font-medium text-accent-600 hover:text-accent-500"
          >
            Return to Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}