import React, { useMemo } from 'react';
import { User, Transaction } from '../../types';

interface CalendarPageProps {
  users: User[];
  transactions: Transaction[];
  firstMealDate: Date | null;
}

interface MealsOnDate {
  [userId: string]: {
    user: User;
    mealCount: number;
  };
}

const CalendarPage: React.FC<CalendarPageProps> = ({ users, transactions, firstMealDate }) => {
  const sortedUsers = useMemo(() => [...users].sort((a, b) => a.name.localeCompare(b.name)), [users]);

  const mealsByDate = useMemo(() => {
    const mealTransactions = transactions.filter(t => t.type === 'meal');
    const grouped: { [date: string]: MealsOnDate } = {};

    mealTransactions.forEach(transaction => {
      const dateStr = new Date(transaction.date).toISOString().split('T')[0];
      const user = users.find(u => u.id === transaction.userId);
      if (!user) return;

      if (!grouped[dateStr]) {
        grouped[dateStr] = {};
      }
      if (!grouped[dateStr][user.id]) {
        grouped[dateStr][user.id] = { user, mealCount: 0 };
      }
      grouped[dateStr][user.id].mealCount += transaction.mealCount ?? 0;
    });

    return grouped;
  }, [transactions, users]);

  const dayRange = useMemo(() => {
    if (!firstMealDate) return [];

    const days = [];
    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(firstMealDate);
      currentDate.setUTCDate(currentDate.getUTCDate() + i);
      days.push({
        dayNumber: i + 1,
        date: currentDate,
      });
    }
    return days;
  }, [firstMealDate]);


  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      {users.length > 0 ? (
        dayRange.length > 0 ? (
            <div className="overflow-x-auto relative border border-gray-200 rounded-lg">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th scope="col" className="sticky left-0 bg-gray-100 px-4 py-3 text-center font-semibold text-gray-600 uppercase tracking-wider z-20 w-16 md:w-20 border-r">
                                Day
                            </th>
                            <th scope="col" className="sticky left-16 md:left-20 bg-gray-100 px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider z-20 border-r">
                                Date
                            </th>
                            {sortedUsers.map(user => (
                            <th key={user.id} scope="col" className="px-4 py-3 text-center font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                                {user.name}
                            </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {dayRange.map(item => {
                            const dateStr = item.date.toISOString().split('T')[0];
                            return (
                            <tr key={dateStr} className="group hover:bg-gray-50">
                                <td className="sticky left-0 bg-white group-hover:bg-gray-50 px-4 py-3 whitespace-nowrap font-bold text-gray-500 text-center border-r z-10 w-16 md:w-20">
                                    {item.dayNumber}
                                </td>
                                <td className="sticky left-16 md:left-20 bg-white group-hover:bg-gray-50 px-4 py-3 whitespace-nowrap font-medium text-gray-800 border-r z-10">
                                    {item.date.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric' })}
                                </td>
                                {sortedUsers.map(user => {
                                const mealCount = mealsByDate[dateStr]?.[user.id]?.mealCount ?? 0;
                                return (
                                    <td key={user.id} className="px-4 py-3 whitespace-nowrap text-center">
                                        <span className={`font-bold text-base ${mealCount > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {mealCount}
                                        </span>
                                    </td>
                                );
                                })}
                            </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="text-center text-gray-500 py-8">
                <p className="font-semibold">No Meals Logged Yet</p>
                <p className="text-sm mt-1">Add a meal to start tracking in the calendar.</p>
            </div>
        )
      ) : (
        <div className="text-center text-gray-500 py-8">
            <p className="font-semibold">No Members Found</p>
            <p className="text-sm mt-1">Please add members to see the meal calendar.</p>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;