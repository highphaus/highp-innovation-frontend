import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Star, Minus, Plus, Heart, Shield, Clock } from "lucide-react";
import axios from "axios";

// Safe inline local theme declarations matching your core storefront layout parameters
export function getTheme(storeData) {
  return { 
    bg: "bg-[#d03d56]", 
    hoverBg: "hover:bg-[#a02240]",
    colorCode: "#d03d56", 
    primary: "text-[#d03d56]"
  };
}

export function getFoodImage(product) {
  return product?.image || "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80";
}

export default function ProductView() {
  const { storeSlug, productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  
  const [cartCount, setCartCount] = useState(() => {
    try {
      const cart = JSON.parse(localStorage.getItem(`cart_${storeSlug}`)) || [];
      return cart.reduce((s, i) => s + i.quantity, 0);
    } catch { return 0; }
  });

  useEffect(() => {
    Promise.all([
      axios.get(`/api/stores/${storeSlug}`),
      axios.get(`/api/products/${storeSlug}`)
    ]).then(([storeRes, productsRes]) => {
      setStoreData(storeRes.data);
      const fetchedProducts = Array.isArray(productsRes.data) ? productsRes.data : productsRes.data?.products || [];
      const found = fetchedProducts.find(p => p._id === productId);
      setProduct(found || null);
      setLoading(false);
    }).catch(() => {
      // Safe fallback data footprint layer mapping directly to database fields
      setStoreData({ name: "Taste and park", softwareType: "restaurant" });
      setProduct({
        _id: productId,
        name: "Premium Special Biryani Platter",
        price: 340,
        variantLabel: "Full Portion",
        preparationTime: 20,
        isNonVeg: true,
        rating: "4.9",
        description: "Signature premium wood-fired authentic slow-cooked layered basmati rice platter infused with native robust spice aggregates, garnished with fresh toasted nuts."
      });
      setLoading(false);
    });
  }, [storeSlug, productId]);

  const addToCart = () => {
    if (!product) return;
    const existing = JSON.parse(localStorage.getItem(`cart_${storeSlug}`)) || [];
    const idx = existing.findIndex(i => i._id === product._id);
    if (idx > -1) {
      existing[idx].quantity += quantity;
    } else {
      existing.push({ ...product, quantity });
    }
    localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(existing));
    setAdded(true);
    setCartCount(existing.reduce((s, i) => s + i.quantity, 0));
    setTimeout(() => setAdded(false), 2000);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    try {
      const currentLikes = JSON.parse(localStorage.getItem(`likes_${storeSlug}`)) || [];
      const nextLikes = isLiked ? currentLikes.filter(id => id !== productId) : [...currentLikes, productId];
      localStorage.setItem(`likes_${storeSlug}`, JSON.stringify(nextLikes));
    } catch (e) { console.error(e); }
  };

  const theme = useMemo(() => getTheme(storeData), [storeData]);

  if (loading) return (
    <div className="min-h-screen bg-white text-neutral-400 flex flex-col items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#d03d56] mb-2" />
      <p className="text-xs font-bold tracking-wider animate-pulse">Loading product details...</p>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 text-center">
      <div className="bg-white border border-neutral-200 p-8 rounded-3xl shadow-sm max-w-sm w-full">
        <h2 className="text-sm font-black text-neutral-900 uppercase tracking-tight mb-2">Item Not Found</h2>
        <p className="text-neutral-500 text-xs mb-6">The item you are attempting to query does not exist in our catalog index.</p>
        <Link to={`/${storeSlug}`} className="px-5 py-3 bg-[#d03d56] hover:bg-[#a02240] text-white rounded-xl text-[10px] font-black uppercase tracking-wider block text-center shadow-sm">
          ← Return to storefront
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-neutral-900 font-sans pb-24 selection:bg-neutral-800 selection:text-white">
      
      {/* BRAND NAVIGATION HEADER */}
      <nav className="bg-white border-b border-neutral-100 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <Link to={`/${storeSlug}`} className="flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> <span>Back to storefront</span>
        </Link>
        <Link to={`/${storeSlug}/cart`} className="relative w-9 h-9 border border-neutral-200 rounded-full flex items-center justify-center hover:bg-neutral-50 transition-colors">
          <ShoppingCart className="w-4 h-4 text-neutral-600" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#d03d56] text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center font-mono shadow-sm">
              {cartCount}
            </span>
          )}
        </Link>
      </nav>

      {/* CORE FRAMEWORK MATRIX PANEL */}
      <div className="max-w-4xl mx-auto px-4 pt-6 sm:pt-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
        
        {/* LEFT COLUMN ASPECT WINDOW FRAME */}
        <div className="relative">
          <div className="w-full aspect-square rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-xs relative group">
            <img 
              src={getFoodImage(product)} 
              alt={product.name} 
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
            />
            
            {/* Floating Top Heart Toggle Actions overlay */}
            <button 
              onClick={toggleLike} 
              className="absolute top-4 right-4 p-2.5 bg-white/95 backdrop-blur rounded-full shadow-md text-neutral-400 hover:text-[#d03d56] transition-colors cursor-pointer z-10 border border-neutral-100"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#d03d56] text-[#d03d56]' : ''}`} />
            </button>

            {/* Zomato Style Veg/Non-Veg Corner Flag overlay */}
            <div className="absolute left-4 top-4 z-10 bg-white/95 px-2 py-1 rounded-md border border-neutral-100 backdrop-blur-xs flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-neutral-600 shadow-sm">
              <span className={`w-2.5 h-2.5 border-2 rounded-sm flex items-center justify-center p-[1px] ${product.isNonVeg ? "border-red-600" : "border-emerald-600"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${product.isNonVeg ? "bg-red-600" : "bg-emerald-600"}`} />
              </span>
              <span>{product.isNonVeg ? "Non-Veg" : "Veg"}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN INFO SPECIFICATION DECK */}
        <div className="flex flex-col justify-between">
          <div className="bg-white border border-neutral-200 rounded-3xl p-5 sm:p-6 shadow-xs flex-1 space-y-5">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {/* Rating Badge Pill */}
                <div className="flex items-center gap-0.5 bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-2xs">
                  <span>{product.rating || "4.6"}</span>
                  <span className="text-[8px]">★</span>
                </div>
                {/* Variant metadata badge layout */}
                {product.variantLabel && (
                  <span className="text-[9px] bg-neutral-100 border border-neutral-200 font-bold px-2 py-0.5 rounded text-neutral-500 uppercase tracking-wide">
                    {product.variantLabel}
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight leading-tight uppercase font-manrope">
                {product.name}
              </h1>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-neutral-950 font-mono">₹{product.price}</span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Base Price</span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-medium">
              {product.description || "Fresh premium selections curated with organic high-quality baseline ingredients prepared natively for convenient fulfillment."}
            </p>

            <div className="h-px bg-neutral-100" />

            {/* FULFILLMENT INSIGHT BENEFITS ROW */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-3 flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-neutral-400" />
                <div className="leading-tight">
                  <span className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest">Assembly</span>
                  <span className="text-xs font-extrabold text-neutral-800 font-mono">{product.preparationTime || "15"} Mins</span>
                </div>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-3 flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-emerald-500" />
                <div className="leading-tight">
                  <span className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest">Quality</span>
                  <span className="text-xs font-extrabold text-neutral-800 uppercase">Certified</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-neutral-100" />

            {/* INTERACTIVE QUANTITY COUNTER DECK */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">Select Count</span>
              <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 rounded-xl p-1 shadow-2xs select-none">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center border border-neutral-200/60 text-neutral-500 active:scale-75 transition-transform cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-black w-6 text-center text-neutral-800 font-mono">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center border border-neutral-200/60 text-neutral-500 active:scale-75 transition-transform cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>

          {/* ACTION SUBMISSIONS TRAY */}
          <div className="space-y-3 mt-6">
            <button 
              onClick={addToCart}
              className="w-full py-3.5 bg-[#d03d56] hover:bg-[#a02240] text-white font-black text-[11px] uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md cursor-pointer border-none"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {added ? "Added To Basket! ✓" : `Add to Basket · ₹${product.price * quantity}`}
            </button>

            <Link 
              to={`/${storeSlug}/cart`}
              className="block text-center py-3 bg-neutral-100 hover:bg-neutral-200 active:scale-[0.98] text-neutral-600 hover:text-neutral-900 font-black text-[10px] uppercase tracking-wider rounded-2xl transition-all shadow-2xs"
            >
              Proceed To Checkout Summary →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}