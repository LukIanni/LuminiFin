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
  balance: number;
  loading: boolean;
  error: string | null;
  addExpense: (expense: Omit<Expense, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  fetchExpenses: () => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  getBalance: () => Promise<void>;
  setBalance: (amount: number) => Promise<void>;
  addBalance: (amount: number) => Promise<void>;
  subtractBalance: (amount: number) => Promise<void>;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export function ExpensesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balance, setBalanceState] = useState<number>(0);
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

  const getBalance = async () => {
    if (!user) return;

    try {
      const data = await apiClient.getBalance();
      setBalanceState(data.balance);
    } catch (err: any) {
      const message = err.response?.data?.error || "Erro ao buscar saldo";
      setError(message);
    }
  };

  const setBalance = async (amount: number) => {
    if (!user) return;

    try {
      const data = await apiClient.setBalance(amount);
      setBalanceState(data.balance);
    } catch (err: any) {
      const message = err.response?.data?.error || "Erro ao atualizar saldo";
      throw new Error(message);
    }
  };

  const addBalance = async (amount: number) => {
    if (!user) return;

    try {
      const data = await apiClient.addBalance(amount);
      setBalanceState(data.balance);
    } catch (err: any) {
      const message = err.response?.data?.error || "Erro ao adicionar ao saldo";
      throw new Error(message);
    }
  };

  const subtractBalance = async (amount: number) => {
    if (!user) return;

    try {
      const data = await apiClient.subtractBalance(amount);
      setBalanceState(data.balance);
    } catch (err: any) {
      const message = err.response?.data?.error || "Erro ao subtrair do saldo";
      throw new Error(message);
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

  // Buscar despesas e saldo quando usuário faz login
  useEffect(() => {
    if (user) {
      fetchExpenses();
      getBalance();
    } else {
      setExpenses([]);
      setBalanceState(0);
    }
  }, [user]);

  return (
    <ExpensesContext.Provider value={{ expenses, balance, loading, error, addExpense, fetchExpenses, deleteExpense, getBalance, setBalance, addBalance, subtractBalance }}>
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
