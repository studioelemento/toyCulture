import React, { useState, useEffect, useCallback } from "react";
import {
  Ticket,
  Plus,
  Edit3,
  ToggleLeft,
  ToggleRight,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { api, ApiError } from "../lib/apiClient";

const emptyCoupon = {
  code: "",
  description: "",
  type: "PERCENTAGE",
  value: "10",
  min_order_amount: "500",
  max_discount: "200",
  usage_limit: "100",
  per_user_limit: "1",
  valid_until: "",
  is_active: true,
};

function toDateInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function formatDiscount(coupon) {
  if (coupon.type === "FIXED") {
    return `₹${Number(coupon.value).toLocaleString("en-IN")} off`;
  }
  const cap = coupon.max_discount
    ? ` (max ₹${Number(coupon.max_discount).toLocaleString("en-IN")})`
    : "";
  return `${coupon.value}%${cap}`;
}

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyCoupon);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: "50",
        page: "1",
        filter,
      });
      if (search.trim()) params.set("q", search.trim());
      const data = await api.get(`/api/admin/coupons?${params}`);
      setCoupons(data.data?.coupons || []);
    } catch {
      setMsg({ text: "Failed to load coupons", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  useEffect(() => {
    const t = setTimeout(() => fetchCoupons(), search ? 300 : 0);
    return () => clearTimeout(t);
  }, [fetchCoupons, search]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openAdd = () => {
    setEditingId(null);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 30);
    setForm({
      ...emptyCoupon,
      valid_until: nextWeek.toISOString().slice(0, 10),
    });
    setShowForm(true);
    setMsg({ text: "", type: "" });
  };

  const openEdit = (coupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code || "",
      description: coupon.description || "",
      type: coupon.type || "PERCENTAGE",
      value: String(coupon.value ?? ""),
      min_order_amount: String(coupon.min_order_amount ?? 0),
      max_discount: coupon.max_discount != null ? String(coupon.max_discount) : "",
      usage_limit: coupon.usage_limit != null ? String(coupon.usage_limit) : "",
      per_user_limit: String(coupon.per_user_limit ?? 1),
      valid_until: toDateInput(coupon.valid_until),
      is_active: Boolean(coupon.is_active),
    });
    setShowForm(true);
    setMsg({ text: "", type: "" });
  };

  const buildPayload = () => {
    const payload = {
      code: form.code.trim().toUpperCase(),
      description: form.description.trim() || undefined,
      type: form.type,
      value: Number(form.value),
      min_order_amount: Number(form.min_order_amount) || 0,
      per_user_limit: Number(form.per_user_limit) || 1,
      valid_until: new Date(`${form.valid_until}T23:59:59`).toISOString(),
      is_active: form.is_active,
    };
    if (form.type === "PERCENTAGE" && form.max_discount !== "") {
      payload.max_discount = Number(form.max_discount);
    } else if (form.type === "FIXED") {
      payload.max_discount = null;
    }
    if (form.usage_limit !== "") {
      payload.usage_limit = Number(form.usage_limit);
    } else {
      payload.usage_limit = null;
    }
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ text: "", type: "" });
    try {
      const payload = buildPayload();
      if (editingId) {
        await api.put(`/api/admin/coupons/${editingId}`, payload);
        setMsg({ text: "Coupon updated!", type: "success" });
      } else {
        await api.post("/api/admin/coupons", payload);
        setMsg({ text: "Coupon created!", type: "success" });
      }
      setShowForm(false);
      setForm(emptyCoupon);
      setEditingId(null);
      fetchCoupons();
    } catch (err) {
      setMsg({
        text: err instanceof ApiError ? err.message : err.message || "Save failed",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleCoupon = async (id) => {
    try {
      await api.patch(`/api/admin/coupons/${id}/toggle`);
      fetchCoupons();
    } catch (err) {
      setMsg({ text: err.message || "Toggle failed", type: "error" });
    }
  };

  const inputClass =
    "w-full bg-[#121A2F] border border-indigo-950 rounded-xl px-4 py-2.5 text-slate-100 text-xs font-sans outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";
  const labelClass =
    "text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Ticket className="w-6 h-6 text-rose-400" />
            <span>Coupons</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Create promo codes for checkout. Codes are 7–9 characters (A–Z, 0–9).
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-rose-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New coupon</span>
        </button>
      </div>

      {msg.text && (
        <div
          className={`p-3 rounded-xl border flex items-center gap-3 text-xs font-semibold ${
            msg.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
              : "bg-rose-950/40 border-rose-500/40 text-rose-300"
          }`}
        >
          {msg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {msg.text}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search code or description..."
            className={inputClass + " pl-10"}
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={inputClass + " max-w-[160px]"}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="in-active">Inactive</option>
        </select>
      </div>

      {showForm && (
        <div className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl p-6 shadow-lg max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">
              {editingId ? "Edit coupon" : "Create coupon"}
            </h2>
            <button onClick={() => setShowForm(false)} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Code *</label>
                <input
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="SAVE10"
                  required
                  minLength={7}
                  maxLength={9}
                  disabled={Boolean(editingId)}
                  className={inputClass + (editingId ? " opacity-60" : "")}
                />
              </div>
              <div>
                <label className={labelClass}>Type *</label>
                <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED">Fixed amount (₹)</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Festive sale — 10% off"
                className={inputClass}
              />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>
                  {form.type === "PERCENTAGE" ? "Discount %" : "Amount (₹)"} *
                </label>
                <input
                  name="value"
                  type="number"
                  min="1"
                  max={form.type === "PERCENTAGE" ? 100 : undefined}
                  step="0.01"
                  value={form.value}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Min order (₹)</label>
                <input
                  name="min_order_amount"
                  type="number"
                  min="0"
                  value={form.min_order_amount}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              {form.type === "PERCENTAGE" ? (
                <div>
                  <label className={labelClass}>Max discount (₹)</label>
                  <input
                    name="max_discount"
                    type="number"
                    min="0"
                    value={form.max_discount}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              ) : null}
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Usage limit (total)</label>
                <input
                  name="usage_limit"
                  type="number"
                  min="1"
                  placeholder="Unlimited"
                  value={form.usage_limit}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Per customer</label>
                <input
                  name="per_user_limit"
                  type="number"
                  min="1"
                  value={form.per_user_limit}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Valid until *</label>
                <input
                  name="valid_until"
                  type="date"
                  value={form.valid_until}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
                className="rounded border-indigo-800"
              />
              Active at checkout
            </label>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-xs font-bold text-slate-400 hover:text-white px-4 py-2 rounded-xl border border-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-rose-500 to-orange-500 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{editingId ? "Update" : "Create"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">No coupons yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[720px]">
              <thead>
                <tr className="border-b border-indigo-950/60 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="text-left px-5 py-3">Code</th>
                  <th className="text-left px-5 py-3">Offer</th>
                  <th className="text-left px-5 py-3">Min order</th>
                  <th className="text-left px-5 py-3">Used</th>
                  <th className="text-left px-5 py-3">Valid until</th>
                  <th className="text-center px-5 py-3">Status</th>
                  <th className="text-center px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => {
                  const expired = new Date(c.valid_until) < new Date();
                  return (
                    <tr
                      key={c.id}
                      className="border-b border-indigo-950/30 hover:bg-indigo-950/20 transition-colors"
                    >
                      <td className="px-5 py-3 font-mono font-bold text-white">{c.code}</td>
                      <td className="px-5 py-3 text-slate-300">{formatDiscount(c)}</td>
                      <td className="px-5 py-3 text-slate-400">
                        ₹{Number(c.min_order_amount || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-3 text-slate-400">
                        {c.used_count ?? 0}
                        {c.usage_limit != null ? ` / ${c.usage_limit}` : ""}
                      </td>
                      <td className="px-5 py-3">
                        <span className={expired ? "text-rose-400" : "text-slate-400"}>
                          {new Date(c.valid_until).toLocaleDateString("en-IN")}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.is_active && !expired
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {c.is_active ? (expired ? "Expired" : "Active") : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEdit(c)}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleCoupon(c.id)}
                            className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg"
                            title="Toggle"
                          >
                            {c.is_active ? (
                              <ToggleRight className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <ToggleLeft className="w-4 h-4 text-rose-400" />
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
        )}
      </div>
    </div>
  );
}
