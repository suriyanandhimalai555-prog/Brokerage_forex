import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import depositRoutes from "./routes/depositRoutes.js";
import withdrawRoutes from "./routes/withdrawRoutes.js";
import transferRoutes from "./routes/transferRoutes.js";
import adminTransactionRoutes from "./routes/adminTransactionRoutes.js";

import { oxaPayWebhook } from "./controllers/accountController.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).send("AVG Forex Backend API is running");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "brokerage-forex-backend",
    timestamp: new Date().toISOString(),
  });
});
app.use("/api/auth", authRoutes);

/* MARKET */
app.use("/api/market", marketRoutes);

/* ORDERS */
app.use("/api/orders", orderRoutes);

/* ACCOUNTS */
app.use("/api/accounts", accountRoutes);

// DEPOSITS
app.use("/api/deposits", depositRoutes);

// WITHDRAWALS
app.use("/api/withdrawals", withdrawRoutes);

// TRANSFER
app.use("/api/transfers", transferRoutes);

app.use(
  "/api/admin",
  adminTransactionRoutes
);

/*
|--------------------------------------------------------------------------
| OXAPAY WEBHOOK
|--------------------------------------------------------------------------
| PUBLIC ROUTE
*/
app.post("/api/accounts/oxapay/webhook", oxaPayWebhook);

/*
|--------------------------------------------------------------------------
| SERVER
|--------------------------------------------------------------------------
*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
