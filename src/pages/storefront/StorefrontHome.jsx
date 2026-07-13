import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShoppingCart, Loader2, AlertCircle, Sparkles, Star, Search, Filter, User,
  Mail, Lock, Phone, ShieldCheck, RefreshCw, Store, ArrowRight, Clock, CheckCircle2,
  ChevronDown, MessageCircle, MapPin, Heart, Plus, Minus, ChevronRight, Check
} from "lucide-react";
import axios from "axios";
import CustomerAuthModal from "../../components/CustomerAuthModal";
import OrderHistoryDrawer from "../../components/OrderHistoryDrawer";
import CustomerProfileDrawer from "../../components/CustomerProfileDrawer";

// ─── THEME RESOLVER FOR SOFTWARE VERTICALS ─────────────────
export function getTheme(storeData) {
  const defaults = {
    primary: "text-[#D03D56]",
    bg: "bg-[#D03D56]",
    hover: "hover:bg-[#3F0712]",
    border: "border-[#D03D56]/15",
    lightBg: "bg-[#D03D56]/8",
    glow: "shadow-[#D03D56]/15",
    colorCode: "#D03D56"
  };
  if (!storeData) return defaults;

  const type = storeData.softwareType || "restaurant";
  const map = {
    restaurant: {
      primary: "text-[#D03D56]",
      bg: "bg-[#D03D56]",
      hover: "hover:bg-[#3F0712]",
      border: "border-[#D03D56]/15",
      lightBg: "bg-[#D03D56]/8",
      glow: "shadow-[#D03D56]/15",
      colorCode: "#D03D56"
    },
    retail: {
      primary: "text-blue-600",
      bg: "bg-blue-600",
      hover: "hover:bg-blue-700",
      border: "border-blue-600/15",
      lightBg: "bg-blue-50",
      glow: "shadow-blue-600/15",
      colorCode: "#2563eb"
    },
    workshop: {
      primary: "text-emerald-600",
      bg: "bg-emerald-600",
      hover: "hover:bg-emerald-700",
      border: "border-emerald-600/15",
      lightBg: "bg-emerald-50",
      glow: "shadow-emerald-600/15",
      colorCode: "#059669"
    },
    salon: {
      primary: "text-rose-600",
      bg: "bg-rose-600",
      hover: "hover:bg-rose-700",
      border: "border-rose-600/15",
      lightBg: "bg-rose-50",
      glow: "shadow-rose-600/15",
      colorCode: "#e11d48"
    },
    water: {
      primary: "text-sky-600",
      bg: "bg-sky-600",
      hover: "hover:bg-sky-700",
      border: "border-sky-600/15",
      lightBg: "bg-sky-50",
      glow: "shadow-sky-600/15",
      colorCode: "#0284c7"
    },
    gym: {
      primary: "text-purple-600",
      bg: "bg-purple-600",
      hover: "hover:bg-purple-700",
      border: "border-purple-600/15",
      lightBg: "bg-purple-50",
      glow: "shadow-purple-600/15",
      colorCode: "#9333ea"
    },
    repair: {
      primary: "text-slate-600",
      bg: "bg-slate-600",
      hover: "hover:bg-slate-700",
      border: "border-slate-600/15",
      lightBg: "bg-slate-50",
      glow: "shadow-slate-600/15",
      colorCode: "#475569"
    }
  };

  return map[type] || defaults;
}

