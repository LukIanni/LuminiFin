import { Router } from "express";
import { signup, login, getProfile } from "../controllers/auth.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Rota de cadastro
router.post("/signup", signup);

// Rota de login
router.post("/login", login);

// Rota de perfil (protegida)
router.get("/profile", authMiddleware, getProfile);

export default router;
