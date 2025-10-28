import { useEffect, useState } from "react";
import { api } from "../api";
import ProductCard from "../components/ProductCard";

export default function Products({ addToCartUI }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <section className="px-6 py-20">
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
        Products
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} addToCartUI={addToCartUI} />
        ))}
      </div>
    </section>
  );
}
