import { Router } from "express";

import {
  archiveAccount,
  createAccount,
  getAccountPlans,
  listMyAccounts,
  restoreAccount,
  setActiveAccount,
  getPerformanceStats
} from "../controllers/accountController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/plans", protect, getAccountPlans);
router.get("/me", protect, listMyAccounts);
router.post("/", protect, createAccount);
router.patch("/:id/archive", protect, archiveAccount);
router.patch("/:id/restore", protect, restoreAccount);
router.patch("/active/:id", protect, setActiveAccount);
router.get("/performance", protect, getPerformanceStats);

export default router;