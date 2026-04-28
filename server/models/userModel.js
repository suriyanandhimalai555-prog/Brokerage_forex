import { pool } from "../config/db.js";

export const findUserByEmail = async (email) => {
  const res = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return res.rows[0];
};

export const createUser = async (email, password, partnerCode, role) => {
  const res = await pool.query(
    `INSERT INTO users (email, password, partner_code, role)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [email, password, partnerCode, role]
  );
  return res.rows[0];
};