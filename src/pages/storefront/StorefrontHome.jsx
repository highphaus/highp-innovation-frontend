import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Loader2, AlertCircle, Sparkles, Star, Search, Filter } from "lucide-react";
import axios from "axios";

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

  // Sync category & search filters
  useEffect(() => {
    let result = products;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Category filter mapping
    if (selectedCategory !== "All") {
      result = result.filter(p => {
        const name = p.name.toLowerCase();
        if (selectedCategory === "Mains") {
          return name.includes("burger") || name.includes("sandwich") || name.includes("smash");
        }
        if (selectedCategory === "Sides") {
          return name.includes("fries") || name.includes("salad") || name.includes("chips");
        }
        if (selectedCategory === "Beverages") {
          return name.includes("latte") || name.includes("coffee") || name.includes("tea") || name.includes("drink");
        }
        if (selectedCategory === "Desserts") {
          return name.includes("cheesecake") || name.includes("tart") || name.includes("cake") || name.includes("sweet");
        }
        return true;
      });
    }

    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, products]);

  const addToCart = (product) => {
    const existing = JSON.parse(localStorage.getItem(`cart_${storeSlug}`)) || [];
    const idx = existing.findIndex(i => i._id === product._id);
    if (idx > -1) {
      existing[idx].quantity += 1;
    } else {
      existing.push({ ...product, quantity: 1 });
    }
    localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(existing));
    
    // Update local states for reactive UI feedback
    const totalQty = existing.reduce((s, i) => s + i.quantity, 0);
    const totalAmt = existing.reduce((s, i) => s + (i.price * i.quantity), 0);
    setCartCount(totalQty);
    setCartTotal(totalAmt);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-neutral-400">
        <Loader2 className="w-9 h-9 animate-spin text-orange-500 mb-3" />
        <p className="text-xs uppercase font-black tracking-widest animate-pulse">Syncing Catalog Node...</p>
      </div>
    );
  }

  if (error || !storeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D] p-4 text-center">
        <div className="bg-neutral-900/60 border border-neutral-800 p-8 rounded-[28px] shadow-2xl max-w-sm backdrop-blur-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-black text-neutral-100 uppercase tracking-wide mb-2">Store Cluster Offline</h2>
          <p className="text-neutral-400 text-xs leading-relaxed mb-6">
            The target merchant tenant cluster is either uninitialized or temporarily unreachable. Check settings.
          </p>
          <Link to="/" className="px-5 py-3 bg-white hover:bg-neutral-200 text-black rounded-xl text-xs font-black uppercase tracking-wider block text-center transition-all shadow-md">
            Return to Core Hub
          </Link>
        </div>
      </div>
    );
  }

  const categories = ["All", "Mains", "Sides", "Beverages", "Desserts"];

  return (
    <div className="min-h-screen bg-neutral-50 text-[#0D0D0D] font-sans pb-24 selection:bg-neutral-950 selection:text-white">
      
      {/* BRAND HEADER BAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200/60 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className={`text-xl font-black tracking-tight uppercase ${storeData.primaryColor}`}>
            {storeData.name}
          </span>
          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 tracking-wider">
            Menu
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to={`/${storeSlug}/cart`} 
            className="relative p-2.5 text-neutral-700 hover:text-neutral-950 transition-colors bg-neutral-100 rounded-xl"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className={`absolute -top-1 -right-1 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md animate-bounce ${storeData.bgColor}`}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* LUXURY BANNER */}
      <header className="bg-white border-b border-neutral-200/50 py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-12 left-10 w-32 h-32 rounded-full bg-neutral-100/50 blur-3xl" />
          <div className="absolute bottom-6 right-10 w-44 h-44 rounded-full bg-neutral-100/80 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-500 mb-4 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Curated Dining Catalog
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-tight mb-3">
            Welcome to <span className={storeData.primaryColor}>{storeData.name}</span>
          </h1>
          <p className="text-neutral-500 text-xs sm:text-sm font-medium leading-relaxed max-w-md mx-auto">
            {storeData.tagline || "Experience luxury handcrafted delicacies delivered instantly to your counter."}
          </p>
          <div className={`w-12 h-1 mx-auto mt-5 rounded-full ${storeData.bgColor}`} />
        </div>
      </header>

      {/* SEARCH AND FILTER WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-sm">
          
          {/* Category badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive 
                      ? `${storeData.bgColor} text-white shadow-sm scale-105` 
                      : "bg-neutral-100 hover:bg-neutral-200/80 text-neutral-600"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative md:w-72">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search dishes, drinks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-neutral-400 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* PRODUCTS CATALOG GRID */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-neutral-200 rounded-[24px] shadow-sm">
            <p className="text-neutral-400 font-black text-sm uppercase tracking-wider">No matching items found</p>
            <p className="text-neutral-500 text-xs mt-1">Try resetting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product._id} 
                className="bg-white border border-neutral-200/70 rounded-3xl overflow-hidden flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1 group"
              >
                <Link to={`/${storeSlug}/product/${product._id}`} className="block relative overflow-hidden aspect-video bg-neutral-100 border-b border-neutral-100">
                  <img 
                    src={product.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80"} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" 
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-neutral-100">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-[10px] font-black text-neutral-800">4.9</span>
                  </div>
                </Link>

                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div className="mb-4">
                    <Link to={`/${storeSlug}/product/${product._id}`} className="block">
                      <h3 className="text-base font-black text-neutral-900 hover:text-neutral-700 transition-colors leading-snug mb-1.5">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2">
                      {product.description || "Fresh premium organic farm-to-table gourmet choice."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Price</span>
                      <span className="text-lg font-black text-neutral-900">₹{product.price}</span>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className={`text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-sm ${storeData.bgColor} ${storeData.hoverColor}`}
                    >
                      Add to Cart
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
            className="flex items-center justify-between bg-neutral-900 text-white px-6 py-4 rounded-2xl shadow-xl hover:bg-neutral-850 transition-all hover:scale-[1.02] border border-neutral-800"
          >
            <div className="flex items-center gap-3">
              <div className="relative bg-white/10 p-2 rounded-xl">
                <ShoppingCart className="w-5 h-5 text-white" />
                <span className={`absolute -top-1 -right-1 text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center ${storeData.bgColor}`}>
                  {cartCount}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-black tracking-wider block">Active Order</span>
                <span className="text-xs font-bold text-white block">{cartCount} Item{cartCount > 1 ? 's' : ''} added</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-white">₹{cartTotal}</span>
              <span className="text-xs font-black uppercase bg-white text-black px-3 py-1.5 rounded-lg tracking-wider">
                Checkout
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* QUICK DEV JUMP DOCK */}
      <div className="fixed bottom-4 left-4 z-40 bg-neutral-950/90 backdrop-blur-md border border-neutral-800 p-2.5 rounded-2xl flex gap-3 text-[10px] uppercase font-black text-neutral-400 tracking-wider shadow-xl">
        <span className="text-white border-r border-neutral-850 pr-2 self-center">Dev:</span>
        <Link to={`/${storeSlug}`} className="hover:text-white transition-colors py-1 px-2 rounded-lg bg-neutral-900">Store</Link>
        <Link to={`/${storeSlug}/admin`} className="hover:text-white transition-colors py-1 px-2 rounded-lg bg-neutral-900 text-emerald-400">Admin</Link>
        <Link to={`/${storeSlug}/kitchen`} className="hover:text-white transition-colors py-1 px-2 rounded-lg bg-neutral-900 text-orange-400">Kitchen</Link>
        <Link to={`/${storeSlug}/delivery`} className="hover:text-white transition-colors py-1 px-2 rounded-lg bg-neutral-900 text-sky-400">Delivery</Link>
      </div>
    </div>
  );
}
