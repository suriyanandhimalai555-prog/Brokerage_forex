import { pool } from "../config/db.js";
import {
  createOrder,
  getOrdersByUser,
  getOpenOrderByIdAndUser,
  closeOrderByIdAndUser,
} from "../models/orderModel.js";

const getContractSize = (symbol) => {
  const s = String(symbol || "").toUpperCase().replace(/\s+/g, "");

  const cryptoPairs = ["BTCUSDT", "ETHUSDT", "BNBUSDT"];
  const forexPairs = [
    "EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "USDCAD", "NZDUSD",
    "EURGBP", "EURAUD", "EURJPY", "EURCHF", "EURCAD", "EURNZD",
    "GBPJPY", "GBPAUD", "GBPCHF", "GBPCAD", "GBPNZD",
    "AUDJPY", "AUDNZD", "AUDCAD", "CADJPY", "CHFJPY", "NZDJPY",
    "USDINR", "USDTRY", "USDZAR", "USDMXN", "USDTHB", "USDSGD", "USDHKD", "USDAED",
  ];
  const metalPairs = ["XAUUSD", "XAGUSD", "XPTUSD"];
  const indexCodes = ["US30", "NAS100", "SPX500", "DAX40", "FTSE100", "DJI", "NDX", "SPX", "DAX", "UKX"];
  const energyCodes = ["USOIL", "UKOIL", "WTI", "BRENT", "NATGAS"];

  if (cryptoPairs.some((code) => s.includes(code))) return 1;
  if (forexPairs.some((code) => s.includes(code))) return 100000;
  if (s.includes("XAUUSD")) return 100;
  if (s.includes("XAGUSD")) return 5000;
  if (s.includes("XPTUSD")) return 100;
  if (energyCodes.some((code) => s.includes(code))) return 1000;
  if (indexCodes.some((code) => s.includes(code))) return 1;

  return 100000;
};

const cleanSymbol = (symbol) => {
  const raw = String(symbol || "")
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/^OANDA:/, "")
    .replace(/^TVC:/, "")
    .replace(/^BINANCE:/, "");

  if (raw.includes("/")) return raw;
  if (/^[A-Z]{6}$/.test(raw)) return `${raw.slice(0, 3)}/${raw.slice(3)}`;
  if (/^[A-Z0-9]+USDT$/.test(raw)) return `${raw.slice(0, -4)}/USDT`;
  if (/^[A-Z0-9]+USD$/.test(raw) && raw.length > 3) return `${raw.slice(0, -3)}/USD`;
  return raw;
};

