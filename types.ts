export interface User {
  id: string;
  name: string;
  avatar: string | null;
}

export type TransactionType = 'meal' | 'expense' | 'deposit';

export interface Transaction {
  id: string;
  type: TransactionType;
  userId: string; // The user associated with the transaction (who ate, who deposited, who paid)
  date: string;
  amount: number; // Always positive.
  description: string;
  mealCount?: number; // Legacy, for backward compatibility
  mealDetails?: Partial<Record<MealOption, number>>; // The new way to store meals
}

export interface DB {
  users: User[];
  transactions: Transaction[];
}

export type Page = 'home' | 'members' | 'expenses' | 'deposits' | 'transactions' | 'calendar' | 'settings';

export type ModalType = TransactionType | 'user';

export interface ModalConfig {
  isOpen: boolean;
  type: ModalType | null;
  data: Transaction | User | null;
  deletingId?: string | null;
}

export interface AlertDialogConfig {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
}

export interface ToastMessage {
  id: number;
  title:string;
  description: string;
  type: 'success' | 'error';
}

export type MealOption = 'breakfast' | 'lunch' | 'dinner';

export interface AppSettings {
  enabledMeals: MealOption[];
  defaultMealValues: Partial<Record<MealOption, number>>;
  theme: 'light' | 'dark' | 'system';
}