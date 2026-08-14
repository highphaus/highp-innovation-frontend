import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShoppingCart, Loader2, Search, User, Clock, Heart, Store, Info, MapPin, Phone, AlertTriangle, Sparkles, X, Check, Share2, MoreVertical, UtensilsCrossed, SlidersHorizontal, Tag
} from "lucide-react";
import axios from "axios";
import CustomerAuthModal from "../../components/CustomerAuthModal";
import OrderHistoryDrawer from "../../components/OrderHistoryDrawer";
import CustomerProfileDrawer from "../../components/CustomerProfileDrawer";
import MobileBottomNav from "../../components/MobileBottomNav";

export function getStoreDisplayName(storeData, storeSlug) {
  if (storeData && storeData.name && storeData.name.trim()) {
    return storeData.name.trim();
  }
  if (storeSlug && storeSlug.trim()) {
    return storeSlug.trim().replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
  return "Storefront";
}

export function checkIsNonVeg(product) {
  if (!product) return false;
  if (product.isNonVeg === true || product.vegNonVeg === "non-veg" || product.vegNonVeg === "egg") {
    return true;
  }
  const name = (product.name || "").toLowerCase();
  const primaryMeat = ["chicken", "mutton", "fish", "prawn", "beef", "pork", "meat", "seafood", "wings", "kebab", "kabab", "tikka", "alfham", "shawaya", "shawarma", "mandi", "biriyani", "biryani"];
  return primaryMeat.some(kw => name.includes(kw));
}

// ─── ADDED BACK FOR PRODUCTVIEW.JSX COMPATIBILITY ───────────
export function getVerticalDetails(softwareType) {
  const map = {
    restaurant: { categories: ["All", "Mains", "Sides", "Beverages", "Desserts"], actionLabel: "Add to Cart", productLabel: "Dish" },
    retail: { categories: ["All", "Apparel", "Electronics", "Wellness", "Home"], actionLabel: "Add to Basket", productLabel: "Product" }
  };
  return map[softwareType || "restaurant"] || map.restaurant;
}

// ─── THEME RESOLVER FOR SOFTWARE VERTICALS ─────────────────
export function getCategoryIcon(categoryName) {
  const cat = (categoryName || "").toLowerCase().trim();
  if (cat === "all") return "🍽️";
  if (cat.includes("alfham") || cat.includes("alfaham") || cat.includes("grill")) return "🔥";
  if (cat.includes("shawarma") || cat.includes("wrap") || cat.includes("roll")) return "🌯";
  if (cat.includes("mandi") || cat.includes("kuzhi")) return "🍚";
  if (cat.includes("shawaya") || cat.includes("roast")) return "🍗";
  if (cat.includes("biriyani") || cat.includes("biryani") || cat.includes("rice")) return "🍲";
  if (cat.includes("drink") || cat.includes("beverage") || cat.includes("juice") || cat.includes("shake") || cat.includes("coffee") || cat.includes("tea")) return "🥤";
  if (cat.includes("dessert") || cat.includes("cake") || cat.includes("sweet") || cat.includes("ice cream")) return "🍰";
  if (cat.includes("starter") || cat.includes("snack") || cat.includes("appetizer") || cat.includes("fried")) return "🍢";
  if (cat.includes("bread") || cat.includes("nan") || cat.includes("roti") || cat.includes("parotta")) return "🫓";
  return "🏷️";
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

export function getTheme(storeData) {
  return { 
    bg: "bg-[#d03d56]", 
    hoverBg: "hover:bg-[#a02240]",
    lightBg: "bg-[#FAF5F6]",
    colorCode: "#d03d56", 
    primary: "text-[#d03d56]",
    borderCode: "border-[#d03d56]",
    textCode: "text-[#d03d56]"
  };
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

export default function Storefront() {
  const { storeSlug } = useParams();

  const [storeData, setStoreData] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [showStoreInfoModal, setShowStoreInfoModal] = useState(false);
  
  const [customerUser, setCustomerUser] = useState(() => {
    try {
      const stored = localStorage.getItem(`customerUser_${storeSlug}`);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  
  const [openFaq, setOpenFaq] = useState(null);
  const [vegFilter, setVegFilter] = useState("all"); // all | veg | non-veg
  const [sortBy, setSortBy] = useState("default"); // default, price-low, price-high, prep-time, rating
  const [offersOnly, setOffersOnly] = useState(false);
  const [fastPrepOnly, setFastPrepOnly] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  const [likedProducts, setLikedProducts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`likes_${storeSlug}`)) || [];
    } catch { return []; }
  });

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [cartCount, setCartCount] = useState(() => {
    try {
      const cart = JSON.parse(localStorage.getItem(`cart_${storeSlug}`)) || [];
      return cart.reduce((s, i) => s + i.quantity, 0);
    } catch { return 0; }
  });

  const [cartTotal, setCartTotal] = useState(() => {
    try {
      const cart = JSON.parse(localStorage.getItem(`cart_${storeSlug}`)) || [];
      return cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    } catch { return 0; }
  });

  const fetchStoreAndProducts = () => {
    const slug = (storeSlug || "").toLowerCase().trim();
    Promise.all([
      axios.get(`/api/stores/${slug}`).catch(() => ({ data: null })),
      axios.get(`/api/products/${slug}`).catch(() => ({ data: [] }))
    ])
      .then(([storeRes, productsRes]) => {
        setStoreData(storeRes.data);
        const fetched = Array.isArray(productsRes?.data) ? productsRes.data : productsRes?.data?.products || [];
        setProducts(fetched);
        setLoading(false);
      })
      .catch(() => {
        setStoreData(null);
        setProducts([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStoreAndProducts();
    const interval = setInterval(() => {
      fetchStoreAndProducts();
    }, 8000); // Live sync polling every 8s
    window.addEventListener("focus", fetchStoreAndProducts);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", fetchStoreAndProducts);
    };
  }, [storeSlug]);

  useEffect(() => {
    const displayName = getStoreDisplayName(storeData, storeSlug);
    document.title = `${displayName} | HighP Store`;
  }, [storeData, storeSlug]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => 
        (p.name || "").toLowerCase().includes(q) || 
        (p.category || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      );
    }
    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter((p) => (p.category || "").toLowerCase().trim() === selectedCategory.toLowerCase().trim());
    }
    if (vegFilter === "veg") {
      result = result.filter(p => !checkIsNonVeg(p));
    }
    if (vegFilter === "non-veg") {
      result = result.filter(p => checkIsNonVeg(p));
    }
    if (offersOnly) {
      result = result.filter(p => Number(p.offerPrice || p.discountPrice || 0) > 0);
    }
    if (fastPrepOnly) {
      result = result.filter(p => {
        const timeStr = String(p.prepTime || p.preparationTime || "").toLowerCase();
        const mins = parseInt(timeStr, 10);
        return mins <= 15 || timeStr.includes("10") || timeStr.includes("15") || timeStr.includes("5");
      });
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortBy === "prep-time") {
      result.sort((a, b) => {
        const aMins = parseInt(String(a.prepTime || 15), 10) || 15;
        const bMins = parseInt(String(b.prepTime || 15), 10) || 15;
        return aMins - bMins;
      });
    } else if (sortBy === "rating") {
      result.sort((a, b) => Number(b.rating || 4.5) - Number(a.rating || 4.5));
    }

    return result;
  }, [products, searchQuery, selectedCategory, vegFilter, offersOnly, fastPrepOnly, sortBy]);

  const addToCart = (product, variantObj) => {
    const variants = getProductVariants(product);
    const selected = variantObj || variants[selectedVariants[product._id] || 0] || variants[0];
    const cartItemId = `${product._id}_${selected.name}`;
    const cartItemName = `${product.name} (${selected.name})`;

    const existing = JSON.parse(localStorage.getItem(`cart_${storeSlug}`)) || [];
    const idx = existing.findIndex(i => i._id === cartItemId || (i.productId === product._id && i.variantLabel === selected.name));
    
    if (idx > -1) {
      existing[idx].quantity += 1;
    } else {
      existing.push({
        _id: cartItemId,
        productId: product._id,
        name: cartItemName,
        price: selected.price,
        variantLabel: selected.name,
        quantity: 1,
        image: getFoodImage(product),
        isNonVeg: checkIsNonVeg(product)
      });
    }
    localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(existing));
    setCartCount(existing.reduce((s, i) => s + i.quantity, 0));
    setCartTotal(existing.reduce((s, i) => s + (i.price * i.quantity), 0));
  };

  const updateCartQty = (cartItemId, delta) => {
    const existing = JSON.parse(localStorage.getItem(`cart_${storeSlug}`)) || [];
    const idx = existing.findIndex(i => i._id === cartItemId);
    if (idx > -1) {
      existing[idx].quantity += delta;
      if (existing[idx].quantity <= 0) existing.splice(idx, 1);
      localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(existing));
      setCartCount(existing.reduce((s, i) => s + i.quantity, 0));
      setCartTotal(existing.reduce((s, i) => s + (i.price * i.quantity), 0));
    }
  };

  const getProductQty = (cartItemId) => {
    const cart = JSON.parse(localStorage.getItem(`cart_${storeSlug}`)) || [];
    const item = cart.find(i => i._id === cartItemId);
    return item ? item.quantity : 0;
  };

  const toggleLike = (productId) => {
    setLikedProducts(prev => {
      const next = prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId];
      localStorage.setItem(`likes_${storeSlug}`, JSON.stringify(next));
      return next;
    });
  };

  const handleSignOut = () => {
    localStorage.removeItem(`customerUser_${storeSlug}`);
    setCustomerUser(null);
    setUserMenuOpen(false);
  };
  
  const categories = useMemo(() => {
    const custom = storeData?.customCategories || [];
    const fromProducts = products.map(p => p.category).filter(Boolean);
    const combined = Array.from(new Set(["All", ...custom, ...fromProducts]));
    if (combined.length <= 1) {
      return ["All", "Mains", "Starters", "Sides", "Beverages", "Desserts"];
    }
    return combined;
  }, [storeData, products]);

  const categoryCounts = useMemo(() => {
    const map = {};
    products.forEach(p => {
      const c = p.category ? p.category.trim() : "All";
      map[c] = (map[c] || 0) + 1;
    });
    map["All"] = products.length;
    return map;
  }, [products]);

  const theme = useMemo(() => getTheme(storeData), [storeData]);

  const freeDeliveryThreshold = Number(storeData?.freeDeliveryAbove) || 0;
  const isFreeDeliveryUnlocked = freeDeliveryThreshold > 0 && cartTotal >= freeDeliveryThreshold;
  const freeDeliveryProgress = freeDeliveryThreshold > 0 ? Math.min(100, (cartTotal / freeDeliveryThreshold) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#d03d56] mb-2" />
        <p className="text-xs font-bold text-neutral-400">Loading catalog...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans pb-32 md:pb-20">
      
      {/* ─── HEADER BAND WITH STORE OWNER DETAILS & STATUS BADGES ─── */}
      <div className="bg-[#d03d56] text-white pt-6 pb-12 px-4 relative shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            {storeData?.logoUrl ? (
              <img 
                src={storeData.logoUrl} 
                alt={getStoreDisplayName(storeData, storeSlug)} 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-md shrink-0 bg-white" 
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs shrink-0 border-2 border-white/30 shadow-md">
                <Store className="w-8 h-8 text-white" />
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight uppercase leading-tight font-manrope">
                  {getStoreDisplayName(storeData, storeSlug)}
                </h1>
                <button
                  onClick={() => setShowStoreInfoModal(true)}
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                  title="Store Info & Operating Hours"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>

              {storeData?.tagline && (
                <p className="text-xs text-white/90 font-medium italic leading-none">{storeData.tagline}</p>
              )}

              {/* Badges Row: Open Status, Prep Time, Delivery Fee */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1.5 text-[9px] font-bold">
                <span className={`px-2.5 py-0.5 rounded-full flex items-center gap-1 ${storeData?.storeIsOpen !== false ? "bg-emerald-500/90 text-white" : "bg-red-900/90 text-white"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${storeData?.storeIsOpen !== false ? "bg-white animate-pulse" : "bg-red-300"}`} />
                  {storeData?.storeIsOpen !== false ? "Open Now" : "Closed"}
                </span>

                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {storeData?.estimatedDeliveryTime || "30-45 Mins"}
                </span>

                {storeData?.minOrderAmount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                    Min Order: ₹{storeData.minOrderAmount}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {customerUser ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="w-8 h-8 rounded-full bg-white/20 text-white border border-white/10 font-bold text-xs flex items-center justify-center cursor-pointer">
                  {customerUser?.name?.charAt(0)?.toUpperCase()}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 shadow-xl rounded-2xl p-1.5 z-50">
                    <Link to={`/${storeSlug}/profile`} className="block w-full text-left px-3 py-2 text-[10px] font-bold text-neutral-600 hover:bg-neutral-50 rounded-xl">My Orders</Link>
                    <button onClick={handleSignOut} className="w-full text-left px-3 py-2 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-xl cursor-pointer">Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setAuthModalOpen(true)} className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-3 py-1.5 rounded-xl border border-white/10 text-white cursor-pointer">
                Login
              </button>
            )}
            
            <Link to={`/${storeSlug}/cart`} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors relative">
              <ShoppingCart className="w-4 h-4 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-neutral-900 font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

        </div>
      </div>

      {/* FLOATING BAR SEARCH INPUT */}
      <div className="max-w-3xl mx-auto px-4 -mt-5 relative z-20">
        <div className="relative flex items-center bg-white border border-neutral-200 shadow-md rounded-full px-4 py-3">
          <Search className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            className="w-full bg-transparent text-xs font-medium text-neutral-800 placeholder-neutral-400 focus:outline-none" 
          />
        </div>
      </div>

      {/* SINGLE UNIFIED LIVE ANNOUNCEMENT BANNER (STORE CLOSED / BUSY MODE) */}
      {storeData?.storeIsOpen === false && (
        <div className="max-w-3xl mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-300 rounded-2xl p-3.5 flex items-center gap-3 text-red-950 shadow-2xs animate-pulse">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <p className="text-xs font-bold leading-snug">
              🔴 Store is currently CLOSED — Orders are temporarily paused. You can still browse products.
            </p>
          </div>
        </div>
      )}

      {storeData?.storeIsOpen !== false && storeData?.busyModeActive === true && (
        <div className="max-w-3xl mx-auto px-4 mt-4">
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 flex items-center gap-3 text-amber-950 shadow-2xs">
            <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-spin" />
            <p className="text-xs font-bold leading-snug">
              {storeData?.busyModeMessage || "High order volume! Deliveries may take slightly longer than usual."}
            </p>
          </div>
        </div>
      )}

      {/* FREE DELIVERY PROGRESS BAR BANNER */}
      {freeDeliveryThreshold > 0 && (
        <div className="max-w-4xl mx-auto px-4 mt-4">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-3 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                {isFreeDeliveryUnlocked 
                  ? "🎉 Congratulations! FREE Delivery Unlocked!" 
                  : `Add ₹${freeDeliveryThreshold - cartTotal} more for FREE Delivery!`}
              </span>
              <span className="text-[10px] font-mono font-black text-emerald-700">₹{cartTotal} / ₹{freeDeliveryThreshold}</span>
            </div>
            <div className="w-full h-2 bg-emerald-200/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* STORE INFO & OPERATING HOURS POPUP MODAL */}
      {showStoreInfoModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 relative overflow-hidden">
            <button
              onClick={() => setShowStoreInfoModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/80 hover:bg-white text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer z-10 border border-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>

            {storeData?.logoUrl && (
              <div className="w-full h-36 -mx-6 -mt-6 mb-2 bg-neutral-100 overflow-hidden relative">
                <img src={storeData.logoUrl} alt={getStoreDisplayName(storeData, storeSlug)} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-1">
              <h3 className="text-base font-black text-neutral-900 uppercase tracking-tight font-manrope">{getStoreDisplayName(storeData, storeSlug)}</h3>
              <p className="text-xs text-neutral-500 font-medium">{storeData?.tagline || "Store Overview & Details"}</p>
            </div>

            <div className="h-px bg-neutral-100" />

            <div className="space-y-3 text-xs">
              {storeData?.address && (
                <div className="flex items-start gap-2 text-neutral-700">
                  <MapPin className="w-4 h-4 text-[#d03d56] shrink-0 mt-0.5" />
                  <span>{storeData.address}</span>
                </div>
              )}

              {(storeData?.phone || storeData?.whatsappNumber) && (
                <div className="flex items-center gap-2 text-neutral-700 font-mono">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{storeData.whatsappNumber || storeData.phone}</span>
                </div>
              )}

              <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-3 space-y-1.5">
                <span className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest">Delivery Details</span>
                <div className="flex justify-between text-neutral-800 font-bold">
                  <span>Est. Time:</span>
                  <span className="font-mono">{storeData?.estimatedDeliveryTime || "30-45 Mins"}</span>
                </div>
                <div className="flex justify-between text-neutral-800 font-bold">
                  <span>Min Order:</span>
                  <span className="font-mono">{storeData?.minOrderAmount > 0 ? `₹${storeData.minOrderAmount}` : "None"}</span>
                </div>
                <div className="flex justify-between text-neutral-800 font-bold">
                  <span>Free Delivery:</span>
                  <span className="font-mono">{storeData?.freeDeliveryAbove > 0 ? `Above ₹${storeData.freeDeliveryAbove}` : "N/A"}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowStoreInfoModal(false)}
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-955 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              Close Info
            </button>
          </div>
        </div>
      )}

      {/* ZOMATO STYLE CLEAN FILTER BAR */}
      <section className="max-w-4xl mx-auto px-4 pt-3 pb-1 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* DIETARY TOGGLE SWITCHES & QUICK FILTERS (HORIZONTALLY SCROLLABLE ON MOBILE) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs select-none">
            {/* VEG ONLY TOGGLE SWITCH */}
            <button
              type="button"
              onClick={() => setVegFilter(vegFilter === "veg" ? "all" : "veg")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all duration-200 cursor-pointer select-none shrink-0 ${
                vegFilter === "veg"
                  ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs font-extrabold"
                  : "bg-white border-neutral-200 text-neutral-600 hover:border-emerald-300 font-bold"
              }`}
            >
              <span className="w-3.5 h-3.5 border border-emerald-600 rounded-xs flex items-center justify-center p-[1px] bg-white shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              </span>
              <span className="text-[11px] tracking-tight">Veg Only</span>
              <div className={`w-6 h-3 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${vegFilter === "veg" ? "bg-emerald-600" : "bg-neutral-300"}`}>
                <div className={`w-2 h-2 rounded-full bg-white transition-transform duration-200 ${vegFilter === "veg" ? "translate-x-3" : "translate-x-0"}`} />
              </div>
            </button>

            {/* NON-VEG ONLY TOGGLE SWITCH */}
            <button
              type="button"
              onClick={() => setVegFilter(vegFilter === "non-veg" ? "all" : "non-veg")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all duration-200 cursor-pointer select-none shrink-0 ${
                vegFilter === "non-veg"
                  ? "bg-red-50 border-red-500 text-red-900 shadow-2xs font-extrabold"
                  : "bg-white border-neutral-200 text-neutral-600 hover:border-red-300 font-bold"
              }`}
            >
              <span className="w-3.5 h-3.5 border border-red-600 rounded-xs flex items-center justify-center p-[1px] bg-white shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              </span>
              <span className="text-[11px] tracking-tight">Non-Veg</span>
              <div className={`w-6 h-3 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${vegFilter === "non-veg" ? "bg-red-600" : "bg-neutral-300"}`}>
                <div className={`w-2 h-2 rounded-full bg-white transition-transform duration-200 ${vegFilter === "non-veg" ? "translate-x-3" : "translate-x-0"}`} />
              </div>
            </button>

            {/* OFFERS ONLY CHIP */}
            <button
              type="button"
              onClick={() => setOffersOnly(!offersOnly)}
              className={`px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                offersOnly ? "bg-amber-500 border-amber-500 text-white shadow-2xs" : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <Tag className="w-3 h-3" />
              <span>Offers</span>
            </button>

            {/* FAST PREP CHIP */}
            <button
              type="button"
              onClick={() => setFastPrepOnly(!fastPrepOnly)}
              className={`px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                fastPrepOnly ? "bg-[#d03d56] border-[#d03d56] text-white shadow-2xs" : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>Under 15 Mins</span>
            </button>

            {/* FULL FILTERS MODAL BUTTON */}
            <button
              type="button"
              onClick={() => setShowFilterModal(true)}
              className={`px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                (vegFilter !== "all" || offersOnly || fastPrepOnly || sortBy !== "default") ? "bg-neutral-900 border-neutral-900 text-white" : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Filters</span>
              {(vegFilter !== "all" || offersOnly || fastPrepOnly || sortBy !== "default") && (
                <span className="w-4 h-4 rounded-full bg-[#d03d56] text-white text-[9px] font-black flex items-center justify-center">
                  {(vegFilter !== "all" ? 1 : 0) + (offersOnly ? 1 : 0) + (fastPrepOnly ? 1 : 0) + (sortBy !== "default" ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          {(selectedCategory !== "All" || vegFilter !== "all" || offersOnly || fastPrepOnly || sortBy !== "default") && (
            <button
              onClick={() => {
                setSelectedCategory("All");
                setVegFilter("all");
                setOffersOnly(false);
                setFastPrepOnly(false);
                setSortBy("default");
              }}
              className="text-[10px] font-bold text-[#d03d56] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>✕ Clear Filters</span>
            </button>
          )}
        </div>

        {/* ALL CATEGORIES HORIZONTALLY SCROLLABLE CHIPS ON MOBILE */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 px-0.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] || (cat === "All" ? products.length : 0);

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                  isSelected
                    ? "bg-[#d03d56] text-white border border-[#d03d56] shadow-md shadow-[#d03d56]/20 font-black scale-[1.02]"
                    : "bg-white text-neutral-800 border border-neutral-200/90 hover:bg-neutral-50 hover:border-neutral-300"
                }`}
              >
                <span className="tracking-tight">{cat}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded-full leading-none transition-colors ${
                      isSelected ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 2-COLUMN APP RESPONSIVE PRODUCT GRID */}
      <section className="max-w-4xl mx-auto px-2 sm:px-4 mt-4">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-3 bg-neutral-50/60 border border-neutral-200/80 rounded-3xl my-6 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-[#d03d56]/10 text-[#d03d56] flex items-center justify-center mb-1 border border-[#d03d56]/20">
              <Store className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-black text-neutral-900 uppercase tracking-tight font-manrope">No Products Found</h3>
            <p className="text-xs text-neutral-500 max-w-xs font-medium">
              This store catalog does not have any matching products at the moment.
            </p>
            <Link to="/platform" className="mt-2 px-4 py-2.5 bg-[#d03d56] hover:bg-[#a02240] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-xs">
              ← Visit HighP Store Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {filteredProducts.map((product) => {
              const liked = likedProducts.includes(product._id);
              const isOutOfStock = product.inStock === false || product.isOutOfStock === true;
              const variants = getProductVariants(product);
              const selectedIdx = selectedVariants[product._id] ?? 0;
              const currentVariant = variants[selectedIdx] || variants[0];
              const cartItemId = `${product._id}_${currentVariant.name}`;
              const quantityInCart = getProductQty(cartItemId);

              return (
                <div key={product._id} className="group flex flex-col rounded-2xl border border-neutral-200 bg-white shadow-xs overflow-hidden hover:shadow-sm transition-shadow">
                  
                  <Link to={`/${storeSlug}/product/${product._id}`} className="relative aspect-square bg-neutral-50 overflow-hidden block cursor-pointer">
                    <img src={getFoodImage(product)} alt={product.name} loading="lazy" className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-102 ${isOutOfStock ? "opacity-60 grayscale-[35%]" : ""}`} />
                    
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                        <span className="bg-red-600 text-white font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    
                    <div className="absolute right-2 top-2 flex items-center gap-1 z-10">
                      <button 
                        type="button" 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          e.stopPropagation(); 
                          try {
                            const url = `${window.location.origin}/${storeSlug}/product/${product._id}`;
                            if (navigator.share) {
                              navigator.share({ title: product.name, url });
                            } else {
                              navigator.clipboard.writeText(url);
                              alert("Product link copied!");
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
                        }} 
                        className="rounded-full bg-white/90 p-1.5 text-neutral-600 shadow-xs hover:text-black cursor-pointer"
                        title="Share product link"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                      </button>

                      <button 
                        type="button" 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleLike(product._id); }} 
                        className="rounded-full bg-white/90 p-1.5 text-neutral-400 shadow-xs hover:text-[#d03d56] cursor-pointer"
                        title="Wishlist product"
                      >
                        <Heart className={`h-3.5 w-3.5 ${liked ? "fill-[#d03d56] text-[#d03d56]" : ""}`} />
                      </button>
                    </div>

                    <div className="absolute left-2 top-2 bg-white/90 p-1 rounded border border-neutral-100 backdrop-blur-xs">
                      <span className={`w-2.5 h-2.5 border rounded-xs flex items-center justify-center p-[1px] ${checkIsNonVeg(product) ? "border-red-600" : "border-emerald-600"}`} title={checkIsNonVeg(product) ? "Non-Veg" : "Veg"}>
                        <span className={`w-1.5 h-1.5 rounded-full ${checkIsNonVeg(product) ? "bg-red-600" : "bg-emerald-600"}`} />
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-neutral-900/80 px-2 py-0.5 text-[9px] font-bold text-white tracking-wide">
                      <Clock className="h-2.5 w-2.5 text-neutral-300" />
                      <span className="uppercase font-mono">{product.prepTime || product.preparationTime || "15-20 mins"}</span>
                    </div>
                  </Link>

                  <div className="p-3 flex flex-col flex-1 justify-between gap-2.5 bg-white">
                    <div className="space-y-2">
                      <Link to={`/${storeSlug}/product/${product._id}`} className="space-y-1 block group-hover:text-[#d03d56] transition-colors cursor-pointer">
                        <div className="flex items-start justify-between gap-1.5">
                          <h4 className="text-xs sm:text-sm font-bold text-neutral-900 tracking-tight leading-tight line-clamp-2 min-h-[2rem]">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-0.5 bg-emerald-600 text-white font-bold text-[8px] px-1 rounded shrink-0 mt-0.5">
                            <span>{product.rating || "4.5"}</span>
                            <span>★</span>
                          </div>
                        </div>
                      </Link>

                      {/* PORTION / QUANTITY DROPDOWN SELECTOR */}
                      <div className="relative">
                        <select
                          value={selectedIdx}
                          onChange={(e) => {
                            const newIdx = Number(e.target.value);
                            setSelectedVariants(prev => ({ ...prev, [product._id]: newIdx }));
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-lg text-[10px] font-bold text-neutral-800 px-2 py-1 focus:outline-none focus:border-[#d03d56] cursor-pointer appearance-none pr-5"
                        >
                          {variants.map((v, idx) => (
                            <option key={idx} value={idx}>
                              {v.name} &mdash; ₹{v.price}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[9px]">▼</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-neutral-100 mt-auto">
                      <span className="text-xs sm:text-sm font-black text-neutral-955 font-mono">₹{currentVariant.price}</span>
                      
                      {isOutOfStock ? (
                        <button type="button" disabled className="bg-neutral-100 border border-neutral-200 text-neutral-400 font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-lg cursor-not-allowed">
                          Out of Stock
                        </button>
                      ) : quantityInCart > 0 ? (
                        <div className="flex items-center bg-[#d03d56] text-white rounded-lg h-7 px-1 font-bold text-xs select-none">
                          <button onClick={(e) => { e.stopPropagation(); updateCartQty(cartItemId, -1); }} className="w-5 h-full bg-transparent border-none text-white text-sm font-bold cursor-pointer">-</button>
                          <span className="w-4 text-center text-[11px] font-black">{quantityInCart}</span>
                          <button onClick={(e) => { e.stopPropagation(); updateCartQty(cartItemId, 1); }} className="w-5 h-full bg-transparent border-none text-white text-sm font-bold cursor-pointer">+</button>
                        </div>
                      ) : (
                        <button type="button" onClick={(e) => { e.stopPropagation(); addToCart(product, currentVariant); }} className="bg-white border border-[#d03d56] text-[#d03d56] font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg hover:bg-[#d03d56] hover:text-white transition-all cursor-pointer">
                          Add
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* FLOATING ACTION BOTTOM TRAY — sits above the bottom nav on mobile */}
      {cartCount > 0 && (
        <div className="fixed bottom-[72px] md:bottom-5 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
          <Link to={`/${storeSlug}/cart`} className="flex items-center justify-between bg-neutral-900 text-white px-4 py-3.5 rounded-xl shadow-xl hover:bg-neutral-955 transition-all">
            <div className="flex items-center gap-2">
              <span className="bg-[#d03d56] text-white font-black text-[10px] px-2 py-0.5 rounded">{cartCount}</span>
              <span className="text-xs font-bold text-neutral-300">Items selected</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-black text-white font-mono">₹{cartTotal}</span>
              <span className="bg-[#d03d56] hover:bg-[#a02240] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-lg transition-colors">
                View Cart
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* ZOMATO STYLE FILTERS DRAWER MODAL */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200 border border-neutral-200">
            {/* MODAL HEADER */}
            <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/60">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#d03d56]" />
                <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 font-manrope">Filters &amp; Sorting</h3>
              </div>
              <button 
                onClick={() => setShowFilterModal(false)}
                className="p-1 rounded-full hover:bg-neutral-200 text-neutral-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* SORT BY SECTION */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-neutral-500 block">Sort Dishes By</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "default", label: "Relevance" },
                    { id: "price-low", label: "Price: Low to High" },
                    { id: "price-high", label: "Price: High to Low" },
                    { id: "prep-time", label: "Fastest Prep Time" }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSortBy(item.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                        sortBy === item.id 
                          ? "bg-[#d03d56]/10 border-[#d03d56] text-[#d03d56] shadow-2xs font-extrabold" 
                          : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* QUICK SPECIAL FILTERS */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-neutral-500 block">Special Food Filters</label>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-50 cursor-pointer">
                    <span className="text-xs font-bold text-neutral-800 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-amber-500" />
                      <span>Special Sale Offers Only</span>
                    </span>
                    <input 
                      type="checkbox" 
                      checked={offersOnly} 
                      onChange={(e) => setOffersOnly(e.target.checked)}
                      className="w-4 h-4 accent-[#d03d56] cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-50 cursor-pointer">
                    <span className="text-xs font-bold text-neutral-800 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#d03d56]" />
                      <span>Fast Preparation (Under 15 mins)</span>
                    </span>
                    <input 
                      type="checkbox" 
                      checked={fastPrepOnly} 
                      onChange={(e) => setFastPrepOnly(e.target.checked)}
                      className="w-4 h-4 accent-[#d03d56] cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setSortBy("default");
                  setOffersOnly(false);
                  setFastPrepOnly(false);
                  setVegFilter("all");
                }}
                className="text-xs font-bold text-neutral-600 hover:text-black cursor-pointer px-3 py-2"
              >
                Reset All
              </button>

              <button
                type="button"
                onClick={() => setShowFilterModal(false)}
                className="flex-1 bg-[#d03d56] hover:bg-[#a02240] text-white font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-md text-center"
              >
                Apply Filters ({filteredProducts.length} items)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PORTS COMPONENTS PROFILES */}
      <CustomerAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} storeSlug={storeSlug} theme={theme} onAuthSuccess={(user) => setCustomerUser(user)} />
      <OrderHistoryDrawer isOpen={historyDrawerOpen} onClose={() => setHistoryDrawerOpen(false)} storeSlug={storeSlug} theme={theme} />
      <CustomerProfileDrawer isOpen={profileDrawerOpen} onClose={() => setProfileDrawerOpen(false)} storeSlug={storeSlug} theme={theme} />

      {/* MOBILE STICKY BOTTOM NAV */}
      <MobileBottomNav storeSlug={storeSlug} cartCount={cartCount} />
    </div>
  );
}