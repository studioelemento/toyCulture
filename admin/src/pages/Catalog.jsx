import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tags, Package, ArrowRight, Layers, Award } from "lucide-react";

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setProducts(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Compute category distribution
  const categoryMap = {};
  const brandMap = {};

  products.forEach((p) => {
    const cat = p.category || "Uncategorized";
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;

    const b = p.brand || "Unbranded";
    brandMap[b] = (brandMap[b] || 0) + 1;
  });

  const categories = Object.entries(categoryMap).map(([name, count]) => ({
    name,
    count,
  }));

  const brands = Object.entries(brandMap).map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Tags className="w-6 h-6 text-indigo-400" />
          <span>Catalog & Brand Management</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Review active categories, manufacturer brands, and product distributions in PostgreSQL
        </p>
      </div>

      {/* ── Categories Section ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Product Categories ({categories.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl p-5 hover:border-indigo-500/40 transition-all flex items-center justify-between group"
            >
              <div>
                <div className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                  {cat.name}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {cat.count} product{cat.count === 1 ? "" : "s"} listed
                </div>
              </div>
              <Link
                to="/products"
                className="w-9 h-9 rounded-xl bg-[#121A2F] text-slate-400 group-hover:text-indigo-300 group-hover:bg-indigo-600/20 flex items-center justify-center transition-all"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ── Brands Section ── */}
      <div className="space-y-4 pt-4 border-t border-indigo-950/60">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" />
            <span>Toy Brands & Manufacturers ({brands.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((b) => (
            <div
              key={b.name}
              className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl p-5 hover:border-indigo-500/40 transition-all flex items-center justify-between group"
            >
              <div>
                <div className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                  {b.name}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {b.count} item{b.count === 1 ? "" : "s"} in stock
                </div>
              </div>
              <Link
                to="/products"
                className="w-9 h-9 rounded-xl bg-[#121A2F] text-slate-400 group-hover:text-indigo-300 group-hover:bg-indigo-600/20 flex items-center justify-center transition-all"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
