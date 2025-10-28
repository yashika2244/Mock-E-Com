import { useState, useEffect } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";
import { Trash, Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";
import { useProducts } from "../context/ProductsContext"; 

export default function Cart({ removeFromCartUI }) {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const { products } = useProducts(); 

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      toast.error("Failed to fetch cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (id, quantity) => {
    try {
      await api.delete(`/cart/${id}`);
      await fetchCart();
      if (removeFromCartUI) removeFromCartUI(quantity);
      toast.success("Removed from cart 🗑️");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const updateQty = async (productId, newQty) => {
    try {
      await api.put(`/cart/${productId}`, { qty: newQty });
      await fetchCart();
      toast.success("Quantity updated");
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  // Calculate totals safely
  const totalWithoutDiscount = cart.items.reduce((sum, item) => {
    const product = products.find((p) => p._id === item.productId._id) || item.productId;
    const price = product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const totalDiscount = cart.items.reduce((sum, item) => {
    const product = products.find((p) => p._id === item.productId._id) || item.productId;
    const price = product?.price || 0;
    const discount = product?.discount || 0;
    return sum + (price * discount * item.quantity) / 100;
  }, 0);

  const totalWithDiscount = totalWithoutDiscount - totalDiscount;

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="md:mx-10 bg-white shadow-xl flex flex-col md:flex-row overflow-y-auto max-h-[85vh] rounded-2xl">

        {/* LEFT SIDE — CART ITEMS */}
        <div
          className={`w-full p-8 flex flex-col ${
            cart.items.length > 0
              ? "md:w-2/3 border-r border-gray-200"
              : "items-center justify-center"
          }`}
        >
          <div className="flex items-center justify-between mb-6 shrink-0 w-full">
            <h1 className="text-2xl font-semibold text-gray-900">
              Shopping Cart
            </h1>
            <p className="text-sm text-gray-500">{cart.items.length} items</p>
          </div>

          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center flex-1">
              <img
                src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
                alt="Empty Cart"
                className="w-24 h-24 opacity-80 mb-5"
              />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-500 mb-6 text-sm max-w-sm">
                Looks like you haven’t added anything yet. Start shopping now!
              </p>
              <Link
                to="/"
                className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2 space-y-5 scrollbar-thin scrollbar-thumb-gray-300">
              {cart.items.map((item) => {
                const product =
                  products.find((p) => p._id === item.productId._id) ||
                  item.productId;
                const finalPrice =
                  product.price -
                  (product.price * (product.discount || 0)) / 100;

                return (
                  <div
                    key={product._id}
                    className="flex items-center justify-between bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          product.image || "https://via.placeholder.com/80"
                        }
                        alt={product.name}
                        className="w-20 h-20 object-contain rounded-xl bg-white shadow-sm border border-gray-100"
                      />
                      <div>
                        <h2 className="font-semibold text-gray-900 text-[16px]">
                          {product.name}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                          ₹{product.price}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() =>
                              updateQty(product._id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-200 disabled:opacity-40"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-medium text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQty(product._id, item.quantity + 1)
                            }
                            className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-200"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ₹{(finalPrice * item.quantity).toFixed(0)}
                      </p>
                      {product.discount > 0 && (
                        <p className="text-sm text-green-600 font-medium">
                          {product.discount}% OFF
                        </p>
                      )}
                      <button
                        onClick={() => removeItem(product._id, item.quantity)}
                        className="text-red-500 hover:text-red-600 text-sm mt-1 flex items-center gap-1 justify-end"
                      >
                        <Trash className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT SIDE — SUMMARY */}
        {cart.items.length > 0 && (
          <div className="w-full md:w-1/3 bg-gray-50 p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-5">
                Summary
              </h2>
              <div className="space-y-3 text-gray-700 text-sm">
                <div className="flex justify-between">
                  <span>Items ({cart.items.length})</span>
                  <span>₹{totalWithoutDiscount.toFixed(0)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>- ₹{totalDiscount.toFixed(0)}</span>
                </div>
              </div>

              <div className="border-t border-gray-300 mt-5 pt-4 flex justify-between text-lg font-semibold text-gray-900">
                <span>Total Price</span>
                <span>₹{totalWithDiscount.toFixed(0)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="mt-8 bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition text-center shadow-md"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
