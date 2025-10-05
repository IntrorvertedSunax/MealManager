import React, { useState, useRef, useEffect } from 'react';
import { User } from '../../types';
import Avatar from '../ui/Avatar';
import { UpDownIcon, CheckIcon } from '../ui/Icons';

interface MultiUserSelectProps {
  users: User[];
  selectedUserIds: string[];
  onChange: (userIds: string[]) => void;
  placeholder?: string;
}

const MultiUserSelect: React.FC<MultiUserSelectProps> = ({ users, selectedUserIds, onChange, placeholder = "Select members" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleToggleUser = (userId: string) => {
    const newSelection = selectedUserIds.includes(userId)
      ? selectedUserIds.filter(id => id !== userId)
      : [...selectedUserIds, userId];
    onChange(newSelection);
  };

  const buttonClasses = "w-full flex items-center gap-3 px-3 py-3 text-left bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";
  
  const selectionText = selectedUserIds.length === 0
    ? placeholder
    : selectedUserIds.length === 1
    ? `${users.find(u => u.id === selectedUserIds[0])?.name}`
    : `${selectedUserIds.length} members selected`;

  return (
    <div ref={wrapperRef} className="relative">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={buttonClasses} aria-haspopup="listbox" aria-expanded={isOpen}>
        <span className="font-semibold text-gray-800 dark:text-gray-100 flex-grow">{selectionText}</span>
        <UpDownIcon className="text-gray-500 dark:text-gray-400 h-5 w-5" />
      </button>

      {isOpen && (
        <ul
          className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black dark:ring-white ring-opacity-5 dark:ring-opacity-10 overflow-auto focus:outline-none sm:text-sm"
          tabIndex={-1}
          role="listbox"
        >
          {users.map(user => {
            const isSelected = selectedUserIds.includes(user.id);
            return (
                <li key={user.id} role="option" aria-selected={isSelected}>
                <button
                    type="button"
                    onClick={() => handleToggleUser(user.id)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-900 dark:text-gray-100 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <div className={`w-5 h-5 flex-shrink-0 border-2 rounded-md flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-gray-500'}`}>
                        {isSelected && <CheckIcon className="h-4 w-4 text-white" />}
                    </div>
                    <Avatar name={user.name} avatar={user.avatar} size="md-small" />
                    <span className="font-medium">{user.name}</span>
                </button>
                </li>
            );
            })}
        </ul>
      )}
    </div>
  );
};

export default MultiUserSelect;
