import React, { useState, useMemo, useEffect } from 'react';
// FIX: Import ModalType to resolve 'Cannot find name' error.
import { User, Transaction, TransactionType, Page, ModalConfig, AlertDialogConfig, ModalType } from './types';
import Header from './components/Header';
import FlatmateBalanceCard from './components/FlatmateBalanceCard';
import MemberCard from './components/MemberCard';
import FormSheet from './components/FormSheet';
import TransactionListItem from './components/TransactionHistory';
import AlertDialog from './components/AlertDialog';
import AddMenuSheet from './components/AddMenuSheet'; // Import the new menu sheet
import { toast } from './components/Toaster';
import { 
  HomeIcon, UserGroupIcon, ClipboardListIcon, CalendarIcon, ReceiptIcon, CurrencyBangladeshiIcon,
  MenuIcon, XIcon, PlusIcon, UserPlusIcon
} from './components/Icons';

// --- MOCK DATA ---
const INITIAL_USERS: User[] = [
  { id: '1', name: 'parvez', avatarUrl: '' },
  { id: '2', name: 'fahim', avatarUrl: '' },
];
const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'deposit', userId: '1', date: '2025-09-25T10:00:00Z', amount: 500, description: 'Initial Deposit' },
  { id: 't2', type: 'expense', userId: '1', date: '2025-09-25T14:00:00Z', amount: 240, description: 'Groceries' },
  { id: 't3', type: 'meal', userId: '1', date: '2025-09-25T12:00:00Z', amount: 0, mealCount: 2, description: 'Lunch & Dinner' },
  { id: 't4', type: 'meal', userId: '2', date: '2025-09-25T12:00:00Z', amount: 0, mealCount: 2, description: 'Lunch & Dinner' },
];

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [page, setPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false); // State for the main "Add New" menu
  const [sheetConfig, setSheetConfig] = useState<ModalConfig>({ isOpen: false, type: null, data: null });
  const [alertDialog, setAlertDialog] = useState<AlertDialogConfig>({ isOpen: false, title: '', description: '', onConfirm: () => {} });
  const [filterUserId, setFilterUserId] = useState<string | null>(null);

  // --- Calculations ---
  const calculations = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const deposits = transactions.filter(t => t.type === 'deposit');
    const meals = transactions.filter(t => t.type === 'meal');

    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalDeposits = deposits.reduce((sum, t) => sum + t.amount, 0);
    const totalMealCount = meals.reduce((sum, t) => sum + (t.mealCount ?? 0), 0);
    const mealRate = totalMealCount > 0 ? totalExpenses / totalMealCount : 0;
    const remainingBalance = totalDeposits - totalExpenses;

    const userData = users.map(user => {
      const userDeposits = deposits.filter(t => t.userId === user.id).reduce((sum, t) => sum + t.amount, 0);
      const userExpensesPaid = expenses.filter(t => t.userId === user.id).reduce((sum, t) => sum + t.amount, 0);
      const userMealCount = meals.filter(t => t.userId === user.id).reduce((sum, t) => sum + (t.mealCount ?? 0), 0);
      const userMealCost = userMealCount * mealRate;
      const balance = userDeposits - userMealCost;
      return { user, userDeposits, userExpensesPaid, userMealCount, userMealCost, balance };
    });

    return { totalExpenses, totalDeposits, totalMealCount, mealRate, remainingBalance, userData };
  }, [users, transactions]);

  const sortedTransactions = useMemo(() => 
    [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  [transactions]);

  // --- Handlers ---
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
  
  const handleEntrySubmit = (entry: any, type: ModalType) => {
    const isEditing = sheetConfig.data?.id;
    try {
        if (type === 'user') {
            if(isEditing) {
                setUsers(users.map(u => u.id === entry.id ? entry : u));
            } else {
                setUsers([...users, { ...entry, id: Date.now().toString() }]);
            }
        } else {
            if(isEditing) {
                setTransactions(transactions.map(t => t.id === entry.id ? entry : t));
            } else {
                setTransactions([...transactions, { ...entry, id: Date.now().toString(), date: new Date().toISOString() }]);
            }
        }
        toast.success('Success!', `${type.charAt(0).toUpperCase() + type.slice(1)} ${isEditing ? 'updated' : 'added'} successfully.`);
        closeSheet();
    } catch (error) {
        toast.error('Error!', `Failed to ${isEditing ? 'update' : 'add'} ${type}.`);
    }
  };

  const confirmRemoveUser = (user: User) => {
    setAlertDialog({
      isOpen: true,
      title: `Remove ${user.name}?`,
      description: `This will permanently remove ${user.name} and all their associated data. This action cannot be undone.`,
      onConfirm: () => {
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
        setTransactions(transactions.filter(t => t.id !== transaction.id));
        toast.success('Deleted', `The ${transaction.type} has been deleted.`);
        closeAlertDialog();
      }
    });
  };
  
  // Handler for the main "Add New" menu
  const handleSelectAddType = (type: ModalType) => {
    setIsAddMenuOpen(false);
    // Use a short timeout to allow the close animation of the first sheet to finish
    setTimeout(() => {
      openSheet(type);
    }, 300);
  };
  

  // --- Page Components ---
  const HomePage = () => (
    <div className="space-y-6">
      <div className="bg-blue-500 text-white p-6 rounded-xl shadow-lg text-center">
        <p className="font-medium text-lg">Current Meal Rate</p>
        <p className="text-5xl font-bold tracking-tight"><span className="font-black">৳</span>{calculations.mealRate.toFixed(2)}</p>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Meals</p><p className="text-2xl font-bold">{calculations.totalMealCount}</p></div>
        <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Deposits</p><p className="text-2xl font-bold"><span className="font-black">৳</span>{calculations.totalDeposits}</p></div>
        <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Expenses</p><p className="text-2xl font-bold"><span className="font-black">৳</span>{calculations.totalExpenses}</p></div>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg shadow-inner text-center">
        <p className="text-gray-600 font-medium">Remaining Balance</p>
        <p className="text-3xl font-bold text-gray-800"><span className="font-black">৳</span>{calculations.remainingBalance.toFixed(2)}</p>
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
  
  const MembersPage = () => (
     <div className="bg-white p-6 rounded-lg shadow-md">
       <h2 className="text-xl font-bold text-gray-700 mb-4">All Members</h2>
       <div className="space-y-3">
         {users.map(user => <MemberCard key={user.id} user={user} onRemove={() => confirmRemoveUser(user)} />)}
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
    let transactionsToDisplay = sortedTransactions;
    if(filteredUser) {
        const userMealCosts = transactionsToDisplay.filter(t => t.type === 'meal' && t.userId === filteredUser.id).map(t => ({...t, type: 'expense' as const, amount: (t.mealCount ?? 0) * calculations.mealRate, description: `${t.mealCount} Meals Cost`}));
        transactionsToDisplay = [...transactionsToDisplay.filter(t => t.userId === filteredUser.id && t.type !== 'meal'), ...userMealCosts].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    let runningBalance = filterUserId 
        ? calculations.userData.find(ud => ud.user.id === filterUserId)?.balance ?? 0 
        : calculations.remainingBalance;
    
    // Recalculate running balance correctly
    const itemsWithRunningBalance = transactionsToDisplay.reduce((acc, t) => {
        const balanceAfter = acc.length > 0 ? acc[acc.length-1].runningBalance : (filteredUser ? calculations.userData.find(d=>d.user.id===filterUserId)!.balance : calculations.remainingBalance);
        let newBalance = balanceAfter;
        if (t.type === 'deposit') newBalance += t.amount;
        else if (t.type === 'expense') newBalance -= t.amount;
        acc.push({transaction: t, runningBalance: newBalance});
        return acc;
    }, [] as {transaction: Transaction, runningBalance: number}[]).reverse();
    
    // Correct initial running balance
    if(itemsWithRunningBalance.length > 0) {
        const totalDeposits = transactionsToDisplay.filter(t => t.type === 'deposit').reduce((sum,t) => sum+t.amount, 0);
        const totalExpenses = transactionsToDisplay.filter(t => t.type === 'expense').reduce((sum,t) => sum+t.amount, 0);
        let finalBalance = totalDeposits-totalExpenses;

        for (let i = 0; i < itemsWithRunningBalance.length; i++) {
            itemsWithRunningBalance[i].runningBalance = finalBalance;
            const t = itemsWithRunningBalance[i].transaction;
            if(t.type === 'deposit') finalBalance -= t.amount;
            else if (t.type === 'expense') finalBalance += t.amount;
        }
    }


    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          {filteredUser ? `Transaction History for ${filteredUser.name}` : 'Transaction History'}
          {filteredUser && <button onClick={() => setFilterUserId(null)} className="ml-4 text-sm font-normal text-green-600 hover:underline">(Show All)</button>}
        </h2>
        <ul className="space-y-4">
          {itemsWithRunningBalance.map(({transaction, runningBalance}) => (
            <TransactionListItem key={transaction.id} transaction={transaction} users={users} onEdit={() => openSheet(transaction.type, transaction)} onDelete={() => confirmRemoveTransaction(transaction)} runningBalance={runningBalance} />
          ))}
        </ul>
      </div>
    );
  };

  const CalendarPage = () => <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">Calendar feature coming soon.</div>;
  
  const pageConfig = {
    home: { title: 'Meal Management', component: HomePage, fab: { icon: <PlusIcon/>, action: () => setIsAddMenuOpen(true) } },
    members: { title: 'Members', component: MembersPage, fab: { icon: <UserPlusIcon />, action: () => openSheet('user') } },
    expenses: { title: 'All Expenses', component: ExpensesPage, fab: { icon: <PlusIcon/>, action: () => openSheet('expense') } },
    deposits: { title: 'All Deposits', component: DepositsPage, fab: { icon: <PlusIcon/>, action: () => openSheet('deposit') } },
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
        <Header title={pageConfig[page].title} onOpenMenu={() => setIsMenuOpen(true)} />
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
        config={sheetConfig}
        onClose={closeSheet}
        onSubmit={handleEntrySubmit}
        users={users}
      />
       <AlertDialog
        config={alertDialog}
        onClose={closeAlertDialog}
      />
    </div>
  );
};

export default App;
