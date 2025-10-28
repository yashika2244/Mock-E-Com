import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne().populate("items.productId");
    if (!cart) cart = await Cart.create({ items: [] });

    const total = cart.items.reduce(
      (sum, i) => sum + i.productId.price * i.quantity,
      0
    );

    res.json({ items: cart.items, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    let cart = await Cart.findOne();
    if (!cart) cart = await Cart.create({ items: [] });

    const item = cart.items.find((i) => i.productId.toString() === productId);

    if (item) item.quantity += qty;
    else cart.items.push({ productId, quantity: qty });

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Cart.findOne();
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.productId.toString() !== id);

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartQty = async (req, res) => {
  try {
    const { id } = req.params; // productId
    const { qty } = req.body; // new quantity

    let cart = await Cart.findOne();
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.productId.toString() === id);

    if (!item)
      return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = qty;

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
