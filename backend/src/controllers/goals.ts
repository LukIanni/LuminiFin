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
      targetAmount: targetAmount.toString(),
      currentAmount: (currentAmount || "0").toString(),
      deadline: deadline ? new Date(deadline) : null,
      status: status || "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    res.status(201).json(newGoal[0]);
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

    res.status(200).json(userGoals);
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

    const updatedGoal = await db
      .update(goals)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(goals.id, id))
      .returning();

    res.status(200).json(updatedGoal[0]);
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
