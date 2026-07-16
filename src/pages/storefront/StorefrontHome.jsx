import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShoppingCart, Loader2, Search, User, Clock, Heart, Store
} from "lucide-react";
import axios from "axios";
import CustomerAuthModal from "../../components/CustomerAuthModal";
import OrderHistoryDrawer from "../../components/OrderHistoryDrawer";
import CustomerProfileDrawer from "../../components/CustomerProfileDrawer";

// ─── ADDED BACK FOR PRODUCTVIEW.JSX COMPATIBILITY ───────────
export function getVerticalDetails(softwareType) {
  const map = {
    restaurant: { categories: ["All", "Mains", "Sides", "Beverages", "Desserts"], actionLabel: "Add to Cart", productLabel: "Dish" },
    retail: { categories: ["All", "Apparel", "Electronics", "Wellness", "Home"], actionLabel: "Add to Basket", productLabel: "Product" }
  };
  return map[softwareType || "restaurant"] || map.restaurant;
}

// ─── THEME RESOLVER FOR SOFTWARE VERTICALS ─────────────────
const foodImagePool = [
  {
    keywords: ["chicken", "grill", "grilled", "tikka", "kebab", "bbq", "shawarma", "fry", "fried"],
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=900&q=80"
  },
  {
    keywords: ["fries", "potato", "crisp", "loaded"],
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=900&q=80"
  },
  {
    keywords: ["biryani", "rice", "pulao", "kuzhimanthi"],
    image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=900&q=80"
  },
  {
    keywords: ["fish", "prawns", "seafood", "meen", "karimeen"],
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80"
  },
  {
    keywords: ["dosa", "idli", "vada", "breakfast", "appam"],
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=80"
  },
  {
    keywords: ["juice", "cool drink", "mango", "smoothie"],
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=900&q=80"
  }
];

export function getFoodImage(product) {
  const text = `${product?.name || ""} ${product?.description || ""}`.toLowerCase();
  const match = foodImagePool.find((item) => item.keywords.some((keyword) => text.includes(keyword)));
  return match?.image || "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80";
}

export function getTheme(storeData) {
  return { 
    bg: "bg-[#d03d56]", 
    hoverBg: "hover:bg-[#a02240]",
    colorCode: "#d03d56", 
    primary: "text-[#d03d56]",
    borderCode: "border-[#d03d56]",
    textCode: "text-[#d03d56]"
  };
}

