import React from 'react';
import { Link } from 'react-router-dom';
import { FormInput } from '../inputs/FormInput';
import { useSignUpForm } from './useSignUpForm';
import timezones from '../../../utils/timezones';

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
    <form className="space-y-6" onSubmit={handleSubmit}>
      {serverError && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{serverError}</p>
        </div>
      )}

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
        id="organization"
        name="organization"
        label="Organization (optional)"
        value={formData.organization}
        onChange={handleChange}
      />

      <div>
        <label htmlFor="timezone" className="block text-sm font-medium text-neutral-700">
          Timezone
        </label>
        <select
          id="timezone"
          name="timezone"
          value={formData.timezone}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-accent-500 focus:outline-none focus:ring-accent-500 sm:text-sm"
        >
          {timezones.map(tz => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </div>

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

      <div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-md border border-transparent bg-accent-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>

      <div className="text-sm text-center">
        <Link to="/signin" className="font-medium text-accent-600 hover:text-accent-500">
          Already have an account? Sign in
        </Link>
      </div>
    </form>
  );
}