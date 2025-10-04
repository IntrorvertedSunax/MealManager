import React from 'react';
import { User } from '../../types';
import { TrashIcon, PencilIcon } from '../ui/Icons';
import Avatar from '../ui/Avatar';

interface MemberCardProps {
  user: User;
  onRemove: () => void;
  onEdit: () => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ user, onRemove, onEdit }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg flex items-center justify-between transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50">
      <div className="flex items-center">
        <Avatar name={user.name} avatar={user.avatar} />
        <span className="font-bold text-lg text-gray-700 dark:text-gray-200 ml-4">{user.name}</span>
      </div>
      <div className="flex items-center">
        <button 
          onClick={onEdit} 
          className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-full"
          aria-label={`Edit ${user.name}`}
        >
          <PencilIcon />
        </button>
        <button 
          onClick={onRemove} 
          className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full"
          aria-label={`Remove ${user.name}`}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default MemberCard;