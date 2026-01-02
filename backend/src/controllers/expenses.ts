import { Request, Response } from "express";
import { db } from "../db/index.js";
import { expenses, users } from "../db/schema.js";
import { eq, and } from "drizzle-orm";

export const createExpense = async (req: Request, res: Response) => {
  try {
    const { amount, category, description, date } = req.body;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    if (!amount || !category || !description || !date) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    // Validar se amount é um número válido
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: "Valor inválido" });
    }

    // Criar a despesa com amount como número
    const newExpense = await db.insert(expenses).values({
      userId,
      amount: numAmount.toString(),
      category,
      description,
      date: new Date(date),
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    res.status(201).json(newExpense[0]);
  } catch (error) {
    console.error("❌ Erro ao criar despesa:", error);
    res.status(500).json({ error: "Erro ao criar despesa" });
  }
};

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const userExpenses = await db
      .select()
      .from(expenses)
      .where(eq(expenses.userId, userId));

    // Converter amount de string para número
    const expensesWithNumbers = userExpenses.map(expense => ({
      ...expense,
      amount: parseFloat(expense.amount)
    }));

    res.status(200).json(expensesWithNumbers);
  } catch (error) {
    console.error("❌ Erro ao buscar despesas:", error);
    res.status(500).json({ error: "Erro ao buscar despesas" });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    // Verificar se o gasto pertence ao usuário
    const expense = await db
      .select()
      .from(expenses)
      .where(and(eq(expenses.id, id), eq(expenses.userId, userId)));

    if (!expense || expense.length === 0) {
      return res.status(404).json({ error: "Despesa não encontrada" });
    }

    await db.delete(expenses).where(eq(expenses.id, id));

    res.status(200).json({ message: "Despesa deletada com sucesso" });
  } catch (error) {
    console.error("❌ Erro ao deletar despesa:", error);
    res.status(500).json({ error: "Erro ao deletar despesa" });
  }
};
