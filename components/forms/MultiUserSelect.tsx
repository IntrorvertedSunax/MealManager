import React, { useState, useRef, useEffect } from 'react';
import { Member } from '../../types';
import Avatar from '../ui/Avatar';
import { UpDownIcon, CheckIcon } from '../ui/Icons';

interface MultiMemberSelectProps {
  members: Member[];
  selectedMemberIds: string[];
  onChange: (memberIds: string[]) => void;
  placeholder?: string;
}

const MultiMemberSelect: React.FC<MultiMemberSelectProps> = ({ members, selectedMemberIds, onChange, placeholder = "Select members" }) => {
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

  const handleToggleMember = (memberId: string) => {
    const newSelection = selectedMemberIds.includes(memberId)
      ? selectedMemberIds.filter(id => id !== memberId)
      : [...selectedMemberIds, memberId];
    onChange(newSelection);
  };

  const buttonClasses = "w-full flex items-center gap-3 px-3 py-3 text-left bg-white dark:bg-slate-700 dark:border-slate-600 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition";
  
  const selectionText = selectedMemberIds.length === 0
    ? placeholder
    : selectedMemberIds.length === 1
    ? `${members.find(u => u.id === selectedMemberIds[0])?.name}`
    : `${selectedMemberIds.length} members selected`;

  return (
    <div ref={wrapperRef} className="relative">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={buttonClasses} aria-haspopup="listbox" aria-expanded={isOpen}>
        <span className="font-semibold text-slate-800 dark:text-slate-100 flex-grow">{selectionText}</span>
        <UpDownIcon className="text-slate-500 dark:text-slate-400 h-5 w-5" />
      </button>

      {isOpen && (
        <ul
          className="absolute z-10 bottom-full mb-1 w-full bg-white dark:bg-slate-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black dark:ring-white ring-opacity-5 dark:ring-opacity-10 overflow-auto focus:outline-none sm:text-sm"
          tabIndex={-1}
          role="listbox"
        >
          {members.map(member => {
            const isSelected = selectedMemberIds.includes(member.id);
            return (
                <li key={member.id} role="option" aria-selected={isSelected}>
                <button
                    type="button"
                    onClick={() => handleToggleMember(member.id)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-slate-900 dark:text-slate-100 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                    <div className={`w-5 h-5 flex-shrink-0 border-2 rounded-md flex items-center justify-center ${isSelected ? 'bg-teal-600 border-teal-600' : 'border-slate-300 dark:border-slate-500'}`}>
                        {isSelected && <CheckIcon className="h-4 w-4 text-white" />}
                    </div>
                    <Avatar name={member.name} avatar={member.avatar} size="md-small" />
                    <span className="font-medium">{member.name}</span>
                </button>
                </li>
            );
            })}
        </ul>
      )}
    </div>
  );
};

export default MultiMemberSelect;
