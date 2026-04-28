import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "AVG_Forex",
  password: "Muthu@45",
  port: 5432,
});