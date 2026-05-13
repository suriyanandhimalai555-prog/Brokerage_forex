import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export const protect = async (
  req,
  res,
  next
) => {
  try {

    let token = null;

    if (
      req.headers.authorization?.startsWith(
        "Bearer "
      )
    ) {

      token =
        req.headers.authorization.split(
          " "
        )[1];

    } else if (
      req.cookies?.token
    ) {

      token = req.cookies.token;

    }

    if (!token) {
      return res.status(401).json({
        message:
          "No token, not authorized",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded?.id) {
      return res.status(401).json({
        message:
          "Invalid token payload",
      });
    }

    const result = await pool.query(
      `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        u.phone_number,
        u.address,
        u.active_account_id,

        ta.id AS trading_account_id,
        ta.account_no,
        ta.balance,
        ta.account_type,
        ta.platform,
        ta.currency,
        ta.leverage,
        ta.status

      FROM users u

      LEFT JOIN trading_accounts ta
      ON ta.id = u.active_account_id
      AND ta.user_id::integer = u.id

      WHERE u.id = $1

      LIMIT 1
      `,
      [decoded.id]
    );

    if (result.rowCount === 0) {

      return res.status(401).json({
        message: "User not found",
      });

    }

    req.user = result.rows[0];

    next();

  } catch (error) {

    console.error(
      "Auth error:",
      error.message
    );

    return res.status(401).json({
      message: "Invalid token",
    });

  }
};

export const authorizeRoles =
  (...roles) => {
    return (
      req,
      res,
      next
    ) => {

      if (
        !req.user ||
        !roles.includes(
          req.user.role
        )
      ) {

        return res.status(403).json({
          message: "Forbidden",
        });

      }

      next();
    };
  };