import React, { useState, useMemo } from 'react';
import { User, Transaction } from '../../types';
import { toast } from '../ui/Toaster';
import Button from '../ui/Button';
import { Input, FormField } from './FormControls';
import { CalendarIcon } from '../ui/Icons';
import UserSelect from './UserSelect';

interface DepositFormProps {
  data: Transaction | null;
  onSubmit: (data: Partial<Transaction>) => void;
  isSubmitting: boolean;
  users: User[];
}

const DepositForm: React.FC<DepositFormProps> = ({ data, onSubmit, isSubmitting, users }) => {
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
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return { date: `${year}-${month}-${day}` };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const formattedDate = useMemo(() => {
    if (!formData.date) return '';
    try {
        const date = new Date(formData.date + 'T00:00:00Z');
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC'
        });
    } catch (e) {
        return '';
    }
  }, [formData.date]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.userId) newErrors.userId = 'Please select a member.';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Amount must be greater than 0.';
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
  
  const handleUserChange = (userId: string) => {
    setFormData((prev: any) => ({ ...prev, userId }));
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
    <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
      <FormField label="Deposited by" error={errors.userId}>
        <UserSelect
            users={users}
            selectedUserId={formData.userId || null}
            onChange={handleUserChange}
            placeholder="Select a member"
        />
      </FormField>

      <FormField label="Date">
        <Input type="date" name="date" value={formData.date || ''} onChange={handleInputChange} required trailingIcon={<CalendarIcon />} />
        {formattedDate && <p className="text-xs text-gray-500 mt-1 text-right">{formattedDate}</p>}
      </FormField>

      <FormField label="Amount" error={errors.amount}>
        <Input
          type="text" name="amount" value={formData.amount ?? ''} onChange={handleInputChange}
          placeholder="0.00" inputMode="decimal"
          leadingIcon={<span className="sm:text-sm font-black">৳</span>}
        />
      </FormField>

      <div className="pt-4">
        <Button type="submit" disabled={isSubmitting} className="w-full justify-center py-3 text-base">
            {isSubmitting ? 'Processing...' : `${isEditing ? 'Update' : 'Add'} Deposit`}
        </Button>
      </div>
    </form>
  );
};

export default DepositForm;