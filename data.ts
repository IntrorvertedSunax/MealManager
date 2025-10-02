import { User, Transaction, DB } from './types';

const DB_KEY = 'meal-management-db';

// --- Helper Functions ---

/**
 * Capitalizes the first letter of each word in a string and normalizes whitespace.
 * e.g., "  john  doe  " -> "John Doe"
 * @param str - The input string.
 * @returns The capitalized and normalized string.
 */
const capitalizeWords = (str: string): string => {
  if (!str) return '';
  return str
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// --- Low-level DB operations ---

/**
 * Retrieves the entire database from localStorage.
 * If no data is found or an error occurs, it returns a fresh, empty DB structure
 * to prevent mutation of a shared initial state.
 * @returns The database object (DB).
 */
export const getDb = (): DB => {
  try {
    const data = localStorage.getItem(DB_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to read from localStorage", error);
  }
  // Return a new object to prevent shared state mutations on first load.
  return {
    users: [],
    transactions: [],
  };
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
 * Adds a new user to the database with a capitalized and normalized name.
 * @param userData - The user data to add (without an ID).
 * @returns The newly created user with an ID.
 */
export const addUser = (userData: Omit<User, 'id'>): User => {
  const db = getDb();
  const capitalizedName = capitalizeWords(userData.name);

  if (!capitalizedName) {
    throw new Error('User name cannot be empty.');
  }
  
  if (db.users.some(u => u.name.toLowerCase() === capitalizedName.toLowerCase())) {
    throw new Error('Member already exists!');
  }

  const newUser: User = { 
    name: capitalizedName,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 11)}`,
    avatar: userData.avatar || null
  };
  db.users.push(newUser);
  saveDb(db);
  return newUser;
};

/**
 * Updates an existing user in the database with a capitalized and normalized name.
 * @param updatedUserData - The user data to update.
 * @returns The updated user.
 */
export const updateUser = (updatedUserData: User): User => {
    const db = getDb();
    const capitalizedName = capitalizeWords(updatedUserData.name);

    if (!capitalizedName) {
      throw new Error('User name cannot be empty.');
    }

    if (db.users.some(u => u.name.toLowerCase() === capitalizedName.toLowerCase() && u.id !== updatedUserData.id)) {
        throw new Error('Member already exists!');
    }
    
    const finalUserData = { ...updatedUserData, name: capitalizedName };
    
    db.users = db.users.map(u => u.id === finalUserData.id ? finalUserData : u);
    saveDb(db);
    return finalUserData;
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
