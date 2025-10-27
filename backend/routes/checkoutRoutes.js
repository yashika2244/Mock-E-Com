import express from "express";
import { checkout, clearCart } from "../controllers/checkoutController.js";

const router = express.Router();

router.post("/", checkout);
router.delete("/cart/clear", clearCart);
export default router;
