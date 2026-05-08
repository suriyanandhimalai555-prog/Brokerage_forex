import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";

import { oxaPayWebhook } from "./controllers/accountController.js";

const app = express();

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

/*
|--------------------------------------------------------------------------
| BODY PARSER
|--------------------------------------------------------------------------
| rawBody needed for OxaPay webhook HMAC verification
*/
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| ROUTES
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.send("API Running...");
});

/* AUTH */
app.use("/api/auth", authRoutes);

/* MARKET */
app.use("/api/market", marketRoutes);

/* ORDERS */
app.use("/api/orders", orderRoutes);

/* ACCOUNTS */
app.use("/api/accounts", accountRoutes);

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