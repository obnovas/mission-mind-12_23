import React from 'react';

interface FormActionsProps {
  onCancel: () => void;
  loading?: boolean;
  isUpdate?: boolean;
  label: string;
}

export function FormActions({ onCancel, loading, isUpdate, label }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200">
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : isUpdate ? `Update ${label}` : `Add ${label}`}
      </button>
    </div>
  );
}