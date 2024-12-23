import { useState } from 'react';
import { validateEmail, validatePassword } from '../../../utils/validation';

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
}

export function useAuthForm(isSignUp = false) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (isSignUp && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setLoading,
    setServerError,
    validateForm,
    handleChange,
  };
}