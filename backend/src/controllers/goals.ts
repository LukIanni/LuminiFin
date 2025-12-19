import { Request, Response } from "express";
import { db } from "../db/index.js";
import { goals } from "../db/schema.js";
import { eq, and } from "drizzle-orm";

export const createGoal = async (req: Request, res: Response) => {
  try {
    const { title, description, targetAmount, currentAmount, deadline, status } = req.body;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    if (!title || !targetAmount) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    const newGoal = await db.insert(goals).values({
      userId,
      title,
      description: description || null,
      targetAmount: parseFloat(targetAmount).toFixed(2),
      currentAmount: parseFloat(currentAmount || "0").toFixed(2),
      deadline: deadline ? new Date(deadline) : null,
      status: status || "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    // Converter valores de volta para número
    const result = {
      ...newGoal[0],
      targetAmount: parseFloat(newGoal[0].targetAmount as any),
      currentAmount: parseFloat(newGoal[0].currentAmount as any),
    };

    res.status(201).json(result);
  } catch (error) {
    console.error("❌ Erro ao criar meta:", error);
    res.status(500).json({ error: "Erro ao criar meta" });
  }
};

export const getGoals = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const userGoals = await db
      .select()
      .from(goals)
      .where(eq(goals.userId, userId));

    // Converter valores numéricos de string para número
    const goalsWithNumbers = userGoals.map((goal: any) => ({
      ...goal,
      targetAmount: parseFloat(goal.targetAmount),
      currentAmount: parseFloat(goal.currentAmount),
    }));

    res.status(200).json(goalsWithNumbers);
  } catch (error) {
    console.error("❌ Erro ao buscar metas:", error);
    res.status(500).json({ error: "Erro ao buscar metas" });
  }
};

export const updateGoal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    const updates = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    // Verificar se a meta pertence ao usuário
    const goal = await db
      .select()
      .from(goals)
      .where(and(eq(goals.id, id), eq(goals.userId, userId)));

    if (!goal || goal.length === 0) {
      return res.status(404).json({ error: "Meta não encontrada" });
    }

    const updatedData: any = { ...updates, updatedAt: new Date() };
    
    // Converter valores numéricos se existirem
    if (updatedData.targetAmount) {
      updatedData.targetAmount = parseFloat(updatedData.targetAmount).toFixed(2);
    }
    if (updatedData.currentAmount) {
      updatedData.currentAmount = parseFloat(updatedData.currentAmount).toFixed(2);
    }

    // Tratar deadline - se for undefined ou vazio, set como null
    if (updatedData.deadline === undefined || updatedData.deadline === "") {
      updatedData.deadline = null;
    } else if (updatedData.deadline) {
      updatedData.deadline = new Date(updatedData.deadline);
    }

    const updatedGoal = await db
      .update(goals)
      .set(updatedData)
      .where(eq(goals.id, id))
      .returning();

    // Converter valores de volta para número
    const result = {
      ...updatedGoal[0],
      targetAmount: parseFloat(updatedGoal[0].targetAmount as any),
      currentAmount: parseFloat(updatedGoal[0].currentAmount as any),
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Erro ao atualizar meta:", error);
    res.status(500).json({ error: "Erro ao atualizar meta" });
  }
};

export const deleteGoal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    // Verificar se a meta pertence ao usuário
    const goal = await db
      .select()
      .from(goals)
      .where(and(eq(goals.id, id), eq(goals.userId, userId)));

    if (!goal || goal.length === 0) {
      return res.status(404).json({ error: "Meta não encontrada" });
    }

    await db.delete(goals).where(eq(goals.id, id));

    res.status(200).json({ message: "Meta deletada com sucesso" });
  } catch (error) {
    console.error("❌ Erro ao deletar meta:", error);
    res.status(500).json({ error: "Erro ao deletar meta" });
  }
};
