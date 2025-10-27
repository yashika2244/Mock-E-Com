import { api } from "../api";
import toast from "react-hot-toast";
import { Heart } from "lucide-react"; // ✅ npm install lucide-react

export default function ProductCard({ product, addToCartUI }) {
  const addToCart = async () => {
    try {
      await api.post("/cart", { productId: product._id, qty: 1 });
      addToCartUI();
      toast.success("Added to cart 🛒");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">

      {/* Wishlist Heart Icon */}
      <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur hover:bg-white shadow-sm transition">
        <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition" />
      </button>

      {/* Product Image */}
      <div className="h-48  flex items-center justify-center overflow-hidden">
        <img
          src={product.image || "https://via.placeholder.com/300x300"}
          alt={product.name}
          className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{product.name}</h3>

        <p className="text-gray-500 text-sm mt-1 mb-4">Premium Quality Product</p>

        <p className="text-xl font-semibold text-gray-900 mb-5">₹{product.price}</p>

        <button
          onClick={addToCart}
          className="w-full bg-black text-white py-2.5 text-sm tracking-wide rounded-lg font-medium hover:bg-gray-800 active:scale-95 transition-all"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
