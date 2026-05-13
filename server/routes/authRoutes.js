import express from "express";
import {
  registerUser,
  loginUser,
  me,
  logoutUser,
  getAllUsers,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, me);
router.put("/profile", protect, updateProfile);
router.post("/logout", logoutUser);
router.get("/admin/users", protect, getAllUsers);

export default router;