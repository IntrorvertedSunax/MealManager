import { User, Transaction } from './types';

// This interface defines the structure for an individual user's calculated data.
export interface UserData {
  user: User;
  userDeposits: number;
  userExpensesPaid: number; // The total amount of expenses this user has personally paid for.
  userMealCount: number;
  userMealCost: number; // The total cost of meals consumed by this user.
  balance: number;
}

// This interface defines the structure for all calculated metrics for the entire group.
export interface CalculationMetrics {
  totalExpenses: number;
  totalDeposits: number;
  totalMealCount: number;
  mealRate: number;
  remainingBalance: number;
  userData: UserData[];
}

/**
 * A central function to calculate all financial metrics for the application.
 * It takes users and transactions and returns a comprehensive metrics object.
 * @param users - An array of all users in the group.
 * @param transactions - An array of all transactions (meals, expenses, deposits).
 * @returns An object containing all calculated metrics.
 */
export function calculateMetrics(users: User[], transactions: Transaction[]): CalculationMetrics {
  const expenses = transactions.filter(t => t.type === 'expense');
  const deposits = transactions.filter(t => t.type === 'deposit');
  const meals = transactions.filter(t => t.type === 'meal');

  // Calculate totals for the entire group
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalDeposits = deposits.reduce((sum, t) => sum + t.amount, 0);
  const totalMealCount = meals.reduce((sum, t) => sum + (t.mealCount ?? 0), 0);
  
  // The meal rate is the total cost of all expenses divided by the total number of meals.
  const mealRate = totalMealCount > 0 ? totalExpenses / totalMealCount : 0;
  
  // The overall remaining balance in the shared pool.
  const remainingBalance = totalDeposits - totalExpenses;

  // Calculate detailed data for each user
  const userData = users.map(user => {
    const userDeposits = deposits
      .filter(t => t.userId === user.id)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const userExpensesPaid = expenses
      .filter(t => t.userId === user.id)
      .reduce((sum, t) => sum + t.amount, 0);

    const userMealCount = meals
      .filter(t => t.userId === user.id)
      .reduce((sum, t) => sum + (t.mealCount ?? 0), 0);
      
    const userMealCost = userMealCount * mealRate;
    
    // The user's personal balance is their total deposits minus the cost of their meals.
    // This model assumes expenses are paid from the collective deposit pool.
    const balance = userDeposits - userMealCost;

    return { 
      user, 
      userDeposits, 
      userExpensesPaid, 
      userMealCount, 
      userMealCost, 
      balance 
    };
  });

  return { 
    totalExpenses, 
    totalDeposits, 
    totalMealCount, 
    mealRate, 
    remainingBalance, 
    userData 
  };
}
