"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  price_cents: number;
  product_images: string[];
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://media.upfrica.com/api/products/");
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setProducts(data.results); // ✅ Get `results[]` from API
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center text-xl">Loading products...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Products</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`} className="block border p-2 rounded-lg hover:shadow-md transition">
            <div>
              <Image
                src={product.product_images.length > 0 ? product.product_images[0] : "/placeholder.jpg"} // ✅ Use first image or placeholder
                alt={product.title}
                width={200}
                height={200}
                className="w-full h-40 object-cover rounded-md"
              />
              <h2 className="text-sm font-medium mt-2">{product.title}</h2>
              <p className="text-lg font-bold text-green-600">${(product.price_cents / 100).toFixed(2)}</p> {/* ✅ Convert cents to dollars */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;