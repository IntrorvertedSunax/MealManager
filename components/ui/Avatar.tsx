import React from 'react';
import { UserIcon } from './Icons';

interface AvatarProps {
  name: string;
  avatar?: string | null;
  size?: 'sm' | 'md-small' | 'md' | 'lg';
}

const Avatar: React.FC<AvatarProps> = ({ name, avatar, size = 'md' }) => {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  
  // Simple hash function to get a consistent color
  const getColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      'bg-red-100 text-red-700',
      'bg-green-100 text-green-700',
      'bg-blue-100 text-blue-700',
      'bg-yellow-100 text-yellow-700',
      'bg-purple-100 text-purple-700',
      'bg-pink-100 text-pink-700',
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  const colorClasses = getColor(name);

  const sizeClasses = {
    sm: 'w-5 h-5 text-xs',
    'md-small': 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-lg',
    lg: 'w-16 h-16 text-2xl',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    'md-small': 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`rounded-full object-cover flex-shrink-0 ${sizeClasses[size]}`}
      />
    );
  }

  if (initial === '?') {
    return (
      <div className={`rounded-full flex items-center justify-center flex-shrink-0 ${sizeClasses[size]} ${colorClasses}`}>
        <UserIcon className={iconSizeClasses[size]} />
      </div>
    );
  }

  return (
    <div className={`rounded-full flex items-center justify-center font-bold flex-shrink-0 ${sizeClasses[size]} ${colorClasses}`}>
      {initial}
    </div>
  );
};

export default Avatar;