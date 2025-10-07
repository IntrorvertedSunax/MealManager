import { Member, Transaction, DB, AppSettings, MealOption } from './types';

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


/**
 * Retrieves the entire database from localStorage.
 * If no data is found, it creates an initial DB with a default member for testing.
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
  
  // No data found, create initial DB with a default member for testing.
  const defaultMember: Member = {
    name: 'Default Member',
    id: `default-${Date.now().toString(36)}`,
    avatar: null
  };
  
  const newDb: DB = {
    members: [defaultMember],
    transactions: [],
  };

  saveDb(newDb); // Save it so it's not created again on next load
  return newDb;
};


// --- High-level CRUD functions ---

/**
 * Adds a new member to the database with a capitalized and normalized name.
 * @param memberData - The member data to add (without an ID).
 * @returns The newly created member with an ID.
 */
export const addMember = (memberData: Omit<Member, 'id'>): Member => {
  const db = getDb();
  const capitalizedName = capitalizeWords(memberData.name);

  if (!capitalizedName) {
    throw new Error('Member name cannot be empty.');
  }
  
  if (db.members.some(m => m.name.toLowerCase() === capitalizedName.toLowerCase())) {
    throw new Error('Member already exists!');
  }

  const newMember: Member = { 
    name: capitalizedName,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 11)}`,
    avatar: memberData.avatar || null
  };
  db.members.push(newMember);
  saveDb(db);
  return newMember;
};

/**
 * Updates an existing member in the database with a capitalized and normalized name.
 * @param updatedMemberData - The member data to update.
 * @returns The updated member.
 */
export const updateMember = (updatedMemberData: Member): Member => {
    const db = getDb();
    const capitalizedName = capitalizeWords(updatedMemberData.name);

    if (!capitalizedName) {
      throw new Error('Member name cannot be empty.');
    }

    if (db.members.some(m => m.name.toLowerCase() === capitalizedName.toLowerCase() && m.id !== updatedMemberData.id)) {
        throw new Error('Member already exists!');
    }
    
    const finalMemberData = { ...updatedMemberData, name: capitalizedName };
    
    db.members = db.members.map(m => m.id === finalMemberData.id ? finalMemberData : m);
    saveDb(db);
    return finalMemberData;
};

/**
 * Deletes a member and all their associated transactions from the database.
 * @param memberId - The ID of the member to delete.
 */
export const deleteMember = (memberId: string): void => {
  let db = getDb();
  db.members = db.members.filter(m => m.id !== memberId);
  db.transactions = db.transactions.filter(t => t.memberId !== memberId);
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

// --- Settings ---

const SETTINGS_KEY = 'meal-management-settings';

const defaultSettings: AppSettings = {
  enabledMeals: ['lunch', 'dinner'],
  defaultMealValues: {
    lunch: 1,
    dinner: 1,
  },
  theme: 'system',
};

export const getSettings = (): AppSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Merge with default settings to ensure new properties are present
      return { 
        ...defaultSettings, 
        ...parsed,
        defaultMealValues: {
          ...defaultSettings.defaultMealValues,
          ...(parsed.defaultMealValues || {})
        } 
      };
    }
  } catch (error) {
    console.error("Failed to read settings from localStorage", error);
  }
  return defaultSettings;
};

export const saveSettings = (settings: Partial<AppSettings>): void => {
  try {
    const currentSettings = getSettings();
    const newSettings = { ...currentSettings, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  } catch (error)    {
    console.error("Failed to save settings to localStorage", error);
  }
};


/**
 * Resets all application data by clearing relevant keys from localStorage.
 */
export const resetAllData = (): void => {
  try {
    localStorage.removeItem(DB_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error("Failed to reset data in localStorage", error);
  }
};