const normalizeOrderType = (type) => {
  const t = String(type || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");

  const allowed = new Set([
    "buy",
    "sell",
    "buy_limit",
    "sell_limit",
    "buy_stop",
    "sell_stop",
  ]);

  return allowed.has(t) ? t : null;
};

const isPendingType = (type) =>
  ["buy_limit", "sell_limit", "buy_stop", "sell_stop"].includes(String(type || "").toLowerCase());

const getSideFromType = (type) =>
  String(type || "").toLowerCase().startsWith("buy") ? "buy" : "sell";

const calculatePnL = ({ type, openPrice, closePrice, units }) => {
  const entry = Number(openPrice);
  const exit = Number(closePrice);
  const qty = Number(units);

  if ([entry, exit, qty].some((v) => Number.isNaN(v))) return 0;

  if (getSideFromType(type) === "buy") return (exit - entry) * qty;
  return (entry - exit) * qty;
};

const shouldTriggerPendingOrder = (orderType, triggerPrice, marketPrice) => {
  const trigger = Number(triggerPrice);
  const price = Number(marketPrice);

  if (Number.isNaN(trigger) || Number.isNaN(price)) return false;

  switch (String(orderType).toLowerCase()) {
    case "buy_limit":
      return price <= trigger;
    case "sell_limit":
      return price >= trigger;
    case "buy_stop":
      return price >= trigger;
    case "sell_stop":
      return price <= trigger;
    default:
      return false;
  }
};

const mapOrderForResponse = (order) => {
  const isPending = String(order.status || "").toLowerCase() === "pending";

  return {
    ...order,
    symbol: cleanSymbol(order.symbol),
    display_symbol: cleanSymbol(order.symbol),
    side: getSideFromType(order.type),
    open_price:
      isPending || order.open_price === null || Number(order.open_price) === 0
        ? null
        : Number(order.open_price),
    trigger_price:
      order.trigger_price === null || order.trigger_price === undefined
        ? null
        : Number(order.trigger_price),
  };
};

export const processPendingOrdersBySymbol = async (symbol, marketPrice) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
      SELECT *
      FROM orders
      WHERE UPPER(symbol) = UPPER($1)
        AND status = 'pending'
      ORDER BY id ASC
      FOR UPDATE
      `,
      [symbol]
    );

    const executed = [];

    for (const order of result.rows) {
      const triggerOk = shouldTriggerPendingOrder(
        order.type,
        order.trigger_price,
        marketPrice
      );

      if (!triggerOk) continue;

      const updated = await client.query(
        `
        UPDATE orders
        SET status = 'open',
            open_price = $1
        WHERE id = $2
        RETURNING *
        `,
        [Number(marketPrice), order.id]
      );

      if (updated.rowCount > 0) {
        executed.push(mapOrderForResponse(updated.rows[0]));
      }
    }

    await client.query("COMMIT");
    return executed;
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Pending order execution error:", err);
    return [];
  } finally {
    client.release();
  }
};

export const placeOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const {
      symbol,
      type,
      lot_size,
      price,
      trigger_price,
      leverage = 100,
    } = req.body;

    if (!symbol || !type || lot_size === undefined || lot_size === null) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const normalizedType = normalizeOrderType(type);

    if (!normalizedType) {
      return res.status(400).json({ message: "Invalid order type" });
    }

    const lot = Number(lot_size);
    const lev = Number(leverage);
    const pending = isPendingType(normalizedType);
    const entryPrice = pending ? Number(trigger_price) : Number(price);

    if (Number.isNaN(lot) || lot <= 0) {
      return res.status(400).json({ message: "Invalid lot size" });
    }

    if (Number.isNaN(lev) || lev <= 0) {
      return res.status(400).json({ message: "Invalid leverage" });
    }

    if (Number.isNaN(entryPrice) || entryPrice <= 0) {
      return res.status(400).json({
        message: pending ? "Invalid trigger price" : "Invalid price",
      });
    }

    const contractSize = getContractSize(symbol);
    const units = lot * contractSize;
    const margin = units / lev;

    await client.query("BEGIN");

    const balanceResult = await client.query(
      "SELECT balance FROM users WHERE id = $1 FOR UPDATE",
      [user_id]
    );

    if (balanceResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "User not found" });
    }

    const currentBalance = Number(balanceResult.rows[0].balance || 0);

    if (currentBalance < margin) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Insufficient balance" });
    }

    await client.query(
      "UPDATE users SET balance = balance - $1 WHERE id = $2",
      [margin, user_id]
    );

    const order = await createOrder(
      {
        user_id,
        symbol,
        type: normalizedType,
        side: getSideFromType(normalizedType),
        status: pending ? "pending" : "open",
        lot_size: lot,
        units,
        leverage: lev,
        margin,
        trigger_price: pending ? entryPrice : null,
        open_price: pending ? null : entryPrice,
      },
      client
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      order: mapOrderForResponse(order),
      balance: currentBalance - margin,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

export const getOrders = async (req, res) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const orders = await getOrdersByUser(user_id);

    return res.json({
      orders: Array.isArray(orders) ? orders.map(mapOrderForResponse) : [],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching orders" });
  }
};

export const closeOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const user_id = req.user?.id;
    const { id } = req.params;
    const { close_price } = req.body;

    if (!user_id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (!id || close_price === undefined || close_price === null) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const order = await getOpenOrderByIdAndUser(id, user_id, client);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const exitPrice = Number(close_price);

    if (Number.isNaN(exitPrice) || exitPrice <= 0) {
      return res.status(400).json({ message: "Invalid close price" });
    }

    const profit = calculatePnL({
      type: order.type,
      openPrice: order.open_price,
      closePrice: exitPrice,
      units: order.units,
    });

    await client.query("BEGIN");

    const closedOrder = await closeOrderByIdAndUser(
      {
        id,
        user_id,
        close_price: exitPrice,
        close_time: new Date(),
        profit,
      },
      client
    );

    const marginToRelease = Number(order.margin || 0);
    const balanceChange = marginToRelease + profit;

    await client.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2",
      [balanceChange, user_id]
    );

    const balanceResult = await client.query(
      "SELECT balance FROM users WHERE id = $1",
      [user_id]
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      order: mapOrderForResponse(closedOrder),
      balance: Number(balanceResult.rows[0].balance || 0),
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return res.status(500).json({ message: "Error closing order" });
  } finally {
    client.release();
  }
};