import React, { useState } from 'react';
import { User } from '../../types';
import { toast } from '../ui/Toaster';
import Button from '../ui/Button';
import { Input, FormField } from './FormControls';

interface MemberFormProps {
  data: User | null;
  onSubmit: (data: Partial<User>) => void;
  isSubmitting: boolean;
  users: User[];
}

const MemberForm: React.FC<MemberFormProps> = ({ data, onSubmit, isSubmitting, users }) => {
  const isEditing = !!data;
  const [formData, setFormData] = useState<Partial<User>>(() => isEditing ? { ...data } : { name: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateName = (name: string): string | null => {
    const normalizedName = name?.trim().replace(/\s+/g, ' ');
    if (!normalizedName) {
      return 'Member name is required.';
    }
    const lowercasedName = normalizedName.toLowerCase();
    
    // Since user.name from the DB is already normalized by the logic in data.ts,
    // we can perform a direct comparison.
    const isDuplicate = users.some(
      (user) => user.name.toLowerCase() === lowercasedName && user.id !== data?.id
    );
    if (isDuplicate) {
      return 'Member already exists!';
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const error = validateName(value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    } else {
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

    const error = validateName(formData.name || '');
    if (error) {
      setErrors({ name: error });
      toast.error('Validation Error', error);
      return;
    }

    setErrors({});
    onSubmit(formData);
  };

  const hasError = !!errors.name;

  return (
    <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
      <FormField label="Member Name" error={errors.name}>
        <Input autoFocus type="text" name="name" value={formData.name || ''} onChange={handleInputChange} placeholder="e.g., John Doe" />
      </FormField>
      <div className="pt-2">
        <Button 
            type="submit"
            variant="cta"
            disabled={isSubmitting || hasError || !formData.name?.trim()}
            className="w-full justify-center py-3 text-base"
        >
            {isSubmitting ? 'Processing...' : `${isEditing ? 'Update' : 'Add'} Member`}
        </Button>
      </div>
    </form>
  );
};

export default MemberForm;