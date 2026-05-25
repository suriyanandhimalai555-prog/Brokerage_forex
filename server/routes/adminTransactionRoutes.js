import express from "express";
import { getAllTransactions } from "../controllers/adminTransactionController.js";

const router = express.Router();

router.get("/transactions", getAllTransactions);

export default router;