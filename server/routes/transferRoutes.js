import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createTransfer,
  getMyTransfers,
} from "../controllers/transferController.js";

const router = Router();

router.post("/", protect, createTransfer);
router.get("/me", protect, getMyTransfers);

export default router;