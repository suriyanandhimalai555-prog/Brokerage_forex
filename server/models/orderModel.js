import { pool } from "../config/db.js";

export const createOrder = async (
  {
    user_id,
    symbol,
    type,
    lot_size,
    units,
    leverage,
    margin,
    open_price,
  },
  client = pool
) => {
  const query = `
    INSERT INTO orders
      (user_id, symbol, type, lot_size, units, leverage, margin, open_price, status)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, 'open')
    RETURNING *;
  `;

  const values = [
    user_id,
    symbol,
    type,
    lot_size,
    units,
    leverage,
    margin,
    open_price,
  ];

  const { rows } = await client.query(query, values);
  return rows[0];
};

export const getOrdersByUser = async (user_id, client = pool) => {
  const { rows } = await client.query(
    `
    SELECT *
    FROM orders
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [user_id]
  );

  return rows;
};

export const getOpenOrderByIdAndUser = async (id, user_id, client = pool) => {
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
    [close_price, close_time, profit, id, user_id]
  );

  return rows[0] || null;
};