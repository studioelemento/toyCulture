// admin/src/pages/AddProduct.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  DollarSign,
  Image as ImageIcon,
  Search,
  Settings,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  ShoppingCart,
  Star,
  Award,
  FolderTree,
  RefreshCw,
  Plus,
} from "lucide-react";

const emptyProduct = {
  name: "",
  title: "",
  brand_id: "",
  brand: "",
  parent_category_id: "",
  category_id: "",
  category: "",
  subcategory_id: "",
  description: "",
  mrp: "",
  sellingPrice: "",
  onOffer: false,
  offerPrice: "",
  ageGroup: "3-5 years",
  stockQTY: "25",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  imageUrl: "",
  images: "",
  attributes: "",
};

const ageGroups = [
  "0-2 years",
  "3-5 years",
  "6-8 years",
  "9-12 years",
  "12+ years",
  "All Ages",
];

const sampleImagePresets = [
  {
    label: "RC Monster Truck",
    url: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "LEGO Technic",
    url: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Wooden Building Blocks",
    url: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Plush Teddy Bear",
    url: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80",
  },
];

export default function AddProduct() {
  const [product, setProduct] = useState(emptyProduct);
  const [msg, setMsg] = useState({ text: "", type: "", createdId: null });
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");

  // Dynamic Brands & Categories fetched from PostgreSQL
  const [brandsList, setBrandsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [customBrandMode, setCustomBrandMode] = useState(false);

  const fetchMetadata = async () => {
    setLoadingMeta(true);
    try {
      const [brandRes, catRes] = await Promise.all([
        fetch("/api/admin/brand?limit=100"),
        fetch("/api/admin/category?limit=100"),
      ]);
      const brandData = await brandRes.json();
      const catData = await catRes.json();

      const bList = (brandData.data || []).filter((b) => b.is_active !== false);
      const cList = (catData.data || []).filter((c) => c.is_active !== false);
      setBrandsList(bList);
      setCategoriesList(cList);

      // Pre-select first brand & category if currently unset
      setProduct((prev) => {
        const next = { ...prev };
        if (!next.brand_id && bList.length > 0) {
          next.brand_id = bList[0].id;
          next.brand = bList[0].name;
        }
        if (!next.parent_category_id && cList.length > 0) {
          const firstParent = cList.find((c) => !c.parent_id) || cList[0];
          next.parent_category_id = firstParent.id;
          next.category_id = firstParent.id;
          next.category = firstParent.name;
        }
        return next;
      });
    } catch (err) {
      console.error("Failed to load brands or categories:", err);
    } finally {
      setLoadingMeta(false);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  // Filter main/parent categories (where parent_id is null)
  const parentCategories = categoriesList.filter((c) => !c.parent_id);

  // Filter subcategories belonging to currently selected parent category
  const availableSubcategories = product.parent_category_id
    ? categoriesList.filter((c) => c.parent_id === product.parent_category_id)
    : [];

  const handleParentCategoryChange = (e) => {
    const parentId = e.target.value;
    const parentCat = categoriesList.find((c) => c.id === parentId);
    setProduct((prev) => ({
      ...prev,
      parent_category_id: parentId,
      subcategory_id: "",
      category_id: parentId,
      category: parentCat ? parentCat.name : "",
    }));
  };

  const handleSubcategoryChange = (e) => {
    const subId = e.target.value;
    if (subId) {
      const subCat = categoriesList.find((c) => c.id === subId);
      setProduct((prev) => ({
        ...prev,
        subcategory_id: subId,
        category_id: subId,
        category: subCat ? subCat.name : prev.category,
      }));
    } else {
      // Revert back to parent category as the primary category
      const parentCat = categoriesList.find(
        (c) => c.id === product.parent_category_id
      );
      setProduct((prev) => ({
        ...prev,
        subcategory_id: "",
        category_id: prev.parent_category_id,
        category: parentCat ? parentCat.name : "",
      }));
    }
  };

  const handleBrandSelectChange = (e) => {
    const bId = e.target.value;
    if (bId === "__NEW__") {
      setCustomBrandMode(true);
      setProduct((prev) => ({ ...prev, brand_id: "", brand: "" }));
    } else {
      const bObj = brandsList.find((b) => b.id === bId);
      setProduct((prev) => ({
        ...prev,
        brand_id: bId,
        brand: bObj ? bObj.name : "",
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const setPresetImage = (url) => {
    setProduct((p) => ({
      ...p,
      imageUrl: url,
      images: url,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "", createdId: null });

    const payload = {
      ...product,
      brand_id: product.brand_id || undefined,
      brand: product.brand ? product.brand.trim() : undefined,
      category_id: product.category_id || undefined,
      category: product.category ? product.category.trim() : undefined,
      mrp: Number(product.mrp) || 0,
      sellingPrice: Number(product.sellingPrice) || Number(product.mrp) || 0,
      offerPrice: product.offerPrice ? Number(product.offerPrice) : null,
      stockQTY: Number(product.stockQTY) || 0,
      metaKeywords:
        typeof product.metaKeywords === "string"
          ? product.metaKeywords
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      imageUrl:
        typeof product.imageUrl === "string"
          ? product.imageUrl
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      images:
        typeof product.images === "string"
          ? product.images
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      attributes:
        typeof product.attributes === "string"
          ? product.attributes
              .split("\n")
              .filter(Boolean)
              .map((line) => {
                const colonIdx = line.indexOf(":");
                if (colonIdx === -1) return null;
                return {
                  attributeName: line.slice(0, colonIdx)?.trim(),
                  attributeValue: line.slice(colonIdx + 1)?.trim(),
                };
              })
              .filter(Boolean)
          : [],
    };

    try {
      const res = await fetch("/api/v1/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMsg({
          text: "Product successfully created & saved to PostgreSQL!",
          type: "success",
          createdId: data.data?.id,
        });
        // Reset form keeping the current category & brand for convenience
        setProduct({
          ...emptyProduct,
          brand_id: product.brand_id,
          brand: product.brand,
          parent_category_id: product.parent_category_id,
          category_id: product.category_id,
          category: product.category,
        });
      } else {
        setMsg({
          text: data.message || "Failed to create product.",
          type: "error",
          createdId: null,
        });
      }
    } catch (err) {
      setMsg({ text: err.message, type: "error", createdId: null });
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: "basic", label: "Basic Info", icon: Package },
    { id: "pricing", label: "Pricing & Stock", icon: DollarSign },
    { id: "media", label: "Media & Images", icon: ImageIcon },
    { id: "seo", label: "SEO & Meta", icon: Search },
    { id: "attributes", label: "Attributes", icon: Settings },
  ];

  const inputClass =
    "w-full bg-[#121A2F] border border-indigo-950 rounded-xl px-4 py-2.5 text-slate-100 text-xs font-sans outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";
  const selectClass = inputClass + " cursor-pointer [&>option]:bg-[#0E1526]";
  const textareaClass = inputClass + " resize-y min-h-[90px]";
  const labelClass =
    "text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5";

  // Compute live preview fields
  const previewImg =
    (product.imageUrl && product.imageUrl.split(",")[0]?.trim()) ||
    (product.images && product.images.split(",")[0]?.trim()) ||
    "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=600";
  const previewPrice =
    Number(product.sellingPrice) || Number(product.mrp) || 0;
  const previewMrp = Number(product.mrp) || 0;
  const previewDiscount =
    previewMrp > previewPrice
      ? `${Math.round(((previewMrp - previewPrice) / previewMrp) * 100)}%`
      : null;

  const selectedParentObj = categoriesList.find(
    (c) => c.id === product.parent_category_id
  );

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span>Create New Toy Listing</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Choose brand, category & subcategory from PostgreSQL database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchMetadata}
            title="Reload Brands & Categories"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white border border-indigo-950 hover:border-slate-700 bg-[#0E1526] px-3 py-2 rounded-xl transition-all"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loadingMeta ? "animate-spin text-indigo-400" : ""}`}
            />
            <span className="hidden sm:inline">Refresh DB Data</span>
          </button>

          <Link
            to="/products"
            className="text-xs font-bold text-slate-400 hover:text-white border border-indigo-950 hover:border-slate-700 bg-[#0E1526] px-4 py-2 rounded-xl transition-all"
          >
            ← Back to All Products
          </Link>
        </div>
      </div>

      {/* ── Feedback Alert ── */}
      {msg.text && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-4 animate-fadeIn ${
            msg.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
              : "bg-rose-950/40 border-rose-500/40 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-3">
            {msg.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span className="text-xs font-semibold">{msg.text}</span>
          </div>
          {msg.createdId && (
            <a
              href={`http://localhost:5173/product/${msg.createdId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold underline text-emerald-200 hover:text-white"
            >
              <span>View in Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}

      {/* ── Two Column Layout (Form + Live Storefront Preview) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Column (8 cols) */}
        <div className="lg:col-span-8 bg-[#0E1526] border border-indigo-950/60 rounded-3xl p-6 sm:p-8 shadow-sm">
          {/* Section Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 border-b border-indigo-950/60 mb-6">
            {sections.map((s) => {
              const Icon = s.icon;
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    active
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Basic Info Section */}
            {activeSection === "basic" && (
              <div className="space-y-4 animate-fadeIn">
                {/* Product Name */}
                <div>
                  <label className={labelClass}>Product Name *</label>
                  <input
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    placeholder="e.g. Remote Control Off-Road Truck"
                    required
                    className={inputClass}
                  />
                </div>

                {/* Brand Selection (Dynamic Dropdown + Quick Add Link) */}
                <div className="p-4 rounded-2xl bg-[#090D16]/60 border border-indigo-950/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Brand *</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCustomBrandMode(!customBrandMode)}
                        className="text-[11px] text-slate-400 hover:text-amber-400 transition-colors"
                      >
                        {customBrandMode
                          ? "← Choose from DB list"
                          : "+ Type custom brand name"}
                      </button>
                      <span className="text-slate-600">|</span>
                      <Link
                        to="/brands"
                        target="_blank"
                        className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <span>Manage Brands</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {customBrandMode ? (
                    <div>
                      <input
                        name="brand"
                        value={product.brand}
                        onChange={(e) =>
                          setProduct((p) => ({
                            ...p,
                            brand: e.target.value,
                            brand_id: "",
                          }))
                        }
                        placeholder="Type new brand name (e.g. Hot Wheels, Funskool)..."
                        className={inputClass}
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Will be automatically created and linked in the database.
                      </span>
                    </div>
                  ) : (
                    <select
                      value={product.brand_id || ""}
                      onChange={handleBrandSelectChange}
                      className={selectClass}
                    >
                      <option value="" disabled>
                        {loadingMeta
                          ? "Loading brands from DB..."
                          : "-- Select Brand from Database --"}
                      </option>
                      {brandsList.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} {b.seo_title ? `(${b.seo_title})` : ""}
                        </option>
                      ))}
                      <option value="__NEW__">
                        + Type a new brand name manually...
                      </option>
                    </select>
                  )}
                </div>

                {/* Category & Subcategory Selection (Dynamic Hierarchy) */}
                <div className="p-4 rounded-2xl bg-[#090D16]/60 border border-indigo-950/60 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-2">
                      <FolderTree className="w-4 h-4 text-indigo-400" />
                      <span>Category & Subcategory Hierarchy *</span>
                    </label>
                    <Link
                      to="/categories"
                      target="_blank"
                      className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <span>Manage Categories</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Main Parent Category */}
                    <div>
                      <span className={labelClass}>
                        1. Main Category (Parent)
                      </span>
                      <select
                        value={product.parent_category_id || ""}
                        onChange={handleParentCategoryChange}
                        className={selectClass}
                      >
                        <option value="" disabled>
                          {loadingMeta
                            ? "Loading categories..."
                            : "-- Select Main Category --"}
                        </option>
                        {parentCategories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Subcategory */}
                    <div>
                      <span className={labelClass}>
                        2. Subcategory (Optional)
                      </span>
                      <select
                        value={product.subcategory_id || ""}
                        onChange={handleSubcategoryChange}
                        disabled={availableSubcategories.length === 0}
                        className={`${selectClass} ${
                          availableSubcategories.length === 0
                            ? "opacity-60 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <option value="">
                          {availableSubcategories.length === 0
                            ? "(No subcategories found under this category)"
                            : `-- None (Keep at "${selectedParentObj?.name || "Main Category"}") --`}
                        </option>
                        {availableSubcategories.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            ↳ {sub.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Summary of chosen categorization */}
                  <div className="text-[11px] text-slate-400 bg-[#121A2F]/80 p-2.5 rounded-xl border border-indigo-950/40 flex items-center gap-2">
                    <span className="text-slate-500">Selected Path:</span>
                    <span className="font-bold text-slate-200">
                      {selectedParentObj?.name || "None"}
                    </span>
                    {product.subcategory_id && (
                      <>
                        <span className="text-indigo-400 font-bold">›</span>
                        <span className="font-bold text-amber-400">
                          {product.category}
                        </span>
                        <span className="text-[10px] text-slate-500 ml-auto">
                          (Foreign key category_id points to subcategory)
                        </span>
                      </>
                    )}
                    {!product.subcategory_id && selectedParentObj && (
                      <span className="text-[10px] text-slate-500 ml-auto">
                        (Foreign key category_id points to main category)
                      </span>
                    )}
                  </div>
                </div>

                {/* Age Group */}
                <div>
                  <label className={labelClass}>Target Age Group</label>
                  <select
                    name="ageGroup"
                    value={product.ageGroup}
                    onChange={handleChange}
                    className={selectClass}
                  >
                    {ageGroups.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Catchy Title */}
                <div>
                  <label className={labelClass}>Catchy Title / Headline</label>
                  <input
                    name="title"
                    value={product.title}
                    onChange={handleChange}
                    placeholder="e.g. 1:18 Scale High-Speed Racing Machine"
                    className={inputClass}
                  />
                </div>

                {/* Detailed Description */}
                <div>
                  <label className={labelClass}>Detailed Description</label>
                  <textarea
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    placeholder="Provide full description of features, materials, and safety guidelines..."
                    className={textareaClass}
                  />
                </div>
              </div>
            )}

            {/* 2. Pricing & Stock Section */}
            {activeSection === "pricing" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>MRP (Maximum Retail Price) ₹ *</label>
                    <input
                      type="number"
                      name="mrp"
                      value={product.mrp}
                      onChange={handleChange}
                      placeholder="e.g. 2999"
                      required
                      min="0"
                      step="any"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Selling Price ₹ *</label>
                    <input
                      type="number"
                      name="sellingPrice"
                      value={product.sellingPrice}
                      onChange={handleChange}
                      placeholder="e.g. 2499"
                      required
                      min="0"
                      step="any"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
                  <div>
                    <label className={labelClass}>Stock Quantity (Units)</label>
                    <input
                      type="number"
                      name="stockQTY"
                      value={product.stockQTY}
                      onChange={handleChange}
                      placeholder="e.g. 25"
                      min="0"
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="onOffer"
                        checked={product.onOffer}
                        onChange={handleChange}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-[#121A2F] border-indigo-950"
                      />
                      <span className="text-xs font-bold text-slate-200">
                        Mark as Special Deal / Offer
                      </span>
                    </label>

                    {product.onOffer && (
                      <input
                        type="number"
                        name="offerPrice"
                        value={product.offerPrice}
                        onChange={handleChange}
                        placeholder="Offer Price ₹ (Optional)"
                        min="0"
                        step="any"
                        className={inputClass}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 3. Media & Images Section */}
            {activeSection === "media" && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className={labelClass}>
                    Main Image URL (or comma-separated list of image URLs)
                  </label>
                  <input
                    name="imageUrl"
                    value={product.imageUrl}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/... or paste image CDN link"
                    className={inputClass}
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Direct public URLs render immediately on customer storefront and in the preview card.
                  </p>
                </div>

                {/* Preset image suggestions for quick demo creation */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-400 block mb-2">
                    Quick Sample Toy Images (Click to use):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {sampleImagePresets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setPresetImage(preset.url)}
                        className="bg-[#121A2F] hover:bg-slate-800 border border-indigo-950 hover:border-indigo-600/40 p-2 rounded-xl text-left transition-all group"
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-20 object-cover rounded-lg mb-1.5 group-hover:scale-102 transition-transform"
                        />
                        <span className="text-[10px] font-semibold text-slate-300 block truncate">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. SEO & Meta Section */}
            {activeSection === "seo" && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className={labelClass}>Meta Title (Browser Tab Title)</label>
                  <input
                    name="metaTitle"
                    value={product.metaTitle}
                    onChange={handleChange}
                    placeholder="e.g. High-Speed RC Monster Truck | Buy Online at ToyCulture"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Meta Description (Search Snippet)</label>
                  <textarea
                    name="metaDescription"
                    value={product.metaDescription}
                    onChange={handleChange}
                    placeholder="Brief description that appears in Google search engine results..."
                    className={textareaClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Meta Keywords (comma-separated)
                  </label>
                  <input
                    name="metaKeywords"
                    value={product.metaKeywords}
                    onChange={handleChange}
                    placeholder="rc truck, toy car, rechargeable, off-road"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {/* 5. Attributes Section */}
            {activeSection === "attributes" && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className={labelClass}>
                    Technical Specifications (Key: Value, one per line)
                  </label>
                  <textarea
                    name="attributes"
                    value={product.attributes}
                    onChange={handleChange}
                    placeholder={`Material: Non-toxic ABS Plastic\nBattery: 7.4V 1200mAh Li-ion\nScale: 1:18 Scale\nCharging Time: 120 mins\nRemote Frequency: 2.4 GHz`}
                    rows={6}
                    className={textareaClass}
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Format: <span className="text-slate-300">Name: Value</span> (e.g. Battery: 1200mAh)
                  </p>
                </div>
              </div>
            )}

            {/* Navigation & Submit Toolbar */}
            <div className="pt-4 border-t border-indigo-950/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activeSection !== "basic" && (
                  <button
                    type="button"
                    onClick={() => {
                      const idx = sections.findIndex((s) => s.id === activeSection);
                      if (idx > 0) setActiveSection(sections[idx - 1].id);
                    }}
                    className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-800/40 transition-colors"
                  >
                    ← Previous
                  </button>
                )}

                {activeSection !== "attributes" && (
                  <button
                    type="button"
                    onClick={() => {
                      const idx = sections.findIndex((s) => s.id === activeSection);
                      if (idx < sections.length - 1)
                        setActiveSection(sections[idx + 1].id);
                    }}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 px-3 py-2 rounded-xl hover:bg-indigo-950/40 transition-colors"
                  >
                    Next Step →
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-lg shadow-orange-500/25 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Saving to PostgreSQL...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Publish Toy Listing</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Customer Storefront Card Preview (4 cols) */}
        <div className="lg:col-span-4 space-y-3 sticky top-24">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>Live Storefront Preview</span>
            </span>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold">
              Real-time
            </span>
          </div>

          {/* Customer Store Product Card Simulation */}
          <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex flex-col font-sans text-[#0F243E] max-w-[320px] mx-auto">
            {/* Card Top / Image */}
            <div className="relative aspect-square mb-3 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-3">
              {previewDiscount && (
                <div className="absolute top-2 left-2 bg-[#F96515] text-white text-[10px] font-black px-2 py-0.5 rounded-md z-10 shadow-xs">
                  -{previewDiscount}
                </div>
              )}
              {product.onOffer && (
                <div className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md z-10">
                  Deal
                </div>
              )}
              <img
                src={previewImg}
                alt="Preview"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=600";
                }}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Badges: Brand & Category */}
            <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded uppercase tracking-wider">
                {product.brand || "ToyCulture Brand"}
              </span>
              {product.category && (
                <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded">
                  {selectedParentObj && product.subcategory_id
                    ? `${selectedParentObj.name} › ${product.category}`
                    : product.category}
                </span>
              )}
            </div>

            <h3 className="text-sm font-bold text-[#0F243E] leading-tight mb-2 line-clamp-2 min-h-[38px]">
              {product.name || "Toy Product Name Preview"}
            </h3>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-3">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <span className="text-[11px] font-bold text-gray-600 ml-1">4.8</span>
              <span className="text-[11px] text-gray-400">(0)</span>
            </div>

            {/* Price & Add to Cart button */}
            <div className="mt-auto pt-2 border-t border-gray-100">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-lg font-black text-[#0F243E]">
                  ₹{previewPrice.toLocaleString()}
                </span>
                {previewMrp > previewPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    ₹{previewMrp.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="w-full bg-[#F96515] text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-sm">
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center px-4">
            This is how your product will immediately render on the customer storefront.
          </p>
        </div>
      </div>
    </div>
  );
}
