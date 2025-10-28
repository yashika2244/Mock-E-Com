import { useState, useEffect } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";
import { Trash, Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";

export default function Cart({ removeFromCartUI }) {
  const [cart, setCart] = useState({ items: [], total: 0 });

  const fetchCart = async () => {
    const res = await api.get("/cart");
    setCart(res.data);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (id, quantity) => {
    await api.delete(`/cart/${id}`);
    await fetchCart();
    removeFromCartUI(quantity);
    toast.success("Removed from cart 🗑️");
  };

  const updateQty = async (productId, newQty) => {
    await api.put(`/cart/${productId}`, { qty: newQty });
    fetchCart();
    toast.success("Quantity updated ");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto py-20">
      <h1 className="text-2xl font-semibold mb-6 text-center ">Your Cart 🛒</h1>

      {/* Empty State */}
      {cart.items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-inner border border-gray-200">
          <div className="bg-white p-6 rounded-full shadow-sm border border-gray-100 mb-5">
            <img
              src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
              alt="Empty Cart"
              className="w-16 h-16 opacity-80"
            />
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-6 text-sm max-w-sm text-center">
            Looks like you haven’t added anything to your cart yet. Start
            exploring our products and add your favorites!
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition active:scale-95"
          >
            Continue Shopping
          </Link>
        </div>
      )}

      {/* Cart List */}
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.productId._id}
            className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition"
          >
            {/* Product Image */}
            <img
              src={item.productId.image || "https://via.placeholder.com/80"}
              alt={item.productId.name}
              className="w-20 h-20 object-contain rounded-md bg-gray-50"
            />

            {/* Info */}
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900 text-[17px]">
                {item.productId.name}
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                ₹{item.productId.price} each
              </p>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() =>
                    updateQty(item.productId._id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                  className="p-1.5 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="font-medium">{item.quantity}</span>

                <button
                  onClick={() =>
                    updateQty(item.productId._id, item.quantity + 1)
                  }
                  className="p-1.5 rounded border border-gray-300 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Remove */}
            <button
              onClick={() => removeItem(item.productId._id, item.quantity)}
              className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
            >
              <Trash className="w-5 h-5" />
            </button>

            {/* Price */}
            <p className="font-semibold text-gray-900 text-lg">
              ₹{item.productId.price * item.quantity}
            </p>
          </div>
        ))}
      </div>

      {/* Total + Checkout */}
      {cart.items.length > 0 && (
        <div className="mt-8 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between text-lg font-semibold text-gray-900">
            <span>Total</span>
            <span>₹{cart.total}</span>
          </div>

          <Link
            to="/checkout"
            className="mt-5 block text-center bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Proceed to Checkout →
          </Link>
        </div>
      )}
    </div>
  );
}
