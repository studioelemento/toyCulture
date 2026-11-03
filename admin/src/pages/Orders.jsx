import React, { useState, useEffect, useCallback } from "react";
import {
  ShoppingBag,
  Search,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  CreditCard,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API_BASE = "/api";

const STATUS_FILTERS = ["ALL", "PLACED", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

const STATUS_META = {
  DELIVERED: { color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: CheckCircle },
  SHIPPED:   { color: "bg-blue-500/10   text-blue-400   border-blue-500/20",   icon: Truck },
  CONFIRMED: { color: "bg-amber-500/10  text-amber-400  border-amber-500/20",  icon: Clock },
  PLACED:    { color: "bg-amber-500/10  text-amber-400  border-amber-500/20",  icon: Clock },
  PACKED:    { color: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: Clock },
  CANCELLED: { color: "bg-rose-500/10   text-rose-400   border-rose-500/20",   icon: XCircle },
  RETURNED:  { color: "bg-slate-500/10  text-slate-400  border-slate-500/20",  icon: XCircle },
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status?.toUpperCase()] ?? { color: "bg-slate-800 text-slate-300 border-slate-700", icon: Clock };
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 rounded-full text-xs font-bold ${meta.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {status ?? "Pending"}
    </span>
  );
}

export default function Orders() {
  const [orders,       setOrders]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm,   setSearchTerm]   = useState("");
  const [page,         setPage]         = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);
  const [totalOrders,  setTotalOrders]  = useState(0);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page,
        limit:  10,
        ...(statusFilter !== "ALL" && { status: statusFilter }),
        ...(searchTerm.trim()      && { search: searchTerm.trim() }),
      });

      const res  = await fetch(`${API_BASE}/admin/orders?${params}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load orders");
      }

      // Support both shaped responses from our new service
      const list = Array.isArray(data.data) ? data.data : [];
      setOrders(list);
      setTotalPages(data.pages      ?? 1);
      setTotalOrders(data.total_orders ?? list.length);
    } catch (err) {
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, searchTerm]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [statusFilter, searchTerm]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        alert(data.message || "Failed to update order status");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-indigo-400" />
            <span>Orders Management</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {loading ? "Loading…" : `${totalOrders} total orders`} · Track purchases, fulfilment &amp; payments
          </p>
        </div>
        <button
          onClick={fetchOrders}
          title="Refresh orders"
          className="p-2.5 bg-[#0E1526] hover:bg-slate-800 border border-indigo-950 text-slate-300 rounded-xl transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-400" : ""}`} />
        </button>
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="orders-search"
            type="text"
            placeholder="Search by order #, customer name or email…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121A2F] border border-indigo-950 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === s
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Error ───────────────────────────────────────────────────────────── */}
      {error && (
        <div className="bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs px-4 py-3 rounded-xl">
          ⚠️ {error}
        </div>
      )}

      {/* ── Orders Table ─────────────────────────────────────────────────────── */}
      <div className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-sm">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-3" />
            <p>Loading orders…</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-sm">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-white font-bold">No orders match your filter</p>
            <p className="text-slate-500 text-xs mt-1">Try adjusting the status or search term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#121A2F]/60 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-indigo-950/40">
                <tr>
                  <th className="py-3.5 px-6">Order #</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-950/30">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-indigo-950/20 transition-colors">
                    <td className="py-4 px-6 font-bold text-white text-xs font-mono">
                      {o.order_number ?? o.id?.slice(0, 12)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-white font-semibold text-xs">{o.customer ?? "—"}</div>
                      <div className="text-slate-500 text-[11px]">{o.email ?? ""}</div>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-400">
                      {new Date(o.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-300">
                      {o.itemsCount ?? "—"} item{o.itemsCount !== 1 ? "s" : ""}
                    </td>
                    <td className="py-4 px-4 text-xs">
                      <div className="inline-flex items-center gap-1.5 text-slate-300">
                        <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="font-bold text-[11px]">{o.paymentMethod ?? "—"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs font-black text-white">
                      ₹{(o.totalAmount ?? 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <select
                        value={o.status?.toUpperCase() || "PLACED"}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className={`border px-2.5 py-1 rounded-xl text-xs font-bold outline-none cursor-pointer transition-all bg-[#0E1526] hover:border-indigo-400 ${
                          STATUS_META[o.status?.toUpperCase()]?.color ?? "text-slate-300 border-slate-700"
                        }`}
                        title="Click to update order status"
                      >
                        {STATUS_FILTERS.filter((s) => s !== "ALL").map((st) => (
                          <option key={st} value={st} className="bg-[#0E1526] text-white">
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination ───────────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 bg-[#0E1526] border border-indigo-950 text-slate-300 rounded-xl disabled:opacity-40 hover:bg-slate-800 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-white font-bold px-2">{page}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 bg-[#0E1526] border border-indigo-950 text-slate-300 rounded-xl disabled:opacity-40 hover:bg-slate-800 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
