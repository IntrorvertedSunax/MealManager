import React, { useState, useCallback } from 'react';
import Toast from './Toast';
import { ToastMessage } from '../../types';

let toastId = 0;

// --- Event Emitter for global access ---
type ToastListener = (toasts: ToastMessage[]) => void;
let listeners: ToastListener[] = [];
let toasts: ToastMessage[] = [];

const toastEmitter = {
  add: (title: string, description: string, type: 'success' | 'error') => {
    const newToast = { id: toastId++, title, description, type };
    toasts = [...toasts, newToast];
    listeners.forEach(listener => listener(toasts));
  },
  remove: (id: number) => {
    toasts = toasts.filter(t => t.id !== id);
    listeners.forEach(listener => listener(toasts));
  },
  subscribe: (listener: ToastListener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
};

// --- Global toast functions ---
export const toast = {
  success: (title: string, description: string) => toastEmitter.add(title, description, 'success'),
  error: (title: string, description: string) => toastEmitter.add(title, description, 'error'),
};

// --- Toaster Component ---
export const Toaster: React.FC = () => {
  const [activeToasts, setActiveToasts] = useState<ToastMessage[]>([]);

  React.useEffect(() => {
    const unsubscribe = toastEmitter.subscribe(setActiveToasts);
    return () => unsubscribe();
  }, []);

  const handleDismiss = useCallback((id: number) => {
    toastEmitter.remove(id);
  }, []);

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-start px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[100]"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {activeToasts.map((message) => (
          <Toast key={message.id} message={message} onDismiss={handleDismiss} />
        ))}
      </div>
    </div>
  );
};
