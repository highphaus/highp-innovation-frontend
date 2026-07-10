import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Tag, Loader2, Check } from "lucide-react";
import axios from "axios";
import { getTheme, getVerticalDetails } from "../storefront/StorefrontHome";

export default function PricesManagement() {
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
  const [searchQuery, setSearchQuery] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [tempPrice, setTempPrice] = useState("");

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

  const theme = getTheme(storeData);

  const handleSavePrice = async (productId) => {
    const priceVal = parseFloat(tempPrice);
    if (isNaN(priceVal) || priceVal < 0) {
      alert("Please enter a valid price amount.");
      return;
    }

    try {
      const p = products.find(item => item._id === productId);
      await axios.put(`http://localhost:5000/api/products/${productId}`, {
        name: p.name,
        price: priceVal,
        description: p.description,
        image: p.image
      });
      setEditingId(null);
      fetchProducts();
    } catch {
      alert("Failed to update product price.");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-20 selection:bg-neutral-800 selection:text-white">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#F0EEEB] px-6 lg:px-10 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-7 h-7 ${theme.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <Tag className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-black text-xs uppercase tracking-widest text-neutral-900 block truncate">
                {storeData?.name || storeSlug}
              </span>
              <span className="text-[9px] text-[#737373] font-mono block">Price Settings · /{storeSlug}</span>
            </div>
          </div>
          <Link 
            to={`/${storeSlug}/admin`} 
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition-colors border border-[#F0EEEB] bg-[#FAFAFA] hover:bg-neutral-50 px-3.5 py-2 rounded-xl flex-shrink-0 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> <span>Dashboard</span>
          </Link>
        </div>
      </header>

      {/* VIEW BODY */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-8 space-y-6">
        <div>
          <h1 className="text-xl font-black text-neutral-950 uppercase tracking-tight">Catalog Pricing Panel</h1>
          <p className="text-[10px] text-neutral-450 uppercase tracking-widest font-bold mt-0.5">Manage and sync prices across your storefront.</p>
        </div>

        {/* Search tool */}
        <div className="relative max-w-md bg-white rounded-xl shadow-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search products or variants..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#F0EEEB] pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 transition-all font-semibold"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#D03D56]" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white border border-[#F0EEEB] rounded-3xl py-20 px-6 text-center space-y-4 shadow-sm">
            <p className="text-neutral-400 text-xs font-bold uppercase tracking-wide">
              No products found. Add one from the Inventory page first.
            </p>
            <Link 
              to={`/${storeSlug}/admin/inventory`}
              className="inline-flex py-2 px-4.5 bg-[#D03D56] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#3F0712] transition-all"
            >
              Manage Inventory
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-[#F0EEEB] rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#F0EEEB] text-[9px] font-black text-neutral-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Current Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F0]">
                {filteredProducts.map(p => (
                  <tr key={p._id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 font-black text-neutral-950 uppercase">{p.name}</td>
                    <td className="px-6 py-4 font-mono font-bold text-neutral-900">
                      {editingId === p._id ? (
                        <input 
                          type="number" 
                          value={tempPrice}
                          onChange={e => setTempPrice(e.target.value)}
                          className="w-24 px-2.5 py-1 bg-[#FAFAFA] border border-[#F0EEEB] rounded-lg text-xs font-bold focus:outline-none focus:border-[#D03D56]"
                        />
                      ) : (
                        <span>₹{p.price}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editingId === p._id ? (
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => handleSavePrice(p._id)}
                            className="px-2.5 py-1.5 bg-[#D03D56] text-white font-black text-[9px] uppercase tracking-wider rounded-lg hover:bg-[#3F0712]"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1.5 bg-neutral-100 text-neutral-600 font-black text-[9px] uppercase tracking-wider rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => { setEditingId(p._id); setTempPrice(p.price.toString()); }}
                          className="px-3.5 py-1.5 border border-[#F0EEEB] hover:border-[#D03D56]/50 text-neutral-700 hover:text-neutral-955 rounded-xl text-[9px] font-black uppercase tracking-widest bg-white shadow-sm transition-all"
                        >
                          Edit Price
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
