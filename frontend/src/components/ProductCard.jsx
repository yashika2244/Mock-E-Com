import { api } from "../api";
import toast from "react-hot-toast";
import { Heart } from "lucide-react";
import { useProducts } from "../context/ProductsContext"; 

export default function ProductCard({ product, addToCartUI }) {
  const { products, setProducts } = useProducts(); 
  const addToCart = async () => {
    try {
      await api.post("/cart", { productId: product._id, qty: 1 });
      if (addToCartUI) addToCartUI(); 
      toast.success("Added to cart", { icon: "✅" });
    } catch {
      toast.error("Something went wrong");
    }
  };

  // Calculate after discount price
  const finalPrice = product.discount
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : product.price;

  return (
    <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
      {/*  Heart Button */}
      <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur hover:bg-white shadow-sm transition">
        <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition" />
      </button>

      {/* Discount Badge */}
      {product.discount && (
        <span className="absolute left-0 top-0 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-br-lg shadow">
          {product.discount}% OFF
        </span>
      )}

      <div className="h-48 flex items-center justify-center overflow-hidden">
        <img
          src={product.image || "https://via.placeholder.com/300x300"}
          alt={product.name}
          className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
          {product.name}
        </h3>

        <p className="text-gray-500 text-sm mt-1 mb-4">
          Premium Quality Product
        </p>

        {/* Price Section */}
        <div className="mb-5">
          <span className="text-xl font-bold text-gray-900">₹{finalPrice}</span>
          {product.discount && (
            <>
              <span className="text-sm text-gray-500 line-through ml-2">
                ₹{product.price}
              </span>
              <p className="text-green-600 text-xs font-semibold mt-1">
                You save ₹{product.price - finalPrice} today!
              </p>
            </>
          )}
        </div>

        <button
          onClick={addToCart}
          className="w-full bg-black cursor-pointer text-white py-2.5 text-sm tracking-wide rounded-lg font-medium hover:bg-gray-800 active:scale-95 transition-all"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
