import React from 'react';
import { User } from '../types';
import { TrashIcon, PencilIcon } from './Icons';
import Avatar from './Avatar';

interface MemberCardProps {
  user: User;
  onRemove: () => void;
  onEdit: () => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ user, onRemove, onEdit }) => {
  return (
    <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between transition-colors hover:bg-gray-100">
      <div className="flex items-center">
        <Avatar name={user.name} />
        <span className="font-semibold text-gray-700 ml-4">{user.name}</span>
      </div>
      <div className="flex items-center">
        <button 
          onClick={onEdit} 
          className="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-full"
          aria-label={`Edit ${user.name}`}
        >
          <PencilIcon />
        </button>
        <button 
          onClick={onRemove} 
          className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full"
          aria-label={`Remove ${user.name}`}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default MemberCard;