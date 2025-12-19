import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import { GeminiService } from "../services/gemini";

const router = Router();

// Middleware de autenticação para todas as rotas
router.use(authMiddleware);

/**
 * POST /api/ai/classify-expense
 * Classifica um gasto descrito pelo usuário
 */
router.post("/classify-expense", async (req: Request, res: Response) => {
  try {
    const { description } = req.body;

    if (!description || description.trim().length === 0) {
      return res.status(400).json({
        error: "Descrição do gasto é obrigatória",
      });
    }

    console.log("📝 Classificando gasto:", description);
    const classification = await GeminiService.classifyExpense(description);
    console.log("✅ Classificação bem-sucedida:", classification);

    return res.json({
      success: true,
      data: classification,
    });
  } catch (error: any) {
    console.error("❌ Erro ao classificar gasto:", {
      message: error?.message,
      name: error?.name,
      stack: error?.stack,
      fullError: JSON.stringify(error, null, 2)
    });
    return res.status(500).json({
      error: error.message || "Erro ao classificar gasto",
      details: process.env.NODE_ENV === "development" ? error?.message : undefined
    });
  }
});

/**
 * POST /api/ai/goals-tips
 * Gera dicas para as metas do usuário
 */
router.post("/goals-tips", async (req: Request, res: Response) => {
  try {
    const { goals, userName } = req.body;

    if (!goals || !Array.isArray(goals) || goals.length === 0) {
      return res.status(400).json({
        error: "Lista de metas é obrigatória",
      });
    }

    console.log("📥 Recebendo", goals.length, "metas para processar");

    // Garantir que valores são numéricos
    const safeGoals = goals.map((goal: any) => ({
      ...goal,
      currentAmount: Number(goal.currentAmount) || 0,
      targetAmount: Number(goal.targetAmount) || 0,
    }));

    // Calcular totais
    const totalSaved = safeGoals.reduce((sum: number, goal: any) => sum + goal.currentAmount, 0);
    const totalTarget = safeGoals.reduce((sum: number, goal: any) => sum + goal.targetAmount, 0);

    // Formatar dados para Gemini
    const listaMetas = safeGoals
      .map((goal: any) => {
        const percentage = goal.targetAmount > 0 ? ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1) : "0";
        const deadline = goal.deadline ? ` - Prazo: ${goal.deadline}` : "";
        return `- ${goal.title}: R$ ${goal.currentAmount.toFixed(2)} de R$ ${goal.targetAmount.toFixed(2)} (${percentage}% concluído)${deadline}`;
      })
      .join("\n");

    const goalsData = `Nome do Usuário: ${userName || "Usuário"}
Total Guardado: R$ ${totalSaved.toFixed(2)}
Total em Metas: R$ ${totalTarget.toFixed(2)}

Lista de Metas Atuais:
${listaMetas}`;

    console.log("📊 Dados formatados - Total: R$ ${totalTarget.toFixed(2)}, Metas: ${safeGoals.length}");
    
    const tips = await GeminiService.generateGoalsTips(goalsData);

    return res.json({
      success: true,
      data: tips,
    });
  } catch (error: any) {
    console.error("❌ Erro ao gerar dicas:", error.message);
    return res.status(500).json({
      error: error.message || "Erro ao gerar dicas",
    });
  }
});

/**
 * POST /api/ai/chat
 * Conversa genérica com o assistente
 */
router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        error: "Mensagem é obrigatória",
      });
    }

    const response = await GeminiService.chat(message, history);

    return res.json({
      success: true,
      data: {
        message: response,
      },
    });
  } catch (error: any) {
    console.error("Erro ao enviar mensagem:", error);
    return res.status(500).json({
      error: error.message || "Erro ao processar mensagem",
    });
  }
});

export default router;
