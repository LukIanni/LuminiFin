import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { apiClient } from "@/lib/api";

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ExpensesContextType {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  addExpense: (expense: Omit<Expense, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  fetchExpenses: () => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export function ExpensesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getExpenses();
      setExpenses(data || []);
    } catch (err: any) {
      const message = err.response?.data?.error || "Erro ao buscar despesas";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense: Omit<Expense, "id" | "createdAt" | "updatedAt">) => {
    if (!user) return;

    try {
      const data = await apiClient.createExpense(expense);
      setExpenses([...expenses, data]);
    } catch (err: any) {
      const message = err.response?.data?.error || "Erro ao adicionar despesa";
      throw new Error(message);
    }
  };

  const deleteExpense = async (id: string) => {
    if (!user) return;

    try {
      await apiClient.deleteExpense(id);
      setExpenses(expenses.filter(e => e.id !== id));
    } catch (err: any) {
      const message = err.response?.data?.error || "Erro ao deletar despesa";
      throw new Error(message);
    }
  };

  // Buscar despesas quando usuário faz login
  useEffect(() => {
    if (user) {
      fetchExpenses();
    } else {
      setExpenses([]);
    }
  }, [user]);

  return (
    <ExpensesContext.Provider value={{ expenses, loading, error, addExpense, fetchExpenses, deleteExpense }}>
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error("useExpenses deve ser usado dentro de ExpensesProvider");
  }
  return context;
}
