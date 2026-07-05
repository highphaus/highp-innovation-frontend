import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Star, Minus, Plus, Heart, Shield } from "lucide-react";
import axios from "axios";

export default function ProductView() {
  const { storeSlug, productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:5000/api/stores/${storeSlug}`),
      axios.get(`http://localhost:5000/api/products/${storeSlug}`)
    ]).then(([storeRes, productsRes]) => {
      setStoreData(storeRes.data);
      const found = productsRes.data.find(p => p._id === productId);
      setProduct(found || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [storeSlug, productId]);

  const addToCart = () => {
    const existing = JSON.parse(localStorage.getItem(`cart_${storeSlug}`)) || [];
    const idx = existing.findIndex(i => i._id === product._id);
    if (idx > -1) {
      existing[idx].quantity += quantity;
    } else {
      existing.push({ ...product, quantity });
    }
    localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(existing));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-neutral-950 text-neutral-400 flex items-center justify-center">
      <div className="text-xs uppercase font-black tracking-widest animate-pulse">Loading Product Node...</div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 text-center">
      <div className="bg-white border border-neutral-200 p-8 rounded-3xl shadow-sm max-w-sm">
        <h2 className="text-lg font-black text-neutral-900 uppercase tracking-tight mb-2">Product Not Found</h2>
        <p className="text-neutral-500 text-xs mb-6">The item you are attempting to query doesn't exist in the menu index.</p>
        <Link to={`/${storeSlug}`} className="px-5 py-3 bg-neutral-900 text-white rounded-xl text-xs font-black uppercase tracking-wider block">
          ← Return to Menu
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 font-sans pb-16 selection:bg-neutral-950 selection:text-white">
      
      {/* NAV */}
      <nav className={`text-white px-6 py-4 flex items-center justify-between shadow-md ${storeData?.bgColor || 'bg-neutral-900'}`}>
        <Link to={`/${storeSlug}`} className="flex items-center gap-2 text-xs font-bold opacity-90 hover:opacity-100 transition-opacity">
          <ArrowLeft className="w-4 h-4" /> <span>Back to {storeData?.name || "Menu"}</span>
        </Link>
        <Link to={`/${storeSlug}/cart`} className="relative p-2 text-white/90 hover:text-white transition-opacity">
          <ShoppingCart className="w-5 h-5" />
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* PRODUCT IMAGE GALLERY / VIEW */}
        <div className="relative">
          <div className="w-full aspect-square rounded-[32px] overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-md relative group">
            <img 
              src={product.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80"} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            
            <button 
              onClick={() => setIsLiked(!isLiked)} 
              className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur rounded-2xl shadow-sm hover:scale-110 active:scale-95 transition-all text-neutral-700 hover:text-red-500"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </button>

            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm border border-neutral-100">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-black text-neutral-800">4.9 Rating</span>
            </div>
          </div>
        </div>

        {/* DETAILS PANEL */}
        <div className="flex flex-col justify-between">
          <div className="bg-white border border-neutral-200/80 rounded-[32px] p-8 shadow-sm mb-6 flex-1">
            
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1">Gourmet Choice</span>
                <h1 className="text-2xl font-black text-neutral-900 leading-snug">{product.name}</h1>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1">Standard</span>
                <span className="text-2xl font-black text-neutral-950 block">₹{product.price}</span>
              </div>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed mb-6">
              {product.description || "Indulge in our exquisite gourmet selection, handcrafted by master chefs using premium local ingredients and fresh organic greens."}
            </p>

            <div className="divider mb-6" />

            {/* BENEFITS */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2.5 text-xs text-neutral-600 font-medium">
                <Shield className="w-4 h-4 text-emerald-500" /> Fresh preparation on order
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-600 font-medium">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500/10" /> Authentic ingredients and flavors
              </div>
            </div>

            <div className="divider mb-6" />

            {/* QUANTITY PICKER */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-neutral-500 uppercase tracking-widest">Select Quantity</span>
              <div className="flex items-center gap-2 bg-neutral-100 rounded-xl p-1">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-neutral-50 active:scale-95 transition-all text-neutral-700"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-black w-8 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-neutral-50 active:scale-95 transition-all text-neutral-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* ACTION BUTTONS */}
          <div className="space-y-3">
            <button 
              onClick={addToCart}
              className={`w-full py-4 text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md ${storeData?.bgColor || 'bg-neutral-900'} ${storeData?.hoverColor || 'hover:bg-neutral-800'}`}
            >
              <ShoppingCart className="w-4 h-4" />
              {added ? "Item Added to Cart! ✓" : `Add to Cart · ₹${product.price * quantity}`}
            </button>

            <Link 
              to={`/${storeSlug}/cart`}
              className="block text-center py-3 bg-neutral-200/60 hover:bg-neutral-200 active:scale-[0.98] text-neutral-800 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all"
            >
              Go to Cart Checkout →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
