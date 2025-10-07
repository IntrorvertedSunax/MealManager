import React from 'react';
import { Member, ModalConfig, ModalType, Transaction } from '../../types';
import FormWrapper from './FormWrapper';
import MemberForm from './MemberForm';
import MealForm from './MealForm';
import DepositForm from './DepositForm';
import ExpenseForm from './ExpenseForm';
import SharedExpenseForm from './SharedExpenseForm';

interface FormSheetProps {
  config: ModalConfig;
  onClose: () => void;
  onSubmit: (data: Partial<Member & Transaction>, type: ModalType) => void;
  members: Member[];
  isSubmitting: boolean;
}

const FormSheet: React.FC<FormSheetProps> = ({ config, onClose, onSubmit, members, isSubmitting }) => {
  const { isOpen, type, data } = config;
  const isEditing = !!data;

  if (!isOpen || !type) return null;

  const titleConfig = {
    meal: { title: isEditing ? 'Edit Meal' : 'Add Meal', description: 'Log meals consumed by a flatmate.' },
    expense: { title: isEditing ? 'Edit Meal Expense' : 'Add Meal Expense', description: 'Log an expense for groceries or meals.' },
    'shared-expense': { title: isEditing ? 'Edit Shared Expense' : 'Add Shared Expense', description: 'Log a bill shared among members.' },
    deposit: { title: isEditing ? 'Edit Deposit' : 'Add Deposit', description: 'Log a financial contribution.' },
    member: { title: isEditing ? 'Edit Member' : 'Add New Member', description: 'Add a new flatmate to the system.' },
  };
  const currentTitle = titleConfig[type];

  const commonProps = {
    onSubmit: (formData: Partial<Member & Transaction>) => onSubmit(formData, type),
    isSubmitting,
  };

  const renderForm = () => {
    switch (type) {
      case 'member':
        return <MemberForm {...commonProps} data={data as Member | null} members={members} />;
      case 'meal':
        return <MealForm {...commonProps} data={data as Transaction | null} members={members} />;
      case 'deposit':
        return <DepositForm {...commonProps} data={data as Transaction | null} members={members} />;
      case 'expense':
        return <ExpenseForm {...commonProps} data={data as Transaction | null} members={members} />;
      case 'shared-expense':
        return <SharedExpenseForm {...commonProps} data={data as Transaction | null} members={members} />;
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
