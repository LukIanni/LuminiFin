import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.js";
import dotenv from "dotenv";

// Carregar variáveis de ambiente antes de criar a conexão
dotenv.config({ path: "backend/.env" });

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/luminifin";

const pool = new Pool({
  connectionString: DATABASE_URL,
});

export const db = drizzle(pool, { schema });
