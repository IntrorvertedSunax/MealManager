import { User, Transaction, DB } from './types';

const DB_KEY = 'meal-management-db';

// The initial empty state for the database.
const initialDb: DB = {
  users: [],
  transactions: [],
};

// --- Low-level DB operations ---

/**
 * Retrieves the entire database from localStorage.
 * If no data is found or an error occurs, it returns the initial empty DB.
 * @returns The database object (DB).
 */
export const getDb = (): DB => {
  try {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : initialDb;
  } catch (error) {
    console.error("Failed to read from localStorage", error);
    return initialDb;
  }
};

/**
 * Saves the entire database object to localStorage.
 * @param db - The database object to save.
 */
const saveDb = (db: DB): void => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (error) {
    console.error("Failed to write to localStorage", error);
  }
};

// --- High-level CRUD functions ---

/**
 * Adds a new user to the database.
 * @param userData - The user data to add (without an ID).
 * @returns The newly created user with an ID.
 */
export const addUser = (userData: Omit<User, 'id' | 'avatarUrl'>): User => {
  const db = getDb();
  const newUser: User = { 
    ...userData, 
    id: `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 11)}`,
    avatarUrl: ''
  };
  db.users.push(newUser);
  saveDb(db);
  return newUser;
};

/**
 * Updates an existing user in the database.
 * @param updatedUserData - The user data to update.
 * @returns The updated user.
 */
export const updateUser = (updatedUserData: User): User => {
    const db = getDb();
    db.users = db.users.map(u => u.id === updatedUserData.id ? updatedUserData : u);
    saveDb(db);
    return updatedUserData;
};

/**
 * Deletes a user and all their associated transactions from the database.
 * @param userId - The ID of the user to delete.
 */
export const deleteUser = (userId: string): void => {
  let db = getDb();
  db.users = db.users.filter(u => u.id !== userId);
  db.transactions = db.transactions.filter(t => t.userId !== userId);
  saveDb(db);
};

/**
 * Adds a new transaction to the database.
 * @param transactionData - The transaction data to add (without an ID).
 * @returns The newly created transaction with an ID.
 */
export const addTransaction = (transactionData: Omit<Transaction, 'id'>): Transaction => {
  const db = getDb();
  const newTransaction: Transaction = { 
    ...transactionData, 
    id: `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 11)}` 
  };
  db.transactions.push(newTransaction);
  saveDb(db);
  return newTransaction;
};

/**
 * Updates an existing transaction in the database.
 * @param updatedTransactionData - The transaction data to update.
 * @returns The updated transaction.
 */
export const updateTransaction = (updatedTransactionData: Transaction): Transaction => {
    const db = getDb();
    db.transactions = db.transactions.map(t => t.id === updatedTransactionData.id ? updatedTransactionData : t);
    saveDb(db);
    return updatedTransactionData;
};

/**
 * Deletes a transaction from the database.
 * @param transactionId - The ID of the transaction to delete.
 */
export const deleteTransaction = (transactionId: string): void => {
  let db = getDb();
  db.transactions = db.transactions.filter(t => t.id !== transactionId);
  saveDb(db);
};