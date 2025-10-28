import React, { useState, useEffect } from "react";
import { api } from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import ReceiptModal from "../components/ReceiptModal";
import { useProducts } from "../context/ProductsContext";

export default function Checkout({ setCartCount }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const { products, setProducts, loading: productsLoading } = useProducts();
  const [cart, setCart] = useState({ items: [], total: 0 });

  useEffect(() => {
    api
      .get("/cart")
      .then((res) => setCart(res.data))
      .catch(() => toast.error("Failed to load cart"));
  }, []);

  const checkout = async () => {
    let valid = true;
    setNameError("");
    setEmailError("");

    if (!name.trim()) {
      setNameError("Please enter your full name");
      valid = false;
    }
    if (!email.trim()) {
      setEmailError("Please enter your email address");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      valid = false;
    }

    if (!valid) return; // stop checkout if invalid

    if (cart.items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/checkout", {
        name,
        email,
        cartItems: cart.items.map((i) => {
          const price = i.productId.price;
          const discount = i.productId.discount || 0;
          const discountedPrice = price - (price * discount) / 100;

          return {
            name: i.productId.name,
            price: discountedPrice,
            originalPrice: price,
            discount,
            quantity: i.quantity,
          };
        }),
      });

      await api.delete("/cart/clear");
      setCart({ items: [], total: 0 });
      setCartCount(0);
      setProducts([]);
      setName("");
      setEmail("");
      setReceipt(res.data);
      toast.success("Order placed successfully ");
    } catch (err) {
      toast.error("Checkout failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex justify-center items-center md:py-24 py-14 md:px-6 lg:px-10">
      <div className="w-full max-w-6xl bg-white/90 backdrop-blur-md rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 md:min-h-[80vh]">
        {/* LEFT SIDE — DETAILS */}
        <div className="w-full md:w-2/3 p-10 md:p-14 flex flex-col justify-between">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition font-medium mb-6"
          >
            <ArrowLeft size={18} />
            Back to Cart
          </button>

          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              Checkout
            </h1>
            <p className="text-gray-500 mb-10">
              Fill in your details below to complete your order.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Full Name
                </label>
                <input
                  className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition
      ${nameError ? "border-red-500 ring-1 ring-red-300" : "border-gray-300"}`}
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError("");
                  }}
                />
                {nameError && (
                  <p className="text-red-500 text-sm mt-1">{nameError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition
      ${emailError ? "border-red-500 ring-1 ring-red-300" : "border-gray-300"}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(""); // clear error on typing
                  }}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>
            </div>

            <button
              disabled={loading}
              onClick={checkout}
              className={`w-full md:w-auto px-10 py-3.5 rounded-xl text-lg font-medium shadow-md transition-all duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-gray-900 text-white hover:bg-gray-800 active:scale-95"
              }`}
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE — SUMMARY */}
        <div className="w-full md:w-1/3 bg-gray-50 border-l border-gray-200 p-8 md:p-10 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            {cart.items.length === 0 ? (
              <p className="text-gray-500 text-sm">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => {
                  const price = item.productId.price;
                  const disc = item.productId.discount || 0;
                  const discounted = price - (price * disc) / 100;

                  return (
                    <div
                      key={item.productId._id}
                      className="flex justify-between text-gray-700 text-sm border-b border-gray-100 pb-3"
                    >
                      <span className="truncate w-2/3">
                        {item.productId.name} × {item.quantity}
                      </span>

                      <span className="font-medium text-gray-900">
                        ₹{(discounted * item.quantity).toFixed(0)}
                        {disc > 0 && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ₹{(price * item.quantity).toFixed(0)}
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}

                <div className="border-t border-gray-300 pt-4 flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>
                    ₹
                    {cart.items
                      .reduce((sum, item) => {
                        const price = item.productId.price;
                        const disc = item.productId.discount || 0;
                        const discounted = price - (price * disc) / 100;
                        return sum + discounted * item.quantity;
                      }, 0)
                      .toFixed(0)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center mt-8">
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <Lock size={14} />
              <span>Secured & encrypted checkout</span>
            </div>
          </div>
        </div>

        {receipt && (
          <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
        )}
      </div>
    </div>
  );
}
