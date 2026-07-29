import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Star, Minus, Plus, Heart, Shield, Clock, Loader2, Share2, Phone } from "lucide-react";
import axios from "axios";
import MobileBottomNav from "../../components/MobileBottomNav";
import { getStoreDisplayName } from "./StorefrontHome";

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
  if (product?.image && typeof product.image === "string" && product.image.trim()) {
    return product.image.trim();
  }
  if (product?.imageUrl && typeof product.imageUrl === "string" && product.imageUrl.trim()) {
    return product.imageUrl.trim();
  }
  return "";
}

export function getProductVariants(product) {
  if (product?.variants && Array.isArray(product.variants) && product.variants.length > 0) {
    return product.variants.map(v => {
      const label = v.variantLabel || v.name || (v.unit ? `1 ${v.unit}` : "Standard Option");
      return {
        name: label,
        variantLabel: label,
        price: Number(v.price !== undefined ? v.price : (product.price || 0))
      };
    });
  }

  const basePrice = Number(product?.price) || 200;
  const mainLabel = product?.variantLabel || (product?.unit ? `1 ${product.unit}` : "Full");

  return [
    { name: "Half", variantLabel: "Half", price: Math.round(basePrice * 0.6) },
    { name: mainLabel, variantLabel: mainLabel, price: basePrice },
    { name: "1 Kg", variantLabel: "1 Kg", price: Math.round(basePrice * 1.8) },
    { name: "2 Kg", variantLabel: "2 Kg", price: Math.round(basePrice * 3.4) }
  ];
}

