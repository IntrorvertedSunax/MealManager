import React, { useState } from 'react';
import { User } from '../types';
import { toast } from './Toaster';
import Button from './Button';
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
    const trimmedName = name.trim();
    if (!trimmedName) {
      return 'Member name is required.';
    }
    const lowercasedName = trimmedName.toLowerCase();
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
      toast.error('Validation Error', 'Please fix the errors in the form.');
      return;
    }

    onSubmit({ ...formData, name: formData.name?.trim() });
  };

  const hasError = !!errors.name;

  return (
    <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
      <FormField label="Member Name" error={errors.name}>
        <Input autoFocus type="text" name="name" value={formData.name || ''} onChange={handleInputChange} />
      </FormField>
      <div className="pt-4">
        <Button 
            type="submit"
            disabled={isSubmitting || hasError}
            className="w-full justify-center py-3 text-base"
        >
            {isSubmitting ? 'Processing...' : `${isEditing ? 'Update' : 'Add'} Member`}
        </Button>
      </div>
    </form>
  );
};

export default MemberForm;