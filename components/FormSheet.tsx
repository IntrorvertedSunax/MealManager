import React, { useState } from 'react';
import { User, ModalConfig, ModalType, Transaction } from '../types';
import { XIcon, CalendarIcon, SwitchVerticalIcon } from './Icons';
import { toast } from './Toaster';
import Button from './Button';

interface FormSheetProps {
  config: ModalConfig;
  onClose: () => void;
  onSubmit: (data: Partial<User & Transaction>, type: ModalType) => void;
  users: User[];
  isSubmitting: boolean;
}

// A reusable Input component to standardize input fields.
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { leadingIcon?: React.ReactNode, trailingIcon?: React.ReactNode }> = ({ leadingIcon, trailingIcon, className, ...props }) => {
  const baseStyles = "w-full py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition";
  const paddingClasses = `${leadingIcon ? 'pl-8' : 'pl-3'} ${trailingIcon ? 'pr-10' : 'pr-3'}`;
  
  return (
    <div className="relative">
      {leadingIcon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {leadingIcon}
        </div>
      )}
      <input {...props} className={`${baseStyles} ${paddingClasses} ${className || ''}`} />
      {trailingIcon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
          {trailingIcon}
        </div>
      )}
    </div>
  );
};

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }> = ({ className, children, ...props }) => {
  return (
    <div className="relative">
      <select 
        {...props} 
        className={`w-full appearance-none px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition ${className || ''}`}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <SwitchVerticalIcon />
      </div>
    </div>
  );
};


