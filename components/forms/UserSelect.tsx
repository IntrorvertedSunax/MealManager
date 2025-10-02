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

  const buttonClasses = "w-full flex items-center gap-2 px-3 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition";

  return (
    <div ref={wrapperRef} className="relative">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={buttonClasses} aria-haspopup="listbox" aria-expanded={isOpen}>
        {selectedUser ? (
          <>
            <Avatar name={selectedUser.name} avatar={selectedUser.avatar} size="sm" />
            <span className="font-semibold text-gray-800 flex-grow text-sm">{selectedUser.name}</span>
          </>
        ) : (
          <>
            <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                <UserIcon className="w-4 h-4" />
            </div>
            <span className="text-gray-500 flex-grow text-sm">{placeholder}</span>
          </>
        )}
        <UpDownIcon className="text-gray-500 h-5 w-5" />
      </button>

      {isOpen && (
        <ul
          className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
          tabIndex={-1}
          role="listbox"
          aria-label="Users"
        >
          {users.map(user => (
            <li key={user.id} role="option" aria-selected={user.id === selectedUserId}>
              <button
                type="button"
                onClick={() => handleSelect(user.id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 text-left text-gray-900 transition-colors ${user.id === selectedUserId ? 'bg-green-50' : 'hover:bg-gray-100'}`}
              >
                <Avatar name={user.name} avatar={user.avatar} size="sm" />
                <span className="font-medium text-sm">{user.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSelect;
