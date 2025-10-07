import React, { useState, useRef, useEffect } from 'react';
import { Member } from '../../types';
import Avatar from '../ui/Avatar';
import { UpDownIcon, UserIcon as MemberIcon } from '../ui/Icons';

interface MemberSelectProps {
  members: Member[];
  selectedMemberId: string | null;
  onChange: (memberId: string) => void;
  placeholder?: string;
}

const MemberSelect: React.FC<MemberSelectProps> = ({ members, selectedMemberId, onChange, placeholder = "Select a member" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedMember = members.find(u => u.id === selectedMemberId);
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

  const handleSelect = (memberId: string) => {
    onChange(memberId);
    setIsOpen(false);
  };

  const buttonClasses = "w-full flex items-center gap-3 px-3 py-3 text-left bg-white dark:bg-slate-700 dark:border-slate-600 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition";

  return (
    <div ref={wrapperRef} className="relative">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={buttonClasses} aria-haspopup="listbox" aria-expanded={isOpen}>
        {selectedMember ? (
          <>
            <Avatar name={selectedMember.name} avatar={selectedMember.avatar} size="md-small" />
            <span className="font-semibold text-slate-800 dark:text-slate-100 flex-grow">{selectedMember.name}</span>
          </>
        ) : (
          <>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-600 text-slate-400 flex items-center justify-center">
                <MemberIcon className="w-5 h-5" />
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
          aria-label="Members"
        >
          {members.map(member => (
            <li key={member.id} role="option" aria-selected={member.id === selectedMemberId}>
              <button
                type="button"
                onClick={() => handleSelect(member.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left text-slate-900 dark:text-slate-100 transition-colors ${member.id === selectedMemberId ? 'bg-teal-50 dark:bg-teal-900/50' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                <Avatar name={member.name} avatar={member.avatar} size="md-small" />
                <span className="font-medium">{member.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MemberSelect;
