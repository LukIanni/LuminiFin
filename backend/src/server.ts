import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import expensesRoutes from "./routes/expenses.js";
import goalsRoutes from "./routes/goals.js";
import aiRoutes from "./routes/ai.js";

// Carregar .env da raiz do backend
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/luminifin";

// Middlewares
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    const allowedOrigins = [
      "http://localhost:8000",
      "http://localhost:5173",
      "http://localhost:8080",
      "http://127.0.0.1:8000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:8080",
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Backend está rodando" });
});

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/ai", aiRoutes);

// Rota 404
app.use("*", (req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📚 API disponível em http://localhost:${PORT}/api`);
  console.log(`🔗 Frontend esperado em: ${process.env.FRONTEND_URL || "http://localhost:8000"}`);
  console.log(`📦 Database: ${DATABASE_URL ? "✅ Configurado" : "❌ Não configurado"}`);
});
