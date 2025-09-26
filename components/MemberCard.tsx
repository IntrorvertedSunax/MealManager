import React from 'react';
import { User } from '../types';
import { TrashIcon } from './Icons';
import Avatar from './Avatar';

interface MemberCardProps {
  user: User;
  onRemove: (userId: string) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ user, onRemove }) => {
  return (
    <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between transition-colors hover:bg-gray-100">
      <div className="flex items-center">
        <Avatar name={user.name} />
        <span className="font-semibold text-gray-700 ml-4">{user.name}</span>
      </div>
      <button 
        onClick={() => onRemove(user.id)} 
        className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full"
        aria-label={`Remove ${user.name}`}
      >
        <TrashIcon />
      </button>
    </div>
  );
};

export default MemberCard;
