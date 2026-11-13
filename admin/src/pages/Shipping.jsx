import React, { useCallback, useEffect, useState } from "react";
import {
  Truck,
  Plus,
  Search,
  ToggleLeft,
  ToggleRight,
  Loader2,
  MapPin,
} from "lucide-react";
import { api, ApiError } from "../lib/apiClient";

const emptyRow = {
  pincode: "",
  city: "",
  state: "",
  cod_allowed: true,
  delivery_days_min: "3",
  delivery_days_max: "6",
  extra_delivery_fee: "0",
};

export default function Shipping() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyRow);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (search.trim()) params.set("q", search.trim());
      const data = await api.get(`/api/admin/shipping?${params}`);
      setRows(data.data?.pincodes || []);
    } catch (err) {
      setMsg(
        err instanceof ApiError
          ? err.message
          : err?.message || "Failed to load pincodes — restart the API after schema changes"
      );
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchRows, search ? 250 : 0);
    return () => clearTimeout(t);
  }, [fetchRows, search]);

  const inputClass =
    "w-full bg-[#121A2F] border border-indigo-950 rounded-xl px-3 py-2 text-slate-100 text-xs outline-none focus:border-indigo-500";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      await api.post("/api/admin/shipping", {
        ...form,
        pincode: form.pincode.replace(/\D/g, "").slice(0, 6),
        delivery_days_min: Number(form.delivery_days_min),
        delivery_days_max: Number(form.delivery_days_max),
        extra_delivery_fee: Number(form.extra_delivery_fee),
      });
      setForm(emptyRow);
      setMsg("Pincode added");
      fetchRows();
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleRow = async (id) => {
    await api.patch(`/api/admin/shipping/${id}/toggle`);
    fetchRows();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Truck className="w-6 h-6 text-sky-400" />
          Shipping & pincodes
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Optional overrides only — customers can use any valid Indian pincode at checkout. Rows here set custom ETA, extra delivery fee, or COD rules for specific pincodes when you need them later.
        </p>
      </div>

      {msg ? (
        <p className="text-xs font-semibold text-amber-300 bg-amber-950/30 border border-amber-500/30 rounded-xl px-3 py-2">
          {msg}
        </p>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl p-5 grid sm:grid-cols-6 gap-3 items-end"
      >
        <div className="sm:col-span-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Pincode</label>
          <input
            required
            maxLength={6}
            pattern="[1-9][0-9]{5}"
            value={form.pincode}
            onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))}
            className={inputClass}
            placeholder="560001"
          />
        </div>
        <div className="sm:col-span-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">City</label>
          <input
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">State</label>
          <input
            value={form.state}
            onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">Extra fee ₹</label>
          <input
            type="number"
            min="0"
            value={form.extra_delivery_fee}
            onChange={(e) => setForm((f) => ({ ...f, extra_delivery_fee: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase">ETA (days)</label>
          <div className="flex gap-1">
            <input
              type="number"
              min="1"
              value={form.delivery_days_min}
              onChange={(e) => setForm((f) => ({ ...f, delivery_days_min: e.target.value }))}
              className={inputClass}
            />
            <input
              type="number"
              min="1"
              value={form.delivery_days_max}
              onChange={(e) => setForm((f) => ({ ...f, delivery_days_max: e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-xs text-slate-300 sm:col-span-1 pb-2">
          <input
            type="checkbox"
            checked={form.cod_allowed}
            onChange={(e) => setForm((f) => ({ ...f, cod_allowed: e.target.checked }))}
          />
          COD allowed
        </label>
        <button
          type="submit"
          disabled={saving}
          className="sm:col-span-6 flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold py-2.5 rounded-xl disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add serviceable pincode
        </button>
      </form>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pincode, city…"
          className={inputClass + " pl-10"}
        />
      </div>

      <div className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-14 flex justify-center">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
          </div>
        ) : rows.length === 0 ? (
          <p className="py-14 text-center text-slate-500 text-sm">
            No overrides yet — delivery is open for all valid pincodes (default ₹99 / free over ₹2,000).
          </p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-indigo-950/60 text-[10px] uppercase text-slate-500">
                <th className="text-left px-5 py-3">Pincode</th>
                <th className="text-left px-5 py-3">Location</th>
                <th className="text-left px-5 py-3">ETA</th>
                <th className="text-left px-5 py-3">Extra ₹</th>
                <th className="text-center px-5 py-3">COD</th>
                <th className="text-center px-5 py-3">Active</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-indigo-950/30 hover:bg-indigo-950/20">
                  <td className="px-5 py-3 font-mono font-bold text-white flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-sky-400" />
                    {r.pincode}
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {[r.city, r.state].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {r.delivery_days_min}–{r.delivery_days_max} days
                  </td>
                  <td className="px-5 py-3 text-slate-400">₹{r.extra_delivery_fee}</td>
                  <td className="px-5 py-3 text-center">{r.cod_allowed ? "Yes" : "No"}</td>
                  <td className="px-5 py-3 text-center">
                    <button onClick={() => toggleRow(r.id)} className="text-slate-400 hover:text-white">
                      {r.is_active ? (
                        <ToggleRight className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-rose-400" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
