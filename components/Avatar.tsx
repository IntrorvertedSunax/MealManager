import React from 'react';

interface AvatarProps {
  name: string;
}

const Avatar: React.FC<AvatarProps> = ({ name }) => {
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

  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${colorClasses}`}>
      {initial}
    </div>
  );
};

export default Avatar;
