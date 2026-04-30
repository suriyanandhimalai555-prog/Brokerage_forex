import { pool } from "../config/db.js";
import {
  createOrder,
  getOrdersByUser,
  getOpenOrderByIdAndUser,
  closeOrderByIdAndUser,
} from "../models/orderModel.js";

const getContractSize = (symbol) => {
  const s = String(symbol || "").toUpperCase().replace(/\s+/g, "");

  const cryptoPairs = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "BINANCE:"];
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

const calculatePnL = ({ type, openPrice, closePrice, units }) => {
  const entry = Number(openPrice);
  const exit = Number(closePrice);
  const qty = Number(units);

  if ([entry, exit, qty].some((v) => Number.isNaN(v))) return 0;

  if (String(type).toLowerCase() === "buy") {
    return (exit - entry) * qty;
  }

  return (entry - exit) * qty;
};

export const placeOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { symbol, type, lot_size, price, leverage = 100 } = req.body;

    if (!symbol || !type || lot_size === undefined || lot_size === null || !price) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const lot = Number(lot_size);
    const open_price = Number(price);
    const lev = Number(leverage);

    if (Number.isNaN(lot) || lot <= 0) {
      return res.status(400).json({ message: "Invalid lot size" });
    }

    if (Number.isNaN(open_price) || open_price <= 0) {
      return res.status(400).json({ message: "Invalid price" });
    }

    if (Number.isNaN(lev) || lev <= 0) {
      return res.status(400).json({ message: "Invalid leverage" });
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
        type: String(type).toLowerCase(),
        lot_size: lot,
        units,
        leverage: lev,
        margin,
        open_price,
      },
      client
    );

    const updatedBalance = currentBalance - margin;

    await client.query("COMMIT");

    return res.json({
      success: true,
      order,
      balance: updatedBalance,
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

    return res.json({ orders });
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
      order: closedOrder,
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