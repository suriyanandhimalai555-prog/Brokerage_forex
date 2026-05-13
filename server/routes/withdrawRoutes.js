import { Router } from "express";

import { protect } from "../middlewares/authMiddleware.js";

import {
  createWithdrawal,
  getMyWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  getAllWithdrawals,
} from "../controllers/withdrawController.js";

const router = Router();

router.post("/", protect, createWithdrawal);
router.get("/me", protect, getMyWithdrawals);
router.get("/", protect, getAllWithdrawals);
router.patch("/:id/approve", protect, approveWithdrawal);
router.patch("/:id/reject", protect, rejectWithdrawal);

export default router;