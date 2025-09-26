import React, { useEffect, useState } from 'react';
import { ToastMessage } from '../types';
import { XIcon } from './Icons';

interface ToastProps {
  message: ToastMessage;
  onDismiss: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ message, onDismiss }) => {
  const { id, title, description, type } = message;
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(id), 300); // Wait for animation to finish
  };

  const config = {
    success: {
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
      color: 'green',
    },
    error: {
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />,
      color: 'red',
    },
  };
  
  const { icon, color } = config[type];
  const iconColor = `text-${color}-500`;

  return (
    <div className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${isExiting ? 'toast-out' : 'toast-in'}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${iconColor}`}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {icon}
            </svg>
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900">{title}</p>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button onClick={handleDismiss} className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="sr-only">Close</span>
              <XIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
