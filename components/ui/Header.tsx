import React from 'react';
import { MenuIcon } from './Icons';

interface HeaderProps {
  title: string;
  onOpenMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onOpenMenu }) => {
  return (
    <header className="bg-gray-50 sticky top-0 z-40 flex-shrink-0">
      <div className="container mx-auto px-4 py-4 md:px-8 relative flex items-center justify-center">
        {/* Absolute positioning for the menu button on mobile */}
        <div className="absolute left-4 md:hidden">
          <button onClick={onOpenMenu} className="text-gray-600">
            <MenuIcon />
          </button>
        </div>
        
        {/* Centered title */}
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;