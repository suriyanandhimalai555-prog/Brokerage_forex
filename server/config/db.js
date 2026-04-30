import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: "appuser",
  host: "localhost",
  database: "AVG_Forex",
  password: "123456",
  port: 5432,
});