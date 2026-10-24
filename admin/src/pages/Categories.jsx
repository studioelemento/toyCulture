import React, { useState, useEffect } from "react";
import {
  FolderTree,
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
  ChevronRight,
  FolderOpen,
} from "lucide-react";

const emptyCategory = { name: "", parent_id: "", seo_description: "" };

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyCategory);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [search, setSearch] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/category?limit=100&search=${search}`);
      const data = await res.json();
      setCategories(data.data || []);
    } catch {
      setMsg({ text: "Failed to fetch categories", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [search]);

  // Get only parent categories (no parent_id) for the parent dropdown
  const parentCategories = categories.filter((c) => !c.parent_id);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const openAdd = (parentId = "") => {
    setEditingId(null);
    setForm({ ...emptyCategory, parent_id: parentId });
    setShowForm(true);
    setMsg({ text: "", type: "" });
  };

  const openEdit = (cat) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      parent_id: cat.parent_id || "",
      seo_description: cat.seo_description || "",
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
        ? `/api/admin/category/${editingId}`
        : "/api/admin/category";
      const method = editingId ? "PUT" : "POST";
      const payload = {
        ...form,
        parent_id: form.parent_id || null,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({
          text: editingId ? "Category updated!" : "Category created!",
          type: "success",
        });
        setShowForm(false);
        setForm(emptyCategory);
        setEditingId(null);
        fetchCategories();
      } else {
        setMsg({ text: data.message || "Failed", type: "error" });
      }
    } catch (err) {
      setMsg({ text: err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = async (id) => {
    try {
      const res = await fetch(`/api/admin/category/toggle/${id}`, {
        method: "PATCH",
      });
      if (res.ok) fetchCategories();
    } catch {}
  };

  const inputClass =
    "w-full bg-[#121A2F] border border-indigo-950 rounded-xl px-4 py-2.5 text-slate-100 text-xs font-sans outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";
  const selectClass = inputClass + " cursor-pointer [&>option]:bg-[#0E1526]";
  const labelClass =
    "text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5";

  // Build a tree: parent categories with their children
  const categoryTree = parentCategories.map((parent) => ({
    ...parent,
    subcategories: categories.filter((c) => c.parent_id === parent.id),
  }));

  // Also find orphan subcategories (parent_id set but parent not in current list)
  const allParentIds = parentCategories.map((p) => p.id);
  const orphanSubs = categories.filter(
    (c) => c.parent_id && !allParentIds.includes(c.parent_id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <FolderTree className="w-6 h-6 text-amber-400" />
            <span>Category Management</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Manage categories & subcategories (parent → child). Connected to
            PostgreSQL.
          </p>
        </div>
        <button
          onClick={() => openAdd()}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
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
          placeholder="Search categories..."
          className={inputClass + " pl-10"}
        />
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl p-6 shadow-lg max-w-lg animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">
              {editingId ? "Edit Category" : "Add New Category"}
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
              <label className={labelClass}>Category Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Action Figures, Board Games"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Parent Category{" "}
                <span className="normal-case text-slate-500 font-normal">
                  (leave empty for top-level)
                </span>
              </label>
              <select
                name="parent_id"
                value={form.parent_id}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="">— None (Top-Level Category) —</option>
                {parentCategories
                  .filter((p) => p.id !== editingId) // can't be parent of itself
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>
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
                <span>
                  {editingId ? "Update Category" : "Create Category"}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Tree Display */}
      <div className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
          </div>
        ) : categoryTree.length === 0 && orphanSubs.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            No categories found. Add your first category!
          </div>
        ) : (
          <div className="divide-y divide-indigo-950/30">
            {categoryTree.map((parent) => (
              <div key={parent.id}>
                {/* Parent row */}
                <div className="flex items-center justify-between px-5 py-3.5 hover:bg-indigo-950/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <FolderOpen className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-bold text-white">
                      {parent.name}
                    </span>
                    {parent.subcategories.length > 0 && (
                      <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                        {parent.subcategories.length} sub
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        parent.is_active
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {parent.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openAdd(parent.id)}
                      className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                      title="Add Subcategory"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openEdit(parent)}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleCategory(parent.id)}
                      className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all"
                      title="Toggle Status"
                    >
                      {parent.is_active ? (
                        <ToggleRight className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 text-rose-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Subcategory rows */}
                {parent.subcategories.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between px-5 py-2.5 pl-14 bg-[#0B1120] hover:bg-indigo-950/15 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <ChevronRight className="w-3 h-3 text-slate-600" />
                      <span className="text-xs font-semibold text-slate-300">
                        {sub.name}
                      </span>
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                          sub.is_active
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {sub.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(sub)}
                        className="p-1 text-slate-500 hover:text-indigo-400 rounded-md transition-all"
                        title="Edit"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => toggleCategory(sub.id)}
                        className="p-1 text-slate-500 hover:text-amber-400 rounded-md transition-all"
                        title="Toggle"
                      >
                        {sub.is_active ? (
                          <ToggleRight className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <ToggleLeft className="w-3.5 h-3.5 text-rose-400" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {/* Orphan subcategories (if any) */}
            {orphanSubs.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-indigo-950/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-semibold text-slate-300">
                    {sub.name}
                  </span>
                  <span className="text-[10px] text-rose-400 font-bold">
                    (Orphan)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(sub)}
                    className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
