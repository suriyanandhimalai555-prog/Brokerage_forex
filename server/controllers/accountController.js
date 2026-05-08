import axios from "axios";
import crypto from "crypto";
import { pool } from "../config/db.js";

const OXAPAY_URL = "https://api.oxapay.com/merchants/request";

const ACCOUNT_PLANS = [
    {
        category: "Standard accounts",
        data: [
            {
                id: "standard",
                title: "Standard",
                desc: "Low minimum deposit with no commission. Made for all traders.",
                minDeposit: "10 USD",
                minDepositAmount: 10,
                spread: "0.20 pips",
                leverage: "1:Unlimited",
                commission: "No commission",
            },
            {
                id: "cent",
                title: "Standard Cent",
                desc: "Smaller lots, lower risk. Great for practicing.",
                minDeposit: "10 USD",
                minDepositAmount: 10,
                spread: "0.30 pips",
                leverage: "1:Unlimited",
                commission: "No commission",
            },
        ],
    },
    {
        category: "Professional accounts",
        data: [
            {
                id: "pro",
                title: "Pro",
                desc: "Instant or market execution with tighter spreads.",
                minDeposit: "500 USD",
                minDepositAmount: 500,
                spread: "0.10 pips",
                leverage: "1:Unlimited",
                commission: "No commission",
            },
            {
                id: "raw",
                title: "Raw spread",
                desc: "Direct market pricing with fixed commission.",
                minDeposit: "500 USD",
                minDepositAmount: 500,
                spread: "0.00 pips",
                leverage: "1:Unlimited",
                commission: "Up to 3.50 USD per lot/side",
            },
            {
                id: "zero",
                title: "Zero",
                desc: "Spreads from 0 pips on top instruments.",
                minDeposit: "500 USD",
                minDepositAmount: 500,
                spread: "0.00 pips",
                leverage: "1:Unlimited",
                commission: "From 0.05 USD per lot/side",
            },
        ],
    },
];

const generateAccountNo = () => {
    const suffix = Math.floor(100000 + Math.random() * 900000);
    return `FX${Date.now().toString().slice(-8)}${suffix}`;
};

const pickPayLink = (data = {}) =>
    data.payLink || data.paymentUrl || data.payment_url || data.url || null;

const toNumber = (value, fallback = 0) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
};

export const getAccountPlans = async (_req, res) => {
    return res.json({ plans: ACCOUNT_PLANS });
};

export const listMyAccounts = async (req, res) => {
    const userId = String(req.user.id);

    const { rows } = await pool.query(
        `SELECT
      id, account_no, user_id, account_type, plan_id, plan_name, category,
      platform, currency, nickname, leverage, initial_balance, balance,
      status, payment_provider, payment_reference, payment_url,
      paid_at, archived_at, created_at, updated_at
     FROM trading_accounts
     WHERE user_id = $1
     ORDER BY created_at DESC`,
        [userId]
    );

    return res.json({ accounts: rows });
};