// ─── BRANDING AND UI VOCABULARY FOR SOFTWARE VERTICALS ──────
export function getVerticalDetails(softwareType) {
  const map = {
    restaurant: {
      categories: ["All", "Mains", "Sides", "Beverages", "Desserts"],
      actionLabel: "Add to Cart",
      productLabel: "Dish",
      welcomeSubtitle: "Experience luxury handcrafted delicacies delivered instantly to your counter.",
      taglineDefault: "Gourmet Artisan Kitchen"
    },
    retail: {
      categories: ["All", "Apparel", "Electronics", "Wellness", "Home"],
      actionLabel: "Add to Basket",
      productLabel: "Product",
      welcomeSubtitle: "Curated premium items sourced directly to verify authentic quality.",
      taglineDefault: "Premium Retail Hub"
    },
    workshop: {
      categories: ["All", "Creative", "Tech", "Business", "Fitness"],
      actionLabel: "Book Workshop",
      productLabel: "Class",
      welcomeSubtitle: "Join our expert-led sessions to elevate your practical knowledge and skills.",
      taglineDefault: "Interactive Learning Space"
    },
    salon: {
      categories: ["All", "Hair", "Massage", "Nails", "Skincare"],
      actionLabel: "Book Appointment",
      productLabel: "Service",
      welcomeSubtitle: "Indulge in premium styling, grooming, and restorative beauty therapy sessions.",
      taglineDefault: "Elite Grooming Studio"
    },
    water: {
      categories: ["All", "Daily Plans", "Weekly Plans", "Bulk Packages"],
      actionLabel: "Subscribe Plan",
      productLabel: "Subscription",
      welcomeSubtitle: "Seamless high-quality pure hydration plans scheduled and delivered right to you.",
      taglineDefault: "Fluid Hydration Logistics"
    },
    gym: {
      categories: ["All", "Passes", "Memberships", "Training Sessions"],
      actionLabel: "Buy Membership",
      productLabel: "Tier",
      welcomeSubtitle: "Unlock unlimited gym tier gates, trainers access, and auto-renew fitness passes.",
      taglineDefault: "Fitness Node"
    },
    repair: {
      categories: ["All", "Appliance", "Electronics", "Plumbing", "Electrical"],
      actionLabel: "Schedule Repair",
      productLabel: "Repair Plan",
      welcomeSubtitle: "Certified technician operations dispatch for rapid repair, restore, and care.",
      taglineDefault: "Certified Repairs Desk"
    }
  };
  return map[softwareType || "restaurant"] || map.restaurant;
}

// ─── DYNAMIC SUBSTRING FILTERING BASED ON CURRENT CATEGORIES ─
export function matchCategory(productName, category, softwareType) {
  const name = (productName || "").toLowerCase();
  const cat = (category || "").toLowerCase();
  
  if (cat === "all") return true;

  const mapping = {
    restaurant: {
      mains: ["burger", "sandwich", "smash", "pizza", "pasta", "rice", "chicken", "salad", "bowl", "roll", "taco", "dosa", "roti", "curry", "paneer", "alfham", "shawarma"],
      sides: ["fries", "salad", "chips", "nuggets", "rings", "sauce", "dip", "samosa"],
      beverages: ["latte", "coffee", "tea", "drink", "juice", "soda", "water", "shake", "coke", "brew", "lassi"],
      desserts: ["cheesecake", "tart", "cake", "sweet", "ice", "cookie", "brownie", "muffin", "donut", "gulab", "halwa"]
    },
    retail: {
      apparel: ["shirt", "pant", "shoe", "jacket", "hoodie", "tee", "sock", "hat", "wear", "dress", "jeans"],
      electronics: ["phone", "charger", "cable", "headphone", "watch", "screen", "pad", "usb", "audio"],
      wellness: ["oil", "serum", "cream", "lotion", "soap", "herb", "vitamin", "organic", "wellness", "supplement"],
      home: ["cup", "candle", "rug", "mug", "bag", "desk", "sheet", "light", "decor", "cushion"]
    },
    workshop: {
      creative: ["art", "painting", "craft", "design", "photo", "music", "dance", "pottery", "writing"],
      tech: ["code", "react", "node", "python", "web", "ai", "data", "dev", "programming", "js"],
      business: ["marketing", "sales", "startup", "finance", "leadership", "business", "seo", "product"],
      fitness: ["yoga", "pilates", "cardio", "strength", "hiit", "zumba", "meditation"]
    },
    salon: {
      hair: ["cut", "trim", "color", "blow", "style", "shave", "beard", "spa", "shampoo"],
      massage: ["body", "foot", "head", "stone", "thai", "swedish", "deep", "therapy"],
      nails: ["mani", "pedi", "gel", "polish", "acrylic", "nail"],
      skincare: ["facial", "peel", "scrub", "mask", "tone", "wax", "laser"]
    },
    gym: {
      passes: ["day", "week", "guest", "trial", "pass"],
      memberships: ["monthly", "annual", "seasonal", "elite", "basic", "member", "membership"],
      "training sessions": ["personal", "coach", "private", "group", "trainer", "session"]
    },
    water: {
      "daily plans": ["daily", "recurring", "everyday"],
      "weekly plans": ["weekly", "monthly", "bi-weekly"],
      "bulk packages": ["bulk", "case", "box", "pack", "crate", "pallet", "liter", "litre", "jar", "can"]
    },
    repair: {
      appliance: ["fridge", "oven", "washer", "dryer", "ac", "refrigerator", "microwave"],
      electronics: ["screen", "battery", "jack", "port", "glass", "laptop", "pc", "console"],
      plumbing: ["pipe", "leak", "tap", "sink", "toilet", "drain", "clog", "faucet"],
      electrical: ["wire", "switch", "fuse", "fan", "light", "panel", "breaker", "outlet"]
    }
  };

  const currentType = softwareType || "restaurant";
  const typeMap = mapping[currentType] || mapping.restaurant;
  
  const keywords = typeMap[cat] || [];
  return keywords.some(keyword => name.includes(keyword));
}

