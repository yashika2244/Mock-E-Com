import Cart from "../models/cartModel.js";

export const checkout = async (req, res) => {
  try {
    const { name, email, cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const receipt = {
      name,
      email,
      items: cartItems.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        originalPrice: i.originalPrice,
        discount: i.discount,
      })),
      total,
      timestamp: new Date(),
    };

   
    const cart = await Cart.findOne();
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json(receipt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne();
    if (!cart) return res.json({ message: "Cart already empty" });

    cart.items = [];
    await cart.save();

    res.json({ message: "Cart Cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
