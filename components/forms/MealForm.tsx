import React, { useState, useMemo } from 'react';
import { Member, Transaction, MealOption } from '../../types';
import { toast } from '../ui/Toaster';
import Button from '../ui/Button';
import { FormField } from './FormControls';
import MemberSelect from './UserSelect';
import DatePicker from '../ui/DatePicker';
import { getSettings } from '../../data';
import NumberInput from './NumberInput';

interface MealFormProps {
  data: Transaction | Partial<Transaction> | null;
  onSubmit: (data: Partial<Transaction>) => void;
  isSubmitting: boolean;
  members: Member[];
}

const MealForm: React.FC<MealFormProps> = ({ data, onSubmit, isSubmitting, members }) => {
  const { enabledMeals, defaultMealValues } = getSettings();

  // State for form fields that are not part of the meal breakdown
  const [date, setDate] = useState<Date>(() => (data?.date ? new Date(data.date) : new Date()));
  
  const [formData, setFormData] = useState<Partial<Transaction>>(() => {
    if (data) {
      return { id: data.id, memberId: data.memberId };
    }
    // Default for the general "Add Meal" button
    return { memberId: 'all' };
  });

  // State for the meal breakdown values (e.g., { lunch: "1", dinner: "1" })
  const [mealValues, setMealValues] = useState<Record<string, string>>(() => {
    if (data?.mealDetails) {
      // Populate from existing meal details
      const detailsAsString: Record<string, string> = {};
      enabledMeals.forEach(meal => {
        const value = data.mealDetails?.[meal as MealOption];
        detailsAsString[meal] = value ? String(value) : '';
      });
      return detailsAsString;
    }
    
    if (!data) {
      // No data provided, so it's a general "Add Meal" - use defaults
      const defaultValues: Record<string, string> = {};
      enabledMeals.forEach(meal => {
        const defaultValue = defaultMealValues[meal as MealOption];
        defaultValues[meal] = defaultValue ? String(defaultValue) : '';
      });
      return defaultValues;
    }

    // Data is provided, but no mealDetails.
    // This covers both editing an old entry AND clicking an empty calendar cell.
    // In both cases, we want to start with 0s.
    return {};
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // For backward compatibility, show the old total if editing a legacy meal entry
  const previousTotal = useMemo(() => {
    const isEditing = !!data?.id;
    if (isEditing && data && data.mealCount !== undefined && !data.mealDetails) {
      return data.mealCount;
    }
    return null;
  }, [data]);

  // The total meal count is always derived from the individual meal inputs
  const mealCount = useMemo(() => {
    return Object.values(mealValues).reduce((sum: number, value: string) => {
      const num = parseInt(value, 10);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
  }, [mealValues]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.memberId) {
        newErrors.memberId = 'Please select who had the meal.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMealValueChange = (meal: MealOption, value: string) => {
    setMealValues(prev => ({
      ...prev,
      [meal]: value,
    }));
  };
  
  const handleMemberChange = (memberId: string) => {
    setFormData(prev => ({ ...prev, memberId }));
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

    const mealDetailsToSubmit: Partial<Record<MealOption, number>> = {};
    enabledMeals.forEach(meal => {
        const count = parseInt(mealValues[meal], 10);
        if (!isNaN(count) && count > 0) {
            mealDetailsToSubmit[meal] = count;
        }
    });

    const finalMealCount = Object.values(mealDetailsToSubmit).reduce((sum, count) => sum + (count || 0), 0);

    const submissionData: Partial<Transaction> = {
      ...formData,
      id: data?.id,
      date: date.toISOString(),
      mealDetails: mealDetailsToSubmit,
      description: `${finalMealCount} meal(s)`,
      amount: 0,
    };

    onSubmit(submissionData);
  };
  
  const isEditing = !!data?.id;
  // "All Members" is only an option for the general "Add Meal" case (when `data` is null).
  // If `data` is provided, it's a specific action from the calendar for a single member.
  const isSpecificMemberAction = !!data;
  const memberSelectMembers = isSpecificMemberAction ? members : [{ id: 'all', name: 'All Members', avatar: null }, ...members];

  const mealLabels: Record<MealOption, string> = {
    'breakfast': 'Breakfast',
    'lunch': 'Lunch',
    'dinner': 'Dinner',
  };

  const primaryMeals: MealOption[] = ['breakfast', 'lunch', 'dinner'];
  const enabledPrimaryMeals = enabledMeals.filter(meal => primaryMeals.includes(meal));

  const gridClassMap: { [key: number]: string } = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
  };
  const gridColsClass = gridClassMap[enabledPrimaryMeals.length] || 'grid-cols-1';

  return (
    <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
      <FormField label="Date">
        <DatePicker value={date} onChange={setDate} />
      </FormField>

      <FormField label="Member" error={errors.memberId}>
         <MemberSelect
            members={memberSelectMembers}
            selectedMemberId={formData.memberId || null}
            onChange={handleMemberChange}
            placeholder="Select who had the meal"
        />
      </FormField>

      {previousTotal !== null && (
        <div className="text-center p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">Previous Total</p>
            <p className="font-bold text-2xl text-gray-800">{previousTotal}</p>
            <p className="text-xs text-gray-500 mt-1">Please re-enter the meal breakdown below.</p>
        </div>
      )}

      {enabledPrimaryMeals.length > 0 && (
        <div className={`grid ${gridColsClass} gap-x-4 gap-y-6`}>
          {enabledPrimaryMeals.map(meal => (
            <FormField key={meal} label={mealLabels[meal]}>
              <NumberInput
                name={meal}
                value={mealValues[meal] || ''}
                onChange={(value) => handleMealValueChange(meal as MealOption, value)}
                placeholder="0"
                min={0}
              />
            </FormField>
          ))}
        </div>
      )}

      {enabledMeals.length > 0 && (
        <FormField label="Total Number of Meals">
          <NumberInput
            readOnly
            value={mealCount}
            className="bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 font-bold"
          />
        </FormField>
      )}

      {enabledMeals.length === 0 && (
          <p className="text-sm text-gray-500">No meal types are enabled. Go to Settings to enable them.</p>
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
