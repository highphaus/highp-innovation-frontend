import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag, Plus, Trash2, PackageX, ImageOff, ArrowLeft,
  Loader2, Pencil, X, Check, Tag, Grid3X3, ChevronDown
} from "lucide-react";
import axios from "axios";
import { getTheme, getVerticalDetails } from "../storefront/StorefrontHome";

export default function InventoryManagement() {
  const { storeSlug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(`token_${storeSlug}`);
    const role = localStorage.getItem(`role_${storeSlug}`);
    if (!token || role !== "admin") {
      navigate(`/${storeSlug}/login`);
    }
  }, [storeSlug, navigate]);

  const [products, setProducts] = useState([]);
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", description: "", image: "", category: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Edit mode state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", description: "", image: "", category: "" });
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Categories management
  const [catInput, setCatInput] = useState("");
  const [catSaving, setCatSaving] = useState(false);
  const [catSuccess, setCatSuccess] = useState("");

  const fetchProducts = () => {
    axios.get(`/api/products/${storeSlug}`)
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (storeSlug) {
      fetchProducts();
      axios.get(`/api/stores/${storeSlug}`)
        .then(r => setStoreData(r.data))
        .catch(() => {});
    }
  }, [storeSlug]);

  const softwareType = storeData?.softwareType || "restaurant";
  const details = getVerticalDetails(softwareType);
  const theme = getTheme(storeData);

  // Use owner's custom categories if defined, else use vertical defaults
  const defaultCategories = details.categories.filter(c => c !== "All");
  const customCats = storeData?.customCategories?.length > 0
    ? storeData.customCategories
    : defaultCategories;
  const allCategoryOptions = ["All", ...customCats];

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await axios.post("/api/products", {
        storeSlug,
        name: form.name,
        price: Number(form.price),
        description: form.description,
        image: form.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
        category: form.category || ""
      });
      setSuccess("Product published in catalog successfully.");
      setForm({ name: "", price: "", description: "", image: "", category: "" });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to publish product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this catalog item?")) return;
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch {
      alert("Failed to delete product.");
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setEditForm({
      name: product.name || "",
      price: product.price || "",
      description: product.description || "",
      image: product.image || "",
      category: product.category || ""
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", price: "", description: "", image: "", category: "" });
  };

  const handleEdit = async (id) => {
    setEditSubmitting(true);
    try {
      const res = await axios.put(`/api/products/${id}`, {
        name: editForm.name,
        price: Number(editForm.price),
        description: editForm.description,
        image: editForm.image,
        category: editForm.category
      });
      setProducts(products.map(p => p._id === id ? res.data : p));
      setEditingId(null);
    } catch {
      alert("Failed to update product.");
    } finally {
      setEditSubmitting(false);
    }
  };

  // Save custom categories to store
  const handleSaveCategories = async () => {
    setCatSaving(true);
    setCatSuccess("");
    try {
      const res = await axios.put(`/api/stores/${storeSlug}`, {
        customCategories: customCats
      });
      setStoreData(res.data);
      setCatSuccess("Categories saved!");
      setTimeout(() => setCatSuccess(""), 2500);
    } catch {
      alert("Failed to save categories.");
    } finally {
      setCatSaving(false);
    }
  };

  const addCategory = () => {
    const val = catInput.trim();
    if (!val) return;
    if (customCats.includes(val)) return;
    const updated = [...customCats, val];
    setStoreData(d => ({ ...d, customCategories: updated }));
    setCatInput("");
  };

  const removeCategory = (cat) => {
    const updated = customCats.filter(c => c !== cat);
    setStoreData(d => ({ ...d, customCategories: updated }));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-20 selection:bg-neutral-800 selection:text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#F0EEEB] px-6 lg:px-10 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-7 h-7 ${theme.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-black text-xs uppercase tracking-widest text-neutral-900 block truncate">
                {storeData?.name || storeSlug}
              </span>
              <span className="text-[9px] text-[#737373] font-mono block">Catalog Workspace · /{storeSlug}</span>
            </div>
          </div>
          <Link
            to={`/${storeSlug}/admin`}
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition-colors border border-[#F0EEEB] bg-[#FAFAFA] hover:bg-neutral-50 px-3.5 py-2 rounded-xl flex-shrink-0 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Dashboard</span><span className="xs:hidden">Back</span>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-8 space-y-8">

        {/* ── CATEGORIES MANAGEMENT SECTION ── */}
        <div className="bg-white border border-[#F0EEEB] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Grid3X3 className={`w-4 h-4 ${theme.primary}`} />
            <h2 className={`font-black text-sm uppercase tracking-widest ${theme.primary}`}>
              Category Labels
            </h2>
          </div>
          <p className="text-[10px] text-[#737373] font-medium mb-4">
            These labels appear as filter tabs on your storefront. Assign products to these when adding or editing them.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {customCats.map(cat => (
              <span key={cat} className="inline-flex items-center gap-1.5 bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-bold px-3 py-1.5 rounded-full">
                {cat}
                <button onClick={() => removeCategory(cat)} className="text-neutral-400 hover:text-red-500 transition-colors cursor-pointer ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {customCats.length === 0 && (
              <span className="text-[11px] text-neutral-400 italic">No custom categories. Using default vertical categories.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`e.g. Mains, Starters, Beverages...`}
              value={catInput}
              onChange={e => setCatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCategory())}
              className="flex-1 bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-neutral-300 focus:bg-white transition-all text-neutral-900"
            />
            <button
              onClick={addCategory}
              className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex-shrink-0"
            >
              + Add
            </button>
            <button
              onClick={handleSaveCategories}
              disabled={catSaving}
              className={`px-4 py-2.5 ${theme.bg} ${theme.hover} text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex-shrink-0 disabled:opacity-60 flex items-center gap-1.5`}
            >
              {catSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Save
            </button>
          </div>
          {catSuccess && <p className="text-emerald-600 text-[10px] font-bold mt-2">{catSuccess}</p>}
        </div>

        {/* ── MAIN GRID: FORM + PRODUCT LIST ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ADD PRODUCT FORM PANEL */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#F5F5F0] rounded-2xl p-6 shadow-sm sticky top-24 space-y-5">
              <div>
                <h2 className={`font-black text-sm uppercase tracking-widest ${theme.primary} flex items-center gap-2`}>
                  <Plus className="w-4.5 h-4.5" /> Publish {details.productLabel}
                </h2>
                <div className={`h-0.5 w-8 ${theme.bg} mt-2 rounded-full`} />
              </div>

              {error && <div className="p-3 bg-red-50 border border-red-200/60 text-red-700 text-xs rounded-xl font-medium">{error}</div>}
              {success && <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-700 text-xs rounded-xl font-medium">{success}</div>}

              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">{details.productLabel} Title</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Chicken Alfham"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-neutral-300 focus:bg-white transition-all text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-neutral-300 focus:bg-white transition-all text-neutral-900 appearance-none cursor-pointer"
                  >
                    <option value="">— Select category —</option>
                    {customCats.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Price Value (₹)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    placeholder="450"
                    value={form.price}
                    onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                    className="w-full bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-neutral-300 focus:bg-white transition-all text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe details, ingredients, etc..."
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    className="w-full bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-neutral-300 focus:bg-white transition-all resize-none text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Image URL Address</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={form.image}
                    onChange={e => setForm(p => ({ ...p, image: e.target.value }))}
                    className="w-full bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-neutral-300 focus:bg-white transition-all text-neutral-900"
                  />
                  <span className="text-[9px] text-[#737373] font-medium block mt-1.5 ml-1">Optional. Defaults to preset banner if empty.</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3.5 ${theme.bg} ${theme.hover} text-white font-black text-[11px] uppercase tracking-wider rounded-xl transition-all mt-2 flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Cataloging...</span>
                    </>
                  ) : (
                    <span>Publish {details.productLabel}</span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* PRODUCTS LIST GRID */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5 ml-1">
              <h2 className="font-black text-[10px] uppercase tracking-widest text-[#737373]">
                Active Listings ({products.length})
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-20 text-[#737373] text-sm animate-pulse">Syncing catalog index...</div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white border border-[#F5F5F0] rounded-2xl text-[#737373] shadow-sm">
                <PackageX className="w-12 h-12 mb-3 stroke-[1.2]" />
                <p className="text-sm font-semibold">No catalog entries instantiated.</p>
                <p className="text-xs mt-1">Configure products inside the builder sidebar.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map(product => (
                  <div key={product._id} className="bg-white border border-[#F5F5F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {editingId === product._id ? (
                      /* ── EDIT INLINE FORM ── */
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Editing Product</span>
                          <button onClick={cancelEdit} className="text-neutral-400 hover:text-neutral-700 cursor-pointer">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1">Name</label>
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                              className="w-full bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-neutral-300 transition-all text-neutral-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1">Price (₹)</label>
                            <input
                              type="number"
                              min="0"
                              value={editForm.price}
                              onChange={e => setEditForm(p => ({ ...p, price: e.target.value }))}
                              className="w-full bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-neutral-300 transition-all text-neutral-900"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1">Category</label>
                          <select
                            value={editForm.category}
                            onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))}
                            className="w-full bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-neutral-300 transition-all text-neutral-900 cursor-pointer"
                          >
                            <option value="">— None —</option>
                            {customCats.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1">Description</label>
                          <textarea
                            rows={2}
                            value={editForm.description}
                            onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                            className="w-full bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-neutral-300 transition-all resize-none text-neutral-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1">Image URL</label>
                          <input
                            type="url"
                            value={editForm.image}
                            onChange={e => setEditForm(p => ({ ...p, image: e.target.value }))}
                            className="w-full bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-neutral-300 transition-all text-neutral-900"
                          />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleEdit(product._id)}
                            disabled={editSubmitting}
                            className={`flex-1 py-2.5 ${theme.bg} ${theme.hover} text-white font-black text-[11px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer`}
                          >
                            {editSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            Save Changes
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── VIEW MODE ── */
                      <div className="flex items-center gap-4 p-4">
                        <div className="w-20 h-20 bg-[#FAFAFA] rounded-xl overflow-hidden border border-[#F5F5F0] flex-shrink-0">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-350">
                              <ImageOff className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="font-black text-sm text-neutral-900 leading-snug truncate">{product.name}</h3>
                              {product.category && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full mt-1">
                                  <Tag className="w-2.5 h-2.5" /> {product.category}
                                </span>
                              )}
                              <p className="text-[10px] text-[#737373] mt-1 leading-relaxed line-clamp-2">{product.description || "No description."}</p>
                            </div>
                            <span className="font-black text-base text-neutral-900 flex-shrink-0">₹{product.price}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => startEdit(product)}
                            className="p-2 text-[#737373] hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                            title="Edit product"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 text-[#737373] hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
