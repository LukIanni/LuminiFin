import express from "express";
import * as expensesController from "../controllers/expenses.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Todas as rotas exigem autenticação
router.use(authMiddleware);

// GET /api/expenses - listar despesas do usuário
router.get("/", expensesController.getExpenses);

// POST /api/expenses - criar nova despesa
router.post("/", expensesController.createExpense);

// DELETE /api/expenses/:id - deletar despesa
router.delete("/:id", expensesController.deleteExpense);

export default router;
