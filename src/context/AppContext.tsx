import React, { createContext, useContext, useEffect, useState } from 'react';
import { Person, Expense, Settlement } from '../types';
import { calculateSettlements } from '../utils/calculations';
import { generateUUID } from '../utils/uuid';
import { requirePassword } from '../utils/auth';

interface AppContextType {
  people: Person[];
  expenses: Expense[];
  addPerson: (person: Omit<Person, 'id'>) => void;
  updatePerson: (id: string, person: Partial<Person>) => Promise<boolean>;
  deletePerson: (id: string) => Promise<boolean>;
  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  deleteExpense: (id: string) => Promise<boolean>;
  settlements: Settlement[];
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'expense-split-data';

interface StorageData {
  people: Person[];
  expenses: Expense[];
}

const loadFromStorage = (): StorageData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading data from storage:', error);
  }
  return { people: [], expenses: [] };
};

const saveToStorage = (data: StorageData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to storage:', error);
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<StorageData>(() => loadFromStorage());
  const [settlements, setSettlements] = useState<Settlement[]>([]);

  useEffect(() => {
    saveToStorage(data);
    setSettlements(calculateSettlements(data.expenses, data.people));
  }, [data]);

  const addPerson = (person: Omit<Person, 'id'>) => {
    setData(prev => ({
      ...prev,
      people: [...prev.people, { ...person, id: generateUUID() }]
    }));
  };

  const updatePerson = async (id: string, updates: Partial<Person>) => {
    const isAuthorized = await requirePassword();
    if (!isAuthorized) {
      alert('Contraseña incorrecta. No se pueden modificar los datos.');
      return false;
    }

    setData(prev => ({
      ...prev,
      people: prev.people.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
    return true;
  };

  const deletePerson = async (id: string) => {
    const isAuthorized = await requirePassword();
    if (!isAuthorized) {
      alert('Contraseña incorrecta. No se pueden eliminar los datos.');
      return false;
    }

    setData(prev => ({
      ...prev,
      people: prev.people.filter(p => p.id !== id),
      expenses: prev.expenses.filter(e => e.paidById !== id && !e.splitBetween.includes(id))
    }));
    return true;
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'date'>) => {
    setData(prev => ({
      ...prev,
      expenses: [...prev.expenses, {
        ...expense,
        id: generateUUID(),
        date: new Date().toISOString(),
      }]
    }));
  };

  const deleteExpense = async (id: string) => {
    const isAuthorized = await requirePassword();
    if (!isAuthorized) {
      alert('Contraseña incorrecta. No se pueden eliminar los datos.');
      return false;
    }

    setData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== id)
    }));
    return true;
  };

  return (
    <AppContext.Provider value={{
      people: data.people,
      expenses: data.expenses,
      settlements,
      addPerson,
      updatePerson,
      deletePerson,
      addExpense,
      deleteExpense,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};