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
import { toast } from './components/ui/Toaster';
import { 
  HomeIcon, UserGroupIcon, ClipboardListIcon, CalendarIcon, ReceiptIcon, CurrencyBangladeshiIcon,
  MenuIcon, XIcon, PlusIcon, UserPlusIcon, SearchIcon
} from './components/ui/Icons';
import { calculateMetrics } from './logic';
import * as db from './data';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [sheetConfig, setSheetConfig] = useState<ModalConfig>({ isOpen: false, type: null, data: null });
  const [alertDialog, setAlertDialog] = useState<AlertDialogConfig>({ isOpen: false, title: '', description: '', onConfirm: () => {} });
  const [filterUserId, setFilterUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  // Load data from localStorage on initial component mount
  useEffect(() => {
    const { users: storedUsers, transactions: storedTransactions } = db.getDb();
    setUsers(storedUsers);
    setTransactions(storedTransactions);
  }, []);
  
  useEffect(() => {
    setSearchQuery('');
  }, [filterUserId]);
  
  // When the form sheet is closed, we can safely reset the submission lock.
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

  const handleNavigate = (newPage: Page, userId: string | null = null) => {
    setPage(newPage);
    setFilterUserId(userId);
    setIsMenuOpen(false);
  };
  
  const openSheet = (type: ModalType, data: Transaction | User | null = null) => {
    setSheetConfig({ isOpen: true, type, data });
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
                // Simply call addUser - let data.ts handle the duplicate check
                const newUser = db.addUser({ name: userEntry.name.trim() });
                setUsers(prev => [...prev, newUser]);
                handleNavigate('members');
            }
        } else { // Transaction types
            const txEntry = entry as Partial<Transaction> & { date: string };
            
            if (!txEntry.userId) throw new Error('A user must be selected.');
            if (type !== 'meal' && (!txEntry.amount || txEntry.amount <= 0)) throw new Error('Amount must be greater than 0.');

            if (type === 'meal' && txEntry.userId === 'all') {
                if (isEditing) throw new Error("Cannot edit a meal entry for 'All' users.");
                if (!users.length) throw new Error("There are no users to add meals for.");

                const newTransactions: Transaction[] = [];
                users.forEach(user => {
                  const newMeal = db.addTransaction({
                      type: 'meal',
                      userId: user.id,
                      date: new Date(txEntry.date).toISOString(),
                      amount: 0,
                      description: txEntry.description || `${txEntry.mealCount || 0} meal(s)`,
                      mealCount: txEntry.mealCount || 0,
                  });
                  newTransactions.push(newMeal);
                });
                setTransactions(prev => [...prev, ...newTransactions]);

            } else {
                if (isEditing) {
                    const existingTx = transactions.find(t => t.id === txEntry.id);
                    if (!existingTx) throw new Error("Transaction not found for editing.");
                    const updatedTransaction = db.updateTransaction({ ...existingTx, ...txEntry });
                    setTransactions(transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
                } else {
                    const newTransactionData: Omit<Transaction, 'id'> = {
                        type: type as TransactionType,
                        userId: txEntry.userId as string,
                        date: new Date(txEntry.date || new Date()).toISOString(),
                        amount: txEntry.amount || 0,
                        description: txEntry.description?.trim() || '',
                        mealCount: txEntry.mealCount || 0,
                    };
                    const newTransaction = db.addTransaction(newTransactionData);
                    setTransactions(prev => [...prev, newTransaction]);
                }
            }
        }
        toast.success('Success!', `${type.charAt(0).toUpperCase() + type.slice(1)} ${isEditing ? 'updated' : 'added'} successfully.`);
        closeSheet();
    } catch (error) {
        const message = error instanceof Error ? error.message : `An unknown error occurred.`;
        toast.error('Error!', message);
        // On error, we must reset the lock manually so the user can try again.
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
        toast.success('User Removed', `${user.name} has been removed.`);
        closeAlertDialog();
      }
    });
  };

  const confirmRemoveTransaction = (transaction: Transaction) => {
    setAlertDialog({
      isOpen: true,
      title: `Delete this ${transaction.type}?`,
      description: `Are you sure you want to delete this ${transaction.type}? This action cannot be undone.`,
      onConfirm: () => {
        db.deleteTransaction(transaction.id);
        setTransactions(transactions.filter(t => t.id !== transaction.id));
        toast.success('Deleted', `The ${transaction.type} has been deleted.`);
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

  const createOpenTransactionSheetHandler = (type: 'meal' | 'expense' | 'deposit') => () => {
    if (users.length === 0) {
      toast.error('No Members Found', 'Please add a member before logging a transaction.');
      return;
    }
    openSheet(type);
  };
  
  const HomePage = () => {
    const dayCount = useMemo(() => {
      const mealTransactions = transactions.filter(t => t.type === 'meal');
      if (mealTransactions.length === 0) return 0;

      const firstDate = new Date(Math.min(...mealTransactions.map(t => new Date(t.date).getTime())));
      const today = new Date();
      
      firstDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      const diffTime = today.getTime() - firstDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays + 1;
    }, [transactions]);

    const currentDate = new Date().toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="bg-white rounded-xl shadow-md flex items-stretch overflow-hidden">
            <div className="bg-gray-100 py-2 px-4 flex flex-col items-center justify-center">
              <p className="text-xs font-bold text-gray-500">Day</p>
              <p className="text-3xl font-bold text-gray-800">{dayCount}</p>
            </div>
            <div className="flex items-center p-3 px-5">
              <p className="font-semibold text-gray-700 text-lg">{currentDate}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-500 text-white p-5 rounded-2xl shadow-lg text-center">
          <p className="font-medium text-base text-blue-100">Current Meal Rate</p>
          <p className="text-5xl font-bold tracking-tight"><span className="font-black">৳</span>{calculations.mealRate.toFixed(2)}</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
            <DashboardCard title="Meals" value={calculations.totalMealCount} />
            <DashboardCard title="Deposits" value={calculations.totalDeposits} formatAs="currency" />
            <DashboardCard title="Expenses" value={calculations.totalExpenses} formatAs="currency" />
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Flatmate Balances</h2>
          <div className="space-y-4">
            {calculations.userData.map(data => (
              <FlatmateBalanceCard key={data.user.id} user={data.user} balance={data.balance} mealCount={data.userMealCount} totalDeposit={data.userDeposits} totalExpenses={data.userMealCost} onHistoryClick={() => handleNavigate('transactions', data.user.id)} />
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const MembersPage = () => (
     <div className="bg-white p-6 rounded-lg shadow-md">
       <h2 className="text-xl font-bold text-gray-700 mb-4">All Members</h2>
       <div className="space-y-3">
         {users.map(user => 
            <MemberCard 
              key={user.id} 
              user={user} 
              onEdit={() => openSheet('user', user)}
              onRemove={() => confirmRemoveUser(user)} 
            />
          )}
       </div>
     </div>
  );

  const createTransactionPage = (title: string, type: TransactionType) => () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-700 mb-4">{title}</h2>
      <ul className="space-y-4">
        {sortedTransactions.filter(t => t.type === type).map(t => (
          <TransactionListItem key={t.id} transaction={t} users={users} onEdit={() => openSheet(type, t)} onDelete={() => confirmRemoveTransaction(t)} />
        ))}
      </ul>
    </div>
  );
  
  const ExpensesPage = createTransactionPage("All Expenses", 'expense');
  const DepositsPage = createTransactionPage("All Deposits", 'deposit');

  const TransactionsPage = () => {
    const filteredUser = filterUserId ? users.find(u => u.id === filterUserId) : null;
    const userBalanceData = filteredUser ? calculations.userData.find(d => d.user.id === filteredUser.id) : null;
  
    const transactionsToDisplay = useMemo(() => {
      let baseTransactions = sortedTransactions;

      if (filteredUser) {
        // Create virtual expense transactions for meals for the specific user
        const userMealCostsAsExpenses = baseTransactions
          .filter(t => t.type === 'meal' && t.userId === filteredUser.id)
          .map(t => ({
            ...t,
            id: `meal-cost-${t.id}`, // Make ID unique to avoid key conflicts
            type: 'expense' as const,
            amount: (t.mealCount ?? 0) * calculations.mealRate,
            description: `${t.mealCount} Meal(s) Cost`
          }));
        
        baseTransactions = [
            ...baseTransactions.filter(t => t.userId === filteredUser.id && t.type !== 'meal'), 
            ...userMealCostsAsExpenses
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      } else {
        // For general history, filter out raw meal entries
        baseTransactions = sortedTransactions.filter(t => t.type !== 'meal');
      }
      return baseTransactions;
    }, [filteredUser, sortedTransactions, calculations.mealRate]);
  
    const allItemsWithRunningBalance = useMemo(() => {
      const finalBalance = filterUserId
        ? calculations.userData.find(d => d.user.id === filterUserId)?.balance ?? 0
        : calculations.remainingBalance;

      let currentBalance = finalBalance;
      const itemsWithBalance: { transaction: Transaction; runningBalance: number }[] = [];

      for (const transaction of transactionsToDisplay) {
        itemsWithBalance.push({ transaction, runningBalance: currentBalance });
        if (transaction.type === 'deposit') {
          currentBalance -= transaction.amount;
        } else if (transaction.type === 'expense') {
          currentBalance += transaction.amount;
        }
      }
      return itemsWithBalance;
    }, [transactionsToDisplay, filterUserId, calculations]);
  
    const searchedItemsWithRunningBalance = useMemo(() => {
      if (!searchQuery.trim()) {
        return allItemsWithRunningBalance;
      }
      const lowercasedQuery = searchQuery.toLowerCase();
  
      return allItemsWithRunningBalance.filter(({ transaction: t }) => {
        const user = users.find(u => u.id === t.userId);
        const userName = user ? user.name.toLowerCase() : '';
        const description = t.description ? t.description.toLowerCase() : '';
        
        return userName.includes(lowercasedQuery) || description.includes(lowercasedQuery);
      });
    }, [searchQuery, allItemsWithRunningBalance, users]);
  
    return (
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-700">
            {filteredUser ? `Transaction History for ${filteredUser.name}` : 'Transaction History'}
            {filteredUser && <button onClick={() => setFilterUserId(null)} className="ml-4 text-sm font-normal text-green-600 hover:underline">(Show All)</button>}
          </h2>
        </div>
        
        {userBalanceData && (
          <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
             <h3 className="font-semibold text-gray-600">Current Balance</h3>
             <p className={`font-bold text-2xl ${userBalanceData.balance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {userBalanceData.balance < 0 && '-'}<span className="font-black">৳</span>{Math.abs(userBalanceData.balance).toFixed(2)}
             </p>
          </div>
        )}
  
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search by description or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Search transactions"
              />
            </div>
          </div>
    
          <ul className="space-y-4">
            {transactionsToDisplay.length === 0 ? (
              <li className="text-center text-gray-500 py-8">No transactions to display.</li>
            ) : searchedItemsWithRunningBalance.length === 0 ? (
              <li className="text-center text-gray-500 py-8">No results for "{searchQuery}"</li>
            ) : (
              searchedItemsWithRunningBalance.map(({ transaction, runningBalance }) => (
                <TransactionListItem
                  key={transaction.id}
                  transaction={transaction}
                  users={users}
                  onEdit={() => openSheet(transaction.type, transaction)}
                  onDelete={() => confirmRemoveTransaction(transaction)}
                  runningBalance={runningBalance}
                />
              ))
            )}
          </ul>
        </div>
      </div>
    );
  };

  const CalendarPage = () => <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">Calendar feature coming soon.</div>;
  
  const pageConfig = {
    home: { title: 'Meal Management', component: HomePage, fab: { icon: <PlusIcon/>, action: () => setIsAddMenuOpen(true) } },
    members: { title: 'Members', component: MembersPage, fab: { icon: <UserPlusIcon />, action: () => openSheet('user') } },
    expenses: { title: 'All Expenses', component: ExpensesPage, fab: { icon: <PlusIcon/>, action: createOpenTransactionSheetHandler('expense') } },
    deposits: { title: 'All Deposits', component: DepositsPage, fab: { icon: <PlusIcon/>, action: createOpenTransactionSheetHandler('deposit') } },
    transactions: { title: 'Transaction History', component: TransactionsPage, fab: null },
    calendar: { title: 'Calendar', component: CalendarPage, fab: null },
  };

  const ActivePage = pageConfig[page].component;
  const fabConfig = pageConfig[page].fab;

  const navItems: { page: Page, label: string, icon: React.ReactNode }[] = [
    { page: 'home', label: 'Home', icon: <HomeIcon /> },
    { page: 'members', label: 'Members', icon: <UserGroupIcon /> },
    { page: 'transactions', label: 'History', icon: <ClipboardListIcon /> },
    { page: 'calendar', label: 'Calendar', icon: <CalendarIcon /> },
    { page: 'expenses', label: 'Expenses', icon: <ReceiptIcon /> },
    { page: 'deposits', label: 'Deposits', icon: <CurrencyBangladeshiIcon /> },
  ];

  const Sidebar = () => (
    <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
      <div className="p-6 text-2xl font-bold text-green-700 border-b">Meal Mng.</div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => (
          <button key={item.page} onClick={() => handleNavigate(item.page)} className={`w-full flex items-center px-4 py-2 rounded-lg text-left transition-colors ${page === item.page ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}>
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
       {fabConfig && (
        <div className="p-4 border-t">
          <button onClick={fabConfig.action} className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <span className="mr-2">{fabConfig.icon}</span> Add New
          </button>
        </div>
      )}
    </aside>
  );
  
  const BottomNav = () => (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_5px_rgba(0,0,0,0.1)] flex justify-around items-center h-16 z-50">
      <button onClick={() => handleNavigate('home')} className={`flex flex-col items-center justify-center text-xs ${page === 'home' ? 'text-green-600' : 'text-gray-500'}`}><HomeIcon /> Home</button>
      <button onClick={() => handleNavigate('members')} className={`flex flex-col items-center justify-center text-xs ${page === 'members' ? 'text-green-600' : 'text-gray-500'}`}><UserGroupIcon /> Members</button>
      {fabConfig && (<button onClick={fabConfig.action} className="w-16 h-16 -mt-8 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg">{fabConfig.icon}</button>)}
      <button onClick={() => handleNavigate('transactions')} className={`flex flex-col items-center justify-center text-xs ${page === 'transactions' ? 'text-green-600' : 'text-gray-500'}`}><ClipboardListIcon /> History</button>
       <button onClick={() => setIsMenuOpen(true)} className="flex flex-col items-center justify-center text-xs text-gray-500"><MenuIcon /> More</button>
    </nav>
  );

  const MobileMenu = () => (
     <div className={`fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}>
      <div className={`fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg p-4 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-green-700">Menu</h2><button onClick={() => setIsMenuOpen(false)}><XIcon /></button></div>
        <nav className="space-y-2">{navItems.map(item => (<button key={item.page} onClick={() => handleNavigate(item.page)} className={`w-full flex items-center px-4 py-2 rounded-lg text-left transition-colors ${page === item.page ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}><span className="mr-3">{item.icon}</span>{item.label}</button>))}
        </nav>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen font-sans bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={pageConfig[page].title} 
          onOpenMenu={() => setIsMenuOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
          <div key={page} className="max-w-4xl mx-auto fade-in">
            <ActivePage />
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
    </div>
  );
};

export default App;