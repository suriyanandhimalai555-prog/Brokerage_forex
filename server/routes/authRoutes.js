import express from "express";
import {
  registerUser,
  loginUser,
  me,
  logoutUser,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, me);
router.post("/logout", logoutUser);

export default router;