"use client";

import React, { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
  active: boolean;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("🔍 Fetching categories...");

        const response = await fetch("https://media.upfrica.com/api/categories/", {
          headers: { Accept: "application/json" },
        });

        if (!response.ok) throw new Error(`❌ API Error: ${response.status}`);

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("❌ API response is NOT JSON.");
        }

        const categoriesData = await response.json();
        if (!Array.isArray(categoriesData)) throw new Error("❌ API did not return an array.");

        setCategories(categoriesData);
      } catch (error: any) {
        console.error("❌ Error fetching categories:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p className="text-center text-xl">Loading categories...</p>;
  if (error) return <p className="text-center text-xl text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Categories</h1>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <li key={category.id} className="p-4 border rounded-lg shadow-md bg-white text-center">
            <a href={`/categories/${category.slug}`} className="text-lg font-semibold text-blue-600">
              {category.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesPage;