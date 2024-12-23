import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { validateEmail, validatePassword } from '../../../utils/validation';

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
  const { signUp } = useAuth();

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
      await signUp(formData.email, formData.password, {
        name: formData.name,
        organization: formData.organization || undefined,
        timezone: formData.timezone,
      });

      // Navigate to email verification page
      navigate('/verify-email', { 
        state: { 
          email: formData.email,
          message: 'Please check your email to verify your account before signing in.' 
        }
      });
    } catch (err) {
      console.error('Sign up error:', err);
      setServerError(err instanceof Error ? err.message : 'Failed to create account');
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