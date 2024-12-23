import React from 'react';
import { Link } from 'react-router-dom';
import { FormInput } from './inputs/FormInput';
import { useSignUpForm } from './hooks';
import { GoogleSignInButton } from './buttons/GoogleSignInButton';
import { AuthError } from './components/AuthError';
import { AuthButton } from './components/AuthButton';

export function SignUpForm() {
  const {
    formData,
    errors,
    loading,
    serverError,
    handleChange,
    handleSubmit,
  } = useSignUpForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AuthError error={serverError} />

      <FormInput
        id="name"
        name="name"
        label="Name"
        value={formData.name}
        onChange={handleChange}
        required
        error={errors.name}
      />

      <FormInput
        id="email"
        name="email"
        label="Email address"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        autoComplete="email"
        error={errors.email}
      />

      <FormInput
        id="password"
        name="password"
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
        autoComplete="new-password"
        error={errors.password}
        showPasswordToggle
      />

      <FormInput
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        autoComplete="new-password"
        error={errors.confirmPassword}
        showPasswordToggle
      />

      <AuthButton
        type="submit"
        loading={loading}
      >
        Create Account
      </AuthButton>

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
        <Link to="/signin" className="font-medium text-accent-600 hover:text-accent-500">
          Already have an account? Sign in
        </Link>
      </div>
    </form>
  );
}