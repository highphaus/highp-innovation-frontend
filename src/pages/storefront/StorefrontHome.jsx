import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Loader2, AlertCircle, Sparkles, Star, Search, Filter } from "lucide-react";
import axios from "axios";

// ─── THEME RESOLVER FOR SOFTWARE VERTICALS ─────────────────
export function getTheme(storeData) {
  const defaults = {
    primary: "text-[#5C0E1E]",
    bg: "bg-[#5C0E1E]",
    hover: "hover:bg-[#3F0712]",
    border: "border-[#5C0E1E]/15",
    lightBg: "bg-[#5C0E1E]/8",
    glow: "shadow-[#5C0E1E]/15",
    colorCode: "#5C0E1E"
  };
  if (!storeData) return defaults;

  const type = storeData.softwareType || "restaurant";
  const map = {
    restaurant: {
      primary: "text-[#5C0E1E]",
      bg: "bg-[#5C0E1E]",
      hover: "hover:bg-[#3F0712]",
      border: "border-[#5C0E1E]/15",
      lightBg: "bg-[#5C0E1E]/8",
      glow: "shadow-[#5C0E1E]/15",
      colorCode: "#5C0E1E"
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

export default function Storefront() {
  const { storeSlug } = useParams();

  const [storeData, setStoreData] = useState(null);
  const [products, setProducts] = useState([]);
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
          <Link to="/" className="px-5 py-3 bg-[#5C0E1E] hover:bg-[#3F0712] text-white rounded-xl text-[10px] font-black uppercase tracking-wider block text-center transition-all shadow-sm">
            Return to Platform Hub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans pb-24 selection:bg-neutral-800 selection:text-white`}>
      
      {/* BRAND HEADER BAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#F5F5F0] px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg font-black tracking-tight uppercase text-neutral-955">
            {storeData.name}
          </span>
          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-neutral-100 ${theme.primary} tracking-wider`}>
            {softwareType}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to={`/${storeSlug}/cart`} 
            className="relative p-2.5 text-neutral-600 hover:text-neutral-900 transition-colors bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className={`absolute -top-1.5 -right-1.5 ${theme.bg} text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md`}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* MARKETING HERO HEADER */}
      <header className="bg-white border-b border-[#F5F5F0] py-16 px-6 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${theme.lightBg} border ${theme.border} text-[10px] font-black ${theme.primary} uppercase tracking-wider`}>
            <Sparkles className={`w-3.5 h-3.5 ${theme.primary}`} /> High Performance {softwareType} Engine
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-neutral-955 tracking-tight leading-tight">
            Welcome to <span className={`italic font-light ${theme.primary} mr-1`} style={{ fontFamily: "'Georgia', serif" }}>{storeData.name}</span>
          </h1>
          <p className="text-[#737373] text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            {storeData.tagline || details.welcomeSubtitle}
          </p>
          <div className={`w-10 h-0.5 mx-auto ${theme.bg} rounded-full`} />
        </div>
      </header>

      {/* FILTER & SEARCH */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white border border-[#F5F5F0] p-4 rounded-2xl shadow-sm">
          
          {/* Category List */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive 
                      ? `${theme.bg} text-white shadow-sm` 
                      : "bg-[#FAFAFA] border border-[#F5F5F0] hover:bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder={`Search ${details.productLabel.toLowerCase()}s...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-neutral-300 focus:bg-white transition-all text-neutral-900"
            />
          </div>
        </div>

        {/* PRODUCTS CATALOG GRID */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#F5F5F0] rounded-2xl shadow-sm">
            <p className="text-neutral-400 font-bold text-xs uppercase tracking-wider">No matching {details.productLabel.toLowerCase()}s found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product._id} 
                className="bg-white border border-[#F5F5F0] rounded-2xl overflow-hidden flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-0.5 group shadow-sm"
              >
                <Link to={`/${storeSlug}/product/${product._id}`} className="block relative overflow-hidden aspect-video bg-[#FAFAFA]">
                  <img 
                    src={product.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80"} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2 py-0.5 rounded flex items-center gap-1 shadow-sm border border-[#F5F5F0]">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    <span className="text-[9px] font-black text-neutral-800">4.9</span>
                  </div>
                </Link>

                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div className="mb-4">
                    <Link to={`/${storeSlug}/product/${product._id}`} className="block">
                      <h3 className={`text-sm font-black text-neutral-905 hover:${theme.primary} transition-colors leading-snug`}>
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[#737373] text-[11px] leading-relaxed line-clamp-2 mt-1.5">
                      {product.description || `Fresh premium ${details.productLabel.toLowerCase()} prepared carefully for wellness and convenience.`}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#F5F5F0]">
                    <span className="text-base font-black text-neutral-900">₹{product.price}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className={`${theme.bg} ${theme.hover} text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-sm`}
                    >
                      {details.actionLabel}
                    </button>
                  </div>
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
    </div>
  );
}
