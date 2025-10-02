import React, { useState, useRef } from 'react';
import { User } from '../../types';
import { toast } from '../ui/Toaster';
import Button from '../ui/Button';
import { Input, FormField } from './FormControls';
import Avatar from '../ui/Avatar';
import { PencilIcon } from '../ui/Icons';

interface MemberFormProps {
  data: User | null;
  onSubmit: (data: Partial<User>) => void;
  isSubmitting: boolean;
  users: User[];
}

const MemberForm: React.FC<MemberFormProps> = ({ data, onSubmit, isSubmitting, users }) => {
  const isEditing = !!data;
  const [formData, setFormData] = useState<Partial<User>>(() => isEditing ? { ...data } : { name: '', avatar: null });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('File too large', 'Please select an image smaller than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setFormData(prev => ({ ...prev, avatar: null }));
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
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
       <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <Avatar name={formData.name || '?'} avatar={formData.avatar} size="lg" />
          <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center rounded-full transition-colors cursor-pointer"
              aria-label="Change avatar"
            >
              <PencilIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
        </div>
        
        {formData.avatar && (
            <Button type="button" variant="secondary" onClick={handleRemoveAvatar} className="text-xs py-1 px-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
                Remove Photo
            </Button>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          aria-hidden="true"
        />
      </div>

      <FormField label="Member Name" error={errors.name}>
        <Input autoFocus type="text" name="name" value={formData.name || ''} onChange={handleInputChange} />
      </FormField>
      <div className="pt-2">
        <Button 
            type="submit"
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
