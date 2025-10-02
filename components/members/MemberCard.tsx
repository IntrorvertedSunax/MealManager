import React from 'react';
import { User } from '../../types';
import { TrashIcon } from '../ui/Icons';
import Avatar from '../ui/Avatar';

interface MemberCardProps {
  user: User;
  onRemove: () => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ user, onRemove }) => {
  return (
    <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between transition-colors hover:bg-gray-100">
      <div className="flex items-center">
        <Avatar name={user.name} avatar={user.avatar} />
        <span className="font-bold text-lg text-gray-700 ml-4">{user.name}</span>
      </div>
      <div className="flex items-center">
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