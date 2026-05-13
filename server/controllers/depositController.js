import axios from "axios";
import crypto from "crypto";
import { pool } from "../config/db.js";

const OXAPAY_WHITE_LABEL_URL =
  process.env.OXAPAY_WHITE_LABEL_URL ||
  "https://api.oxapay.com/v1/payment/white-label";

const PAYMENT_METHODS = [
  {
    id: "usdt_trc20",
    name: "USDT (TRC20)",
    payCurrency: "USDT",
    network: "TRC20",
  },
  {
    id: "usdt_bep20",
    name: "USDT (BEP20)",
    payCurrency: "USDT",
    network: "BEP20",
  },
  {
    id: "btc",
    name: "Bitcoin (BTC)",
    payCurrency: "BTC",
    network: "BTC",
  },
];

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const generateDepositNo = () => {
  const suffix = Math.floor(100000 + Math.random() * 900000);
  return `DP${Date.now().toString().slice(-8)}${suffix}`;
};

const normalizeWhiteLabelResponse = (data = {}) => {
  const payload = data?.data ?? data ?? {};

  return {
    trackId:
      payload.track_id ||
      payload.trackId ||
      payload.id ||
      payload.reference ||
      null,
    address:
      payload.address ||
      payload.wallet_address ||
      payload.payment_address ||
      null,
    qrCode: payload.qr_code || payload.qrCode || payload.qr || null,
    amount: payload.amount ?? payload.pay_amount ?? payload.payAmount ?? null,
    payAmount: payload.pay_amount ?? payload.payAmount ?? payload.amount ?? null,
    currency: payload.currency ?? null,
    payCurrency: payload.pay_currency ?? payload.payCurrency ?? null,
    network: payload.network ?? null,
    expiredAt:
      payload.expired_at || payload.expiredAt || payload.expire_at || null,
    orderId: payload.order_id || payload.orderId || null,
    raw: data,
  };
};

export const getDepositMethods = async (_req, res) => {
  return res.json({ methods: PAYMENT_METHODS });
};

