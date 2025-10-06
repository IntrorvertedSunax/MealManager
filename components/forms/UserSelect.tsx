import React, { useState, useRef, useEffect } from 'react';
import { User } from '../../types';
import Avatar from '../ui/Avatar';
import { UpDownIcon, UserIcon } from '../ui/Icons';

interface UserSelectProps {
  users: User[];
  selectedUserId: string | null;
  onChange: (userId: string) => void;
  placeholder?: string;
}

const UserSelect: React.FC<UserSelectProps> = ({ users, selectedUserId, onChange, placeholder = "Select a user" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedUser = users.find(u => u.id === selectedUserId);
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

  const handleSelect = (userId: string) => {
    onChange(userId);
    setIsOpen(false);
  };

  const buttonClasses = "w-full flex items-center gap-3 px-3 py-3 text-left bg-white dark:bg-slate-700 dark:border-slate-600 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition";

  return (
    <div ref={wrapperRef} className="relative">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={buttonClasses} aria-haspopup="listbox" aria-expanded={isOpen}>
        {selectedUser ? (
          <>
            <Avatar name={selectedUser.name} avatar={selectedUser.avatar} size="md-small" />
            <span className="font-semibold text-slate-800 dark:text-slate-100 flex-grow">{selectedUser.name}</span>
          </>
        ) : (
          <>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-600 text-slate-400 flex items-center justify-center">
                <UserIcon className="w-5 h-5" />
            </div>
            <span className="text-slate-500 dark:text-slate-400 flex-grow">{placeholder}</span>
          </>
        )}
        <UpDownIcon className="text-slate-500 dark:text-slate-400 h-5 w-5" />
      </button>

      {isOpen && (
        <ul
          className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black dark:ring-white ring-opacity-5 dark:ring-opacity-10 overflow-auto focus:outline-none sm:text-sm"
          tabIndex={-1}
          role="listbox"
          aria-label="Users"
        >
          {users.map(user => (
            <li key={user.id} role="option" aria-selected={user.id === selectedUserId}>
              <button
                type="button"
                onClick={() => handleSelect(user.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left text-slate-900 dark:text-slate-100 transition-colors ${user.id === selectedUserId ? 'bg-teal-50 dark:bg-teal-900/50' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                <Avatar name={user.name} avatar={user.avatar} size="md-small" />
                <span className="font-medium">{user.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSelect;