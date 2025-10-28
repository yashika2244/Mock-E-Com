import { Link, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

export default function Navbar({ cartCount }) {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="md:px-20 px-10 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-semibold text-gray-900 tracking-tight hover:opacity-80 transition"
        >
          Mock<span className="text-indigo-600">Store</span>
        </Link>

        {/* Cart Button */}
        <Link
          to="/cart"
          className="relative flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full font-medium hover:bg-gray-800 transition-all duration-200 active:scale-95"
        >
          <ShoppingCart size={20} />
          <span>Cart</span>

          {/*  Badge */}
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 text-[11px] font-semibold bg-red-600 text-white px-2 py-[2px] rounded-full shadow-md ">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
