import { pool } from "../config/db.js";

const METHODS = [
  "erc20",
  "trc20",
  "btc",
  "eth",
];

const generateWithdrawNo = () => {
  const suffix = Math.floor(
    100000 + Math.random() * 900000
  );

  return `WD${Date.now()
    .toString()
    .slice(-8)}${suffix}`;
};

export const createWithdrawal = async (
  req,
  res
) => {
  const client = await pool.connect();

  try {
    const userId = req.user.id;

    const {
      accountId,
      methodId,
      amount,
      note = "",
    } = req.body;

    if (!METHODS.includes(methodId)) {
      return res.status(400).json({
        message: "Invalid method",
      });
    }

    const withdrawAmount = Number(amount);

    if (
      !Number.isFinite(withdrawAmount) ||
      withdrawAmount < 100
    ) {
      return res.status(400).json({
        message:
          "Minimum withdrawal amount is 100",
      });
    }

    await client.query("BEGIN");

    const accountResult = await client.query(
      `
      SELECT
        id,
        account_no,
        plan_name,
        currency,
        balance,
        status,
        account_type
      FROM trading_accounts
      WHERE id = $1
      AND user_id = $2
      FOR UPDATE
      `,
      [accountId, userId]
    );

    if (!accountResult.rowCount) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        message: "Account not found",
      });
    }

    const account = accountResult.rows[0];

    if (
      account.account_type !== "real" ||
      account.status !== "active"
    ) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message:
          "Only active real accounts allowed",
      });
    }

    if (
      withdrawAmount >
      Number(account.balance || 0)
    ) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    await client.query(
      `
      UPDATE trading_accounts
      SET balance = balance - $1,
      updated_at = NOW()
      WHERE id = $2
      `,
      [withdrawAmount, account.id]
    );

    const withdrawalNo =
      generateWithdrawNo();

    const insert = await client.query(
      `
      INSERT INTO withdrawal_requests (
        user_id,
        trading_account_id,
        withdrawal_no,
        method_id,
        amount,
        currency,
        status,
        note
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,'pending',$7
      )
      RETURNING *
      `,
      [
        userId,
        account.id,
        withdrawalNo,
        methodId,
        withdrawAmount,
        account.currency,
        note,
      ]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      message:
        "Withdrawal request submitted",
      withdrawal: {
        ...insert.rows[0],
        account_no: account.account_no,
        plan_name: account.plan_name,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(error);

    return res.status(500).json({
      message:
        "Failed to create withdrawal",
    });
  } finally {
    client.release();
  }
};

export const getMyWithdrawals = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const { rows } = await pool.query(
      `
      SELECT
        wr.*,
        ta.account_no,
        ta.plan_name
      FROM withdrawal_requests wr
      JOIN trading_accounts ta
      ON ta.id = wr.trading_account_id
      WHERE wr.user_id = $1
      ORDER BY wr.created_at DESC
      `,
      [userId]
    );

    return res.json({
      withdrawals: rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Failed to fetch withdrawals",
    });
  }
};

export const approveWithdrawal = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    await pool.query(
      `
      UPDATE withdrawal_requests
      SET status = 'approved',
      processed_at = NOW(),
      updated_at = NOW()
      WHERE id = $1
      `,
      [id]
    );

    return res.json({
      message: "Withdrawal approved",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Failed to approve withdrawal",
    });
  }
};

export const rejectWithdrawal = async (
  req,
  res
) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query("BEGIN");

    const result = await client.query(
      `
      SELECT *
      FROM withdrawal_requests
      WHERE id = $1
      FOR UPDATE
      `,
      [id]
    );

    if (!result.rowCount) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        message:
          "Withdrawal request not found",
      });
    }

    const request = result.rows[0];

    if (request.status !== "pending") {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message:
          "Already processed",
      });
    }

    await client.query(
      `
      UPDATE trading_accounts
      SET balance = balance + $1,
      updated_at = NOW()
      WHERE id = $2
      `,
      [
        request.amount,
        request.trading_account_id,
      ]
    );

    await client.query(
      `
      UPDATE withdrawal_requests
      SET status = 'rejected',
      processed_at = NOW(),
      updated_at = NOW()
      WHERE id = $1
      `,
      [id]
    );

    await client.query("COMMIT");

    return res.json({
      message:
        "Withdrawal rejected and refunded",
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(error);

    return res.status(500).json({
      message:
        "Failed to reject withdrawal",
    });
  } finally {
    client.release();
  }
};

export const getAllWithdrawals = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT
        wr.*,
        ta.account_no,
        ta.plan_name,
        ta.balance,
        u.name,
        u.email
      FROM withdrawal_requests wr

      JOIN trading_accounts ta
      ON ta.id = wr.trading_account_id

      JOIN users u
      ON u.id = wr.user_id

      ORDER BY wr.created_at DESC
      `
    );

    return res.json({
      withdrawals: rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch withdrawals",
    });
  }
};