export const createDeposit = async (req, res) => {
  try {
    const userId = String(req.user.id);
    const { accountId, methodId, amount } = req.body;

    if (!accountId) {
      return res.status(400).json({ message: "Account is required" });
    }

    if (!methodId) {
      return res.status(400).json({ message: "Payment method is required" });
    }

    const method = PAYMENT_METHODS.find((m) => m.id === methodId);
    if (!method) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const depositAmount = toNumber(amount, 0);
    if (!Number.isFinite(depositAmount) || depositAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const accountResult = await pool.query(
      `SELECT id, account_no, user_id, currency, balance, status, plan_name
       FROM trading_accounts
       WHERE id = $1 AND user_id = $2`,
      [accountId, userId]
    );

    if (!accountResult.rowCount) {
      return res.status(404).json({ message: "Account not found" });
    }

    const account = accountResult.rows[0];

    if (account.status === "archived") {
      return res.status(400).json({ message: "Archived account cannot receive deposits" });
    }

    const depositNo = generateDepositNo();

    const insertDeposit = await pool.query(
      `INSERT INTO account_deposits (
        user_id,
        trading_account_id,
        deposit_no,
        amount,
        currency,
        pay_currency,
        network,
        status,
        payment_provider
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,'pending_payment','oxapay')
      RETURNING *`,
      [
        userId,
        account.id,
        depositNo,
        depositAmount,
        account.currency || "USD",
        method.payCurrency,
        method.network,
      ]
    );

    const callbackUrl = `${process.env.API_URL}/api/deposits/oxapay/webhook`;
    const returnUrl = `${process.env.CLIENT_URL}/user/deposit-success?deposit_no=${depositNo}`;

    const whiteLabelPayload = {
      amount: depositAmount,
      currency: account.currency || "USD",
      pay_currency: method.payCurrency,
      network: method.network,
      callback_url: callbackUrl,
      return_url: returnUrl,
      lifetime: 60,
      fee_paid_by_payer: 1,
      order_id: depositNo,
      description: `Deposit to account ${account.account_no}`,
    };

    const oxapayResponse = await axios.post(
      OXAPAY_WHITE_LABEL_URL,
      whiteLabelPayload,
      {
        headers: {
          merchant_api_key: process.env.OXAPAY_MERCHANT_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const payment = normalizeWhiteLabelResponse(oxapayResponse.data);

    await pool.query(
      `UPDATE account_deposits
       SET payment_reference = $1,
           payment_url = $2,
           payment_raw = $3,
           updated_at = NOW()
       WHERE id = $4`,
      [
        String(payment.trackId || depositNo),
        payment.address || null,
        JSON.stringify(oxapayResponse.data),
        insertDeposit.rows[0].id,
      ]
    );

    const { rows } = await pool.query(
      `SELECT * FROM account_deposits WHERE id = $1`,
      [insertDeposit.rows[0].id]
    );

    return res.status(201).json({
      message: "Deposit created successfully",
      account,
      deposit: rows[0],
      payment: {
        trackId: payment.trackId,
        address: payment.address,
        qrCode: payment.qrCode,
        amount: payment.amount,
        payAmount: payment.payAmount,
        currency: payment.currency,
        payCurrency: payment.payCurrency || method.payCurrency,
        network: payment.network || method.network,
        expiredAt: payment.expiredAt,
        orderId: payment.orderId || depositNo,
        returnUrl,
      },
      provider: "oxapay",
    });
  } catch (error) {
    console.error("createDeposit error:", error?.response?.data || error);
    return res.status(500).json({
      message: "Failed to create deposit",
      error: error?.response?.data || error.message,
    });
  }
};

export const oxaPayDepositWebhook = async (req, res) => {
  const client = await pool.connect();

  try {
    const rawBody = req.rawBody || JSON.stringify(req.body || {});
    const signature = req.get("HMAC") || req.get("hmac");

    if (!signature) {
      return res.status(400).send("Missing HMAC");
    }

    const secret = process.env.OXAPAY_MERCHANT_KEY;

    const calculated = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    if (
      signature.length !== calculated.length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(calculated))
    ) {
      return res.status(400).send("Invalid HMAC signature");
    }

    const status = String(req.body?.status || "").toLowerCase();
    const trackId = String(req.body?.track_id || req.body?.trackId || "");
    const orderId = String(req.body?.order_id || req.body?.orderId || "");
    const ref = orderId || trackId;

    await client.query("BEGIN");

    const depResult = await client.query(
      `SELECT *
       FROM account_deposits
       WHERE deposit_no = $1 OR payment_reference = $2
       FOR UPDATE`,
      [ref, trackId]
    );

    if (!depResult.rowCount) {
      await client.query("COMMIT");
      return res.status(200).send("ok");
    }

    const deposit = depResult.rows[0];

    if (deposit.status === "paid") {
      await client.query("COMMIT");
      return res.status(200).send("ok");
    }

    if (["paying", "paid"].includes(status)) {
      if (status === "paid") {
        await client.query(
          `UPDATE trading_accounts
           SET balance = COALESCE(balance, 0) + $1,
               updated_at = NOW()
           WHERE id = $2 AND user_id = $3`,
          [deposit.amount, deposit.trading_account_id, deposit.user_id]
        );

        await client.query(
          `UPDATE account_deposits
           SET status = 'paid',
               payment_reference = COALESCE(payment_reference, $2),
               paid_at = NOW(),
               updated_at = NOW()
           WHERE id = $1`,
          [deposit.id, trackId]
        );
      } else {
        await client.query(
          `UPDATE account_deposits
           SET status = 'pending_payment',
               updated_at = NOW()
           WHERE id = $1`,
          [deposit.id]
        );
      }
    }

    await client.query("COMMIT");
    return res.status(200).send("ok");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("oxaPayDepositWebhook error:", error);
    return res.status(500).send("Webhook error");
  } finally {
    client.release();
  }
};

export const getMyDeposits = async (req, res) => {
  try {
    const userId = req.user.id;

    const { rows } = await pool.query(
      `
      SELECT
        ad.*,
        ta.account_no,
        ta.plan_name
      FROM account_deposits ad
      JOIN trading_accounts ta
      ON ta.id = ad.trading_account_id
      WHERE ad.user_id = $1
      ORDER BY ad.created_at DESC
      `,
      [userId]
    );

    return res.json({
      deposits: rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch deposits",
    });
  }
};