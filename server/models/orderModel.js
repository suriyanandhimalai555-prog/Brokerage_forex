import { pool } from "../config/db.js";

export const createOrder = async (
  {
    user_id,
    trading_account_id,

    symbol,
    type,
    side,
    status,

    lot_size,
    units,

    leverage,
    margin,

    trigger_price = null,
    open_price = null,

    // NEW
    take_profit = null,
    stop_loss = null,
  },
  client = pool
) => {
  const query = `
    INSERT INTO orders
    (
      user_id,
      trading_account_id,

      symbol,
      type,
      side,
      status,

      lot_size,
      units,

      leverage,
      margin,

      trigger_price,
      open_price,

      take_profit,
      stop_loss,

      created_at
    )

    VALUES
    (
      $1,
      $2,

      $3,
      $4,
      $5,
      $6,

      $7,
      $8,

      $9,
      $10,

      $11,
      $12,

      $13,
      $14,

      NOW()
    )

    RETURNING *;
  `;

  const values = [
    user_id,
    trading_account_id,

    symbol,
    type,
    side,
    status,

    lot_size,
    units,

    leverage,
    margin,

    trigger_price,
    open_price,

    // NEW
    take_profit,
    stop_loss,
  ];

  const { rows } = await client.query(
    query,
    values
  );

  return rows[0];
};

export const getOrdersByUser = async (
  user_id,
  trading_account_id
) => {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM orders

    WHERE user_id = $1
    AND trading_account_id = $2

    ORDER BY created_at DESC
    `,
    [user_id, trading_account_id]
  );

  return rows;
};

export const getOpenOrderByIdAndUser = async (
  id,
  user_id,
  client = pool
) => {
  const { rows } = await client.query(
    `
    SELECT *
    FROM orders

    WHERE id = $1
    AND user_id = $2
    AND status = 'open'

    LIMIT 1
    `,
    [id, user_id]
  );

  return rows[0] || null;
};

export const closeOrderByIdAndUser = async (
  {
    id,
    user_id,

    close_price,
    close_time,

    profit,
  },
  client = pool
) => {
  const { rows } = await client.query(
    `
    UPDATE orders

    SET
      status = 'closed',
      close_price = $1,
      close_time = $2,
      profit = $3

    WHERE id = $4
    AND user_id = $5

    RETURNING *;
    `,
    [
      close_price,
      close_time,
      profit,
      id,
      user_id,
    ]
  );

  return rows[0] || null;
};

export const updateOrderProtectionByIdAndUser = async (
  {
    id,
    user_id,
    take_profit = null,
    stop_loss = null,
  },
  client = pool
) => {
  const { rows } = await client.query(
    `
    UPDATE orders
    SET
      take_profit = $1,
      stop_loss = $2
    WHERE id = $3
      AND user_id = $4
      AND status IN ('open', 'pending')
    RETURNING *;
    `,
    [
      take_profit,
      stop_loss,
      id,
      user_id,
    ]
  );

  return rows[0] || null;
};