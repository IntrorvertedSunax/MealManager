import React from 'react';
import { User, ModalConfig, ModalType, Transaction } from '../../types';
import FormWrapper from './FormWrapper';
import MemberForm from './MemberForm';
import MealForm from './MealForm';
import DepositForm from './DepositForm';
import ExpenseForm from './ExpenseForm';
import SharedExpenseForm from './SharedExpenseForm';

interface FormSheetProps {
  config: ModalConfig;
  onClose: () => void;
  onSubmit: (data: Partial<User & Transaction>, type: ModalType) => void;
  users: User[];
  isSubmitting: boolean;
}

const FormSheet: React.FC<FormSheetProps> = ({ config, onClose, onSubmit, users, isSubmitting }) => {
  const { isOpen, type, data } = config;
  const isEditing = !!data;

  if (!isOpen || !type) return null;

  const titleConfig = {
    meal: { title: isEditing ? 'Edit Meal' : 'Add Meal', description: 'Log meals consumed by a flatmate.' },
    expense: { title: isEditing ? 'Edit Expense' : 'Add Expense', description: 'Log a shared expense.' },
    'shared-expense': { title: isEditing ? 'Edit Shared Expense' : 'Add Shared Expense', description: 'Log a bill shared among members.' },
    deposit: { title: isEditing ? 'Edit Deposit' : 'Add Deposit', description: 'Log a financial contribution.' },
    user: { title: isEditing ? 'Edit Member' : 'Add New Member', description: 'Add a new flatmate to the system.' },
  };
  const currentTitle = titleConfig[type];

  const commonProps = {
    onSubmit: (formData: Partial<User & Transaction>) => onSubmit(formData, type),
    isSubmitting,
  };

  const renderForm = () => {
    switch (type) {
      case 'user':
        return <MemberForm {...commonProps} data={data as User | null} users={users} />;
      case 'meal':
        return <MealForm {...commonProps} data={data as Transaction | null} users={users} />;
      case 'deposit':
        return <DepositForm {...commonProps} data={data as Transaction | null} users={users} />;
      case 'expense':
        return <ExpenseForm {...commonProps} data={data as Transaction | null} users={users} />;
      case 'shared-expense':
        return <SharedExpenseForm {...commonProps} data={data as Transaction | null} users={users} />;
      default:
        return null;
    }
  };

  return (
    <FormWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={currentTitle.title}
      description={currentTitle.description}
    >
      {renderForm()}
    </FormWrapper>
  );
};

export default FormSheet;
