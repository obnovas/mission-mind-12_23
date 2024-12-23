import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  error?: string;
  icon?: LucideIcon;
  required?: boolean;
  disabled?: boolean;
}

export function SelectField({
  id,
  name,
  label,
  value,
  onChange,
  options,
  error,
  icon: Icon,
  required = false,
  disabled = false,
}: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-neutral-700 mb-1">
        <div className="flex items-center">
          {Icon && <Icon className="h-4 w-4 text-accent-500 mr-2" />}
          {label}
        </div>
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`
          block w-full rounded-md shadow-sm
          ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-neutral-300 focus:border-accent-500 focus:ring-accent-500'
          }
          ${disabled ? 'bg-neutral-50 text-neutral-500' : ''}
        `}
      >
        {options.map(({ value, label, disabled }) => (
          <option key={value} value={value} disabled={disabled}>
            {label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}