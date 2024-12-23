import React from 'react';
import { AuthLayout } from '../AuthLayout';
import { SignUpForm } from './SignUpForm';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  organization?: string;
  timezone: string;
}

export function SignUpContainer() {
  return (
    <AuthLayout title="Create your account">
      <SignUpForm />
    </AuthLayout>
  );
}