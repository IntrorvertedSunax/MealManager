import React, { useState, useMemo, useEffect, useRef } from 'react';
import { User, Transaction, TransactionType, Page, ModalConfig, AlertDialogConfig, ModalType } from './types';
import Header from './components/ui/Header';
import FlatmateBalanceCard from './components/dashboard/FlatmateBalanceCard';
import MemberCard from './components/members/MemberCard';
import FormSheet from './components/forms/FormSheet';
import TransactionListItem from './components/transactions/TransactionHistory';
import AlertDialog from './components/ui/AlertDialog';
import AddMenuSheet from './components/ui/AddMenuSheet';
import DashboardCard from './components/dashboard/DashboardCard';
import CalendarPage from './components/calendar/CalendarPage';
import SettingsPage from './components/settings/SettingsPage';
import { toast } from './components/ui/Toaster';
import { 
  HomeIcon, UserGroupIcon, ClipboardListIcon, CalendarIcon, SettingsIcon,
  MenuIcon, XIcon, PlusIcon, SearchIcon, ChevronRightIcon, DepositIcon, ReceiptIcon, UserPlusIcon
} from './components/ui/Icons';
import { Input } from './components/forms/FormControls';
import Button from './components/ui/Button';
import Badge from './components/ui/Badge';
import { calculateMetrics, CalculationMetrics } from './logic';
import * as db from './data';
import ResetConfirmationDialog from './components/settings/ResetConfirmationDialog';

// --- Page Components ---

const HomePage = ({ firstMealDate, calculations, handleNavigate, openSheet }: { 
  firstMealDate: Date | null;
  calculations: CalculationMetrics;
  handleNavigate: (page: Page, userId?: string | null) => void;
  openSheet: (type: 'user', data?: User | null) => void;
}) => {
  const dayCount = useMemo(() => {
    if (!firstMealDate) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - firstMealDate.getTime();
    if (diffTime < 0) return 0;
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays + 1;
  }, [firstMealDate]);

  const currentDate = new Date().toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md flex items-stretch overflow-hidden">
          <div className="bg-gray-100 dark:bg-gray-700 py-2 px-4 flex flex-col items-center justify-center">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Day</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{dayCount}</p>
          </div>
          <div className="flex items-center p-3 px-5">
            <p className="font-semibold text-gray-700 dark:text-gray-200 text-lg">{currentDate}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg text-center">
        <p className="font-medium text-sm text-blue-100">Remaining Balance</p>
        <p className={`text-4xl font-bold tracking-tight ${calculations.remainingBalance >= 0 ? 'text-white' : 'text-yellow-300'}`}>
          {calculations.remainingBalance < 0 && '-'}<span className="font-black">৳</span>{Math.abs(calculations.remainingBalance).toFixed(0)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
          <DashboardCard title="Total Meals" value={calculations.totalMealCount} />
          <DashboardCard title="Current Meal Rate" value={calculations.mealRate} formatAs="currency" precision={2} />
          <DashboardCard title="Total Deposits" value={calculations.totalDeposits} formatAs="currency" onClick={() => handleNavigate('deposits')} variant="positive" />
          <DashboardCard title="Total Expenses" value={calculations.totalExpenses} formatAs="currency" onClick={() => handleNavigate('expenses')} variant="negative" />
      </div>
      
      <div className="bg-white dark:bg-gray-800/50 p-4 sm:p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Member Balances</h2>
          <Button 
            onClick={() => openSheet('user')}
            className="py-1.5 px-3"
          >
            <UserPlusIcon className="h-4 w-4 mr-1.5" />
            Add Member
          </Button>
        </div>
        <div className="space-y-4">
          {calculations.userData.map(data => (
            <FlatmateBalanceCard key={data.user.id} user={data.user} balance={data.balance} mealCount={data.userMealCount} totalDeposit={data.userDeposits} mealCost={data.userMealCost + data.userSharedExpenseCost} onHistoryClick={() => handleNavigate('transactions', data.user.id)} />
          ))}
        </div>
      </div>
    </div>
  );
};
  
