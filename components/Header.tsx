import React from 'react';
import { MenuIcon } from './Icons';

interface HeaderProps {
  title: string;
  onOpenMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onOpenMenu }) => {
  const displayDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="bg-gray-50 sticky top-0 z-40 flex-shrink-0">
      <div className="container mx-auto px-4 py-4 md:px-8 relative flex items-center justify-center">
        {/* Absolute positioning for the menu button on mobile */}
        <div className="absolute left-4 md:hidden">
          <button onClick={onOpenMenu} className="text-gray-600">
            <MenuIcon />
          </button>
        </div>
        
        {/* Centered title and date */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-800">
            {title}
          </h1>
          <div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
            {displayDate}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;