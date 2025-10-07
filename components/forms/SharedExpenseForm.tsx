import React, { useState, useMemo } from 'react';
import { Member, Transaction } from '../../types';
import { toast } from '../ui/Toaster';
import Button from '../ui/Button';
import { Input, FormField, Textarea } from './FormControls';
import MemberSelect from './UserSelect';
import DatePicker from '../ui/DatePicker';
import MultiMemberSelect from './MultiUserSelect';

interface SharedExpenseFormProps {
  data: Transaction | null;
  onSubmit: (data: Partial<Transaction>) => void;
  isSubmitting: boolean;
  members: Member[];
}

const SharedExpenseForm: React.FC<SharedExpenseFormProps> = ({ data, onSubmit, isSubmitting, members }) => {
  const isEditing = !!data;

  const [date, setDate] = useState<Date>(() => (data?.date ? new Date(data.date) : new Date()));
  const [formData, setFormData] = useState<any>(() => {
    if (isEditing && data) {
      const { date, sharedWith, ...restData } = data;
      const initialData: any = { ...restData };
      if (initialData.amount !== undefined) {
        initialData.amount = String(initialData.amount);
      }
      return initialData;
    }
    return {};
  });

  const [sharedWith, setSharedWith] = useState<string[]>(() => {
    if (isEditing && data?.sharedWith) {
      return data.sharedWith;
    }
    // By default, select all members for a new shared expense
    return members.map(u => u.id);
  });

  const [addToDeposit, setAddToDeposit] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const payer = useMemo(() => members.find(m => m.id === formData.memberId), [members, formData.memberId]);

  const depositCheckboxLabel = payer
    ? `Add this amount to ${payer.name}'s balance`
    : "Add this amount to the payer's balance";

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.memberId) newErrors.memberId = 'Please select who paid.';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Amount must be greater than 0.';
    if (!formData.description?.trim()) newErrors.description = 'Description is required.';
    if (sharedWith.length < 1) newErrors.sharedWith = 'At least one member must share the expense.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
  
  const handleMemberChange = (memberId: string) => {
    setFormData((prev: any) => ({ ...prev, memberId }));
    if (errors.memberId) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.memberId;
            return newErrors;
        });
    }
  };

  const handleSharedWithChange = (memberIds: string[]) => {
    setSharedWith(memberIds);
    if (errors.sharedWith) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.sharedWith;
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
    
    const submissionData: Partial<Transaction> & { addToDeposit?: boolean } = { 
      ...formData, 
      date: date.toISOString(),
      sharedWith: sharedWith,
      addToDeposit: isEditing ? false : addToDeposit,
    };
    if (submissionData.amount !== undefined) {
      // FIX: Explicitly cast `submissionData.amount` to a string before passing it to `parseFloat`.
      // This resolves a TypeScript error where the type was being incorrectly inferred as a number.
      submissionData.amount = parseFloat(String(submissionData.amount)) || 0;
    }
    
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="p-6 space-y-3">
      <FormField label="Date">
        <DatePicker value={date} onChange={setDate} />
      </FormField>

      <FormField label="Paid by" error={errors.memberId}>
         <MemberSelect
            members={members}
            selectedMemberId={formData.memberId || null}
            onChange={handleMemberChange}
            placeholder="Select a member"
        />
      </FormField>
      
      <FormField label="Total Amount" error={errors.amount}>
        <Input
          type="text" name="amount" value={formData.amount ?? ''} onChange={handleInputChange}
          placeholder="0.00" inputMode="decimal"
          leadingIcon={<span className="sm:text-sm font-black">৳</span>}
        />
      </FormField>

      {!isEditing && (
        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
          <input
            id="add-to-deposit"
            type="checkbox"
            checked={addToDeposit}
            onChange={(e) => setAddToDeposit(e.target.checked)}
            className="h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-teal-600 focus:ring-teal-500 bg-white dark:bg-slate-700"
          />
          <label htmlFor="add-to-deposit" className="text-sm font-bold text-teal-600 dark:text-teal-400 flex-1 cursor-pointer">
            {depositCheckboxLabel}
          </label>
        </div>
      )}
      
      <FormField label="Description" error={errors.description}>
        <Textarea 
            name="description" 
            value={formData.description || ''} 
            onChange={handleInputChange} 
            placeholder="e.g., Internet Bill, Gas Bill" 
            required 
            rows={2} 
        />
      </FormField>

      <FormField label="Shared with" description={`Each member will be charged ৳${(parseFloat(formData.amount || '0') / (sharedWith.length || 1)).toFixed(2)}`} error={errors.sharedWith}>
        <MultiMemberSelect 
            members={members}
            selectedMemberIds={sharedWith}
            onChange={handleSharedWithChange}
        />
      </FormField>

      <div className="pt-4">
        <Button variant="cta" type="submit" disabled={isSubmitting} className="w-full justify-center py-3 text-base">
            {isSubmitting ? 'Processing...' : `${isEditing ? 'Update' : 'Add'} Shared Expense`}
        </Button>
      </div>
    </form>
  );
};

export default SharedExpenseForm;