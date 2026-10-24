import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Layers,
  TrendingUp,
  AlertTriangle,
  PlusCircle,
  ExternalLink,
  Trash2,
  Eye,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/v1/products");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/v1/admin/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      alert("Failed to delete product: " + err.message);
    }
  };

  // Stats calculations
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + (p.stockQTY || p.stock || 0), 0);
  const categoriesCount = new Set(products.map((p) => p.category).filter(Boolean)).size;
  const lowStockCount = products.filter((p) => (p.stockQTY || p.stock || 0) < 10).length;

  return (
    <div className="space-y-8">
      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900/80 border border-indigo-500/20 p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ToyCulture Executive Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Inventory & Catalog Overview
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Manage your toy catalog, review live inventory levels, and push new arrivals directly to PostgreSQL.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/products/new"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Toy</span>
            </Link>
            <Link
              to="/products"
              className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
            >
              <span>Manage Products</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── KPI Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Products */}
        <div className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl p-5 hover:border-indigo-500/30 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Products
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3">
            {loading ? "..." : totalProducts}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="text-emerald-400 font-semibold">Active in DB</span>
            <span>• PostgreSQL</span>
          </div>
        </div>

        {/* Card 2: Total Units in Stock */}
        <div className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl p-5 hover:border-indigo-500/30 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Inventory
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3">
            {loading ? "..." : totalStock.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">Available toy units</div>
        </div>

        {/* Card 3: Categories Covered */}
        <div className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl p-5 hover:border-indigo-500/30 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Categories
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3">
            {loading ? "..." : categoriesCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">Active toy classifications</div>
        </div>

        {/* Card 4: Low Stock Alert */}
        <div className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl p-5 hover:border-amber-500/30 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Low Stock Items
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3">
            {loading ? "..." : lowStockCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">Under 10 units remaining</div>
        </div>
      </div>

      {/* ── Recent Products Table ── */}
      <div className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 sm:p-6 border-b border-indigo-950/60 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Recently Added Toys
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live records from PostgreSQL database
            </p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Loading products from database...
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-3">🧸</div>
            <p className="text-slate-300 font-bold">No products found in database</p>
            <p className="text-slate-500 text-xs mt-1">
              Add your first toy to see it here and in the online store.
            </p>
            <Link
              to="/products/new"
              className="inline-flex items-center gap-2 mt-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Product</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#121A2F]/60 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-indigo-950/40">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Product</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price / MRP</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-950/30">
                {products.slice(0, 5).map((p) => {
                  const fallback = "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=600";
                  const img = p.image || (Array.isArray(p.images) && p.images[0]) || fallback;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-indigo-950/20 transition-colors group"
                    >
                      {/* Product Thumbnail & Name */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt={p.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = fallback;
                            }}
                            className="w-11 h-11 rounded-xl object-contain bg-[#16213E] p-1 border border-indigo-950"
                          />
                          <div className="min-w-0 max-w-[220px]">
                            <div className="font-bold text-white text-sm truncate group-hover:text-indigo-300 transition-colors">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              ID: {p.id.slice(0, 8)}...
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
                        <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg font-medium text-[11px]">
                          {p.category || "General"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 text-xs">
                        <div className="font-bold text-white text-sm">
                          ₹{(p.sellingPrice || p.price || 0).toLocaleString()}
                        </div>
                        {p.originalPrice && p.originalPrice > (p.sellingPrice || p.price) && (
                          <div className="text-[11px] text-slate-500 line-through">
                            ₹{p.originalPrice.toLocaleString()}
                          </div>
                        )}
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
                          {p.stockQTY || p.stock || 0} in stock
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`http://localhost:5173/product/${p.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View in Customer Store"
                            className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-indigo-950/50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            title="Delete Product"
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
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
