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
    const trimmedName = name.trim();
    if (!trimmedName) {
      return 'Member name is required.';
    }
    const lowercasedName = trimmedName.toLowerCase();
    
    // Check if another user (not the one being edited) already has this name.
    const isDuplicate = users.some((user) => {
      // When editing, we should not compare the user with themselves.
      if (isEditing && user.id === data?.id) {
        return false;
      }
      // For all other users (or when adding a new one), check for a name match.
      return user.name.toLowerCase() === lowercasedName;
    });

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

    // The final, authoritative validation is handled by the data layer (data.ts).
    // This component's responsibility is to capture input and provide real-time feedback.
    // The check on submit is removed to avoid redundant logic.
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