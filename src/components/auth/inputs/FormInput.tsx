import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  error?: string;
  showPasswordToggle?: boolean;
}

export function FormInput({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  autoComplete,
  placeholder,
  error,
  showPasswordToggle = false,
}: FormInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-neutral-700">
        {label}
      </label>
      <div className="mt-1 relative">
        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-accent-500 sm:text-sm ${
            error
              ? 'border-red-300 focus:border-red-500'
              : 'border-neutral-300 focus:border-accent-500'
          } ${showPasswordToggle ? 'pr-10' : ''}`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-500"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}