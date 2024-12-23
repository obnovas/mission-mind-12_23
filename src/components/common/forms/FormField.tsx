import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  icon?: LucideIcon;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
}

export function FormField({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  error,
  icon: Icon,
  required = false,
  placeholder,
  disabled = false,
  multiline = false,
  rows = 3,
}: FormFieldProps) {
  const inputClasses = `
    block w-full rounded-md shadow-sm
    ${error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-neutral-300 focus:border-accent-500 focus:ring-accent-500'
    }
    ${disabled ? 'bg-neutral-50 text-neutral-500' : ''}
  `;

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-neutral-700 mb-1">
        <div className="flex items-center">
          {Icon && <Icon className="h-4 w-4 text-accent-500 mr-2" />}
          {label}
        </div>
      </label>
      <div className="relative">
        <InputComponent
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          rows={multiline ? rows : undefined}
          className={inputClasses}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}