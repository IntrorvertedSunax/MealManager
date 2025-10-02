import React, { useState } from 'react';
import { User, Transaction } from '../../types';
import { toast } from '../ui/Toaster';
import Button from '../ui/Button';
import { Input, FormField } from './FormControls';
import UserSelect from './UserSelect';
import DatePicker from '../ui/DatePicker';

interface MealFormProps {
  data: Transaction | null;
  onSubmit: (data: Partial<Transaction>) => void;
  isSubmitting: boolean;
  users: User[];
}

const MealForm: React.FC<MealFormProps> = ({ data, onSubmit, isSubmitting, users }) => {
  const isEditing = !!data;

  const [date, setDate] = useState<Date>(() => (data?.date ? new Date(data.date) : new Date()));
  const [formData, setFormData] = useState<Partial<Transaction>>(() => isEditing ? { ...data, date: undefined } : { userId: 'all' });

  const [mealChecks, setMealChecks] = useState(() => {
    if (isEditing) return { breakfast: false, lunch: false, dinner: false };
    return { breakfast: true, lunch: true, dinner: true };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const mealCount = (mealChecks.breakfast ? 1 : 0) + (mealChecks.lunch ? 1 : 0) + (mealChecks.dinner ? 1 : 0);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.userId) {
        newErrors.userId = 'Please select who had the meal.';
    }
    if (isEditing) {
      if (!formData.mealCount || formData.mealCount <= 0) newErrors.mealCount = 'Number of meals must be greater than 0.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (name in mealChecks) {
      setMealChecks(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? (value === '' ? undefined : parseFloat(value)) : value
      }));
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };
  
  const handleUserChange = (userId: string) => {
    setFormData(prev => ({ ...prev, userId }));
    if (errors.userId) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.userId;
        return newErrors;
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!isEditing && mealCount === 0) {
      toast.error('Error!', 'Please select at least one meal.');
      return;
    }
    
    if (!validate()) {
      toast.error('Validation Error', 'Please fix the errors in the form.');
      return;
    }

    const count = isEditing ? (formData.mealCount || 0) : mealCount;
    const submissionData = {
      ...formData,
      date: date.toISOString(),
      mealCount: count,
      description: `${count} meal(s)`,
      amount: 0,
    };

    onSubmit(submissionData);
  };
  
  const userSelectUsers = isEditing ? users : [{ id: 'all', name: 'All Users', avatar: null }, ...users];

  return (
    <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
      <FormField label="Date">
        <DatePicker value={date} onChange={setDate} />
      </FormField>

      <FormField label="User" error={errors.userId}>
         <UserSelect
            users={userSelectUsers}
            selectedUserId={formData.userId || null}
            onChange={handleUserChange}
            placeholder="Select who had the meal"
        />
      </FormField>

      {isEditing ? (
        <FormField label="Number of Meals" error={errors.mealCount}>
          <Input
            type="number"
            name="mealCount"
            value={formData.mealCount ?? ''}
            onChange={handleInputChange}
            placeholder="0"
            min="1" step="1" inputMode="numeric"
          />
        </FormField>
      ) : (
        <>
          <FormField label="Meal" description="Select which meals to log.">
            <div className="flex items-center space-x-6 pt-1">
              {['breakfast', 'lunch', 'dinner'].map(meal => (
                <label key={meal} className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" name={meal} 
                    checked={mealChecks[meal as keyof typeof mealChecks]} 
                    onChange={handleInputChange} 
                    className="h-5 w-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500"
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
      )}

      <div className="pt-4">
        <Button variant="cta" type="submit" disabled={isSubmitting} className="w-full justify-center py-3 text-base">
            {isSubmitting ? 'Processing...' : `${isEditing ? 'Update' : 'Add'} Meal`}
        </Button>
      </div>
    </form>
  );
};

export default MealForm;
