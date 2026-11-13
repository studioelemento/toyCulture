import React, { useState, useEffect, useCallback } from "react";
import {
  Star,
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  User,
  Package,
} from "lucide-react";

import { api } from "../lib/apiClient";

const APPROVAL_FILTERS = [
  { label: "ALL",      value: "all"   },
  { label: "APPROVED", value: "true"  },
  { label: "PENDING",  value: "false" },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${
            s <= rating
              ? "text-amber-400 fill-amber-400"
              : "text-slate-600"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-slate-400 font-medium">{rating}/5</span>
    </div>
  );
}

function ApprovalBadge({ approved }) {
  return approved ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <CheckCircle className="w-3.5 h-3.5" />
      APPROVED
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
      <XCircle className="w-3.5 h-3.5" />
      PENDING
    </span>
  );
}

export default function Reviews() {
  const [reviews,      setReviews]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [filter,       setFilter]       = useState("all");
  const [searchTerm,   setSearchTerm]   = useState("");
  const [page,         setPage]         = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [actionLoading, setActionLoading] = useState({});

  const LIMIT = 10;

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page,
        limit: LIMIT,
        ...(searchTerm && { search: searchTerm }),
        ...(filter !== "all" && { is_approved: filter }),
      });
      const data = await api.get(`/api/admin/reviews?${params}`);
      setReviews(data.reviews || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalReviews(data.pagination?.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, filter, searchTerm]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Reset to page 1 when filter / search changes
  useEffect(() => {
    setPage(1);
  }, [filter, searchTerm]);

  const handleApprove = async (id, currentApproved) => {
    setActionLoading((p) => ({ ...p, [id]: "approve" }));
    try {
      await api.patch(`/api/admin/reviews/${id}/approve`, { is_approved: !currentApproved });
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_approved: !currentApproved } : r))
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading((p) => ({ ...p, [id]: null }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review? This cannot be undone.")) return;
    setActionLoading((p) => ({ ...p, [id]: "delete" }));
    try {
      await api.delete(`/api/admin/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setTotalReviews((n) => n - 1);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading((p) => ({ ...p, [id]: null }));
    }
  };

  const startItem = (page - 1) * LIMIT + 1;
  const endItem   = Math.min(page * LIMIT, totalReviews);

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600/30 to-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Reviews Management</h1>
          </div>
          <p className="text-slate-400 text-sm ml-12">
            {totalReviews} total reviews · Moderate customer feedback
          </p>
        </div>
        <button
          onClick={fetchReviews}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/40 rounded-xl text-slate-300 hover:text-white text-sm font-medium transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ── Filters Row ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by customer, product or comment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0E1526] border border-indigo-950/60 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-colors"
          />
        </div>
        {/* Status filter pills */}
        <div className="flex gap-2 flex-wrap">
          {APPROVAL_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                filter === value
                  ? "bg-indigo-600 text-white border-indigo-500"
                  : "bg-[#0E1526] text-slate-400 border-indigo-950/60 hover:text-slate-200 hover:border-indigo-500/40"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="bg-[#0E1526]/90 border border-indigo-950/60 rounded-2xl overflow-hidden">
        {error ? (
          <div className="text-center py-16 text-rose-400 text-sm">{error}</div>
        ) : loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-indigo-400" />
            Loading reviews…
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-slate-700" />
            No reviews found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-indigo-950/60 bg-[#090D16]/40">
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Customer
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Product
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Rating
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Review
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                    <th className="text-right px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-950/40">
                  {reviews.map((review) => {
                    const isActing = !!actionLoading[review.id];
                    const productImg =
                      Array.isArray(review.product?.images) && review.product.images.length > 0
                        ? review.product.images[0]
                        : null;
                    return (
                      <tr key={review.id} className="hover:bg-slate-800/20 transition-colors">
                        {/* Customer */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                              <User className="w-4 h-4 text-indigo-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-200 truncate">
                                {review.user
                                  ? `${review.user.first_name} ${review.user.last_name}`
                                  : "Unknown"}
                              </p>
                              <p className="text-xs text-slate-500 truncate">
                                {review.user?.email || review.user_id}
                              </p>
                            </div>
                          </div>
                        </td>
                        {/* Product */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {productImg ? (
                              <img
                                src={productImg}
                                alt={review.product?.name}
                                className="w-9 h-9 rounded-lg object-cover border border-indigo-950/60 shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-slate-800/60 border border-indigo-950/40 flex items-center justify-center shrink-0">
                                <Package className="w-4 h-4 text-slate-500" />
                              </div>
                            )}
                            <p className="text-slate-200 font-medium truncate max-w-[140px]">
                              {review.product?.name || review.product_id}
                            </p>
                          </div>
                        </td>
                        {/* Rating */}
                        <td className="px-5 py-4">
                          <StarRating rating={review.rating} />
                        </td>
                        {/* Comment */}
                        <td className="px-5 py-4 max-w-[220px]">
                          <p className="text-slate-400 text-xs line-clamp-2">
                            {review.comment || <span className="italic text-slate-600">No comment</span>}
                          </p>
                        </td>
                        {/* Status */}
                        <td className="px-5 py-4">
                          <ApprovalBadge approved={review.is_approved} />
                        </td>
                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {/* Approve / Reject toggle */}
                            <button
                              onClick={() => handleApprove(review.id, review.is_approved)}
                              disabled={isActing}
                              title={review.is_approved ? "Reject Review" : "Approve Review"}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border disabled:opacity-50 ${
                                review.is_approved
                                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20"
                                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                              }`}
                            >
                              {actionLoading[review.id] === "approve" ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : review.is_approved ? (
                                <XCircle className="w-3.5 h-3.5" />
                              ) : (
                                <CheckCircle className="w-3.5 h-3.5" />
                              )}
                              {review.is_approved ? "Reject" : "Approve"}
                            </button>
                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(review.id)}
                              disabled={isActing}
                              title="Delete Review"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all disabled:opacity-50"
                            >
                              {actionLoading[review.id] === "delete" ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            <div className="px-5 py-4 border-t border-indigo-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Showing{" "}
                <span className="text-slate-300 font-semibold">{startItem}–{endItem}</span>{" "}
                of{" "}
                <span className="text-slate-300 font-semibold">{totalReviews}</span> reviews
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white hover:border-indigo-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("…");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, idx) =>
                    p === "…" ? (
                      <span key={`ellipsis-${idx}`} className="px-1 text-slate-600 text-sm">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border ${
                          p === page
                            ? "bg-indigo-600 text-white border-indigo-500"
                            : "bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-white hover:border-indigo-500/40"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || loading}
                  className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white hover:border-indigo-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

