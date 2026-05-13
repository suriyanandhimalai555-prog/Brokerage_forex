import { pool } from "../config/db.js";

const generateTransferNo = () => {
  const suffix = Math.floor(100000 + Math.random() * 900000);
  return `TR${Date.now().toString().slice(-8)}${suffix}`;
};

export const createTransfer = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.id;
    const { fromAccountId, toAccountId, amount, note = "" } = req.body;

    if (!fromAccountId || !toAccountId) {
      return res.status(400).json({ message: "Both accounts are required" });
    }

    if (String(fromAccountId) === String(toAccountId)) {
      return res.status(400).json({ message: "From and To accounts cannot be the same" });
    }

    const transferAmount = Number(amount);
    if (!Number.isFinite(transferAmount) || transferAmount <= 0) {
      return res.status(400).json({ message: "Invalid transfer amount" });
    }

    await client.query("BEGIN");

    const fromResult = await client.query(
      `
      SELECT id, account_no, plan_name, currency, balance, status, account_type
      FROM trading_accounts
      WHERE id = $1 AND user_id = $2
      FOR UPDATE
      `,
      [fromAccountId, userId]
    );

    if (!fromResult.rowCount) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Source account not found" });
    }

    const toResult = await client.query(
      `
      SELECT id, account_no, plan_name, currency, balance, status, account_type
      FROM trading_accounts
      WHERE id = $1 AND user_id = $2
      FOR UPDATE
      `,
      [toAccountId, userId]
    );

    if (!toResult.rowCount) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Destination account not found" });
    }

    const fromAccount = fromResult.rows[0];
    const toAccount = toResult.rows[0];

    if (fromAccount.status !== "active" || toAccount.status !== "active") {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Only active accounts are allowed" });
    }

    if (fromAccount.currency !== toAccount.currency) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Transfer is allowed only between same currency accounts" });
    }

    if (transferAmount > Number(fromAccount.balance || 0)) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Insufficient balance" });
    }

    await client.query(
      `
      UPDATE trading_accounts
      SET balance = balance - $1,
          updated_at = NOW()
      WHERE id = $2
      `,
      [transferAmount, fromAccount.id]
    );

    await client.query(
      `
      UPDATE trading_accounts
      SET balance = balance + $1,
          updated_at = NOW()
      WHERE id = $2
      `,
      [transferAmount, toAccount.id]
    );

    const transferNo = generateTransferNo();

    const insert = await client.query(
      `
      INSERT INTO account_transfers (
        user_id,
        from_account_id,
        to_account_id,
        transfer_no,
        amount,
        currency,
        status,
        note
      )
      VALUES ($1,$2,$3,$4,$5,$6,'completed',$7)
      RETURNING *
      `,
      [
        userId,
        fromAccount.id,
        toAccount.id,
        transferNo,
        transferAmount,
        fromAccount.currency || "USD",
        note,
      ]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Transfer completed successfully",
      transfer: {
        ...insert.rows[0],
        from_account_no: fromAccount.account_no,
        to_account_no: toAccount.account_no,
        from_plan_name: fromAccount.plan_name,
        to_plan_name: toAccount.plan_name,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("createTransfer error:", error);
    return res.status(500).json({
      message: "Failed to create transfer",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

export const getMyTransfers = async (req, res) => {
  try {
    const userId = req.user.id;

    const { rows } = await pool.query(
      `
      SELECT
        at.*,
        fa.account_no AS from_account_no,
        fa.plan_name AS from_plan_name,
        ta.account_no AS to_account_no,
        ta.plan_name AS to_plan_name
      FROM account_transfers at
      JOIN trading_accounts fa ON fa.id = at.from_account_id
      JOIN trading_accounts ta ON ta.id = at.to_account_id
      WHERE at.user_id = $1
      ORDER BY at.created_at DESC
      `,
      [userId]
    );

    return res.json({ transfers: rows });
  } catch (error) {
    console.error("getMyTransfers error:", error);
    return res.status(500).json({
      message: "Failed to fetch transfers",
    });
  }
};