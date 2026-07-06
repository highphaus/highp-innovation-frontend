import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingBag, Plus, Trash2, PackageX, ImageOff, ArrowLeft, Loader2 } from "lucide-react";
import axios from "axios";
import { getTheme, getVerticalDetails } from "../storefront/StorefrontHome";

export default function InventoryManagement() {
  const { storeSlug } = useParams();
  const [products, setProducts] = useState([]);
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", description: "", image: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProducts = () => {
    axios.get(`http://localhost:5000/api/products/${storeSlug}`)
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (storeSlug) {
      fetchProducts();
      axios.get(`http://localhost:5000/api/stores/${storeSlug}`).then(r => setStoreData(r.data)).catch(() => {});
    }
  }, [storeSlug]);

  const softwareType = storeData?.softwareType || "restaurant";
  const details = getVerticalDetails(softwareType);
  const theme = getTheme(storeData);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await axios.post("http://localhost:5000/api/products", {
        storeSlug,
        name: form.name,
        price: Number(form.price),
        description: form.description,
        image: form.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80"
      });
      setSuccess("Product published in catalog successfully.");
      setForm({ name: "", price: "", description: "", image: "" });
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
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch {
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-20 selection:bg-neutral-800 selection:text-white">
      
      {/* HEADER */}
      <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center border border-white/5">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-xs uppercase tracking-wider">{storeSlug} — Catalog Workspace</span>
        </div>
        <Link to={`/${storeSlug}/admin`} className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-white transition-colors bg-neutral-800 px-3.5 py-2 rounded-xl">
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ADD PRODUCT FORM PANEL */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#F5F5F0] rounded-2xl p-6 shadow-sm sticky top-6 space-y-5">
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
                  placeholder="e.g. Cold-Pressed Sesame Oil" 
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-neutral-300 focus:bg-white transition-all text-neutral-900" 
                />
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
                className={`w-full py-3.5 ${theme.bg} ${theme.hover} text-white font-black text-[11px] uppercase tracking-wider rounded-xl transition-all mt-2 flex items-center justify-center gap-2 shadow-md disabled:opacity-50`}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map(product => (
                <div key={product._id} className="bg-white border border-[#F5F5F0] rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow animate-fade-in group">
                  <div>
                    <div className="h-44 bg-[#FAFAFA] overflow-hidden relative border-b border-[#F5F5F0]">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-350">
                          <ImageOff className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-black text-sm text-neutral-900 leading-snug">{product.name}</h3>
                      <p className="text-xs text-[#737373] mt-1.5 leading-relaxed line-clamp-2">{product.description || "No description configured."}</p>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <div className="flex items-center justify-between pt-3 border-t border-[#F5F5F0]">
                      <span className="text-base font-black text-neutral-900">₹{product.price}</span>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-[#737373] hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
