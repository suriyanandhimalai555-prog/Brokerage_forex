import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASS),
  port: Number(process.env.DB_PORT) || 5432,

  // 🔥 REQUIRED FOR RENDER / CLOUD DB
  ssl: process.env.DB_HOST !== "localhost"
    ? { rejectUnauthorized: false }
    : false,
});