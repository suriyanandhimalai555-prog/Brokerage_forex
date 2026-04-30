import express from "express";
import { getLivePrice } from "../controllers/marketController.js";

const router = express.Router();

router.get("/price/:symbol", getLivePrice);

export default router;