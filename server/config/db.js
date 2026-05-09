import pkg from "pg";
const { Pool } = pkg;

// export const pool = new Pool({
//   user: "appuser",
//   host: "localhost",
//   database: "AVG_Forex",
//   password: "123456",
//   port: 5432,
// });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});