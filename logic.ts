import { Member, Transaction } from './types';

// This interface defines the structure for an individual member's calculated data.
export interface MemberData {
  member: Member;
  memberDeposits: number;
  memberExpensesPaid: number; // The total amount of expenses this member has personally paid for.
  memberMealCount: number;
  memberMealCost: number; // The total cost of meals consumed by this member.
  memberSharedExpenseCost: number; // The member's share of all shared expenses.
  balance: number;
}

// This interface defines the structure for all calculated metrics for the entire group.
export interface CalculationMetrics {
  totalExpenses: number;
  totalDeposits: number;
  totalMealCount: number;
  mealRate: number;
  remainingBalance: number;
  memberData: MemberData[];
}

/**
 * Calculates the total number of meals from a transaction object,
 * prioritizing the new `mealDetails` object but falling back to the legacy `mealCount`.
 * @param transaction - The transaction to process.
 * @returns The total number of meals for that transaction.
 */
const getMealCount = (transaction: Transaction): number => {
    if (transaction.mealDetails) {
      return Object.values(transaction.mealDetails).reduce((sum, count) => sum + (count || 0), 0);
    }
    return transaction.mealCount ?? 0;
};


/**
 * A central function to calculate all financial metrics for the application.
 * It takes members and transactions and returns a comprehensive metrics object.
 * @param members - An array of all members in the group.
 * @param transactions - An array of all transactions (meals, expenses, deposits).
 * @returns An object containing all calculated metrics.
 */
export function calculateMetrics(members: Member[], transactions: Transaction[]): CalculationMetrics {
  const expenses = transactions.filter(t => t.type === 'expense' || t.type === 'shared-expense');
  const deposits = transactions.filter(t => t.type === 'deposit');
  const meals = transactions.filter(t => t.type === 'meal');
  const sharedExpenses = transactions.filter(t => t.type === 'shared-expense');

  // Calculate totals for the entire group
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalDeposits = deposits.reduce((sum, t) => sum + t.amount, 0);
  const totalMealCount = meals.reduce((sum, t) => sum + getMealCount(t), 0);
  
  // The meal rate is the total cost of all 'expense' transactions (assumed to be for food/groceries) divided by the total number of meals.
  const mealRelatedExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const mealRate = totalMealCount > 0 ? mealRelatedExpenses / totalMealCount : 0;
  
  // The overall remaining balance in the shared pool.
  const remainingBalance = totalDeposits - totalExpenses;

  // Calculate detailed data for each member
  const memberData = members.map(member => {
    const memberDeposits = deposits
      .filter(t => t.memberId === member.id)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const memberExpensesPaid = transactions
      .filter(t => (t.type === 'expense' || t.type === 'shared-expense') && t.memberId === member.id)
      .reduce((sum, t) => sum + t.amount, 0);

    const memberMealCount = meals
      .filter(t => t.memberId === member.id)
      .reduce((sum, t) => sum + getMealCount(t), 0);
      
    const memberMealCost = memberMealCount * mealRate;
    
    const memberSharedExpenseCost = sharedExpenses.reduce((sum, t) => {
        if (t.sharedWith && t.sharedWith.includes(member.id)) {
            const share = t.amount / (t.sharedWith.length || 1);
            return sum + share;
        }
        return sum;
    }, 0);
    
    // The member's personal balance is their total deposits minus their meal costs and their share of shared expenses.
    const balance = memberDeposits - memberMealCost - memberSharedExpenseCost;

    return { 
      member, 
      memberDeposits, 
      memberExpensesPaid, 
      memberMealCount, 
      memberMealCost,
      memberSharedExpenseCost,
      balance 
    };
  });

  return { 
    totalExpenses, 
    totalDeposits, 
    totalMealCount, 
    mealRate, 
    remainingBalance, 
    memberData 
  };
}
