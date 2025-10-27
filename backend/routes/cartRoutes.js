import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQty,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", getCart);
router.post("/", addToCart);
router.delete("/:id", removeFromCart);
router.put("/:id", updateCartQty);
export default router;
