import express from "express";
import * as balanceController from "../controllers/balance.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Todas as rotas exigem autenticação
router.use(authMiddleware);

// GET /api/balance - obter saldo atual
router.get("/", balanceController.getBalance);

// POST /api/balance - definir saldo
router.post("/", balanceController.setBalance);

// POST /api/balance/add - adicionar ao saldo
router.post("/add", balanceController.addBalance);

// POST /api/balance/subtract - subtrair do saldo
router.post("/subtract", balanceController.subtractBalance);

export default router;