const storeCategoryLabels = {
  restaurant: "Restaurant",
  bakery: "Bakery",
  restaurant_bakery: "Restaurant & Bakery",
  cafe: "Café",
  fastfood: "Fast Food / Street Food",
  juice_bar: "Juice Bar",
  sweets_shop: "Sweets & Mithai",
  ice_cream: "Ice Cream Parlour",
  grocery: "Grocery & Kirana",
  retail: "Retail Shop",
  pharmacy: "Pharmacy",
  electronics: "Electronics Store",
  clothing: "Clothing & Apparel",
  stationery: "Stationery & Books",
  salon: "Salon & Spa",
  gym: "Gym & Fitness",
  water: "Water Delivery",
  workshop: "Workshop / Classes",
  repair: "Repair Services",
  other: "Store",
};

const getStoredCustomer = (slug) => {
  if (!slug) return null;
  try {
    const stored = localStorage.getItem(`customerUser_${slug}`);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const normalizeProducts = (value) => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value.products)) return value.products;
  if (Array.isArray(value.data)) return value.data;
  return [];
};

export default function Storefront() {
  const { storeSlug } = useParams();

  const [storeData, setStoreData] = useState(null);
  const [products, setProducts] = useState([]);
  const [customerUser, setCustomerUser] = useState(() => getStoredCustomer(storeSlug));
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState(null); // Product Details modal
  const [productModalQty, setProductModalQty] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [likedProducts, setLikedProducts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`likes_${storeSlug}`)) || [];
    } catch { return []; }
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const syncUser = () => {
      try {
        setCustomerUser(JSON.parse(localStorage.getItem(`customerUser_${storeSlug}`)) || null);
      } catch {}
    };
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, [storeSlug]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
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

  // Derive custom categories flag early so it's available in the useEffect below
  const useCustomCats = !!(storeData?.customCategories?.length > 0);

  // Fetch store and products
  const fetchStoreAndProducts = () => {
    const slug = (storeSlug || "").toLowerCase().trim();
    Promise.all([
      axios.get(`/api/stores/${slug}`),
      axios.get(`/api/products/${slug}`)
    ])
      .then(([storeRes, productsRes]) => {
        setStoreData(storeRes.data);
        setProducts(normalizeProducts(productsRes?.data || productsRes));
        setLoading(false);
      })
      .catch((err) => {
        console.error("MNC Tenant Gateway Connection Failure:", err);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetchStoreAndProducts();
  }, [storeSlug]);

  const filteredProducts = useMemo(() => {
    let result = Array.isArray(products) ? products : [];

    if (result.length === 0) {
      result = [
        {
          _id: "demo-alfham",
          name: "Chicken Alfham",
          description: "Signature grilled chicken platter with house spices and fresh toppings.",
          price: 220,
          image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80"
        },
        {
          _id: "demo-shawarma",
          name: "Chicken Shawarma Wrap",
          description: "Crispy wrap filled with spiced chicken, sauce, and salad.",
          price: 180,
          image: "https://images.unsplash.com/photo-1512838243194-3c0b4f2f0e8f?auto=format&fit=crop&w=900&q=80"
        },
        {
          _id: "demo-lassi",
          name: "Sweet Lassi",
          description: "Refreshing chilled yogurt drink served cold.",
          price: 90,
          image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=900&q=80"
        }
      ];
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "All" && storeData) {
      if (useCustomCats) {
        result = result.filter((p) => (p.category || "").toLowerCase() === selectedCategory.toLowerCase());
      } else {
        result = result.filter((p) => matchCategory(p.name, selectedCategory, storeData.softwareType));
      }
    }

    return result;
  }, [products, searchQuery, selectedCategory, storeData, useCustomCats]);

  // Inject dynamic JSON-LD Schema for SEO
  useEffect(() => {
    if (storeData) {
      const existingScript = document.getElementById("jsonld-schema");
      if (existingScript) existingScript.remove();

      const schema = {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": storeData.name,
        "image": storeData.logoUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
        "telephone": storeData.phone || "+91 99999 99999",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": storeData.address || "Main Street",
          "addressLocality": storeData.location || "City",
          "addressCountry": "IN"
        },
        "priceRange": "₹₹"
      };

      const script = document.createElement("script");
      script.id = "jsonld-schema";
      script.type = "application/ld+json";
      script.innerHTML = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [storeData]);

  const addToCart = (product, quantitySelected = 1) => {
    const existing = JSON.parse(localStorage.getItem(`cart_${storeSlug}`)) || [];
    const idx = existing.findIndex(i => i._id === product._id);
    if (idx > -1) {
      existing[idx].quantity += quantitySelected;
    } else {
      existing.push({ ...product, quantity: quantitySelected });
    }
    localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(existing));
    
    const totalQty = existing.reduce((s, i) => s + i.quantity, 0);
    const totalAmt = existing.reduce((s, i) => s + (i.price * i.quantity), 0);
    setCartCount(totalQty);
    setCartTotal(totalAmt);
  };

  const toggleLike = (productId) => {
    setLikedProducts(prev => {
      const next = prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId];
      localStorage.setItem(`likes_${storeSlug}`, JSON.stringify(next));
      return next;
    });
  };

  const softwareType = storeData?.softwareType || "restaurant";
  const details = useMemo(() => getVerticalDetails(softwareType), [softwareType]);
  const theme = useMemo(() => getTheme(storeData), [storeData]);
  
  // Use owner-defined custom categories if present, else vertical defaults
  const defaultCategories = details.categories;
  const customCats = storeData?.customCategories?.length > 0 ? storeData.customCategories : null;
  const categories = customCats ? ["All", ...customCats] : defaultCategories;

  const handleSignOut = () => {
    localStorage.removeItem(`customerUser_${storeSlug}`);
    setCustomerUser(null);
    setUserMenuOpen(false);
  };

  const userInitial = customerUser?.name?.charAt(0)?.toUpperCase() || "U";

  // Compute delay
  const prepTimeOffset = storeData?.busyModeActive ? (storeData.busyModeDuration || 0) : 0;
  const standardPrepTime = 20 + prepTimeOffset;

  const isNonVeg = (name = "", desc = "") => {
    const checkString = `${name} ${desc}`.toLowerCase();
    const nonVegKeywords = ["chicken", "beef", "fish", "meat", "pork", "mutton", "egg", "shawarma", "alfham", "kebab", "wings", "tikka"];
    return nonVegKeywords.some(kw => checkString.includes(kw));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-neutral-400">
        <Loader2 className="w-7 h-7 animate-spin text-neutral-600 mb-3" />
        <p className="text-[10px] uppercase font-bold tracking-wider animate-pulse">Syncing catalog...</p>
      </div>
    );
  }

  if (error || !storeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4 text-center">
        <div className="bg-white border border-neutral-200 p-8 rounded-2xl shadow-sm max-w-sm">
          <AlertCircle className="w-10 h-10 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide mb-2">Catalog Offline</h2>
          <p className="text-neutral-500 text-xs leading-relaxed mb-6">
            The target store catalog is temporarily unreachable.
          </p>
          <Link to="/" className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider block text-center transition-all">
            Return to Hub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans pb-24 selection:bg-neutral-800 selection:text-white relative">
      
      {/* 🚨 BUSY MODE GLOBAL ALERTS */}
      {storeData.busyModeActive && (
        <div className="bg-amber-500 text-white text-center py-2.5 px-4 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 relative z-50">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {storeData.busyModeMessage || `We're currently busy. Estimated preparation times have been extended by ${storeData.busyModeDuration} minutes.`}
          </span>
        </div>
      )}

      {/* ─── PREMIUM STICKY NAVBAR ─── */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "py-3.5 shadow-md" : "py-4"
      }`} style={{ backgroundColor: theme.colorCode || "#2563eb" }}>
        <div className="max-w-4xl mx-auto px-5 flex items-center justify-between">
          {/* Logo / Brand */}
          <Link to={`/${storeSlug}`} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl overflow-hidden bg-white/20 flex items-center justify-center shrink-0">
              {storeData.logoUrl ? (
                <img src={storeData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Store className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <span className="font-bold text-xs uppercase tracking-wider text-white block font-manrope">{storeData.name}</span>
              <span className="text-[8px] text-white/75 font-bold uppercase tracking-widest block">{storeCategoryLabels[softwareType] || "Store"}</span>
            </div>
          </Link>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-3">
            <Link to={`/${storeSlug}/cart`} className="relative w-9 h-9 border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
              <ShoppingCart className="w-4 h-4 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-neutral-900 text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center font-numbers shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {customerUser ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-9 h-9 rounded-xl border border-white/20 text-white font-bold text-xs flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer bg-transparent">
                  {userInitial}
                </button>
                
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg p-1.5 z-50 text-neutral-900">
                      <div className="px-3 py-2 border-b border-neutral-100">
                        <p className="text-[10px] font-black text-neutral-800 truncate">{customerUser.name}</p>
                        <p className="text-[9px] text-neutral-400 truncate mt-0.5">{customerUser.email}</p>
                      </div>
                      <Link to={`/${storeSlug}/profile`} onClick={() => setUserMenuOpen(false)}
                        className="block w-full text-left px-3 py-2 text-[10px] font-bold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors">
                        My Orders
                      </Link>
                      <button onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button onClick={() => setAuthModalOpen(true)}
                className="rounded-xl border border-white/20 flex items-center gap-2 px-3 py-2 hover:bg-white/10 transition-colors cursor-pointer bg-transparent text-white">
                <User className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider">Login / Register</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ─── DYNAMIC HOMEPAGE CONTENT ─── */}
      <main className="pt-28 space-y-10">

        {/* 2. POPULAR CATEGORIES TABBED LIST */}
        <section id="catalog-start" className="max-w-2xl mx-auto px-4 space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1">Categories</p>
              <h3 className="text-sm font-bold text-neutral-800 font-manrope">Explore Culinary Offerings</h3>
            </div>
          </div>
          <div className="overflow-x-auto py-1 scrollbar-none flex items-center gap-1.5">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                    isActive 
                      ? "bg-neutral-900 border-neutral-950 text-white shadow-sm" 
                      : "bg-white border-neutral-200 hover:bg-neutral-50 text-neutral-600 shadow-sm"
                  }`}>
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. DYNAMIC SEARCH ACCORDION */}
        <section className="max-w-2xl mx-auto px-4">
          <div className="relative flex items-center bg-white border border-neutral-200 rounded-xl shadow-sm px-4.5 py-3 w-full hover:border-neutral-300 transition-all">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input type="text" placeholder="Search menu catalog..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-transparent pl-6 pr-2 text-xs font-semibold text-neutral-800 placeholder-neutral-400 focus:outline-none" />
          </div>
        </section>

        {/* 4. PRODUCT CATALOG GRID */}
        <section className="max-w-4xl mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-neutral-200 rounded-2xl">
              <ShoppingCart className="w-8 h-8 text-neutral-300 mb-2" />
              <p className="text-xs font-bold text-neutral-400">No matching dishes cataloged</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredProducts.map((product) => {
                const isItemNonVeg = isNonVeg(product.name, product.description);
                const liked = likedProducts.includes(product._id);
                return (
                  <div key={product._id}
                    className="group bg-white border border-neutral-200 rounded-2xl p-4 flex gap-4 items-center justify-between shadow-sm hover:shadow-md transition-all">
                    
                    {/* Left: Metadata specs */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {/* Veg / Non-Veg Indicator */}
                        <span className={`w-3.5 h-3.5 border flex items-center justify-center shrink-0 ${isItemNonVeg ? "border-red-655 text-red-600" : "border-emerald-600"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isItemNonVeg ? "bg-red-600" : "bg-emerald-600"}`} />
                        </span>
                        
                        <div className="flex items-center gap-0.5 text-neutral-500">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          <span className="text-[10px] font-bold text-neutral-700">4.8</span>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                          <Clock className="w-2.5 h-2.5" />
                          <span className="font-numbers">{standardPrepTime} mins</span>
                        </div>
                      </div>

                      <button onClick={() => { setSelectedProduct(product); setProductModalQty(1); }}
                        className="block text-left group">
                        <h4 className="text-xs font-black text-neutral-900 leading-snug truncate group-hover:text-neutral-600 transition-colors uppercase tracking-tight">
                          {product.name}
                        </h4>
                      </button>

                      <p className="text-neutral-400 text-[10px] leading-relaxed line-clamp-2 mt-1 font-semibold">
                        {product.description || "Gourmet freshly curated dish prepared with local organic ingredients."}
                      </p>

                      <div className="text-xs font-bold text-neutral-800 mt-2.5 font-numbers">
                        Rs.{product.price}
                      </div>
                    </div>

                    {/* Right: Picture & Add overlay */}
                    <div className="relative shrink-0 w-24 h-24">
                      <button onClick={() => { setSelectedProduct(product); setProductModalQty(1); }}
                        className="block w-full h-full rounded-xl overflow-hidden border border-neutral-200/80 bg-neutral-50">
                        <img src={product.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80"}
                          alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </button>

                      {/* Favorite Liked Heart */}
                      <button onClick={() => toggleLike(product._id)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-white/80 hover:bg-white text-neutral-400 hover:text-red-500 transition-colors shadow-sm">
                        <Heart className={`w-3 h-3 ${liked ? "fill-red-500 text-red-500" : ""}`} />
                      </button>

                      <button onClick={() => addToCart(product)}
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white border border-neutral-250 hover:border-neutral-400 text-neutral-800 font-bold text-[9px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow-sm active:scale-95 transition-all whitespace-nowrap">
                        Add +
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 5. TESTIMONIALS SLIDER SECTION */}
        <section className="max-w-4xl mx-auto px-4 py-6 border-t border-neutral-200">
          <div className="text-center space-y-1 mb-8">
            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Testimonials</p>
            <h3 className="text-sm font-bold text-neutral-800 font-manrope">Consumer Feedback</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { name: "Rahul S.", rating: 5, text: "The Chicken Alfham was cooked perfectly. Tastes authentic and preparation timing estimates were spot on." },
              { name: "Meera K.", rating: 5, text: "Extremely fast ordering system. It opened WhatsApp and order got confirmed instantly." },
              { name: "Anish P.", rating: 4, text: "Excellent packing, clean food, and amazing quality. Highly recommended storefront." }
            ].map((t, idx) => (
              <div key={idx} className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3">
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-neutral-500 text-[11px] leading-relaxed italic">"{t.text}"</p>
                <p className="text-[10px] font-bold text-neutral-800">— {t.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. FAQ DROPDOWN ACCORDION */}
        <section className="max-w-2xl mx-auto px-4 py-4 border-t border-neutral-200">
          <div className="text-center space-y-1 mb-6">
            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Support Desk</p>
            <h3 className="text-sm font-bold text-neutral-800 font-manrope">Frequently Asked Questions</h3>
          </div>
          <div className="space-y-2.5">
            {[
              { q: "How does WhatsApp order validation work?", a: "When checkout completes, we build a direct structured summary containing items and address coordinates, opening WhatsApp instantly to dispatch confirmation." },
              { q: "Is home delivery available for all distances?", a: "We support local radius deliveries based on catalog options. Specific fee overrides apply automatically based on address variables." },
              { q: "What is Busy Mode?", a: "If the kitchen operations team reports high order volumes, we dynamically extend estimates across all dish listings automatically to keep expectations clean." }
            ].map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                  <button onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 flex justify-between items-center text-xs font-bold text-neutral-800 hover:bg-neutral-50 transition-colors">
                    <span>{item.q}</span>
                    <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-[11px] text-neutral-500 leading-relaxed border-t border-neutral-100">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* ─── FLOATING ACTION BOTTOM TRAY FOR CART PREVIEW ─── */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4 animate-fade-up">
          <Link to={`/${storeSlug}/cart`}
            className="flex items-center justify-between bg-neutral-900 text-white px-5 py-3.5 rounded-2xl shadow-xl hover:bg-neutral-800 transition-all hover:scale-[1.01]">
            <div className="flex items-center gap-3">
              <div className="relative bg-white/10 p-2 rounded-xl">
                <ShoppingCart className="w-4 h-4 text-white" />
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center font-numbers">
                  {cartCount}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">Cart items</span>
                <span className="text-xs font-bold text-white block">{cartCount} items selected</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white font-numbers">Rs.{cartTotal}</span>
              <span className="text-[10px] font-black uppercase bg-white text-black px-3 py-1.5 rounded-lg tracking-wider">
                Checkout
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* ─── FLAGSHIP PRODUCT DETAILS DIALOG MODAL ─── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/55 backdrop-blur-sm p-0 sm:p-4">
          <div className="fixed inset-0" onClick={() => setSelectedProduct(null)} />
          <div className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl z-10 animate-fade-up border border-neutral-100 max-h-[85vh] sm:max-h-none overflow-y-auto">
            {/* Top Close bar */}
            <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-white sticky top-0 z-20">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Dish Profile</span>
              <button onClick={() => setSelectedProduct(null)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-250 flex items-center justify-center text-neutral-500 transition-colors">
                ✕
              </button>
            </div>

            {/* Product image */}
            <div className="h-48 w-full bg-neutral-100 relative">
              <img src={selectedProduct.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80"}
                alt={selectedProduct.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-3 left-3 bg-white/95 px-2.5 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold text-neutral-800 shadow">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>4.8 (85 ratings)</span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h4 className="text-base font-black text-neutral-900 leading-tight uppercase tracking-tight">{selectedProduct.name}</h4>
                <p className="text-[10px] text-neutral-400 font-bold uppercase mt-1">Rs.{selectedProduct.price} per unit</p>
              </div>

              <p className="text-[11px] text-neutral-500 leading-relaxed">
                {selectedProduct.description || "Gourmet freshly curated dish prepared with local organic ingredients to guarantee delicious experience and quality nutrition."}
              </p>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-3 text-[10px] text-[#737373] pt-1">
                <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                  <span className="block text-neutral-400 uppercase tracking-widest text-[8px] font-bold">Prep Time</span>
                  <span className="font-bold text-neutral-800 font-numbers">{standardPrepTime} Mins</span>
                </div>
                <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                  <span className="block text-neutral-400 uppercase tracking-widest text-[8px] font-bold">Dietary Status</span>
                  <span className="font-bold text-neutral-800">{isNonVeg(selectedProduct.name, selectedProduct.description) ? "Non-Vegetarian" : "Vegetarian"}</span>
                </div>
              </div>

              {/* Quantity Picker & Add to Cart button */}
              <div className="flex items-center gap-3 pt-3 border-t border-neutral-100">
                <div className="flex items-center rounded-xl border border-neutral-250 bg-neutral-50 h-10 px-1">
                  <button onClick={() => setProductModalQty(q => Math.max(1, q - 1))}
                    className="w-8 h-full flex items-center justify-center text-neutral-500 hover:bg-neutral-150">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-7 text-center text-xs font-bold text-neutral-800 font-numbers">{productModalQty}</span>
                  <button onClick={() => setProductModalQty(q => q + 1)}
                    className="w-8 h-full flex items-center justify-center text-neutral-500 hover:bg-neutral-150">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button onClick={() => { addToCart(selectedProduct, productModalQty); setSelectedProduct(null); }}
                  className="flex-1 py-3 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-md text-center"
                  style={{ backgroundColor: theme.colorCode }}>
                  Add to basket &middot; Rs.{selectedProduct.price * productModalQty}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUTH & DRAWER CUSTOMERS MODALS */}
      <CustomerAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} storeSlug={storeSlug} theme={theme} onAuthSuccess={(user) => setCustomerUser(user)} />
      <OrderHistoryDrawer isOpen={historyDrawerOpen} onClose={() => setHistoryDrawerOpen(false)} storeSlug={storeSlug} theme={theme} />
      <CustomerProfileDrawer isOpen={profileDrawerOpen} onClose={() => setProfileDrawerOpen(false)} storeSlug={storeSlug} theme={theme} />
    </div>
  );
}
