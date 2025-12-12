import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { apiClient } from "@/lib/api";

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  status: "pending" | "completed";
  createdAt?: string;
  updatedAt?: string;
}

interface GoalsContextType {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "updatedAt" | "status">) => Promise<void>;
  fetchGoals: () => Promise<void>;
  updateGoal: (id: string, goal: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export function GoalsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getGoals();
      setGoals(data || []);
    } catch (err: any) {
      const message = err.response?.data?.error || "Erro ao buscar metas";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goal: Omit<Goal, "id" | "createdAt" | "updatedAt" | "status">) => {
    if (!user) return;

    try {
      const data = await apiClient.createGoal({ ...goal, status: "pending" });
      setGoals([...goals, data]);
    } catch (err: any) {
      const message = err.response?.data?.error || "Erro ao adicionar meta";
      throw new Error(message);
    }
  };

  const updateGoal = async (id: string, goal: Partial<Goal>) => {
    if (!user) return;

    try {
      const data = await apiClient.updateGoal(id, goal);
      setGoals(goals.map(g => g.id === id ? data : g));
    } catch (err: any) {
      const message = err.response?.data?.error || "Erro ao atualizar meta";
      throw new Error(message);
    }
  };

  const deleteGoal = async (id: string) => {
    if (!user) return;

    try {
      await apiClient.deleteGoal(id);
      setGoals(goals.filter(g => g.id !== id));
    } catch (err: any) {
      const message = err.response?.data?.error || "Erro ao deletar meta";
      throw new Error(message);
    }
  };

  // Buscar metas quando usuário faz login
  useEffect(() => {
    if (user) {
      fetchGoals();
    } else {
      setGoals([]);
    }
  }, [user]);

  return (
    <GoalsContext.Provider value={{ goals, loading, error, addGoal, fetchGoals, updateGoal, deleteGoal }}>
      {children}
    </GoalsContext.Provider>
  );
}

export function useGoals() {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error("useGoals deve ser usado dentro de GoalsProvider");
  }
  return context;
}
