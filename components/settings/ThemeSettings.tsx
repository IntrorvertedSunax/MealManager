import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../../data';
import { SunIcon, MoonIcon, ComputerDesktopIcon, CheckIcon } from '../ui/Icons';
import { AppSettings } from '../../types';

const ThemeSettings = () => {
  const [selectedTheme, setSelectedTheme] = useState(() => getSettings().theme);

  useEffect(() => {
    const applyTheme = (theme: AppSettings['theme']) => {
      const root = window.document.documentElement;
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      root.classList.toggle('dark', isDark);
    };
    
    applyTheme(selectedTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (selectedTheme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [selectedTheme]);

  const handleThemeChange = (theme: AppSettings['theme']) => {
    setSelectedTheme(theme);
    saveSettings({ theme });
  };

  // FIX: Refactored to store component references in the `themes` array instead of instantiated elements.
  // This allows direct rendering with props, which is more type-safe and avoids issues with `React.cloneElement`.
  const themes = [
    { name: 'system', label: 'System', icon: ComputerDesktopIcon, description: 'Follows OS setting' },
    { name: 'light', label: 'Light', icon: SunIcon },
    { name: 'dark', label: 'Dark', icon: MoonIcon },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Appearance</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Select your preferred interface theme.</p>
      
      <fieldset>
        <legend className="sr-only">Theme selection</legend>
        <div className="space-y-3">
          {themes.map(theme => {
            const Icon = theme.icon;
            return (
              <div key={theme.name}>
                <input
                  type="radio"
                  id={theme.name}
                  name="theme"
                  value={theme.name}
                  checked={selectedTheme === theme.name}
                  onChange={() => handleThemeChange(theme.name as AppSettings['theme'])}
                  className="sr-only"
                />
                <label
                  htmlFor={theme.name}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedTheme === theme.name
                      ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/30'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className={`mr-4 ${selectedTheme === theme.name ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-grow">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{theme.label}</span>
                    {theme.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">{theme.description}</p>
                    )}
                  </div>
                  {selectedTheme === theme.name && (
                    <div className="text-teal-600 dark:text-teal-400">
                      <CheckIcon className="h-6 w-6" />
                    </div>
                  )}
                </label>
              </div>
            )
          })}
        </div>
      </fieldset>
    </div>
  );
};

export default ThemeSettings;