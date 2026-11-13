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
  Eye,
  X,
  MapPin,
  User,
  Calendar,
  Package,
} from "lucide-react";
import { api } from "../lib/apiClient";

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
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const handleOpenDetails = async (orderId) => {
    setSelectedOrderId(orderId);
    setDetailsLoading(true);
    try {
      const data = await api.get(`/api/admin/orders/${orderId}`);
      if (data.data) setOrderDetails(data.data);
    } catch (e) {
      console.error("Failed to load order details", e);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedOrderId(null);
    setOrderDetails(null);
  };

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

      const data = await api.get(`/api/admin/orders?${params}`);

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
      await api.patch(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
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
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-950/30">
                {orders.map((o) => (
                  <tr key={o.id} onClick={() => handleOpenDetails(o.id)} className="hover:bg-indigo-950/30 cursor-pointer transition-colors group">
                    <td className="py-4 px-6 font-bold text-white text-xs font-mono">
                      {o.order_number ?? o.id?.slice(0, 12)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-white font-semibold text-xs">{o.customer ?? "—"}</div>
                      <div className="text-slate-500 text-[11px]">{o.email ?? ""}</div>
                    </td>
                    <td className="py-4 px-4 text-xs">
                      <div className="font-semibold text-slate-200">
                        {new Date(o.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {new Date(o.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit", minute: "2-digit", hour12: true,
                        })}
                      </div>
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
                    <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
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
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenDetails(o.id)}
                        className="p-1.5 rounded-xl border border-indigo-950/60 bg-indigo-950/30 hover:bg-indigo-600 text-slate-400 hover:text-white transition-all"
                        title="View Full Order Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <p className="text-xs text-slate-400">
          Showing <span className="text-white font-bold">{orders.length === 0 ? 0 : (page - 1) * 10 + 1}–{Math.min(page * 10, totalOrders)}</span> of <span className="text-white font-bold">{totalOrders}</span> orders (Page {page} of {totalPages || 1})
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-2 bg-[#0E1526] border border-indigo-950 text-slate-300 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-all"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-white font-bold px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-900/50">
            {page}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="p-2 bg-[#0E1526] border border-indigo-950 text-slate-300 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-all"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* ── Order Details Slide-Over Drawer / Modal ──────────────────────── */}
      {selectedOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-2xl max-h-[90vh] bg-[#0E1526] border border-indigo-900/60 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-indigo-950/80 flex items-center justify-between bg-[#121A2F]/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <span>Order #{orderDetails?.order_number || selectedOrderId.slice(0, 12)}</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Placed on {orderDetails?.createdAt ? new Date(orderDetails.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {orderDetails?.status && (
                  <StatusBadge status={orderDetails.status} />
                )}
                <button
                  onClick={handleCloseDetails}
                  className="w-8 h-8 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
              {detailsLoading ? (
                <div className="py-12 text-center text-slate-400">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-3" />
                  <p>Loading order details...</p>
                </div>
              ) : (
                <>
                  {/* Customer & Payment Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Customer Info */}
                    <div className="p-4 rounded-2xl bg-[#121A2F]/40 border border-indigo-950/60 space-y-2">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                        <User className="w-3.5 h-3.5" />
                        <span>Customer Information</span>
                      </div>
                      <div className="text-white font-bold text-sm">
                        {orderDetails?.user ? `${orderDetails.user.first_name || ''} ${orderDetails.user.last_name || ''}`.trim() : 'Customer'}
                      </div>
                      <div className="text-slate-400 text-xs">{orderDetails?.user?.email || 'No email provided'}</div>
                      {orderDetails?.user?.phone && (
                        <div className="text-slate-400 text-xs">{orderDetails.user.phone}</div>
                      )}
                    </div>

                    {/* Payment Info */}
                    <div className="p-4 rounded-2xl bg-[#121A2F]/40 border border-indigo-950/60 space-y-2">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Payment Summary</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Method</span>
                        <span className="font-bold text-white">{orderDetails?.payment_method || 'COD'}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Payment Status</span>
                        <span className="font-bold text-emerald-400">{orderDetails?.payment_status || 'PENDING'}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs pt-1 border-t border-indigo-950/50">
                        <span className="text-slate-400 font-semibold">Total Amount</span>
                        <span className="font-black text-white text-sm">₹{Number(orderDetails?.total_amount || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {orderDetails?.shipping_address && (
                    <div className="p-4 rounded-2xl bg-[#121A2F]/40 border border-indigo-950/60 space-y-1.5">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Shipping Address</span>
                      </div>
                      <p className="font-bold text-white text-xs">
                        {orderDetails.shipping_address.first_name} {orderDetails.shipping_address.last_name}
                      </p>
                      <p className="text-slate-300 text-xs">{orderDetails.shipping_address.address}</p>
                      <p className="text-slate-300 text-xs">
                        {orderDetails.shipping_address.place}, {orderDetails.shipping_address.state} - {orderDetails.shipping_address.pincode}
                      </p>
                      <p className="text-slate-400 text-xs pt-0.5">📞 {orderDetails.shipping_address.phone}</p>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5" />
                      <span>Items Ordered ({orderDetails?.items?.length || 0})</span>
                    </h4>

                    <div className="divide-y divide-indigo-950/50 border border-indigo-950/60 rounded-2xl overflow-hidden bg-[#121A2F]/30">
                      {orderDetails?.items?.map((item) => (
                        <div key={item.id} className="p-3.5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 p-1 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              <img
                                src={item.product_image || item.product?.images?.[0] || '/lamborghini.jpg'}
                                alt={item.product_name || item.product?.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-white text-xs sm:text-sm leading-tight">
                                {item.product_name || item.product?.name || 'Product'}
                              </p>
                              <p className="text-slate-400 text-[11px] mt-0.5">
                                Qty: {item.quantity} × ₹{Number(item.price).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="font-black text-white text-xs sm:text-sm text-right">
                            ₹{(Number(item.price) * (item.quantity || 1)).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Status Transition inside Modal */}
                  <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-800/30 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold text-white">Update Order Status</div>
                      <div className="text-[11px] text-slate-400">Change fulfilment progress directly</div>
                    </div>
                    <select
                      value={orderDetails?.status?.toUpperCase() || "PLACED"}
                      onChange={async (e) => {
                        const newSt = e.target.value;
                        await handleStatusChange(orderDetails.id, newSt);
                        setOrderDetails(prev => prev ? { ...prev, status: newSt } : null);
                      }}
                      className={`border px-3 py-1.5 rounded-xl text-xs font-bold outline-none cursor-pointer bg-[#0E1526] hover:border-indigo-400 ${
                        STATUS_META[orderDetails?.status?.toUpperCase()]?.color ?? "text-slate-300 border-slate-700"
                      }`}
                    >
                      {STATUS_FILTERS.filter((s) => s !== "ALL").map((st) => (
                        <option key={st} value={st} className="bg-[#0E1526] text-white">
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-indigo-950/80 bg-[#121A2F]/60 flex items-center justify-end">
              <button
                onClick={handleCloseDetails}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

