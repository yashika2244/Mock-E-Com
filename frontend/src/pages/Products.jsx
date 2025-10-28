import { useEffect, useState } from "react";
import { api } from "../api";
import ProductCard from "../components/ProductCard";

export default function Products({ addToCartUI }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false); 
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="relative   bg-gradient-to-b from-indigo-50 via-white to-indigo-100 py-20 px-6 overflow-hidden">
      {/* Decorative blurred accents */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-300 rounded-full blur-3xl opacity-30 -z-10" />
      <div className="absolute bottom-10 right-0 w-72 h-72 bg-violet-300 rounded-full blur-3xl opacity-30 -z-10" />

      {/* Header */}
      <div className="text-center mb-8 mt-4">
        <h2 className="text-4xl font-bold text-gray-800 tracking-tight drop-shadow-sm">
          Our <span className="text-indigo-600">Featured</span> Products
        </h2>
        <p className="text-gray-600 mt-3 max-w-md mx-auto">
          Discover top picks from our collection — crafted with quality and style.
        </p>
      </div>

      {/* Content */}
      {loading ? (
        //  Spinner loader
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : products.length > 0 ? (
        //  Products grid
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 px-2">
          {products.map((p) => (
            <div key={p._id} className="transition transform duration-300">
              <ProductCard product={p} addToCartUI={addToCartUI} />
            </div>
          ))}
        </div>
      ) : (
        //  No products message
        <div className="flex flex-col items-center justify-center text-center mt-10">
          <img
            src="https://illustrations.popsy.co/gray/shopping-bag.svg"
            alt="No products"
            className="w-48 mb-6 opacity-70"
          />
          <p className="text-gray-500 text-lg">No products available right now.</p>
        </div>
      )}
    </section>
  );
}
