import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  PlusCircle,
  Search,
  Trash2,
  Eye,
  RefreshCw,
  ExternalLink,
  Filter,
} from "lucide-react";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/products");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from PostgreSQL database?`)) return;

    try {
      const res = await fetch(`/api/v1/admin/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete product.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Unique categories for filtering
  const categories = ["ALL", ...new Set(products.map((p) => p.category).filter(Boolean))];

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === "ALL" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Package className="w-6 h-6 text-indigo-400" />
            <span>Product Catalog</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Total {products.length} products stored in PostgreSQL database
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchProducts}
            title="Refresh product list"
            className="p-2.5 bg-[#0E1526] hover:bg-slate-800 border border-indigo-950 text-slate-300 rounded-xl transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-400" : ""}`} />
          </button>

          <Link
            to="/products/new"
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* ── Filters & Search Toolbar ── */}
      <div className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search toy by name, brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121A2F] border border-indigo-950 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#121A2F] border border-indigo-950 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 cursor-pointer w-full sm:w-auto"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-[#0E1526]">
                {cat === "ALL" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Products Table ── */}
      <div className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-sm">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-3"></div>
            <p>Loading products from PostgreSQL...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-white font-bold text-base">No products match your query</p>
            <p className="text-slate-500 text-xs mt-1">
              {searchTerm || selectedCategory !== "ALL"
                ? "Try adjusting your search filters."
                : "No toys found in the database. Add your first product to get started!"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#121A2F]/60 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-indigo-950/40">
                <tr>
                  <th className="py-3.5 px-6">Product Details</th>
                  <th className="py-3.5 px-4">Brand</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Selling Price</th>
                  <th className="py-3.5 px-4">MRP</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-950/30">
                {filteredProducts.map((p) => {
                  const fallback =
                    "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=600";
                  const img =
                    p.image || (Array.isArray(p.images) && p.images[0]) || fallback;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-indigo-950/20 transition-colors group"
                    >
                      {/* Product details */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={img}
                            alt={p.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = fallback;
                            }}
                            className="w-12 h-12 rounded-xl object-contain bg-[#16213E] p-1 border border-indigo-950 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="font-bold text-white text-sm truncate group-hover:text-indigo-300 transition-colors">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate line-clamp-1">
                              {p.small_description || p.description || p.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Brand */}
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-300">
                        {p.brand || "—"}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-xs">
                        <div className="flex flex-col gap-0.5">
                          <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg font-medium text-[11px] w-fit">
                            {p.category || "General"}
                          </span>
                          {p.parentCategory && (
                            <span className="text-[10px] text-slate-500 px-1">
                              under {p.parentCategory}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Selling Price */}
                      <td className="py-3.5 px-4 text-xs font-black text-white text-sm">
                        ₹{(p.sellingPrice || p.price || 0).toLocaleString()}
                      </td>

                      {/* MRP */}
                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        {p.originalPrice || p.mrp ? `₹${(p.originalPrice || p.mrp).toLocaleString()}` : "—"}
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-4 text-xs">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                            (p.stockQTY || p.stock || 0) > 10
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : (p.stockQTY || p.stock || 0) > 0
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {p.stockQTY || p.stock || 0} units
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`http://localhost:5173/product/${p.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View on Customer Storefront"
                            className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-indigo-950/50 rounded-lg transition-colors inline-flex items-center gap-1 text-xs"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="hidden md:inline">View</span>
                          </a>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            title="Delete Product"
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 rounded-lg transition-colors inline-flex items-center gap-1 text-xs"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden md:inline">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
