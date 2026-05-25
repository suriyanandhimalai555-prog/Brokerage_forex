import { pool } from "../config/db.js";

export const getAllTransactions = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        t.source_id,
        t.transaction_kind,
        t.transaction_type,
        t.reference_no,
        t.amount,
        t.currency,
        t.status,
        t.note,
        t.account_no,
        t.plan_name,
        t.user_id,
        t.user_name,
        t.user_email,
        t.from_account_no,
        t.to_account_no,
        t.created_at,
        t.updated_at
      FROM (
        SELECT
          ad.id::text AS source_id,
          'deposit' AS transaction_kind,
          'Credit' AS transaction_type,
          ad.deposit_no AS reference_no,
          ad.amount,
          ad.currency,
          ad.status,
          ad.note,
          ta.account_no::text AS account_no,
          ta.plan_name,
          u.id AS user_id,
          u.name AS user_name,
          u.email AS user_email,
          NULL::text AS from_account_no,
          NULL::text AS to_account_no,
          ad.created_at,
          ad.updated_at
        FROM account_deposits ad
        JOIN trading_accounts ta ON ta.id = ad.trading_account_id
        JOIN users u ON u.id = ad.user_id

        UNION ALL

        SELECT
          wr.id::text AS source_id,
          'withdrawal' AS transaction_kind,
          'Debit' AS transaction_type,
          wr.withdrawal_no AS reference_no,
          wr.amount,
          wr.currency,
          wr.status,
          wr.note,
          ta.account_no::text AS account_no,
          ta.plan_name,
          u.id AS user_id,
          u.name AS user_name,
          u.email AS user_email,
          NULL::text AS from_account_no,
          NULL::text AS to_account_no,
          wr.created_at,
          wr.updated_at
        FROM withdrawal_requests wr
        JOIN trading_accounts ta ON ta.id = wr.trading_account_id
        JOIN users u ON u.id = wr.user_id

        UNION ALL

        SELECT
          at.id::text AS source_id,
          'transfer' AS transaction_kind,
          CASE
            WHEN at.status = 'completed' THEN 'Transfer'
            ELSE 'Transfer'
          END AS transaction_type,
          at.transfer_no AS reference_no,
          at.amount,
          at.currency,
          at.status,
          at.note,
          fa.account_no::text AS account_no,
          fa.plan_name,
          u.id AS user_id,
          u.name AS user_name,
          u.email AS user_email,
          fa.account_no::text AS from_account_no,
          ta.account_no::text AS to_account_no,
          at.created_at,
          at.updated_at
        FROM account_transfers at
        JOIN trading_accounts fa ON fa.id = at.from_account_id
        JOIN trading_accounts ta ON ta.id = at.to_account_id
        JOIN users u ON u.id = at.user_id
      ) t
      ORDER BY t.created_at DESC
    `);

    return res.json({ transactions: rows });
  } catch (error) {
    console.error("getAllTransactions error:", error);
    return res.status(500).json({
      message: "Failed to fetch transactions",
    });
  }
};