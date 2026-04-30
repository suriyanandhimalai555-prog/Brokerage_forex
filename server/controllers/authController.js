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
    const { email, password, partnerCode = null } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
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
      `INSERT INTO users (email, password, partner_code, role, balance)
       VALUES ($1, $2, $3, 'user', 10000)
       RETURNING id, email, role, balance`,
      [email, hashedPassword, partnerCode]
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
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const result = await pool.query(
      "SELECT id, email, password, role, balance FROM users WHERE email = $1",
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
    return res.status(500).json({ message: error.message });
  }
};

export const me = async (req, res) => {
  return res.json({ user: req.user });
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  return res.json({ message: "Logged out successfully" });
};