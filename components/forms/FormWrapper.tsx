import React from 'react';
import { XIcon } from '../ui/Icons';

interface FormWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: React.ReactNode;
}

const FormWrapper: React.FC<FormWrapperProps> = ({ isOpen, onClose, title, description, children }) => {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
      <div className={`bg-white rounded-t-2xl shadow-xl w-full max-w-lg transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`} onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><XIcon /></button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default FormWrapper;