const FormSheet: React.FC<FormSheetProps> = ({ config, onClose, onSubmit, users, isSubmitting }) => {
  const { isOpen, type, data } = config;
  const isEditing = !!data;

  const [formData, setFormData] = useState<any>(() => {
    if (isEditing) {
      const formDataToSet = { ...data };
      if ('date' in formDataToSet && formDataToSet.date) {
        formDataToSet.date = new Date(formDataToSet.date).toISOString().split('T')[0];
      }
      if ('amount' in formDataToSet && formDataToSet.amount !== undefined) {
        formDataToSet.amount = String(formDataToSet.amount);
      }
      return formDataToSet;
    }
    const today = new Date().toISOString().split('T')[0];
    const defaultFormData: Partial<User & Transaction> = { date: today };
    return defaultFormData;
  });

  const [mealChecks, setMealChecks] = useState(() => {
    if (type === 'meal' && !isEditing) {
      return { breakfast: true, lunch: true, dinner: true };
    }
    return { breakfast: false, lunch: false, dinner: false };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form data when modal opens/closes or type changes
  React.useEffect(() => {
    if (isOpen && type) {
      if (isEditing && data) {
        const formDataToSet = { ...data };
        if ('date' in formDataToSet && formDataToSet.date) {
          formDataToSet.date = new Date(formDataToSet.date).toISOString().split('T')[0];
        }
        if ('amount' in formDataToSet && formDataToSet.amount !== undefined) {
          formDataToSet.amount = String(formDataToSet.amount);
        }
        setFormData(formDataToSet);
      } else {
        const today = new Date().toISOString().split('T')[0];
        const defaultFormData: Partial<User & Transaction> = { date: today };
        setFormData(defaultFormData);
      }
      setErrors({});
    }
  }, [isOpen, type, data, isEditing]);
  const mealCount = (mealChecks.breakfast ? 1 : 0) + (mealChecks.lunch ? 1 : 0) + (mealChecks.dinner ? 1 : 0);
  
  if (!isOpen || !type) return null;

  const titleConfig = {
    meal: { title: isEditing ? 'Edit Meal' : 'Add Meal', description: 'Log meals consumed by a flatmate.' },
    expense: { title: isEditing ? 'Edit Expense' : 'Add Expense', description: 'Log a shared expense.' },
    deposit: { title: isEditing ? 'Edit Deposit' : 'Add Deposit', description: 'Log a financial contribution.' },
    user: { title: isEditing ? 'Edit Member' : 'Add New Member', description: 'Manage a person in the group.' },
  };
  const currentTitle = titleConfig[type];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (type === 'user') {
        if (!formData.name?.trim()) newErrors.name = 'Member name is required.';
    } else if (type === 'expense' || type === 'deposit') {
        if (!formData.userId) newErrors.userId = 'Please select a user.';
        if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Amount must be greater than 0.';
    } else if (type === 'meal' && isEditing) {
        if (!formData.mealCount || formData.mealCount <= 0) newErrors.mealCount = 'Number of meals must be greater than 0.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (type === 'meal' && !isEditing && mealCount === 0) {
        toast.error('Error!', 'Please select at least one meal.');
        return;
    }
    
    if (!validate()) {
      toast.error('Validation Error', 'Please fix the errors in the form.');
      return;
    }

    let submissionData = { ...formData };
    if (type === 'meal') {
      const count = isEditing ? (formData.mealCount || 0) : mealCount;
      submissionData = {
        ...submissionData,
        mealCount: count,
        description: `${count} meal(s)`,
        amount: 0,
      };
    }

    if (submissionData.amount !== undefined) {
      submissionData.amount = parseFloat(submissionData.amount) || 0;
    }
    
    if(type) {
        onSubmit(submissionData, type);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type: inputType } = e.target;

    if (name in mealChecks) {
      setMealChecks(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
      return;
    } else {
      if (name === 'amount' && value && !/^\d*\.?\d*$/.test(value)) {
          return;
      }
      
      let processedValue = value;
      
      // Auto-capitalize first letter of member names
      if (name === 'name' && type === 'user') {
        processedValue = value.charAt(0).toUpperCase() + value.slice(1);
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: inputType === 'number' ? (processedValue === '' ? undefined : parseFloat(processedValue)) : processedValue
      }));
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
    // Handle different input types properly
  };

  const FormField: React.FC<{label: string, children: React.ReactNode, description?: string, error?: string}> = ({label, children, description, error}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {description && <p className="text-xs text-gray-500 mb-1">{description}</p>}
        {children}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

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
            <FormField label="Member Name" error={errors.name}>
              <Input 
                autoFocus 
                type="text" 
                name="name" 
                value={formData.name || ''} 
                onChange={handleInputChange}
                placeholder="Enter member name"
                autoComplete="off"
              />
            </FormField>
          )}

          {(type === 'expense' || type === 'deposit') && (
            <FormField label="User" error={errors.userId}>
              <Select 
                name="userId" 
                value={formData.userId || ''} 
                onChange={handleInputChange}
                autoFocus={type !== 'user'}
              >
                <option value="" disabled>Select a user</option>
                {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
              </Select>
            </FormField>
          )}

          {type === 'meal' && (
            <FormField label="User">
              <Select 
                name="userId" 
                value={formData.userId || (isEditing ? '' : 'all')} 
                onChange={handleInputChange}
                autoFocus={type === 'meal'}
              >
                {type === 'meal' && !isEditing && <option value="all">All Users</option>}
                {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
              </Select>
            </FormField>
          )}
          
          {(type === 'expense' || type === 'deposit' || type === 'meal') && (
              <FormField label="Date">
                <Input 
                  type="date" 
                  name="date" 
                  value={formData.date || ''} 
                  onChange={handleInputChange} 
                  required 
                  trailingIcon={<CalendarIcon />}
                  autoComplete="off"
                />
              </FormField>
          )}

          {type === 'meal' && (
            isEditing ? (
              <FormField label="Number of Meals" error={errors.mealCount}>
                <Input
                  type="number"
                  name="mealCount"
                  value={String(formData.mealCount ?? '')}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  autoComplete="off"
                />
              </FormField>
            ) : (
              <>
                <FormField label="Meals" description="Select which meals to log.">
                  <div className="flex items-center space-x-6">
                    {['breakfast', 'lunch', 'dinner'].map(meal => (
                      <label key={meal} className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          name={meal} 
                          checked={mealChecks[meal as keyof typeof mealChecks]} 
                          onChange={handleInputChange} 
                          className="h-5 w-5 rounded-md border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="capitalize text-gray-700">{meal}</span>
                      </label>
                    ))}
                  </div>
                </FormField>
                <FormField label="Number of Meals">
                  <Input type="number" readOnly value={mealCount} className="bg-gray-100 text-gray-700 font-medium" />
                </FormField>
              </>
            )
          )}

          {(type === 'expense' || type === 'deposit') && (
            <FormField label="Amount" error={errors.amount}>
               <Input
                  type="text"
                  name="amount"
                  value={String(formData.amount ?? '')}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  inputMode="decimal"
                  leadingIcon={<span className="text-gray-500 sm:text-sm font-black">৳</span>}
                  autoComplete="off"
                />
            </FormField>
          )}
          
          {type === 'expense' && (
            <FormField label="Description">
              <Input 
                type="text" 
                name="description" 
                value={formData.description || ''} 
                onChange={handleInputChange} 
                placeholder="e.g., Groceries, Rent" 
                required 
                autoComplete="off"
              />
            </FormField>
          )}

          <div className="pt-4">
             <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full justify-center py-3 text-base"
             >
                {isSubmitting ? 'Processing...' : `${isEditing ? 'Update' : 'Add'} ${type.charAt(0).toUpperCase() + type.slice(1)}`}
             </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormSheet;