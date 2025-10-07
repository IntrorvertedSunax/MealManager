import React from 'react';
import { MenuIcon } from './Icons';
import ThemeToggleButton from './ThemeToggleButton';

interface HeaderProps {
  title: string;
  onOpenMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onOpenMenu }) => {
  return (
    <header className="bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm dark:border-b dark:border-slate-700 sticky top-0 z-40 flex-shrink-0">
      <div className="container mx-auto px-4 py-4 md:px-8 relative flex items-center justify-center">
        {/* Absolute positioning for the menu button on mobile */}
        <div className="absolute left-4 md:hidden">
          <button onClick={onOpenMenu} className="text-slate-600 dark:text-slate-300">
            <MenuIcon />
          </button>
        </div>
        
        {/* Centered title */}
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            {title}
          </h1>
        </div>

        <div className="absolute right-4">
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
};

export default Header;