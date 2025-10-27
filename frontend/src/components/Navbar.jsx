import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

export default function Navbar({ cartCount }) {
  return (
    <header className="bg-brand text-black shadow-md">
      <div className="px-5 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-semibold tracking-wide hover:opacity-90 transition"
        >
          Mock E-Com
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          className="relative flex items-center gap-2 bg-white text-brand px-4 py-2 rounded-full font-medium hover:bg-opacity-90 transition"
        >
          <ShoppingCart size={20} />
          <span>Cart</span>

          {/* Badge */}
          <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white px-2 py-1 rounded-full">
            {cartCount}
          </span>
        </Link>
      </div>
    </header>
  );
}