export const createAccount = async (req, res) => {
    try {
        const userId = String(req.user.id);

        const {
            accountType, // demo | real
            planId,
            platform = "MT5",
            currency = "USD",
            startingBalance,
            nickname,
            leverage = "1:2000",
        } = req.body;

        if (!accountType || !["demo", "real"].includes(accountType)) {
            return res.status(400).json({ message: "Invalid account type" });
        }

        if (!planId) {
            return res.status(400).json({ message: "Plan is required" });
        }

        if (!nickname || !String(nickname).trim()) {
            return res.status(400).json({ message: "Nickname is required" });
        }

        const plan = ACCOUNT_PLANS.flatMap((group) =>
            group.data.map((item) => ({
                ...item,
                category: group.category,
            }))
        ).find((p) => p.id === planId);

        if (!plan) {
            return res.status(400).json({ message: "Invalid plan selected" });
        }

        const initialBalance = toNumber(startingBalance, plan.minDepositAmount);
        const accountNo = generateAccountNo();
        const cleanNickname = String(nickname).trim();

        if (accountType === "demo") {
            const insert = await pool.query(
                `INSERT INTO trading_accounts (
          user_id, account_no, account_type, plan_id, plan_name, category,
          platform, currency, nickname, leverage, initial_balance, balance, status
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'active'
        )
        RETURNING *`,
                [
                    userId,
                    accountNo,
                    "demo",
                    plan.id,
                    plan.title,
                    plan.category || "Standard accounts",
                    platform,
                    currency,
                    cleanNickname,
                    leverage,
                    initialBalance,
                    initialBalance,
                ]
            );

            await pool.query(
                `
  UPDATE users
  SET active_account_id = $1
  WHERE id = $2
  AND active_account_id IS NULL
  `,
                [insert.rows[0].id, userId]
            );

            return res.status(201).json({
                message: "Demo account created successfully",
                account: insert.rows[0],
            });
        }

        const callbackUrl = `${process.env.API_URL}/api/accounts/oxapay/webhook`;
        const returnUrl = `${process.env.FRONTEND_URL}/user/my-account?payment=success`;

        const pendingInsert = await pool.query(
            `INSERT INTO trading_accounts (
        user_id, account_no, account_type, plan_id, plan_name, category,
        platform, currency, nickname, leverage, initial_balance, balance,
        status, payment_provider
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,0,'pending_payment','oxapay'
      )
      RETURNING *`,
            [
                userId,
                accountNo,
                "real",
                plan.id,
                plan.title,
                plan.category || "Standard accounts",
                platform,
                currency,
                cleanNickname,
                leverage,
                initialBalance,
            ]
        );

        const oxapayPayload = {
            merchant: process.env.OXAPAY_MERCHANT_KEY,
            amount: initialBalance,
            currency,
            callbackUrl,
            returnUrl,
            lifeTime: 60,
            feePaidByPayer: 0,
            orderId: accountNo,
            description: `Forex real account: ${plan.title} (${cleanNickname})`,
        };

        const oxapayResponse = await axios.post(OXAPAY_URL, oxapayPayload, {
            headers: { "Content-Type": "application/json" },
        });

        const payLink = pickPayLink(oxapayResponse.data);

        if (!payLink) {
            await pool.query(
                `UPDATE trading_accounts
         SET status = 'rejected',
             payment_raw = $2,
             updated_at = NOW()
         WHERE id = $1`,
                [pendingInsert.rows[0].id, oxapayResponse.data]
            );

            return res.status(500).json({
                message: "OxaPay payment link was not returned",
                raw: oxapayResponse.data,
            });
        }

        await pool.query(
            `UPDATE trading_accounts
       SET payment_reference = $1,
           payment_url = $2,
           payment_raw = $3,
           updated_at = NOW()
       WHERE id = $4`,
            [
                String(oxapayResponse.data.trackId || oxapayResponse.data.track_id || ""),
                payLink,
                oxapayResponse.data,
                pendingInsert.rows[0].id,
            ]
        );

        const { rows } = await pool.query(
            `SELECT * FROM trading_accounts WHERE id = $1`,
            [pendingInsert.rows[0].id]
        );

        return res.status(201).json({
            message: "Live account created. Complete payment to activate it.",
            account: rows[0],
            payLink,
            provider: "oxapay",
            trackId: oxapayResponse.data.trackId || oxapayResponse.data.track_id || null,
        });
    } catch (error) {
        console.error("createAccount error:", error?.response?.data || error);
        return res.status(500).json({
            message: "Failed to create account",
            error: error?.response?.data || error.message,
        });
    }
};

export const setActiveAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const account = await pool.query(
      `
      SELECT id, balance
      FROM trading_accounts
      WHERE id = $1
      AND user_id = $2
      `,
      [id, userId]
    );

    if (account.rowCount === 0) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    await pool.query(
      `
      UPDATE users
      SET active_account_id = $1
      WHERE id = $2
      `,
      [id, userId]
    );

    return res.json({
      success: true,
      account: account.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const archiveAccount = async (req, res) => {
    try {
        const userId = String(req.user.id);
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE trading_accounts
       SET status = 'archived',
           archived_at = NOW(),
           updated_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
            [id, userId]
        );

        if (!result.rowCount) {
            return res.status(404).json({ message: "Account not found" });
        }

        return res.json({ message: "Account archived", account: result.rows[0] });
    } catch (error) {
        console.error("archiveAccount error:", error);
        return res.status(500).json({ message: "Failed to archive account" });
    }
};

export const restoreAccount = async (req, res) => {
    try {
        const userId = String(req.user.id);
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE trading_accounts
       SET status = 'active',
           archived_at = NULL,
           updated_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
            [id, userId]
        );

        if (!result.rowCount) {
            return res.status(404).json({ message: "Account not found" });
        }

        return res.json({ message: "Account restored", account: result.rows[0] });
    } catch (error) {
        console.error("restoreAccount error:", error);
        return res.status(500).json({ message: "Failed to restore account" });
    }
};

