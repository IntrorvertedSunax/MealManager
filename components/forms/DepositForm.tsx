import React, { useState } from 'react';
import { Member, Transaction } from '../../types';
import { toast } from '../ui/Toaster';
import Button from '../ui/Button';
import { Input, FormField } from './FormControls';
import MemberSelect from './UserSelect';
import DatePicker from '../ui/DatePicker';

interface DepositFormProps {
  data: Transaction | null;
  onSubmit: (data: Partial<Transaction>) => void;
  isSubmitting: boolean;
  members: Member[];
}

const DepositForm: React.FC<DepositFormProps> = ({ data, onSubmit, isSubmitting, members }) => {
  const isEditing = !!data;

  const [date, setDate] = useState<Date>(() => (data?.date ? new Date(data.date) : new Date()));
  const [formData, setFormData] = useState<any>(() => {
    if (isEditing && data) {
      const { date, ...restData } = data;
      const initialData: any = { ...restData };
      if (initialData.amount !== undefined) {
        initialData.amount = String(initialData.amount);
      }
      return initialData;
    }
    return {};
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.memberId) newErrors.memberId = 'Please select a member.';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Amount must be greater than 0.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) {
      toast.error('Validation Error', 'Please fix the errors in the form.');
      return;
    }
    
    const submissionData = { ...formData, date: date.toISOString() };
    if (submissionData.amount !== undefined) {
      submissionData.amount = parseFloat(submissionData.amount) || 0;
    }
    
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
      <FormField label="Date">
        <DatePicker value={date} onChange={setDate} />
      </FormField>

      <FormField label="Deposited by" error={errors.memberId}>
        <MemberSelect
            members={members}
            selectedMemberId={formData.memberId || null}
            onChange={handleMemberChange}
            placeholder="Select a member"
        />
      </FormField>

      <FormField label="Amount" error={errors.amount}>
        <Input
          type="text" name="amount" value={formData.amount ?? ''} onChange={handleInputChange}
          placeholder="0.00" inputMode="decimal"
          leadingIcon={<span className="sm:text-sm font-black">৳</span>}
        />
      </FormField>

      <div className="pt-4">
        <Button variant="cta" type="submit" disabled={isSubmitting} className="w-full justify-center py-3 text-base">
            {isSubmitting ? 'Processing...' : `${isEditing ? 'Update' : 'Add'} Deposit`}
        </Button>
      </div>
    </form>
  );
};

export default DepositForm;