export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export type TransactionType = 'meal' | 'expense' | 'deposit';

export interface Transaction {
  id: string;
  type: TransactionType;
  userId: string; // The user associated with the transaction (who ate, who deposited, who paid)
  date: string;
  amount: number; // Always positive.
  description: string;
  mealCount?: number; // Only for 'meal' type
}

export type Page = 'home' | 'members' | 'expenses' | 'deposits' | 'transactions' | 'calendar';

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
  title: string;
  description: string;
  type: 'success' | 'error';
}
