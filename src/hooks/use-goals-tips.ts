import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api";

export interface GoalsTipsResult {
  dicas: string[];
}

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export function useGoalsTips() {
  const [dicas, setDicas] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTips = useCallback(async (goals: Goal[], userName?: string) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentPage(0);

      if (!goals || goals.length === 0) {
        setError("Nenhuma meta para gerar dicas");
        setLoading(false);
        return null;
      }

      console.log("📊 Enviando", goals.length, "metas para gerar dicas");

      // Normalizar valores para garantir que são números
      const normalizedGoals = goals.map(goal => ({
        ...goal,
        currentAmount: typeof goal.currentAmount === 'string' ? parseFloat(goal.currentAmount) : goal.currentAmount,
        targetAmount: typeof goal.targetAmount === 'string' ? parseFloat(goal.targetAmount) : goal.targetAmount,
      }));

      const response = await apiClient.post<{ success: boolean; data: GoalsTipsResult }>(
        "/ai/goals-tips",
        { goals: normalizedGoals, userName }
      );

      if (!response.data.success) {
        throw new Error("Erro ao gerar dicas");
      }

      const tipsData = response.data.data.dicas || [];
      setDicas(tipsData);
      console.log("✅ Dicas geradas:", tipsData.length);
      return response.data.data;
    } catch (err: any) {
      console.error("❌ Erro ao gerar dicas:", err);
      const errorMessage = err.response?.data?.error || err.message || "Erro ao gerar dicas";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const nextPage = useCallback(() => {
    if (currentPage < dicas.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, dicas.length]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const goToPage = useCallback((page: number) => {
    if (page >= 0 && page < dicas.length) {
      setCurrentPage(page);
    }
  }, [dicas.length]);

  const getCurrentDica = useCallback(() => {
    return dicas[currentPage] || null;
  }, [dicas, currentPage]);

  const clearTips = useCallback(() => {
    setDicas([]);
    setCurrentPage(0);
    setError(null);
  }, []);

  return {
    dicas,
    currentPage,
    totalPages: dicas.length,
    loading,
    error,
    generateTips,
    getCurrentDica,
    nextPage,
    prevPage,
    goToPage,
    clearTips,
  };
}