export const oxaPayWebhook = async (req, res) => {
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

        if (calculated !== signature) {
            return res.status(400).send("Invalid HMAC signature");
        }

        const status = String(req.body?.status || "").toLowerCase();
        const trackId = String(req.body?.track_id || req.body?.trackId || "");
        const orderId = String(req.body?.order_id || req.body?.orderId || "");

        if (["paying", "paid"].includes(status)) {
            const accountNo = orderId || trackId;

            if (status === "paid") {
                await pool.query(
                    `UPDATE trading_accounts
           SET status = 'active',
               balance = initial_balance,
               payment_reference = COALESCE(payment_reference, $2),
               paid_at = NOW(),
               updated_at = NOW()
           WHERE account_no = $1 OR payment_reference = $2`,
                    [accountNo, trackId]
                );
            } else {
                await pool.query(
                    `UPDATE trading_accounts
           SET status = 'pending_payment',
               updated_at = NOW()
           WHERE account_no = $1 OR payment_reference = $2`,
                    [accountNo, trackId]
                );
            }
        }

        return res.status(200).send("ok");
    } catch (error) {
        console.error("oxaPayWebhook error:", error);
        return res.status(500).send("Webhook error");
    }
};

export const getPerformanceStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const accountId =
      req.query.account_id || null;

    /*
    |--------------------------------------------------------------------------
    | ACCOUNT FILTER
    |--------------------------------------------------------------------------
    */

    let whereClause = `WHERE o.user_id = $1`;
    let values = [userId];

    if (accountId) {
      whereClause += ` AND o.trading_account_id = $2`;
      values.push(accountId);
    }

    /*
    |--------------------------------------------------------------------------
    | SUMMARY
    |--------------------------------------------------------------------------
    */

    const summaryQuery = `
      SELECT
        COALESCE(SUM(
          CASE
            WHEN o.status = 'closed'
            THEN o.profit
            ELSE 0
          END
        ), 0) AS net_profit,

        COALESCE(SUM(
          CASE
            WHEN o.status = 'closed'
            AND o.profit > 0
            THEN o.profit
            ELSE 0
          END
        ), 0) AS total_profit,

        COALESCE(SUM(
          CASE
            WHEN o.status = 'closed'
            AND o.profit < 0
            THEN o.profit
            ELSE 0
          END
        ), 0) AS total_loss,

        COUNT(*) FILTER (
          WHERE o.status = 'closed'
        ) AS closed_orders,

        COUNT(*) FILTER (
          WHERE o.status = 'closed'
          AND o.profit > 0
        ) AS profitable_orders,

        COUNT(*) FILTER (
          WHERE o.status = 'closed'
          AND o.profit < 0
        ) AS unprofitable_orders,

        COALESCE(SUM(o.margin), 0) AS trading_volume

      FROM orders o
      ${whereClause}
    `;

    const summaryResult = await pool.query(
      summaryQuery,
      values
    );

    /*
    |--------------------------------------------------------------------------
    | EQUITY
    |--------------------------------------------------------------------------
    */

    let equityQuery = `
      SELECT
        COALESCE(SUM(balance), 0) AS equity
      FROM trading_accounts
      WHERE user_id = $1
    `;

    let equityValues = [userId];

    if (accountId) {
      equityQuery += ` AND id = $2`;
      equityValues.push(accountId);
    }

    const equityResult = await pool.query(
      equityQuery,
      equityValues
    );

    /*
    |--------------------------------------------------------------------------
    | MONTHLY CHART
    |--------------------------------------------------------------------------
    */

    const chartQuery = `
      SELECT
        TO_CHAR(
          DATE_TRUNC('month', created_at),
          'Mon'
        ) AS month,

        COALESCE(SUM(
          CASE
            WHEN profit > 0
            THEN profit
            ELSE 0
          END
        ), 0) AS profit,

        COALESCE(SUM(
          CASE
            WHEN profit < 0
            THEN profit
            ELSE 0
          END
        ), 0) AS loss,

        COUNT(*) AS orders,

        COALESCE(SUM(margin), 0) AS volume

      FROM orders o

      ${whereClause}

      GROUP BY DATE_TRUNC('month', created_at)

      ORDER BY DATE_TRUNC('month', created_at)
    `;

    const chartResult = await pool.query(
      chartQuery,
      values
    );

    return res.json({
      summary: {
        net_profit: Number(
          summaryResult.rows[0].net_profit || 0
        ),

        total_profit: Number(
          summaryResult.rows[0].total_profit || 0
        ),

        total_loss: Number(
          summaryResult.rows[0].total_loss || 0
        ),

        closed_orders: Number(
          summaryResult.rows[0].closed_orders || 0
        ),

        profitable_orders: Number(
          summaryResult.rows[0]
            .profitable_orders || 0
        ),

        unprofitable_orders: Number(
          summaryResult.rows[0]
            .unprofitable_orders || 0
        ),

        trading_volume: Number(
          summaryResult.rows[0]
            .trading_volume || 0
        ),

        equity: Number(
          equityResult.rows[0].equity || 0
        ),
      },

      charts: chartResult.rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch performance stats",
    });
  }
};