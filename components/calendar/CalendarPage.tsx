import React, { useMemo } from 'react';
import { User, Transaction, ModalType } from '../../types';
import { CalculationMetrics } from '../../logic';

interface CalendarPageProps {
  users: User[];
  transactions: Transaction[];
  firstMealDate: Date | null;
  lastMealDate: Date | null;
  calculations: CalculationMetrics;
  openSheet: (type: ModalType, data: Transaction | Partial<Transaction>) => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ users, transactions, firstMealDate, lastMealDate, calculations, openSheet }) => {
  const sortedUsers = useMemo(() => [...users].sort((a, b) => a.name.localeCompare(b.name)), [users]);

  // Create a map for efficient lookup of meals by date and user ID.
  const mealMap = useMemo(() => {
    const map = new Map<string, Transaction>();
    transactions.filter(t => t.type === 'meal').forEach(t => {
      // Use local date parts to avoid timezone issues
      const date = new Date(t.date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const key = `${dateStr}-${t.userId}`;
      map.set(key, t);
    });
    return map;
  }, [transactions]);

  // Generate the range of days to display from the first meal to the last.
  const dayRange = useMemo(() => {
    if (!firstMealDate || !lastMealDate) return [];
    
    const days = [];
    let currentDate = new Date(firstMealDate);
    let dayCounter = 1;

    while (currentDate <= lastMealDate) {
      days.push({
        dayNumber: dayCounter,
        date: new Date(currentDate),
      });
      currentDate.setDate(currentDate.getDate() + 1);
      dayCounter++;
    }
    
    return days;
  }, [firstMealDate, lastMealDate]);


  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg h-full flex flex-col p-4">
      {users.length > 0 ? (
        dayRange.length > 0 ? (
            <div className="overflow-auto relative border border-gray-200/80 dark:border-gray-700 rounded-xl flex-1">
                <table className="min-w-full text-base divide-y divide-gray-200/80 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th scope="col" className="sticky top-0 left-0 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-center font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider z-30 w-16 md:w-20 border-r border-b border-gray-200/80 dark:border-gray-700">
                                Day
                            </th>
                            <th scope="col" className="sticky top-0 left-16 md:left-20 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-left font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider z-30 border-r border-b border-gray-200/80 dark:border-gray-700">
                                Date
                            </th>
                            {sortedUsers.map(user => (
                            <th key={user.id} scope="col" className="sticky top-0 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-center font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap z-20 border-b border-gray-200/80 dark:border-gray-700">
                                {user.name.split(' ')[0]}
                            </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200/80 dark:divide-gray-700">
                        {dayRange.map(item => {
                            // Generate the lookup key using local date parts.
                            const date = item.date;
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            const dateStr = `${year}-${month}-${day}`;

                            return (
                            <tr key={dateStr} className="group">
                                <td className="sticky left-0 bg-white dark:bg-gray-800 group-hover:bg-gray-50/70 dark:group-hover:bg-gray-700/50 px-4 py-3 whitespace-nowrap font-bold text-gray-500 dark:text-gray-400 text-center border-r border-gray-200/80 dark:border-gray-700 z-10 w-16 md:w-20">
                                    {item.dayNumber}
                                </td>
                                <td className="sticky left-16 md:left-20 bg-white dark:bg-gray-800 group-hover:bg-gray-50/70 dark:group-hover:bg-gray-700/50 px-4 py-3 whitespace-nowrap font-medium text-gray-800 dark:text-gray-100 border-r border-gray-200/80 dark:border-gray-700 z-10">
                                    {item.date.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
                                </td>
                                {sortedUsers.map(user => {
                                  const key = `${dateStr}-${user.id}`;
                                  const transaction = mealMap.get(key);
                                  
                                  const mealCount = transaction 
                                    ? (transaction.mealDetails ? Object.values(transaction.mealDetails).reduce((s: number, c: unknown) => s + (Number(c) || 0), 0) : transaction.mealCount ?? 0)
                                    : 0;
                                  
                                  let className = 'font-bold text-sm inline-flex items-center justify-center px-3 py-1.5 rounded-full min-w-[32px]';

                                  if (mealCount === 0) {
                                      className += ' bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300';
                                  } else if (mealCount === 1) {
                                      className += ' bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300';
                                  } else if (mealCount === 2) {
                                      className += ' bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300';
                                  } else { // mealCount > 2
                                      className += ' bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300';
                                  }
                                  
                                  const handleCellClick = () => {
                                      const dataForSheet = transaction || {
                                        userId: user.id,
                                        date: item.date.toISOString(),
                                      };
                                      openSheet('meal', dataForSheet);
                                  };

                                  return (
                                      <td key={user.id} className="px-4 py-3 whitespace-nowrap text-center cursor-pointer hover:bg-gray-100/80 dark:hover:bg-gray-700 transition-colors duration-150" onClick={handleCellClick}>
                                          <span className={className}>
                                              {mealCount}
                                          </span>
                                      </td>
                                  );
                                })}
                            </tr>
                            );
                        })}
                    </tbody>
                    <tfoot className="bg-gray-50 dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700">
                      <tr>
                        <th scope="row" colSpan={2} className="sticky bottom-0 left-0 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-left font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider z-30 border-r border-t border-gray-200/80 dark:border-gray-700">
                            Total Meals
                        </th>
                        {sortedUsers.map(user => {
                          const userData = calculations.userData.find(ud => ud.user.id === user.id);
                          const mealCount = userData?.userMealCount ?? 0;
                          return (
                            <td key={user.id} className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-center font-bold text-gray-800 dark:text-gray-100 z-20 border-t border-gray-200/80 dark:border-gray-700">
                              {mealCount}
                            </td>
                          );
                        })}
                      </tr>
                    </tfoot>
                </table>
            </div>
        ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <p className="font-semibold">No Meals Logged Yet</p>
                <p className="text-sm mt-1">Add a meal to start tracking in the calendar.</p>
            </div>
        )
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <p className="font-semibold">No Members Found</p>
            <p className="text-sm mt-1">Please add members to see the meal calendar.</p>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;