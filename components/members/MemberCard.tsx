import React from 'react';
import { Member } from '../../types';
import { TrashIcon, PencilIcon } from '../ui/Icons';
import Avatar from '../ui/Avatar';

interface MemberCardProps {
  member: Member;
  onRemove: () => void;
  onEdit: () => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onRemove, onEdit }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg flex items-center justify-between transition-colors hover:bg-slate-100 dark:hover:bg-slate-700/50">
      <div className="flex items-center">
        <Avatar name={member.name} avatar={member.avatar} />
        <span className="font-bold text-lg text-slate-700 dark:text-slate-200 ml-4">{member.name}</span>
      </div>
      <div className="flex items-center">
        <button 
          onClick={onEdit} 
          className="text-teal-600 hover:text-teal-800 transition-colors p-2 rounded-full"
          aria-label={`Edit ${member.name}`}
        >
          <PencilIcon />
        </button>
        <button 
          onClick={onRemove} 
          className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full"
          aria-label={`Remove ${member.name}`}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default MemberCard;
