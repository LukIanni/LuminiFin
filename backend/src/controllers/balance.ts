import { Request, Response } from "express";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const getBalance = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const user = await db
      .select({ balance: users.balance })
      .from(users)
      .where(eq(users.id, userId));

    if (!user || user.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json({ 
      balance: parseFloat(user[0].balance) 
    });
  } catch (error) {
    console.error("❌ Erro ao buscar saldo:", error);
    res.status(500).json({ error: "Erro ao buscar saldo" });
  }
};

export const setBalance = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { balance } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    if (balance === undefined || balance === null) {
      return res.status(400).json({ error: "Saldo é obrigatório" });
    }

    // Validar se balance é um número válido
    const numBalance = parseFloat(balance);
    if (isNaN(numBalance)) {
      return res.status(400).json({ error: "Saldo inválido" });
    }

    const updatedUser = await db
      .update(users)
      .set({ 
        balance: numBalance.toString(),
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning({ balance: users.balance });

    res.status(200).json({ 
      balance: parseFloat(updatedUser[0].balance) 
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar saldo:", error);
    res.status(500).json({ error: "Erro ao atualizar saldo" });
  }
};

export const addBalance = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { amount } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    if (!amount) {
      return res.status(400).json({ error: "Valor é obrigatório" });
    }

    // Validar se amount é um número válido
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: "Valor inválido" });
    }

    // Obter saldo atual
    const user = await db
      .select({ balance: users.balance })
      .from(users)
      .where(eq(users.id, userId));

    if (!user || user.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const currentBalance = parseFloat(user[0].balance);
    const newBalance = currentBalance + numAmount;

    const updatedUser = await db
      .update(users)
      .set({ 
        balance: newBalance.toString(),
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning({ balance: users.balance });

    res.status(200).json({ 
      balance: parseFloat(updatedUser[0].balance),
      previousBalance: currentBalance,
      addedAmount: numAmount
    });
  } catch (error) {
    console.error("❌ Erro ao adicionar ao saldo:", error);
    res.status(500).json({ error: "Erro ao adicionar ao saldo" });
  }
};

export const subtractBalance = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { amount } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    if (!amount) {
      return res.status(400).json({ error: "Valor é obrigatório" });
    }

    // Validar se amount é um número válido
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: "Valor inválido" });
    }

    // Obter saldo atual
    const user = await db
      .select({ balance: users.balance })
      .from(users)
      .where(eq(users.id, userId));

    if (!user || user.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const currentBalance = parseFloat(user[0].balance);
    const newBalance = currentBalance - numAmount;

    const updatedUser = await db
      .update(users)
      .set({ 
        balance: newBalance.toString(),
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning({ balance: users.balance });

    res.status(200).json({ 
      balance: parseFloat(updatedUser[0].balance),
      previousBalance: currentBalance,
      subtractedAmount: numAmount
    });
  } catch (error) {
    console.error("❌ Erro ao subtrair do saldo:", error);
    res.status(500).json({ error: "Erro ao subtrair do saldo" });
  }
};
