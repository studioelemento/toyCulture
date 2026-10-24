import React, { useState, useEffect } from "react";
import {
  Award,
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

const emptyBrand = { name: "", seo_title: "", seo_description: "" };

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyBrand);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [search, setSearch] = useState("");

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/brand?limit=100&search=${search}`);
      const data = await res.json();
      setBrands(data.data || []);
    } catch {
      setMsg({ text: "Failed to fetch brands", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [search]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyBrand);
    setShowForm(true);
    setMsg({ text: "", type: "" });
  };

  const openEdit = (brand) => {
    setEditingId(brand.id);
    setForm({
      name: brand.name,
      seo_title: brand.seo_title || "",
      seo_description: brand.seo_description || "",
    });
    setShowForm(true);
    setMsg({ text: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ text: "", type: "" });
    try {
      const url = editingId
        ? `/api/admin/brand/${editingId}`
        : "/api/admin/brand";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({
          text: editingId ? "Brand updated!" : "Brand created!",
          type: "success",
        });
        setShowForm(false);
        setForm(emptyBrand);
        setEditingId(null);
        fetchBrands();
      } else {
        setMsg({ text: data.message || "Failed", type: "error" });
      }
    } catch (err) {
      setMsg({ text: err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const toggleBrand = async (id) => {
    try {
      const res = await fetch(`/api/admin/brand/toggle/${id}`, {
        method: "PATCH",
      });
      if (res.ok) fetchBrands();
    } catch {}
  };

  const inputClass =
    "w-full bg-[#121A2F] border border-indigo-950 rounded-xl px-4 py-2.5 text-slate-100 text-xs font-sans outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";
  const labelClass =
    "text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-400" />
            <span>Brand Management</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Manage toy brands with SEO metadata. Connected to PostgreSQL.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Brand</span>
        </button>
      </div>

      {/* Feedback */}
      {msg.text && (
        <div
          className={`p-3 rounded-xl border flex items-center gap-3 text-xs font-semibold animate-fadeIn ${
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

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search brands..."
          className={inputClass + " pl-10"}
        />
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl p-6 shadow-lg max-w-lg animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">
              {editingId ? "Edit Brand" : "Add New Brand"}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Brand Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. LEGO, Hot Wheels, Funskool"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>SEO Title</label>
              <input
                name="seo_title"
                value={form.seo_title}
                onChange={handleChange}
                placeholder="e.g. LEGO Toys | ToyCulture"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>SEO Description</label>
              <textarea
                name="seo_description"
                value={form.seo_description}
                onChange={handleChange}
                placeholder="Brief description for search engines..."
                rows={3}
                className={inputClass + " resize-y"}
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-xs font-bold text-slate-400 hover:text-white px-4 py-2 rounded-xl border border-slate-800 hover:border-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-orange-500/25 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{editingId ? "Update Brand" : "Create Brand"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Brands Table */}
      <div className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            No brands found. Add your first brand!
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-indigo-950/60 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">SEO Title</th>
                <th className="text-left px-5 py-3">SEO Description</th>
                <th className="text-center px-5 py-3">Status</th>
                <th className="text-center px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr
                  key={brand.id}
                  className="border-b border-indigo-950/30 hover:bg-indigo-950/20 transition-colors"
                >
                  <td className="px-5 py-3 font-bold text-white">
                    {brand.name}
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {brand.seo_title || "—"}
                  </td>
                  <td className="px-5 py-3 text-slate-400 max-w-[200px] truncate">
                    {brand.seo_description || "—"}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        brand.is_active
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {brand.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEdit(brand)}
                        className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleBrand(brand.id)}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all"
                        title="Toggle Status"
                      >
                        {brand.is_active ? (
                          <ToggleRight className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <ToggleLeft className="w-4 h-4 text-rose-400" />
                        )}
                      </button>
                    </div>
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
