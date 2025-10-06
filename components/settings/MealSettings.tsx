import React, { useState, useEffect, useMemo } from 'react';
import { saveSettings, getSettings } from '../../data';
import { MealOption, AppSettings } from '../../types';
import { toast } from '../ui/Toaster';
import Button from '../ui/Button';

const MealSettings = () => {
  const [initialSettings, setInitialSettings] = useState<AppSettings>(() => getSettings());
  const [currentSettings, setCurrentSettings] = useState<AppSettings>(() => getSettings());

  useEffect(() => {
    const settings = getSettings();
    setInitialSettings(settings);
    setCurrentSettings(settings);
  }, []);

  const hasChanges = useMemo(() => {
    if (initialSettings.enabledMeals.length !== currentSettings.enabledMeals.length ||
        !initialSettings.enabledMeals.every(meal => currentSettings.enabledMeals.includes(meal))) {
      return true;
    }
    
    const allMealKeys = Array.from(new Set([...Object.keys(initialSettings.defaultMealValues), ...Object.keys(currentSettings.defaultMealValues)])) as MealOption[];

    for (const meal of allMealKeys) {
      const initialValue = initialSettings.defaultMealValues[meal] ?? 0;
      const currentValue = currentSettings.defaultMealValues[meal] ?? 0;
      if (initialValue !== currentValue) {
        return true;
      }
    }

    return false;
  }, [initialSettings, currentSettings]);

  const handleMealSettingChange = (meal: MealOption, isChecked: boolean) => {
    setCurrentSettings(prev => {
      const newEnabledMeals = isChecked
        ? [...prev.enabledMeals, meal]
        : prev.enabledMeals.filter(m => m !== meal);
      
      const orderedEnabledMeals = (['breakfast', 'lunch', 'dinner'] as MealOption[]).filter(m => newEnabledMeals.includes(m));
      
      const newDefaultValues = { ...prev.defaultMealValues };
      if (isChecked && newDefaultValues[meal] === undefined) {
        newDefaultValues[meal] = 1;
      }

      return {
        ...prev,
        enabledMeals: orderedEnabledMeals,
        defaultMealValues: newDefaultValues
      };
    });
  };

  const handleDefaultValueChange = (meal: MealOption, value: string) => {
    const numValue = parseInt(value, 10);
    setCurrentSettings(prev => ({
      ...prev,
      defaultMealValues: {
        ...prev.defaultMealValues,
        [meal]: isNaN(numValue) || numValue < 0 ? 0 : numValue,
      },
    }));
  };

  const handleSave = () => {
    saveSettings(currentSettings);
    setInitialSettings(currentSettings);
    toast.success('Settings Saved', 'Visible meals and default values have been updated.');
  };

  const mealOptions: { value: MealOption; label: string }[] = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Meal Options</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Choose which meals are visible and set their default count for new entries.</p>

      <div className="space-y-4">
        {mealOptions.map(option => (
          <div key={option.value} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <input
                id={option.value}
                name="enabled-meals"
                type="checkbox"
                checked={currentSettings.enabledMeals.includes(option.value)}
                onChange={(e) => handleMealSettingChange(option.value, e.target.checked)}
                className="focus:ring-teal-500 h-5 w-5 text-teal-600 border-slate-300 dark:bg-slate-900 dark:border-slate-600 rounded"
              />
              <label htmlFor={option.value} className="ml-3 font-medium text-slate-700 dark:text-slate-200">{option.label}</label>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor={`${option.value}-default`} className="text-sm text-slate-500 dark:text-slate-400">Default</label>
              <input
                id={`${option.value}-default`}
                type="number"
                min="0"
                step="1"
                disabled={!currentSettings.enabledMeals.includes(option.value)}
                value={currentSettings.defaultMealValues[option.value] ?? ''}
                onChange={e => handleDefaultValueChange(option.value, e.target.value)}
                className="w-20 text-center border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:disabled:bg-slate-800 dark:disabled:text-slate-400 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                aria-label={`Default value for ${option.label}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <Button onClick={handleSave} disabled={!hasChanges} variant="cta">
              Save Changes
          </Button>
      </div>
    </div>
  );
};

export default MealSettings;