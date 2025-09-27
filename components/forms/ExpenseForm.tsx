import React, { useState } from 'react';
import { User, Transaction } from '../../types';
import { toast } from '../ui/Toaster';
import Button from '../ui/Button';
import { Input, Select, FormField } from './FormControls';
import { CalendarIcon } from '../ui/Icons';

interface ExpenseFormProps {
  data: Transaction | null;
  onSubmit: (data: Partial<Transaction>) => void;
  isSubmitting: boolean;
  users: User[];
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ data, onSubmit, isSubmitting, users }) => {
  const isEditing = !!data;

  const [formData, setFormData] = useState<any>(() => {
    if (isEditing) {
      const formDataToSet: any = { ...data };
      if (formDataToSet.date) {
        formDataToSet.date = new Date(formDataToSet.date).toISOString().split('T')[0];
      }
      if (formDataToSet.amount !== undefined) {
        formDataToSet.amount = String(formDataToSet.amount);
      }
      return formDataToSet;
    }
    return { date: new Date().toISOString().split('T')[0] };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.userId) newErrors.userId = 'Please select a user.';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Amount must be greater than 0.';
    if (!formData.description?.trim()) newErrors.description = 'Description is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'amount' && value && !/^\d*\.?\d*$/.test(value)) {
        return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) {
      toast.error('Validation Error', 'Please fix the errors in the form.');
      return;
    }
    
    const submissionData = { ...formData };
    if (submissionData.amount !== undefined) {
      submissionData.amount = parseFloat(submissionData.amount) || 0;
    }
    
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
      <FormField label="User" error={errors.userId}>
        <Select name="userId" value={formData.userId || ''} onChange={handleInputChange}>
          <option value="" disabled>Select a user</option>
          {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
        </Select>
      </FormField>

      <FormField label="Date">
        <Input type="date" name="date" value={formData.date || ''} onChange={handleInputChange} required trailingIcon={<CalendarIcon />} />
      </FormField>

      <FormField label="Amount" error={errors.amount}>
        <Input
          type="text" name="amount" value={formData.amount ?? ''} onChange={handleInputChange}
          placeholder="0.00" inputMode="decimal"
          leadingIcon={<span className="text-gray-500 sm:text-sm font-black">৳</span>}
        />
      </FormField>
      
      <FormField label="Description" error={errors.description}>
        <Input type="text" name="description" value={formData.description || ''} onChange={handleInputChange} placeholder="e.g., Groceries, Rent" required />
      </FormField>

      <div className="pt-4">
        <Button type="submit" disabled={isSubmitting} className="w-full justify-center py-3 text-base">
            {isSubmitting ? 'Processing...' : `${isEditing ? 'Update' : 'Add'} Expense`}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;