export default function Storefront() {
  const { storeSlug } = useParams();

  const [storeData, setStoreData] = useState(null);
  const [products, setProducts] = useState([]);
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
  const [vegFilter, setVegFilter] = useState("all");
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
      axios.get(`/api/stores/${slug}`),
      axios.get(`/api/products/${slug}`)
    ])
      .then(([storeRes, productsRes]) => {
        setStoreData(storeRes.data);
        const fetched = Array.isArray(productsRes?.data) ? productsRes.data : productsRes?.data?.products || [];
        setProducts(fetched);
        setLoading(false);
      })
      .catch(() => {
        setStoreData({ name: "Taste and park", softwareType: "restaurant", customCategories: ["Mains", "Sides", "Beverages"] });
        setProducts([
          { _id: "p1", name: "Premium Mutton Biryani", price: 340, variantLabel: "Full Portion", preparationTime: 20, isNonVeg: true, rating: "4.9", category: "Mains" },
          { _id: "p2", name: "Double Cheese Crunch Burger", price: 160, variantLabel: "1 Pcs", preparationTime: 12, isNonVeg: false, rating: "4.7", category: "Mains" },
          { _id: "p3", name: "Peri Peri Loaded Fries", price: 190, variantLabel: "Reg Box", preparationTime: 8, isNonVeg: false, rating: "4.5", category: "Sides" },
          { _id: "p4", name: "Classic Grilled Chicken Shawarma", price: 180, variantLabel: "1 Roll", preparationTime: 15, isNonVeg: true, rating: "4.8", category: "Mains" }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStoreAndProducts();
  }, [storeSlug]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => (p.name || "").toLowerCase().includes(q));
    }
    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter((p) => (p.category || "").toLowerCase() === selectedCategory.toLowerCase());
    }
    if (vegFilter === "veg") result = result.filter(p => !p.isNonVeg);
    if (vegFilter === "non-veg") result = result.filter(p => p.isNonVeg);
    return result;
  }, [products, searchQuery, selectedCategory, vegFilter]);

  const addToCart = (product) => {
    const existing = JSON.parse(localStorage.getItem(`cart_${storeSlug}`)) || [];
    const idx = existing.findIndex(i => i._id === product._id);
    if (idx > -1) {
      existing[idx].quantity += 1;
    } else {
      existing.push({ ...product, quantity: 1 });
    }
    localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(existing));
    setCartCount(existing.reduce((s, i) => s + i.quantity, 0));
    setCartTotal(existing.reduce((s, i) => s + (i.price * i.quantity), 0));
  };

  const updateCartQty = (productId, delta) => {
    const existing = JSON.parse(localStorage.getItem(`cart_${storeSlug}`)) || [];
    const idx = existing.findIndex(i => i._id === productId);
    if (idx > -1) {
      existing[idx].quantity += delta;
      if (existing[idx].quantity <= 0) existing.splice(idx, 1);
      localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(existing));
      setCartCount(existing.reduce((s, i) => s + i.quantity, 0));
      setCartTotal(existing.reduce((s, i) => s + (i.price * i.quantity), 0));
    }
  };

  const getProductQty = (productId) => {
    const cart = JSON.parse(localStorage.getItem(`cart_${storeSlug}`)) || [];
    const item = cart.find(i => i._id === productId);
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

  const theme = useMemo(() => getTheme(storeData), [storeData]);
  const categories = useMemo(() => {
    return storeData?.customCategories?.length > 0 ? ["All", ...storeData.customCategories] : ["All", "Mains", "Sides", "Beverages"];
  }, [storeData]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#d03d56] mb-2" />
        <p className="text-xs font-bold text-neutral-400">Loading catalog...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans pb-32">
      
      {/* ─── HEADER BAND ─── */}
      <div className="bg-[#d03d56] text-white pt-6 pb-10 px-4 relative shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight uppercase leading-tight font-manrope">{storeData?.name || "Storefront"}</h1>
              <p className="text-[10px] text-white/80 font-medium">{storeData?.softwareType === 'restaurant' ? 'Restaurant & Café' : 'Store'} &middot; {products?.length || 0} products</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
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

      {/* FILTER CAROUSEL */}
      <section className="max-w-4xl mx-auto px-4 pt-6 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <button onClick={() => setVegFilter(vegFilter === "veg" ? "all" : "veg")} className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${vegFilter === "veg" ? "bg-emerald-50 border-emerald-400 text-emerald-700" : "bg-white border-neutral-200 text-neutral-600"}`}>
            Veg
          </button>
          <button onClick={() => setVegFilter(vegFilter === "non-veg" ? "all" : "non-veg")} className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${vegFilter === "non-veg" ? "bg-red-50 border-red-400 text-red-700" : "bg-white border-neutral-200 text-neutral-600"}`}>
            Non-Veg
          </button>
          <div className="w-px h-4 bg-neutral-200 mx-1 shrink-0" />
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-1.5 rounded-full text-[11px] font-bold border whitespace-nowrap transition-all cursor-pointer ${selectedCategory === cat ? "bg-[#d03d56] border-[#d03d56] text-white" : "bg-white border-neutral-200 text-neutral-500"}`}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 2-COLUMN APP RESPONSIVE PRODUCT GRID */}
      <section className="max-w-4xl mx-auto px-2 sm:px-4 mt-4">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-neutral-400 space-y-3">
            <Store className="w-12 h-12 text-neutral-200" />
            <p className="text-xs font-bold">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {filteredProducts.map((product) => {
              const liked = likedProducts.includes(product._id);
              const quantityInCart = getProductQty(product._id);

              return (
                <div key={product._id} className="group flex flex-col rounded-2xl border border-neutral-200 bg-white shadow-xs overflow-hidden hover:shadow-sm transition-shadow">
                  
                  <div className="relative aspect-square bg-neutral-50 overflow-hidden">
                    <img src={getFoodImage(product)} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102" />
                    
                    <button type="button" onClick={() => toggleLike(product._id)} className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-neutral-400 shadow-xs hover:text-[#d03d56] cursor-pointer">
                      <Heart className={`h-3.5 w-3.5 ${liked ? "fill-[#d03d56] text-[#d03d56]" : ""}`} />
                    </button>

                    <div className="absolute left-2 top-2 bg-white/90 p-1 rounded border border-neutral-100 backdrop-blur-xs">
                      <span className={`w-2.5 h-2.5 border rounded-xs flex items-center justify-center p-[1px] ${product.isNonVeg ? "border-red-600" : "border-emerald-600"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${product.isNonVeg ? "bg-red-600" : "bg-emerald-600"}`} />
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-neutral-900/80 px-2 py-0.5 text-[9px] font-bold text-white tracking-wide">
                      <Clock className="h-2.5 w-2.5 text-neutral-300" />
                      <span>{product.preparationTime || "15"} MINS</span>
                    </div>
                  </div>

                  <div className="p-3 flex flex-col flex-1 justify-between gap-3 bg-white">
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-1.5">
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900 tracking-tight leading-tight line-clamp-2 min-h-[2rem]">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-0.5 bg-emerald-600 text-white font-bold text-[8px] px-1 rounded shrink-0">
                          <span>{product.rating || "4.5"}</span>
                          <span>★</span>
                        </div>
                      </div>

                      {product.variantLabel && (
                        <span className="inline-block text-[9px] font-bold text-neutral-400 bg-neutral-50 border border-neutral-200 rounded px-1.5 py-0.5 uppercase tracking-wider">
                          {product.variantLabel}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-neutral-100 mt-auto">
                      <span className="text-xs sm:text-sm font-black text-neutral-955 font-mono">₹{product.price}</span>
                      
                      {quantityInCart > 0 ? (
                        <div className="flex items-center bg-[#d03d56] text-white rounded-lg h-7 px-1 font-bold text-xs select-none">
                          <button onClick={() => updateCartQty(product._id, -1)} className="w-5 h-full bg-transparent border-none text-white text-sm font-bold">-</button>
                          <span className="w-4 text-center text-[11px] font-black">{quantityInCart}</span>
                          <button onClick={() => updateCartQty(product._id, 1)} className="w-5 h-full bg-transparent border-none text-white text-sm font-bold">+</button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => addToCart(product)} className="bg-white border border-[#d03d56] text-[#d03d56] font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg hover:bg-[#d03d56] hover:text-white transition-all cursor-pointer">
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

      {/* FLOATING ACTION BOTTOM TRAY */}
      {cartCount > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
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

      {/* PORTS COMPONENTS PROFILES */}
      <CustomerAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} storeSlug={storeSlug} theme={theme} onAuthSuccess={(user) => setCustomerUser(user)} />
      <OrderHistoryDrawer isOpen={historyDrawerOpen} onClose={() => setHistoryDrawerOpen(false)} storeSlug={storeSlug} theme={theme} />
      <CustomerProfileDrawer isOpen={profileDrawerOpen} onClose={() => setProfileDrawerOpen(false)} storeSlug={storeSlug} theme={theme} />
    </div>
  );
}