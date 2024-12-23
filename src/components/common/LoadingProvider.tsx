import React from 'react';
import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  setLoading: (loading) => {
    if (loading) {
      // Add 300ms delay before showing loader
      const timeout = setTimeout(() => {
        set({ isLoading: true });
      }, 300);
      return () => clearTimeout(timeout);
    }
    set({ isLoading: false });
  },
}));

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const isLoading = useLoadingStore((state) => state.isLoading);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-accent-200 border-t-accent-600 rounded-full animate-spin" />
            <p className="text-neutral-600 font-medium">Loading...</p>
          </div>
        </div>
      )}
      {children}
    </>
  );
}