export default function ProductView() {
  const { storeSlug, productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(1); // Default to "Full"
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
      axios.get(`/api/stores/${storeSlug}`).catch(() => ({ data: null })),
      axios.get(`/api/products/${storeSlug}`).catch(() => ({ data: [] }))
    ]).then(([storeRes, productsRes]) => {
      setStoreData(storeRes.data);
      const fetchedProducts = Array.isArray(productsRes.data) ? productsRes.data : productsRes.data?.products || [];
      const found = fetchedProducts.find(p => String(p._id) === String(productId) || p.slug === productId || String(p.id) === String(productId));
      setProduct(found || null);
      setLoading(false);
    }).catch(() => {
      setStoreData(null);
      setProduct(null);
      setLoading(false);
    });
  }, [storeSlug, productId]);

  useEffect(() => {
    const storeName = storeData?.name || (storeSlug ? storeSlug.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : "Store");
    if (product && product.name) {
      document.title = `${product.name} - ${storeName} | HighP Platform`;
    } else {
      document.title = `${storeName} | HighP Platform`;
    }
  }, [product, storeData, storeSlug]);

  // Track recently viewed products
  useEffect(() => {
    if (product && product._id) {
      try {
        const existing = JSON.parse(localStorage.getItem(`viewed_${storeSlug}`)) || [];
        const filtered = existing.filter(p => p._id !== product._id);
        const itemToSave = {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: getFoodImage(product),
          category: product.category,
          viewedAt: new Date().toISOString()
        };
        localStorage.setItem(`viewed_${storeSlug}`, JSON.stringify([itemToSave, ...filtered].slice(0, 20)));
      } catch (_) {}
    }
  }, [product, storeSlug]);

  const handleShareProduct = () => {
    if (!product) return;
    try {
      const url = window.location.href;
      if (navigator.share) {
        navigator.share({ title: product.name, text: `Check out ${product.name} on ${storeData?.name || storeSlug}!`, url });
      } else {
        navigator.clipboard.writeText(url);
        alert("Product link copied to clipboard!");
      }
      const existing = JSON.parse(localStorage.getItem(`shared_${storeSlug}`)) || [];
      const filtered = existing.filter(p => p._id !== product._id);
      const itemToSave = {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: getFoodImage(product),
        sharedAt: new Date().toISOString()
      };
      localStorage.setItem(`shared_${storeSlug}`, JSON.stringify([itemToSave, ...filtered].slice(0, 20)));
    } catch (_) {}
  };

  const variants = useMemo(() => getProductVariants(product), [product]);
  const currentVariant = variants[selectedVariantIndex] || variants[0] || { name: "Full", price: product?.price || 200 };
  const unitPrice = currentVariant.price;

  const addToCart = () => {
    if (!product) return;
    const cartItemId = `${product._id}_${currentVariant.name}`;
    const cartItemName = `${product.name} (${currentVariant.name})`;

    const existing = JSON.parse(localStorage.getItem(`cart_${storeSlug}`)) || [];
    const idx = existing.findIndex(i => i._id === cartItemId || (i.productId === product._id && i.variantLabel === currentVariant.name));
    
    if (idx > -1) {
      existing[idx].quantity += quantity;
    } else {
      existing.push({
        _id: cartItemId,
        productId: product._id,
        name: cartItemName,
        price: unitPrice,
        variantLabel: currentVariant.name,
        quantity,
        image: product.image || "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80"
      });
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
    <>
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
            
            {/* Floating Top Share & Wishlist Toggle Actions */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button 
                type="button"
                onClick={handleShareProduct} 
                className="p-2.5 bg-white/95 backdrop-blur rounded-full shadow-md text-neutral-600 hover:text-black transition-colors cursor-pointer border border-neutral-100"
                title="Share product link"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button 
                type="button"
                onClick={toggleLike} 
                className="p-2.5 bg-white/95 backdrop-blur rounded-full shadow-md text-neutral-400 hover:text-[#d03d56] transition-colors cursor-pointer border border-neutral-100"
                title="Wishlist product"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#d03d56] text-[#d03d56]' : ''}`} />
              </button>
            </div>

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
                <span className="text-[9px] bg-neutral-100 border border-neutral-200 font-bold px-2 py-0.5 rounded text-neutral-500 uppercase tracking-wide">
                  {currentVariant.name}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight leading-tight uppercase font-manrope">
                {product.name}
              </h1>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-neutral-950 font-mono">₹{unitPrice * quantity}</span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                ({currentVariant.name} × {quantity})
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-medium">
              {product.description || "Fresh premium selections curated with organic high-quality baseline ingredients prepared natively for convenient fulfillment."}
            </p>

            <div className="h-px bg-neutral-100" />

            {/* PORTION / QUANTITY DROPDOWN SELECTOR */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Select Portion / Quantity</span>
                <span className="text-[10px] font-bold text-[#d03d56] uppercase tracking-wider">{currentVariant.name}</span>
              </div>
              <div className="relative">
                <select
                  value={selectedVariantIndex}
                  onChange={(e) => setSelectedVariantIndex(Number(e.target.value))}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-900 px-4 py-3 focus:outline-none focus:border-[#d03d56] cursor-pointer appearance-none pr-8 shadow-2xs"
                >
                  {variants.map((v, idx) => (
                    <option key={idx} value={idx}>
                      {v.name} &mdash; ₹{v.price}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-bold">▼</div>
              </div>
            </div>

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
            {(product?.inStock === false || product?.isOutOfStock === true) ? (
              <button 
                disabled
                className="w-full py-3.5 bg-neutral-200 text-neutral-500 font-black text-[11px] uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed border-none"
              >
                Currently Out of Stock
              </button>
            ) : (
              <button 
                onClick={addToCart}
                className="w-full py-3.5 bg-[#d03d56] hover:bg-[#a02240] text-white font-black text-[11px] uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md cursor-pointer border-none"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                {added ? "Added To Basket! ✓" : `Add to Basket · ₹${unitPrice * quantity}`}
              </button>
            )}

            <Link 
              to={`/${storeSlug}/cart`}
              className="block text-center py-3 bg-neutral-100 hover:bg-neutral-200 active:scale-[0.98] text-neutral-600 hover:text-neutral-900 font-black text-[10px] uppercase tracking-wider rounded-2xl transition-all shadow-2xs"
            >
              Proceed To Checkout Summary →
            </Link>
          </div>
        </div>

      </div>

      {/* STORE OWNER INFO CARD (FETCHED DYNAMICALLY FROM STORE SETTINGS) */}
      {storeData && (
        <div className="mt-8 max-w-4xl mx-auto px-4">
          <div className="bg-white border border-neutral-200 rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {storeData.logoUrl ? (
                <img src={storeData.logoUrl} alt={storeData.name} className="w-12 h-12 rounded-2xl object-cover border border-neutral-100 shadow-2xs" />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-[#d03d56]/10 text-[#d03d56] font-black text-lg flex items-center justify-center border border-[#d03d56]/20 shrink-0">
                  {storeData.name ? storeData.name.charAt(0).toUpperCase() : "S"}
                </div>
              )}
              <div>
                <h3 className="text-sm font-black text-neutral-900 uppercase tracking-tight font-manrope">{getStoreDisplayName(storeData, storeSlug)}</h3>
                {storeData.tagline && <p className="text-[11px] text-neutral-500 font-medium italic">{storeData.tagline}</p>}
                {storeData.address && (
                  <p className="text-[10px] text-neutral-400 font-medium flex items-center gap-1 mt-0.5">
                    <span>📍</span> {storeData.address}
                  </p>
                )}
              </div>
            </div>

            {(storeData.phone || storeData.whatsappNumber) && (
              <a 
                href={`tel:${storeData.whatsappNumber || storeData.phone}`}
                className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2 self-start sm:self-auto hover:bg-emerald-100 transition-colors shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {storeData.whatsappNumber || storeData.phone}</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>

    {/* MOBILE STICKY BOTTOM NAV */}
    <MobileBottomNav storeSlug={storeSlug} cartCount={cartCount} />
  </>
  );
}