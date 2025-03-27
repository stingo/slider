"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProductSlider from "@/components/ProductSlider";

interface Product {
  id: number;
  title: string;
  price_cents: number;
  description: string;
  product_images: string[];
  slug: string;
}

const ProductDetailsPage = () => {
  const params = useParams();
  const country = params?.country?.toString() || "";
  const productSeo = params?.seo?.toString() || "";

  // ✅ Extract slug, condition, city
  const parts = productSeo.split("-");
  const city = parts.at(-1) || "";
  const conditionParts = parts.slice(-3, -1);
  const condition = conditionParts.join("-");
  const slug = parts.slice(0, -conditionParts.length - 1).join("-");

  console.log("✅ Extracted:", { slug, condition, city });

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchProductDetails = async () => {
      try {
        console.log(`🔍 Fetching product details for slug: ${slug}`);
        const response = await fetch(`https://media.upfrica.com/api/products/${slug}/`);
        if (!response.ok) throw new Error("❌ Failed to fetch product by slug");

        const data = await response.json();
        console.log("🖼️ Full Product Details:", data);
        setProduct(data);
      } catch (error) {
        console.error("❌ Error fetching product details:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [slug]);

  if (loading) return <p className="text-center text-xl">Loading product details...</p>;
  if (!product) return <p className="text-center text-xl text-red-500">Product not found.</p>;

  const productURL = `https://upfrica.com/products/${product.slug}`;
  const productPrice = `$${(product.price_cents / 100).toFixed(2)}`;

  const buyerMessage = encodeURIComponent(`
🔹 *${product.title}*  
💰 Price: *${productPrice}*  
📎 View product: ${productURL}

Hello! I’m interested in this product. Can you share more details?
  `);

  const sellerMessage = encodeURIComponent(`
🛒 *New Customer Interest!*  
📦 Product: *${product.title}*  
💰 Price: *${productPrice}*  
📎 View product: ${productURL}

A buyer is interested in this product. Please respond to their inquiry!
  `);

  const buyerWhatsApp = `https://api.whatsapp.com/send?phone=+447593537599&text=${buyerMessage}`;
  const sellerWhatsApp = `https://api.whatsapp.com/send?phone=+233554248805&text=${sellerMessage}`;

  const handleWhatsAppClick = async (type: string) => {
    try {
      await fetch("/api/log-whatsapp-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          sellerId: "123456",
          buyerPhone: "233554248805",
          page: "Product Page",
          type,
        }),
      });
    } catch (error) {
      console.error("Error logging WhatsApp click:", error);
    }
  };

  const sendWhatsAppAPI = async () => {
    try {
      const response = await fetch("/api/send-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: "233554248805",
          message: `Hello! I'm interested in ${product.title} priced at ${productPrice}.`,
          imageUrl: product.product_images[0],
        }),
      });

      const result = await response.json();
      console.log("📩 WhatsApp API Response:", result);
    } catch (error) {
      console.error("❌ WhatsApp API Error:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-4">{product.title}</h1>
      <ProductSlider images={product.product_images} />

      <p className="text-lg text-gray-700 mt-4">
        {product.description || "No description available."}
      </p>
      <p className="text-xl font-semibold text-green-600 mt-2">{productPrice}</p>

      <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center">
        <a
          href={buyerWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white py-2 px-4 rounded text-center flex items-center space-x-2"
          onClick={() => handleWhatsAppClick("buyer")}
        >
          <span>📲 Contact Seller on WhatsApp</span>
        </a>

        <a
          href={sellerWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white py-2 px-4 rounded text-center flex items-center space-x-2"
          onClick={() => handleWhatsAppClick("seller")}
        >
          <span>📩 Notify Seller on WhatsApp</span>
        </a>

        <button
          onClick={sendWhatsAppAPI}
          className="bg-green-600 text-white py-2 px-4 rounded text-center"
        >
          📲 Send via Upfrica SocialShop API
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsPage;