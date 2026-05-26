import express from "express";
import {
  placeOrder,
  getOrders,
  closeOrder,
  getAllOrdersAdmin,
  getOpenOrdersAdmin,
  getClosedOrdersAdmin,
  updateOrderProtection,
} from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/", protect, getOrders);
router.get("/admin/all", protect, getAllOrdersAdmin);
router.get("/admin/open", protect, getOpenOrdersAdmin);
router.get("/admin/closed",  protect, getClosedOrdersAdmin);
router.patch("/:id/close", protect, closeOrder);
router.put("/:id/protection", protect, updateOrderProtection);

export default router;