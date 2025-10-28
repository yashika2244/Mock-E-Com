import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { api } from "./api";

export default function App() {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const res = await api.get("/cart");
      if (res.data && Array.isArray(res.data.items)) {
        setCartCount(res.data.items.length);
      }
    } catch (err) {
      console.error("Error fetching cart count:", err);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  const addToCartUI = () => {
    setCartCount((prev) => prev + 1);
  };

  const removeFromCartUI = (qty) => {
    setCartCount((prev) => Math.max(prev - qty, 0));
  };

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#000",
            color: "#fff",
            borderRadius: "10px",
            padding: "12px 16px",
            fontSize: "15px",
          },
        }}
      />
      <BrowserRouter>
        <Navbar cartCount={cartCount} />

        <Routes>
          <Route path="/" element={<Products addToCartUI={addToCartUI} />} />
          <Route
            path="/cart"
            element={<Cart removeFromCartUI={removeFromCartUI} />}
          />
          <Route
            path="/checkout"
            element={<Checkout setCartCount={setCartCount} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
