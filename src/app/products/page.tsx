"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  price_cents: number;
  description: string;
  product_images: string[];
  slug: string;
  user?: {
    country_code?: string;
    city?: string;
  };
  condition?: {
    slug?: string;
  };
}

const STOP_WORDS = ["with", "and", "in", "for", "the", "on", "at", "a", "an", "of", "by"];

function generateSeoTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/\s+/)
    .filter((word) => word && !STOP_WORDS.includes(word))
    .slice(0, 5)
    .join("-")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("🔍 Fetching products...");
        const response = await fetch("https://media.upfrica.com/api/products/");
        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const data = await response.json();
        console.log("✅ API Response:", data);
        setProducts(data.results);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center text-xl">Loading products...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Products</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => {
            const country = product.user?.country_code?.toLowerCase() || "gh";
            const city = product.user?.city?.toLowerCase().replace(/\s+/g, "-") || "accra";
            const condition = product.condition?.slug?.toLowerCase() || "new";

            
            const seoSlug = `${product.slug}-${condition}-${city}`;
            const productHref = `/${country}/${seoSlug}`;

            return (
              <Link
                key={product.id}
                href={productHref}
                className="block border p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="relative w-full h-48 bg-gray-100 rounded-md">
                  {product.product_images?.length > 0 ? (
                    <Image
                      src={product.product_images[0]}
                      alt={product.title}
                      fill
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <Image
                      src="https://via.placeholder.com/300"
                      alt="No image available"
                      fill
                      className="rounded-md object-cover"
                    />
                  )}
                </div>
                <h2 className="text-sm font-medium mt-2">{product.title}</h2>
                <p className="text-lg font-bold text-green-600">
                  ${product.price_cents / 100}
                </p>
              </Link>
            );
          })
        ) : (
          <p className="text-center col-span-full text-gray-500">No products available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;