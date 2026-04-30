import express from "express";
import {
  placeOrder,
  getOrders,
  closeOrder,
} from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/", protect, getOrders);
router.patch("/:id/close", protect, closeOrder);

export default router;