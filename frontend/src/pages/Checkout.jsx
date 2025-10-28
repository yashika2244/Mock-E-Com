import { useState, useEffect } from "react";
import { api } from "../api";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReceiptModal from "../components/ReceiptModal";

export default function Checkout({ setCartCount }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //  Fetch cart
  useEffect(() => {
    api
      .get("/cart")
      .then((res) => setCart(res.data))
      .catch(() => toast.error("Failed to load cart"));
  }, []);

  //  Checkout handler
  const checkout = async () => {
    if (!name.trim() || !email.trim()) return toast.error("Enter name & email");
    if (cart.items.length === 0) return toast.error("Cart is empty");
    if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Enter a valid email");

    setLoading(true);
    try {
      const res = await api.post("/checkout", {
        name,
        email,
        cartItems: cart.items.map((i) => ({
          name: i.productId.name,
          price: i.productId.price,
          quantity: i.quantity,
        })),
      });

      //  Clear cart + inputs + navbar count
      await api.delete("/cart/clear");
      setCart({ items: [], total: 0 });
      setCartCount(0);
      setName("");
      setEmail("");
      setReceipt(res.data);

      toast.success("Order placed successfully");
    } catch (err) {
      toast.error("Checkout failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center py-20 px-4 bg-gradient-to-br from-gray-100 via-white to-gray-50">
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-8 relative">
        {/* Back Button */}
        <div className="mb-2">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-gray-700 hover:text-black transition font-medium"
          >
            <ArrowLeft size={18} />
            Back to Cart
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">
            Checkout
          </h1>
          <p className="text-gray-500 text-sm">
            Confirm your details and complete your order
          </p>
        </div>

        {/* Customer Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:outline-none transition"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:outline-none transition"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 shadow-inner mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Order Summary
          </h2>

          {cart.items.length === 0 ? (
            <p className="text-gray-500 text-sm">Your cart is empty.</p>
          ) : (
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div
                  key={item.productId._id}
                  className="flex justify-between text-gray-700 text-sm border-b border-gray-100 pb-2"
                >
                  <span>
                    {item.productId.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ₹{item.productId.price * item.quantity}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-300 pt-4 flex justify-between text-xl font-semibold text-gray-900">
                <span>Total</span>
                <span>₹{cart.total}</span>
              </div>
            </div>
          )}
        </div>

        {/* Place Order */}
        <button
          disabled={loading}
          onClick={checkout}
          className={`w-full py-3 rounded-xl text-lg font-medium shadow-md transition-all duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-black text-white hover:bg-gray-800 active:scale-95"
          }`}
        >
          {loading ? "Processing..." : "Place Order"}
        </button>

        {/* Receipt Modal */}
        {receipt && (
          <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
        )}
      </div>
    </div>
  );
}
