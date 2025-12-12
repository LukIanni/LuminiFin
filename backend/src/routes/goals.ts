import express from "express";
import * as goalsController from "../controllers/goals.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Todas as rotas exigem autenticação
router.use(authMiddleware);

// GET /api/goals - listar metas do usuário
router.get("/", goalsController.getGoals);

// POST /api/goals - criar nova meta
router.post("/", goalsController.createGoal);

// PUT /api/goals/:id - atualizar meta
router.put("/:id", goalsController.updateGoal);

// DELETE /api/goals/:id - deletar meta
router.delete("/:id", goalsController.deleteGoal);

export default router;
