import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  PlusCircle,
  ArrowRight,
  Sparkles,
  RefreshCw,
} from "lucide-react";

// ── API base ────────────────────────────────────────────────────────────────
const API_BASE = "/api";

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, subLabel, loading }) {
  const colorMap = {
    indigo:  { bg: "bg-indigo-500/10", text: "text-indigo-400" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
    purple:  { bg: "bg-purple-500/10",  text: "text-purple-400" },
    amber:   { bg: "bg-amber-500/10",   text: "text-amber-400" },
    rose:    { bg: "bg-rose-500/10",    text: "text-rose-400" },
    blue:    { bg: "bg-blue-500/10",    text: "text-blue-400" },
  };
  const c = colorMap[color] ?? colorMap.indigo;

  return (
    <div className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl p-5 hover:border-indigo-500/30 transition-all shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</span>
        <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-3xl font-black text-white mt-3">
        {loading ? "..." : value}
      </div>
      {subLabel && (
        <div className="text-xs text-slate-500 mt-1">{subLabel}</div>
      )}
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [summary,  setSummary]  = useState(null);
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, prodRes] = await Promise.all([
        fetch(`${API_BASE}/admin/dashboard`),
        fetch(`${API_BASE}/v1/products`),
      ]);

      if (dashRes.ok) {
        const dash = await dashRes.json();
        setSummary(dash.data?.summary ?? null);
      }

      if (prodRes.ok) {
        const prod = await prodRes.json();
        if (prod.success && Array.isArray(prod.data)) setProducts(prod.data);
      }
    } catch (err) {
      setError("Failed to load dashboard data. Check your server connection.");
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Fallback KPIs from products list if dashboard API not available
  const totalProducts  = summary?.total_products   ?? products.length;
  const totalStock     = summary?.total_units       ?? products.reduce((a, p) => a + (p.stockQTY || p.stock || 0), 0);
  const lowStockCount  = summary?.low_stock_count   ?? products.filter((p) => (p.stockQTY || p.stock || 0) < 10).length;
  const totalOrders    = summary?.total_orders      ?? 0;
  const totalUsers     = summary?.total_users       ?? 0;
  const totalRevenue   = summary?.total_revenue     ?? 0;

  return (
    <div className="space-y-8">

      {/* ── Welcome Banner ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900/80 border border-indigo-500/20 p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ToyCulture Executive Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Inventory &amp; Catalog Overview
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Manage your toy catalog, review live inventory levels, and push new arrivals directly to PostgreSQL.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              title="Refresh"
              className="p-2.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-300 rounded-xl transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-400" : ""}`} />
            </button>
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

      {/* ── Error Banner ───────────────────────────────────────────────────── */}
      {error && (
        <div className="bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs px-4 py-3 rounded-xl">
          ⚠️ {error}
        </div>
      )}

      {/* ── KPI Metric Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Total Products"  value={totalProducts}  icon={Package}     color="indigo"  subLabel="Active in DB"         loading={loading} />
        <StatCard label="Total Inventory" value={totalStock.toLocaleString()} icon={TrendingUp} color="emerald" subLabel="Available units"     loading={loading} />
        <StatCard label="Low Stock"       value={lowStockCount}  icon={AlertTriangle} color="amber" subLabel="Under 10 units"        loading={loading} />
        <StatCard label="Total Orders"    value={totalOrders}    icon={ShoppingBag} color="purple"  subLabel="All time"              loading={loading} />
        <StatCard label="Total Users"     value={totalUsers}     icon={Users}       color="blue"    subLabel="Registered customers"  loading={loading} />
        <StatCard label="Revenue (₹)"     value={`₹${totalRevenue.toLocaleString()}`} icon={DollarSign} color="rose" subLabel="Paid orders only" loading={loading} />
      </div>

      {/* ── Recent Products Table ──────────────────────────────────────────── */}
      <div className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 sm:p-6 border-b border-indigo-950/60 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Recently Added Toys</h2>
            <p className="text-xs text-slate-400 mt-0.5">Live records from PostgreSQL database</p>
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
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-3" />
            <p>Loading products from database...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-3">🧸</div>
            <p className="text-slate-300 font-bold">No products found in database</p>
            <p className="text-slate-500 text-xs mt-1">Add your first toy to see it here.</p>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-950/30">
                {products.slice(0, 8).map((p) => {
                  const fallback = "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=600";
                  const img = p.image || (Array.isArray(p.images) && p.images[0]) || fallback;
                  const stock = p.stockQTY ?? p.stock ?? 0;

                  return (
                    <tr key={p.id} className="hover:bg-indigo-950/20 transition-colors group">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt={p.name}
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallback; }}
                            className="w-11 h-11 rounded-xl object-contain bg-[#16213E] p-1 border border-indigo-950"
                          />
                          <div className="min-w-0 max-w-[220px]">
                            <div className="font-bold text-white text-sm truncate group-hover:text-indigo-300 transition-colors">{p.name}</div>
                            <div className="text-[11px] text-slate-400 truncate">ID: {p.id.slice(0, 8)}…</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-300">{p.brand || "—"}</td>
                      <td className="py-3.5 px-4 text-xs">
                        <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg font-medium text-[11px]">
                          {p.category || "General"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <div className="font-bold text-white text-sm">₹{(p.sellingPrice || p.price || 0).toLocaleString()}</div>
                        {p.originalPrice && p.originalPrice > (p.sellingPrice || p.price) && (
                          <div className="text-[11px] text-slate-500 line-through">₹{p.originalPrice.toLocaleString()}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <span className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                          stock > 10
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : stock > 0
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}>
                          {stock} in stock
                        </span>
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
