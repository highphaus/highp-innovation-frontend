import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Loader2, AlertCircle, Sparkles, Star, Search, Filter, User, Mail, Lock, Phone, ShieldCheck, RefreshCw, Store, ArrowRight } from "lucide-react";
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
      welcomeSubtitle: "Discover curated premium items sourced directly to verify authentic quality.",
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
      taglineDefault: "State-of-the-art Fitness Node"
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
      mains: ["burger", "sandwich", "smash", "pizza", "pasta", "rice", "chicken", "salad", "bowl", "roll", "taco", "dosa", "roti", "curry", "paneer"],
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

export default function Storefront() {
  const { storeSlug } = useParams();

  const [storeData, setStoreData] = useState(null);
  const [products, setProducts] = useState([]);
  const [customerUser, setCustomerUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`customerUser_${storeSlug}`)) || null;
    } catch {
      return null;
    }
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);

  useEffect(() => {
    const syncUser = () => {
      try {
        setCustomerUser(JSON.parse(localStorage.getItem(`customerUser_${storeSlug}`)) || null);
      } catch {}
    };
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, [storeSlug]);

  const [authSignUp, setAuthSignUp] = useState(false);
  const [authStep, setAuthStep] = useState(1); // 1 = details, 2 = OTP
  const [authForm, setAuthForm] = useState({ name: "", email: "", phone: "" });
  const [authOtp, setAuthOtp] = useState(["", "", "", "", "", ""]);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const startResendCooldown = () => {
    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (authSignUp && !authForm.name.trim()) {
      setAuthError("Please enter your name.");
      return;
    }
    setAuthLoading(true);
    setAuthError("");
    try {
      await axios.post("http://localhost:5000/api/customers/send-otp", {
        storeSlug,
        email:   authForm.email.trim(),
        purpose: authSignUp ? "register" : "login",
        name:    authForm.name.trim()
      });
      setAuthStep(2);
      startResendCooldown();
    } catch (err) {
      setAuthError(err.response?.data?.message || "Failed to send verification code.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpValue = authOtp.join("");
    if (otpValue.length < 6) {
      setAuthError("Please enter the complete 6-digit OTP.");
      return;
    }
    setAuthLoading(true);
    setAuthError("");
    const url = authSignUp 
      ? "http://localhost:5000/api/customers/register" 
      : "http://localhost:5000/api/customers/login";

    const payload = authSignUp
      ? { storeSlug, otp: otpValue, ...authForm }
      : { storeSlug, email: authForm.email.trim(), otp: otpValue };

    try {
      const res = await axios.post(url, payload);
      localStorage.setItem(`customerToken_${storeSlug}`, res.data.token);
      localStorage.setItem(`customerUser_${storeSlug}`, JSON.stringify(res.data.customer));
      setCustomerUser(res.data.customer);
    } catch (err) {
      setAuthError(err.response?.data?.message || "Incorrect code. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    setAuthError("");
    setAuthLoading(true);
    try {
      await axios.post("http://localhost:5000/api/customers/send-otp", {
        storeSlug,
        email:   authForm.email.trim(),
        purpose: authSignUp ? "register" : "login",
        name:    authForm.name.trim()
      });
      setAuthOtp(["", "", "", "", "", ""]);
      startResendCooldown();
    } catch (err) {
      setAuthError(err?.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem(`customerToken_${storeSlug}`);
    localStorage.removeItem(`customerUser_${storeSlug}`);
    setCustomerUser(null);
    setUserMenuOpen(false);
  };
  const [filteredProducts, setFilteredProducts] = useState([]);
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

  useEffect(() => {
    setLoading(true);
    setError(false);

    const slug = (storeSlug || "").toLowerCase().trim();

    Promise.all([
      axios.get(`http://localhost:5000/api/stores/${slug}`),
      axios.get(`http://localhost:5000/api/products/${slug}`)
    ])
      .then(([storeRes, productsRes]) => {
        setStoreData(storeRes.data);
        setProducts(productsRes.data);
        setFilteredProducts(productsRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("MNC Tenant Gateway Connection Failure:", err);
        setError(true);
        setLoading(false);
      });
  }, [storeSlug]);

  useEffect(() => {
    let result = products;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "All" && storeData) {
      result = result.filter(p => matchCategory(p.name, selectedCategory, storeData.softwareType));
    }

    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, products, storeData]);

  const addToCart = (product) => {
    const existing = JSON.parse(localStorage.getItem(`cart_${storeSlug}`)) || [];
    const idx = existing.findIndex(i => i._id === product._id);
    if (idx > -1) {
      existing[idx].quantity += 1;
    } else {
      existing.push({ ...product, quantity: 1 });
    }
    localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(existing));
    
    const totalQty = existing.reduce((s, i) => s + i.quantity, 0);
    const totalAmt = existing.reduce((s, i) => s + (i.price * i.quantity), 0);
    setCartCount(totalQty);
    setCartTotal(totalAmt);
  };

  const softwareType = storeData?.softwareType || "restaurant";
  const details = getVerticalDetails(softwareType);
  const theme = getTheme(storeData);
  const categories = details.categories;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] text-[#737373]">
        <Loader2 className={`w-8 h-8 animate-spin ${theme.primary} mb-3`} />
        <p className="text-[10px] uppercase font-black tracking-widest animate-pulse">Syncing Storefront Menu...</p>
      </div>
    );
  }

  if (error || !storeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-4 text-center">
        <div className="bg-white border border-[#F5F5F0] p-8 rounded-2xl shadow-lg max-w-sm">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-4" />
          <h2 className="text-base font-black text-neutral-900 uppercase tracking-wide mb-2">Store Offline</h2>
          <p className="text-[#737373] text-xs leading-relaxed mb-6">
            The target store catalog is temporarily unreachable.
          </p>
          <Link to="/" className="px-5 py-3 bg-[#D03D56] hover:bg-[#3F0712] text-white rounded-xl text-[10px] font-black uppercase tracking-wider block text-center transition-all shadow-sm">
            Return to Platform Hub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans pb-24 selection:bg-neutral-800 selection:text-white relative">
      
      {/* ⚠️ PENDING ACTIVATION BANNER NOTICE */}
      {storeData && !storeData.isApproved && (
        <div className="bg-amber-500 text-white text-center py-2.5 px-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
          <span>⚠️ Workspace Pending Activation. Custom setups are in sandbox mode.</span>
        </div>
      )}

      {/* SOLID BRAND HEADER BANNER */}
      <div className={`${theme.bg} text-white pt-8 pb-12 px-6 shadow-sm transition-all relative`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 flex items-center justify-center text-white font-black shadow-sm flex-shrink-0">
              {storeData.logoUrl ? (
                <img src={storeData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Store className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-white tracking-tight truncate leading-tight">
                {storeData.name}
              </h1>
              <p className="text-[10px] text-white/85 font-bold uppercase tracking-wider mt-0.5">
                {storeCategoryLabels[softwareType] || "Store"} · {products.length} product{products.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Right actions: Cart & Profile */}
          <div className="flex items-center gap-3 relative">
            <Link 
              to={`/${storeSlug}/cart`} 
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white relative shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-[#D03D56] text-[8.5px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            {customerUser ? (
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-10 h-10 rounded-full bg-white/20 border border-white/10 text-white font-black text-xs flex items-center justify-center hover:bg-white/30 cursor-pointer shadow-sm transition-all"
                >
                  {customerUser.name.charAt(0).toUpperCase()}
                </button>
                
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-[#F0EEEB] rounded-2xl shadow-xl p-2 z-50 animate-fade-up text-neutral-900">
                      <div className="px-3.5 py-2.5 border-b border-[#F5F5F0]">
                        <p className="text-[10px] font-black text-neutral-955 truncate">{customerUser.name}</p>
                        <p className="text-[9px] text-[#737373] truncate mt-0.5">{customerUser.email}</p>
                      </div>
                      <Link 
                        to={`/${storeSlug}/profile`}
                        onClick={() => setUserMenuOpen(false)}
                        className="block w-full text-left px-3.5 py-2 text-[10px] font-bold text-neutral-700 hover:text-neutral-955 hover:bg-[#FAFAFA] rounded-xl transition-colors"
                      >
                        My Dashboard
                      </Link>
                      <button 
                        onClick={handleSignOut}
                        className="w-full text-left px-3.5 py-2 text-[10px] font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <User className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* OVERLAPPING SEARCH BAR */}
      <div className="max-w-2xl mx-auto -mt-6 px-4 relative z-10">
        <div className="relative flex items-center bg-white border border-[#F0EEEB] rounded-full shadow-lg px-4.5 py-3 w-full hover:border-neutral-300 transition-all">
          <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent pl-8 pr-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Category List */}
      <div className="max-w-2xl mx-auto px-4 mt-6 overflow-x-auto py-1 scrollbar-none flex items-center gap-1.5">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                isActive 
                  ? `${theme.bg} text-white shadow-sm` 
                  : "bg-white border border-[#F0EEEB] hover:bg-neutral-50 text-neutral-600 shadow-sm"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* PRODUCTS CATALOG LIST */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-[#F0EEEB] rounded-3xl mt-6 shadow-sm">
            <div className="w-16 h-16 bg-[#FAFAFA] border border-[#F0EEEB] rounded-2xl flex items-center justify-center text-neutral-400 mb-4 shadow-sm">
              <Store className="w-8 h-8 text-neutral-450" />
            </div>
            <p className="text-sm font-bold text-neutral-500">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {filteredProducts.map((product) => (
              <div 
                key={product._id} 
                className="bg-white border border-[#F0EEEB] rounded-2xl p-4.5 flex gap-5 items-center justify-between shadow-sm hover:shadow-[0_8px_24px_rgba(92,14,30,0.04)] transition-all group"
              >
                {/* LEFT: DISH SPECS */}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100/50">
                      Fresh
                    </span>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <span className="text-[9px] font-black text-neutral-800">4.9</span>
                    </div>
                  </div>
                  
                  <Link to={`/${storeSlug}/product/${product._id}`} className="block">
                    <h3 className={`text-sm font-black text-neutral-900 leading-snug truncate hover:${theme.primary} transition-colors uppercase tracking-tight`}>
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-[#737373] text-[10px] sm:text-[11px] leading-relaxed line-clamp-2 mt-1 font-bold">
                    {product.description || `Fresh premium ${details.productLabel.toLowerCase()} prepared carefully for wellness and convenience.`}
                  </p>

                  <div className="text-xs font-black text-neutral-950 mt-2.5">
                    ₹{product.price}
                  </div>
                </div>

                {/* RIGHT: IMAGE FRAME & OVERLAID BUTTON */}
                <div className="relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28">
                  <Link to={`/${storeSlug}/product/${product._id}`} className="block w-full h-full rounded-2xl overflow-hidden border border-[#F0EEEB] bg-[#FAFAFA]">
                    <img 
                      src={product.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80"} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  </Link>

                  {/* ZOMATO / SWIGGY STYLE OVERLAID ADD BUTTON */}
                  <button
                    onClick={() => addToCart(product)}
                    className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-white border border-[#F0EEEB] hover:border-[#D03D56]/50 text-[#D03D56] font-black text-[9px] uppercase tracking-widest px-4 py-2 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <span>ADD</span> <span className="font-light text-xs leading-none">+</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* FLOATING ACTION BOTTOM TRAY FOR CART PREVIEW */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-fade-up">
          <Link 
            to={`/${storeSlug}/cart`} 
            className="flex items-center justify-between bg-neutral-900 text-white px-5 py-3.5 rounded-2xl shadow-xl hover:bg-neutral-800 transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3">
              <div className="relative bg-white/10 p-2 rounded-xl">
                <ShoppingCart className="w-4 h-4 text-white" />
                <span className={`absolute -top-1 -right-1 ${theme.bg} text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center`}>
                  {cartCount}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-black tracking-wider block">Selected Items</span>
                <span className="text-xs font-bold text-white block">{cartCount} Item{cartCount > 1 ? 's' : ''} added</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">₹{cartTotal}</span>
              <span className="text-[10px] font-black uppercase bg-white text-black px-3 py-1.5 rounded-lg tracking-wider">
                Checkout
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* QUICK DEV JUMP DOCK */}
      <div className="fixed bottom-4 left-4 z-40 bg-neutral-950/90 backdrop-blur-md border border-neutral-800 p-2.5 rounded-2xl hidden sm:flex gap-3 text-[10px] uppercase font-black text-neutral-400 tracking-wider shadow-xl">
        <span className="text-white border-r border-neutral-800 pr-2 self-center">Dev:</span>
        <Link to={`/${storeSlug}`} className="hover:text-white transition-colors py-1 px-2 rounded-lg bg-neutral-900">Store</Link>
        <Link to={`/${storeSlug}/admin`} className="hover:text-white transition-colors py-1 px-2 rounded-lg bg-neutral-900 text-emerald-400">Admin</Link>
        <Link to={`/${storeSlug}/kitchen`} className="hover:text-white transition-colors py-1 px-2 rounded-lg bg-neutral-900 text-orange-400">Queue</Link>
        <Link to={`/${storeSlug}/delivery`} className="hover:text-white transition-colors py-1 px-2 rounded-lg bg-neutral-900 text-sky-400">Logistics</Link>
      </div>

      {/* AUTH & DRAWER CUSTOMERS MODALS */}
      <CustomerAuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        storeSlug={storeSlug} 
        theme={theme} 
        onAuthSuccess={(user) => setCustomerUser(user)}
      />

      <OrderHistoryDrawer 
        isOpen={historyDrawerOpen} 
        onClose={() => setHistoryDrawerOpen(false)} 
        storeSlug={storeSlug} 
        theme={theme}
      />

      <CustomerProfileDrawer
        isOpen={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
        storeSlug={storeSlug}
        theme={theme}
      />
    </div>
  );
}
