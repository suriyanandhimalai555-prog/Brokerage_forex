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
          "No token provided",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const result =
      await pool.query(
        `
        SELECT
          id,
          name,
          email,
          role,
          phone_number,
          address,
          active_account_id

        FROM users

        WHERE id = $1

        LIMIT 1
        `,
        [decoded.id]
      );

    if (
      result.rowCount === 0
    ) {
      return res.status(401).json({
        message:
          "User not found",
      });
    }

    req.user =
      result.rows[0];

    next();

  } catch (error) {

    console.error(
      "AUTH MIDDLEWARE ERROR:",
      error
    );

    return res.status(401).json({
      message:
        error.message,
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