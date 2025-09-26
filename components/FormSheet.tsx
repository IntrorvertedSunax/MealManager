import React, { useState, useEffect } from 'react';
import { User, ModalConfig, ModalType } from '../types';
import { XIcon, CalendarIcon } from './Icons';

interface FormSheetProps {
  config: ModalConfig;
  onClose: () => void;
  onSubmit: (data: any, type: ModalType) => void;
  users: User[];
}

const FormSheet: React.FC<FormSheetProps> = ({ config, onClose, onSubmit, users }) => {
  const { isOpen, type, data } = config;
  const [formData, setFormData] = useState<any>({});
  const [mealChecks, setMealChecks] = useState({ breakfast: false, lunch: false, dinner: false });
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!data;

  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      // Format to YYYY-MM-DD for the date input
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      
      setFormData(data || { date: `${yyyy}-${mm}-${dd}` });
      if(type === 'meal' && data?.mealCount) {
        setMealChecks({ breakfast: data.mealCount >= 1, lunch: data.mealCount >= 2, dinner: data.mealCount >= 3});
      } else {
        setMealChecks({ breakfast: true, lunch: true, dinner: true });
      }
    }
  }, [isOpen, data, type]);

  const mealCount = (mealChecks.breakfast ? 1 : 0) + (mealChecks.lunch ? 1 : 0) + (mealChecks.dinner ? 1 : 0);
  
  if (!isOpen || !type) return null;

  const titleConfig = {
    meal: { title: 'Add Meal', description: 'Log a meal consumed by a flatmate.' },
    expense: { title: 'Add Expense', description: 'Log a shared expense.' },
    deposit: { title: 'Add Deposit', description: 'Log a financial contribution from a flatmate.' },
    user: { title: 'Add New Member', description: 'Add a new person to the group.' },
  };
  const currentTitle = titleConfig[type];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    let submissionData = { ...formData };
    if (type === 'meal') {
      submissionData.mealCount = mealCount;
      submissionData.description = `${mealCount} meals`;
    }
    setTimeout(() => {
        onSubmit(submissionData, type);
        setIsLoading(false);
    }, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (name in mealChecks) {
      setMealChecks(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    }
  };

  const FormField: React.FC<{label: string, children: React.ReactNode, description?: string}> = ({label, children, description}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {description && <p className="text-xs text-gray-500 mb-1">{description}</p>}
        {children}
    </div>
  )

  const inputStyles = "w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
      <div className={`bg-white rounded-t-2xl shadow-xl w-full max-w-lg transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`} onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{currentTitle.title}</h2>
              <p className="text-sm text-gray-500">{currentTitle.description}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><XIcon /></button>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          {type === 'user' && (
            <FormField label="Member Name">
              <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} required className={inputStyles} />
            </FormField>
          )}

          {(type === 'expense' || type === 'deposit' || type === 'meal') && (
            <FormField label="User">
              <select name="userId" value={formData.userId || 'all'} onChange={handleInputChange} required className={inputStyles}>
                {type === 'meal' && <option value="all">All</option>}
                {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
              </select>
            </FormField>
          )}

          {type === 'meal' && (
              <>
                <FormField label="Date">
                    <div className="relative">
                        <input type="date" name="date" value={formData.date || ''} onChange={handleInputChange} required className={`${inputStyles} pr-10`} />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <CalendarIcon />
                        </div>
                    </div>
                </FormField>
                <FormField label="Meal" description="Select which meals to log.">
                    <div className="flex items-center space-x-6">
                        {['breakfast', 'lunch', 'dinner'].map(meal => (
                            <label key={meal} className="flex items-center space-x-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name={meal} 
                                    checked={mealChecks[meal as keyof typeof mealChecks]} 
                                    onChange={handleInputChange} 
                                    className="appearance-none h-5 w-5 border-2 border-gray-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                />
                                 <svg className="absolute w-5 h-5 -ml-5 opacity-0 checked:opacity-100 pointer-events-none" viewBox="0 0 20 20" fill="white">
                                    <path d="M6.293 9.293a1 1 0 0 1 1.414 0L10 11.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 0-1.414z"/>
                                 </svg>
                                <span className="capitalize text-gray-700">{meal}</span>
                            </label>
                        ))}
                    </div>
                </FormField>
                 <FormField label="Number of Meals">
                    <input type="number" readOnly value={mealCount} className={`${inputStyles} bg-blue-50 text-gray-700 font-medium`} />
                </FormField>
              </>
          )}

          {(type === 'expense' || type === 'deposit') && (
            <FormField label="Amount">
              <input type="number" name="amount" value={formData.amount || ''} onChange={handleInputChange} placeholder="0.00" required min="0.01" step="0.01" className={inputStyles} />
            </FormField>
          )}
          
          {type === 'expense' && (
            <FormField label="Description">
              <input type="text" name="description" value={formData.description || ''} onChange={handleInputChange} placeholder="e.g., Groceries, Rent" required className={inputStyles} />
            </FormField>
          )}

          <div className="pt-4">
             <button 
                type="submit"
                disabled={isLoading}
                className="w-full justify-center px-4 py-3 rounded-xl font-semibold text-base focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 shadow-sm bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500 disabled:bg-orange-300"
             >
                {isLoading ? 'Saving...' : `${isEditing ? 'Update' : 'Add'} ${type.charAt(0).toUpperCase() + type.slice(1)}`}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormSheet;
