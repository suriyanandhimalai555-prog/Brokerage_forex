import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createDeposit,
  getDepositMethods,
  oxaPayDepositWebhook,
  getMyDeposits,
} from "../controllers/depositController.js";

const router = Router();

router.get("/methods", protect, getDepositMethods);
router.get("/me", protect, getMyDeposits);
router.post("/", protect, createDeposit);
router.post("/oxapay/webhook", oxaPayDepositWebhook);

export default router;