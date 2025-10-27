import { useState, useEffect } from "react";
import { api } from "../api";
import ReceiptModal from "../components/ReceiptModal";

export default function Checkout() {
  const [name, setName] = useState("");
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    api.get("/cart").then(res => setCart(res.data));
  }, []);

  const checkout = async () => {
    if (!name.trim()) return alert("Enter your name");
    if (cart.items.length === 0) return alert("Cart is empty");

const res = await api.post("/checkout", { 
  name,
  cartItems: cart.items.map(i => ({
    name: i.productId.name,
    price: i.productId.price,
    quantity: i.quantity
  }))
});

setReceipt(res.data);

    await api.delete("/cart/clear");
    setCart({ items: [], total: 0 });
  };

 return (
  <div className="min-h-screen  flex  justify-center px-4 py-10">
    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xlp-8">

      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Checkout 
      </h1>

      {/* Your Name Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Your Name
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none transition"
          placeholder="Enter your full name"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>

        {cart.items.length === 0 ? (
          <p className="text-gray-500 text-sm">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.productId._id} className="flex justify-between text-gray-700">
                <span>{item.productId.name} × {item.quantity}</span>
                <span className="font-medium">
                  ₹{item.productId.price * item.quantity}
                </span>
              </div>
            ))}

            <div className="border-t border-gray-300 pt-4 flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>₹{cart.total}</span>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Button */}
      <button
        onClick={checkout}
        className="w-full bg-black text-white py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 active:scale-95 transition"
      >
        Place Order →
      </button>

      {/* Receipt Modal */}
      {receipt && (
        <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
      )}
    </div>
  </div>
);

}