const MembersPage = ({ users, openSheet, confirmRemoveUser }: {
  users: User[];
  openSheet: (type: 'user', data?: User | null) => void;
  confirmRemoveUser: (user: User) => void;
}) => {
  return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-4">
          <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200">All Members</h2>
              <Button onClick={() => openSheet('user')} className="rounded-lg">
                  <PlusIcon className="h-5 w-5 mr-1" />
                  Add Member
              </Button>
          </div>

          <div className="space-y-3">
              {users.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">No members yet. Add one to get started!</p>
              ) : (
                  users.map(user =>
                      <MemberCard
                          key={user.id}
                          user={user}
                          onEdit={() => openSheet('user', user)}
                          onRemove={() => confirmRemoveUser(user)}
                      />
                  )
              )}
          </div>
      </div>
  );
};

const SharedExpenseShareItem = ({ transaction, users, yourShare }: { transaction: Transaction, users: User[], yourShare: number }) => {
  const payer = users.find(u => u.id === transaction.userId);
  const formattedDate = new Date(transaction.date).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge type={transaction.type} />
            <h3 className="font-bold text-gray-800 dark:text-gray-100 capitalize leading-tight">{transaction.description}</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{formattedDate} • Paid by {payer?.name || 'Unknown'}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-bold text-xl text-red-600 dark:text-red-400">
            -<span className="font-black">৳</span>{yourShare.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Your Share</p>
        </div>
      </div>
    </div>
  );
};

