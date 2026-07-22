import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

const signToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      partnerCode
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const exists = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (exists.rowCount > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, partner_code, role, balance)
       VALUES ($1, $2, $3, $4, 'user', 10000)
       RETURNING id, name, email, role, balance`,
      [
        name,
        email,
        hashedPassword,
        partnerCode && partnerCode.trim() !== ""
          ? partnerCode.trim()
          : null
      ]
    );

    const user = result.rows[0];
    const token = signToken(user);

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "Registered successfully",
      user,
      token,
    });
  } catch (error) {
  console.error("========== REGISTER ERROR ==========");
  console.error(error);
  console.error("====================================");

  return res.status(500).json({
    success: false,
    message: error.message,
    stack: error.stack,
  });
}
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const result = await pool.query(
      "SELECT id, name, email, password, role, balance FROM users WHERE email = $1",
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const userRow = result.rows[0];
    const isMatch = await bcrypt.compare(password, userRow.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = {
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
      role: userRow.role,
      balance: userRow.balance,
    };

    const token = signToken(user);

    res.cookie("token", token, cookieOptions);

    return res.json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {

  console.error(
    "LOGIN ERROR:",
    error
  );

  return res.status(500).json({
    success: false,
    message: error.message,
    stack: error.stack,
  });
}
};

export const me = async (req, res) => {
  try {

    const accountsResult = await pool.query(
      `
      SELECT
        account_type,
        balance
      FROM trading_accounts
      WHERE user_id = $1
      AND status = 'active'
      `,
      [req.user.id]
    );

    let realBalance = 0;
    let demoBalance = 0;

    accountsResult.rows.forEach((acc) => {

      if (acc.account_type === "real") {
        realBalance += Number(acc.balance || 0);
      }

      if (acc.account_type === "demo") {
        demoBalance += Number(acc.balance || 0);
      }

    });

    return res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        phone_number: req.user.phone_number,
        address: req.user.address,
        role: req.user.role,

        active_account_id: req.user.active_account_id,

        trading_account: req.user.trading_account_id
          ? {
            id: req.user.trading_account_id,
            account_no: req.user.account_no,
            balance: Number(req.user.balance || 0),
            account_type: req.user.account_type,
            platform: req.user.platform,
            currency: req.user.currency,
            leverage: req.user.leverage,
            status: req.user.status,
          }
          : null,

        balance: Number(req.user.balance || 0),

        wallets: {
          real: realBalance,
          demo: demoBalance,
        },
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  return res.json({ message: "Logged out successfully" });
};

export const getAllUsers = async (
  req,
  res
) => {
  try {

    const result = await pool.query(`
      SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.created_at,

        ta.id AS trading_account_id,
        ta.account_no,
        ta.account_type,
        ta.platform,
        ta.currency,
        ta.status AS trading_status,

        ta.balance,
        ta.initial_balance,

        ta.plan_name,
        ta.nickname,
        ta.leverage

      FROM users u

      LEFT JOIN trading_accounts ta
      ON ta.user_id::integer = u.id

      ORDER BY u.id DESC
    `);

    return res.json({
      success: true,
      users: result.rows,
    });

  } catch (err) {

    console.error(
      "GET ALL USERS ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateProfile = async (
  req,
  res
) => {
  try {

    const {
      name,
      email,
      phone_number,
      address,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE users

      SET
        name = $1,
        email = $2,
        phone_number = $3,
        address = $4

      WHERE id = $5

      RETURNING
        id,
        name,
        email,
        phone_number,
        address
      `,
      [
        name,
        email,
        phone_number,
        address,
        req.user.id,
      ]
    );

    return res.json({
      success: true,
      user: result.rows[0],
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message:
        "Failed to update profile",
    });
  }
};
