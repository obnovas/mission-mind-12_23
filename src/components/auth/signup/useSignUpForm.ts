import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { handleAuthError } from '../../../lib/auth/errors';
import { validateEmail, validatePassword } from '../../../utils/validation';
import { useSettingsStore } from '../../../store/settingsStore';

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  organization: string;
  timezone: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
}

export function useSignUpForm() {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    organization: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { updateSettings } = useSettingsStore();

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Create auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            organization: formData.organization || undefined,
            timezone: formData.timezone,
          },
          emailRedirectTo: `${window.location.origin}/signin`,
        },
      });

      if (signUpError) throw signUpError;
      if (!data?.user) throw new Error('Failed to create account');

      // Initialize user settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .insert({
          user_id: data.user.id,
          timezone: formData.timezone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (settingsError) throw settingsError;

      // Update local settings
      updateSettings({
        userName: formData.name,
        timezone: formData.timezone,
      });

      // Navigate to sign in
      navigate('/signin');
    } catch (err) {
      const authError = handleAuthError(err);
      setServerError(authError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is modified
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return {
    formData,
    errors,
    loading,
    serverError,
    handleChange,
    handleSubmit,
  };
}