const TransactionsPage = ({
  filterUserId, users, calculations, sortedTransactions, searchQuery,
  setSearchQuery, openSheet, confirmRemoveTransaction
}: {
  filterUserId: string | null;
  users: User[];
  calculations: CalculationMetrics;
  sortedTransactions: Transaction[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  openSheet: (type: ModalType, data?: Transaction | null) => void;
  confirmRemoveTransaction: (t: Transaction) => void;
}) => {
  const filteredUser = filterUserId ? users.find(u => u.id === filterUserId) : null;
  const userBalanceData = filteredUser ? calculations.userData.find(d => d.user.id === filteredUser.id) : null;

  const historyItemsToDisplay = useMemo(() => {
    if (filteredUser) {
      const userDeposits = sortedTransactions.filter(t => t.userId === filteredUser.id && t.type === 'deposit');
      const userSharedExpenses = sortedTransactions.filter(t => t.type === 'shared-expense' && t.sharedWith?.includes(filteredUser.id));

      const allHistoryItems: (
        { itemType: 'deposit'; transaction: Transaction; date: Date } | 
        { itemType: 'share'; transaction: Transaction; date: Date }
      )[] = [
        ...userDeposits.map(t => ({ itemType: 'deposit' as const, transaction: t, date: new Date(t.date) })),
        ...userSharedExpenses.map(t => ({ itemType: 'share' as const, transaction: t, date: new Date(t.date) }))
      ];
      
      return allHistoryItems.sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    // For the main history, show all deposits, expenses, and shared expenses.
    return sortedTransactions.filter(t => t.type !== 'meal');
  }, [filteredUser, sortedTransactions]);

  const searchedItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return historyItemsToDisplay;
    }
    const lowercasedQuery = searchQuery.toLowerCase();

    return historyItemsToDisplay.filter(itemOrTx => {
      const t = 'itemType' in itemOrTx ? itemOrTx.transaction : itemOrTx;
      const user = users.find(u => u.id === t.userId);
      const userName = user ? user.name.toLowerCase() : '';
      const description = t.description ? t.description.toLowerCase() : '';
      
      return userName.includes(lowercasedQuery) || description.includes(lowercasedQuery);
    });
  }, [searchQuery, historyItemsToDisplay, users]);

  return (
    <div className="space-y-4">
      {userBalanceData && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-600 dark:text-gray-300">Current Balance</h3>
              <p className={`font-bold text-2xl ${userBalanceData.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                  {userBalanceData.balance < 0 && '-'}<span className="font-black">৳</span>{Math.abs(userBalanceData.balance).toFixed(0)}
              </p>
          </div>
          <hr className="my-3 border-gray-100 dark:border-gray-700" />
          <div className="grid grid-cols-3 text-center gap-2">
              <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Total Meals</p>
                  <p className="font-bold text-gray-800 dark:text-gray-100 text-lg">{userBalanceData.userMealCount}</p>
              </div>
              <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Total Deposit</p>
                  <p className="font-bold text-gray-800 dark:text-gray-100 text-lg"><span className="font-black">৳</span>{userBalanceData.userDeposits.toFixed(0)}</p>
              </div>
              <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Total Cost</p>
                  <p className="font-bold text-gray-800 dark:text-gray-100 text-lg"><span className="font-black">৳</span>{(userBalanceData.userMealCost + userBalanceData.userSharedExpenseCost).toFixed(0)}</p>
              </div>
          </div>
        </div>
      )}

      {!filterUserId && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="relative">
            <Input
              leadingIcon={<SearchIcon className="h-5 w-5" />}
              type="text"
              placeholder="Search by description or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search transactions"
            />
          </div>
        </div>
      )}
  
      <div className="space-y-4">
        {historyItemsToDisplay.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">No transactions to display.</div>
        ) : searchedItems.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">No results for "{searchQuery}"</div>
        ) : (
          searchedItems.map((itemOrTx, index) => {
            if ('itemType' in itemOrTx) { // User-specific history view
              if (itemOrTx.itemType === 'deposit') {
                return <TransactionListItem key={itemOrTx.transaction.id} transaction={itemOrTx.transaction} users={users} onEdit={() => openSheet('deposit', itemOrTx.transaction)} onDelete={() => confirmRemoveTransaction(itemOrTx.transaction)} hideRunningBalance={true} />;
              } else { // 'share'
                const share = itemOrTx.transaction.amount / (itemOrTx.transaction.sharedWith?.length || 1);
                return <SharedExpenseShareItem key={`share-${itemOrTx.transaction.id}`} transaction={itemOrTx.transaction} users={users} yourShare={share} />;
              }
            } else { // General history view
                return <TransactionListItem key={itemOrTx.id} transaction={itemOrTx} users={users} onEdit={() => openSheet(itemOrTx.type, itemOrTx)} onDelete={() => confirmRemoveTransaction(itemOrTx)} />;
            }
          })
        )}
      </div>
    </div>
  );
};

const DepositsPage = ({ users, sortedTransactions, searchQuery, setSearchQuery, openSheet, confirmRemoveTransaction }: {
  users: User[];
  sortedTransactions: Transaction[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  openSheet: (type: ModalType, data?: Transaction | null) => void;
  confirmRemoveTransaction: (t: Transaction) => void;
}) => {
  const depositTransactions = useMemo(() =>
    sortedTransactions.filter(t => t.type === 'deposit'),
  [sortedTransactions]);

  const searchedItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return depositTransactions;
    }
    const lowercasedQuery = searchQuery.toLowerCase();

    return depositTransactions.filter(t => {
      const user = users.find(u => u.id === t.userId);
      const userName = user ? user.name.toLowerCase() : '';
      
      return userName.includes(lowercasedQuery);
    });
  }, [searchQuery, depositTransactions, users]);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative">
          <Input
            leadingIcon={<SearchIcon className="h-5 w-5" />}
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search deposits"
          />
        </div>
      </div>
  
      <div className="space-y-4">
        {depositTransactions.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">No deposits recorded.</div>
        ) : searchedItems.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">No results for "{searchQuery}"</div>
        ) : (
          searchedItems.map(transaction => (
            <TransactionListItem
              key={transaction.id}
              transaction={transaction}
              users={users}
              onEdit={() => openSheet(transaction.type, transaction)}
              onDelete={() => confirmRemoveTransaction(transaction)}
            />
          ))
        )}
      </div>
    </div>
  );
};

const ExpensesPage = ({ users, sortedTransactions, searchQuery, setSearchQuery, openSheet, confirmRemoveTransaction }: {
  users: User[];
  sortedTransactions: Transaction[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  openSheet: (type: ModalType, data?: Transaction | null) => void;
  confirmRemoveTransaction: (t: Transaction) => void;
}) => {
  const expenseTransactions = useMemo(() =>
    sortedTransactions.filter(t => t.type === 'expense' || t.type === 'shared-expense'),
  [sortedTransactions]);

  const searchedItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return expenseTransactions;
    }
    const lowercasedQuery = searchQuery.toLowerCase();

    return expenseTransactions.filter(t => {
      const user = users.find(u => u.id === t.userId);
      const userName = user ? user.name.toLowerCase() : '';
      const description = t.description ? t.description.toLowerCase() : '';
      
      return userName.includes(lowercasedQuery) || description.includes(lowercasedQuery);
    });
  }, [searchQuery, expenseTransactions, users]);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative">
          <Input
            leadingIcon={<SearchIcon className="h-5 w-5" />}
            type="text"
            placeholder="Search by description or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search expenses"
          />
        </div>
      </div>
  
      <div className="space-y-4">
        {expenseTransactions.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">No expenses recorded.</div>
        ) : searchedItems.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">No results for "{searchQuery}"</div>
        ) : (
          searchedItems.map(transaction => (
            <TransactionListItem
              key={transaction.id}
              transaction={transaction}
              users={users}
              onEdit={() => openSheet(transaction.type, transaction)}
              onDelete={() => confirmRemoveTransaction(transaction)}
            />
          ))
        )}
      </div>
    </div>
  );
};


// --- Main App Component ---

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => db.getDb().users);
  const [transactions, setTransactions] = useState<Transaction[]>(() => db.getDb().transactions);
  const [page, setPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [sheetConfig, setSheetConfig] = useState<ModalConfig>({ isOpen: false, type: null, data: null });
  const [alertDialog, setAlertDialog] = useState<AlertDialogConfig>({ isOpen: false, title: '', description: '', onConfirm: () => {} });
  const [isResetConfirmationOpen, setIsResetConfirmationOpen] = useState(false);
  const [filterUserId, setFilterUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    setSearchQuery('');
  }, [page, filterUserId]);
  
  useEffect(() => {
    if (!sheetConfig.isOpen) {
        setIsSubmitting(false);
        isSubmittingRef.current = false;
    }
  }, [sheetConfig.isOpen]);

  const calculations = useMemo(() => calculateMetrics(users, transactions), [users, transactions]);

  const sortedTransactions = useMemo(() => 
    [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  [transactions]);
  
  const firstMealDate = useMemo(() => {
    const mealTransactions = transactions.filter(t => t.type === 'meal');
    if (mealTransactions.length === 0) return null;
    const date = new Date(Math.min(...mealTransactions.map(t => new Date(t.date).getTime())));
    date.setHours(0, 0, 0, 0);
    return date;
  }, [transactions]);
  
  const lastMealDate = useMemo(() => {
    const mealTransactions = transactions.filter(t => t.type === 'meal');
    if (mealTransactions.length === 0) return null;
    const date = new Date(Math.max(...mealTransactions.map(t => new Date(t.date).getTime())));
    date.setHours(0, 0, 0, 0);
    return date;
  }, [transactions]);

  const handleNavigate = (newPage: Page, userId: string | null = null) => {
    setPage(newPage);
    setFilterUserId(userId);
    setIsMenuOpen(false);
  };
  
  const openSheet = (type: ModalType, data: Transaction | User | Partial<Transaction> | null = null) => {
    setSheetConfig({ isOpen: true, type, data: data as Transaction | User | null });
  };
  
  const closeSheet = () => setSheetConfig({ isOpen: false, type: null, data: null });

  const closeAlertDialog = () => setAlertDialog({ ...alertDialog, isOpen: false });
  
  const handleEntrySubmit = (entry: Partial<User & Transaction>, type: ModalType) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    const isEditing = !!entry.id;
    try {
        if (type === 'user') {
            const userEntry = entry as Partial<User>;
            if (!userEntry.name?.trim()) throw new Error('User name cannot be empty.');

            if (isEditing) {
                const updatedUser = db.updateUser({ ...users.find(u => u.id === userEntry.id), ...userEntry } as User);
                setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
            } else {
                const newUser = db.addUser(entry as Omit<User, 'id'>);
                setUsers(prev => [...prev, newUser]);
            }
        } else { // Transaction types
            const txEntry = entry as Partial<Transaction>;
            let dateForTransaction: string;

            if (isEditing) {
                const existingTx = transactions.find(t => t.id === txEntry.id);
                if (!existingTx) throw new Error("Transaction not found for editing.");
                
                if (txEntry.date) {
                    const originalDateTime = new Date(existingTx.date);
                    const newDatePart = new Date(txEntry.date);

                    originalDateTime.setFullYear(newDatePart.getFullYear(), newDatePart.getMonth(), newDatePart.getDate());
                    dateForTransaction = originalDateTime.toISOString();
                } else {
                    dateForTransaction = existingTx.date;
                }
            } else {
                const selectedDate = txEntry.date ? new Date(txEntry.date) : new Date();
                const now = new Date();
                
                selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
                dateForTransaction = selectedDate.toISOString();
            }

            if (!txEntry.userId) throw new Error('A user must be selected.');
            if (type !== 'meal' && (!txEntry.amount || txEntry.amount <= 0)) throw new Error('Amount must be greater than 0.');
            if (type === 'shared-expense' && (!txEntry.sharedWith || txEntry.sharedWith.length === 0)) throw new Error('At least one member must share the expense.');


            if (type === 'meal' && txEntry.userId === 'all') {
                if (isEditing) throw new Error("Cannot edit a meal entry for 'All' users.");
                if (!users.length) throw new Error("There are no users to add meals for.");

                const dateToMatch = new Date(dateForTransaction).toISOString().split('T')[0];
    
                let nextTransactions = [...transactions];
            
                users.forEach(user => {
                    const existingMeal = nextTransactions.find(t => 
                        t.type === 'meal' &&
                        t.userId === user.id &&
                        new Date(t.date).toISOString().split('T')[0] === dateToMatch
                    );
            
                    if (existingMeal) {
                        const updatedMeal = db.updateTransaction({
                            ...existingMeal,
                            mealDetails: txEntry.mealDetails,
                            description: txEntry.description,
                        });
                        nextTransactions = nextTransactions.map(t => t.id === updatedMeal.id ? updatedMeal : t);
                    } else {
                        const newMeal = db.addTransaction({
                            type: 'meal',
                            userId: user.id,
                            date: dateForTransaction,
                            amount: 0,
                            description: txEntry.description,
                            mealDetails: txEntry.mealDetails,
                        });
                        nextTransactions.push(newMeal);
                    }
                });
            
                setTransactions(nextTransactions);

            } else {
                if (isEditing) {
                    const existingTx = transactions.find(t => t.id === txEntry.id);
                    if (!existingTx) throw new Error("Transaction not found for editing.");
                    const updatedData = { ...txEntry };
                    if (updatedData.date) {
                      updatedData.date = dateForTransaction;
                    }
                    const updatedTransaction = db.updateTransaction({ ...existingTx, ...updatedData });
                    setTransactions(transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
                } else {
                    if (type === 'meal') {
                        const dateToMatch = new Date(dateForTransaction).toISOString().split('T')[0];
                        const existingMeal = transactions.find(t => 
                            t.type === 'meal' &&
                            t.userId === txEntry.userId &&
                            new Date(t.date).toISOString().split('T')[0] === dateToMatch
                        );

                        if (existingMeal) {
                             const updatedMeal = db.updateTransaction({
                                ...existingMeal,
                                mealDetails: txEntry.mealDetails,
                                description: txEntry.description,
                            });
                            setTransactions(transactions.map(t => t.id === updatedMeal.id ? updatedMeal : t));
                        } else {
                            const newTransactionData: Omit<Transaction, 'id'> = {
                                type: 'meal',
                                userId: txEntry.userId as string,
                                date: dateForTransaction,
                                amount: 0,
                                description: txEntry.description?.trim() || '',
                                mealDetails: txEntry.mealDetails,
                            };
                            const newTransaction = db.addTransaction(newTransactionData);
                            setTransactions(prev => [...prev, newTransaction]);
                        }
                    } else { // deposit, expense, shared-expense
                        const newTransactionData: Omit<Transaction, 'id'> = {
                            type: type as TransactionType,
                            userId: txEntry.userId as string,
                            date: dateForTransaction,
                            amount: txEntry.amount || 0,
                            description: txEntry.description?.trim() || '',
                            ...(type === 'shared-expense' && { sharedWith: txEntry.sharedWith })
                        };
                        const newTransaction = db.addTransaction(newTransactionData);
                        setTransactions(prev => [...prev, newTransaction]);
                    }
                }
            }
        }
        toast.success('Success!', `${type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} ${isEditing ? 'updated' : 'added'} successfully.`);
        closeSheet();

        if (!isEditing) {
          switch (type) {
            case 'meal':
              handleNavigate('calendar');
              break;
            case 'deposit':
              handleNavigate('deposits');
              break;
            case 'expense':
            case 'shared-expense':
              handleNavigate('expenses');
              break;
            case 'user':
              handleNavigate('members');
              break;
          }
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : `An unknown error occurred.`;
        toast.error('Error!', message);
        isSubmittingRef.current = false;
        setIsSubmitting(false);
    }
  };

  const confirmRemoveUser = (user: User) => {
    setAlertDialog({
      isOpen: true,
      title: `Remove ${user.name}?`,
      description: `This will permanently remove ${user.name} and all their associated data. This action cannot be undone.`,
      onConfirm: () => {
        db.deleteUser(user.id);
        setUsers(users.filter(u => u.id !== user.id));
        setTransactions(transactions.filter(t => t.userId !== user.id));
        if (filterUserId === user.id) {
          handleNavigate('members');
        }
        toast.success('User Removed', `${user.name} has been removed.`);
        closeAlertDialog();
      }
    });
  };

  const confirmRemoveTransaction = (transaction: Transaction) => {
    const typeLabel = transaction.type.replace('-', ' ');
    setAlertDialog({
      isOpen: true,
      title: `Delete this ${typeLabel}?`,
      description: `Are you sure you want to delete this ${typeLabel}? This action cannot be undone.`,
      onConfirm: () => {
        db.deleteTransaction(transaction.id);
        setTransactions(transactions.filter(t => t.id !== transaction.id));
        toast.success('Deleted', `The ${typeLabel} has been deleted.`);
        closeAlertDialog();
      }
    });
  };
  
  const handleSelectAddType = (type: ModalType) => {
    setIsAddMenuOpen(false);
    setTimeout(() => {
      if (type !== 'user' && users.length === 0) {
        toast.error('No Members Found', 'Please add a member before logging a transaction.');
        return;
      }
      openSheet(type);
    }, 300);
  };
  
  const openResetConfirmationDialog = () => {
    setIsResetConfirmationOpen(true);
  };

  const performActualReset = () => {
    db.resetAllData();
    const newDb = db.getDb(); // This creates and returns the default DB
    
    setUsers(newDb.users);
    setTransactions(newDb.transactions);

    toast.success('Data Reset', 'Application has been reset to its default state.');
    setIsResetConfirmationOpen(false);
    handleNavigate('home'); // Navigate to home page to show the fresh state
  };
  
  const filteredUserForTitle = useMemo(() => filterUserId ? users.find(u => u.id === filterUserId) : null, [filterUserId, users]);
  const transactionPageTitle = filteredUserForTitle ? `${filteredUserForTitle.name}'s History` : 'Transaction History';

  const pageConfig: Record<Page, { title: string; component: React.ReactNode }> = {
    home: { title: 'Meal Management', component: <HomePage firstMealDate={firstMealDate} calculations={calculations} handleNavigate={handleNavigate} openSheet={openSheet} /> },
    members: { title: 'Members', component: <MembersPage users={users} openSheet={openSheet} confirmRemoveUser={confirmRemoveUser} /> },
    transactions: { title: transactionPageTitle, component: <TransactionsPage {...{filterUserId, users, calculations, sortedTransactions, searchQuery, setSearchQuery, openSheet, confirmRemoveTransaction}} /> },
    calendar: { title: 'Meal Calendar', component: <CalendarPage users={users} transactions={transactions} firstMealDate={firstMealDate} lastMealDate={lastMealDate} calculations={calculations} openSheet={openSheet} /> },
    deposits: { title: 'All Deposits', component: <DepositsPage {...{users, sortedTransactions, searchQuery, setSearchQuery, openSheet, confirmRemoveTransaction}} /> },
    expenses: { title: 'All Expenses', component: <ExpensesPage {...{users, sortedTransactions, searchQuery, setSearchQuery, openSheet, confirmRemoveTransaction}} /> },
    settings: { title: 'Settings', component: <SettingsPage onDataReset={openResetConfirmationDialog} /> },
  };

  const ActivePage = pageConfig[page].component;

  const navItems: { page: Page, label: string, icon: React.ReactNode }[] = [
    { page: 'home', label: 'Home', icon: <HomeIcon className="h-6 w-6"/> },
    { page: 'transactions', label: 'History', icon: <ClipboardListIcon className="h-6 w-6"/> },
    { page: 'members', label: 'Members', icon: <UserGroupIcon className="h-6 w-6"/> },
    { page: 'deposits', label: 'Deposits', icon: <DepositIcon className="h-6 w-6"/> },
    { page: 'expenses', label: 'Expenses', icon: <ReceiptIcon className="h-6 w-6"/> },
    { page: 'settings', label: 'Settings', icon: <SettingsIcon className="h-6 w-6" /> },
  ];

  const Sidebar = () => (
    <aside className="w-64 bg-white dark:bg-gray-800 dark:border-r dark:border-gray-700 shadow-md hidden md:flex flex-col">
      <div className="p-6 text-2xl font-bold text-blue-700 dark:text-blue-400 border-b dark:border-gray-700">Meal Mng.</div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => (
          <button key={item.page} onClick={() => handleNavigate(item.page)} className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors font-bold text-base tracking-wide ${page === item.page ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'}`}>
            <span className="mr-4">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t dark:border-gray-700">
        <Button onClick={() => setIsAddMenuOpen(true)} className="w-full">
          <span className="mr-2"><PlusIcon className="h-5 w-5"/></span> Add New
        </Button>
      </div>
    </aside>
  );
  
  const BottomNav = () => (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 dark:shadow-[0_-2px_5px_rgba(0,0,0,0.3)] h-16 z-50">
      <div className="grid grid-cols-3 h-full items-center">
        <button onClick={() => handleNavigate('home')} className={`flex flex-col items-center justify-center text-xs gap-1 ${page === 'home' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
          <HomeIcon className="h-5 w-5"/>
          <span>Home</span>
        </button>
        <div className="relative flex justify-center">
            <button 
                onClick={() => setIsAddMenuOpen(true)} 
                className="absolute -top-6 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
                aria-label="Add New"
            >
                <PlusIcon className="h-8 w-8"/>
            </button>
        </div>
        <button onClick={() => handleNavigate('transactions')} className={`flex flex-col items-center justify-center text-xs gap-1 ${page === 'transactions' || page === 'deposits' || page === 'expenses' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
          <ClipboardListIcon className="h-5 w-5"/>
          <span>History</span>
        </button>
      </div>
    </nav>
  );

  const MobileMenu = () => (
     <div className={`fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}>
      <div className={`fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-lg p-4 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-blue-700 dark:text-blue-400">Menu</h2><button onClick={() => setIsMenuOpen(false)} className="text-gray-500 dark:text-gray-300"><XIcon /></button></div>
        <nav className="space-y-2">{navItems.map(item => (<button key={item.page} onClick={() => handleNavigate(item.page)} className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors font-bold text-base tracking-wide ${page === item.page ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'}`}><span className="mr-4">{item.icon}</span>{item.label}</button>))}
        </nav>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={pageConfig[page].title} 
          onOpenMenu={() => setIsMenuOpen(true)}
        />
        <main className={`flex-1 overflow-y-auto ${page === 'calendar' ? 'px-1' : 'p-4 md:p-6'} pb-20 md:pb-6`}>
          <div key={page + (filterUserId || '')} className={`max-w-4xl mx-auto fade-in ${page === 'calendar' ? 'h-full' : ''}`}>
            {ActivePage}
          </div>
        </main>
      </div>
      <BottomNav />
      <MobileMenu />
      <AddMenuSheet
        isOpen={isAddMenuOpen}
        onClose={() => setIsAddMenuOpen(false)}
        onSelect={handleSelectAddType}
      />
      <FormSheet
        key={sheetConfig.type + '-' + (sheetConfig.data?.id || 'new')}
        config={sheetConfig}
        onClose={closeSheet}
        onSubmit={handleEntrySubmit}
        users={users}
        isSubmitting={isSubmitting}
      />
       <AlertDialog
        config={alertDialog}
        onClose={closeAlertDialog}
      />
      <ResetConfirmationDialog
        isOpen={isResetConfirmationOpen}
        onClose={() => setIsResetConfirmationOpen(false)}
        onConfirm={performActualReset}
      />
    </div>
  );
};

export default App;