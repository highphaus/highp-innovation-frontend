import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { 
  User, MapPin, ShoppingBag, LogOut, ArrowLeft, Loader2,
  AlertCircle, CheckCircle, Plus, Trash, Phone, Mail, ChevronRight, ShieldCheck, Clock,
  Heart, Eye, Share2, ShoppingCart, RefreshCw
} from "lucide-react";
import axios from "axios";
import { getTheme, getFoodImage } from "../storefront/StorefrontHome";
import MobileBottomNav from "../../components/MobileBottomNav";

export default function CustomerProfile() {
  const { storeSlug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [customerUser, setCustomerUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`customerUser_${storeSlug}`)) || null;
    } catch {
      return null;
    }
  });

  // Access Control: Redirect if session doesn't exist
  useEffect(() => {
    if (!customerUser) {
      navigate(`/${storeSlug}`);
    }
  }, [customerUser, storeSlug, navigate]);

  const [storeData, setStoreData] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "account" || tabParam === "profile") return "info";
    return tabParam || "orders";
  });

  const [wishlistSubTab, setWishlistSubTab] = useState("liked");

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "account" || tabParam === "profile") setActiveTab("info");
    else if (tabParam) setActiveTab(tabParam);
  }, [searchParams]);

  // Form & Profile States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);

  // Localized Address Addition Cache States
  const [newAddrTag, setNewAddrTag] = useState("Home");
  const [newAddrDetail, setNewAddrDetail] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAuthError = (err) => {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem(`customerToken_${storeSlug}`);
      localStorage.removeItem(`customerUser_${storeSlug}`);
      setCustomerUser(null);
      navigate(`/${storeSlug}`);
    }
  };

  const fetchProfile = async () => {
    setLoadingProfile(true);
    setErrorMsg("");
    const token = localStorage.getItem(`customerToken_${storeSlug}`);

    try {
      const res = await axios.get("/api/customers/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setName(res.data.name || "");
      setEmail(res.data.email || "");
      setPhone(res.data.phone || "");
      setAddress(res.data.address || "");
      setAddresses(res.data.addresses || []);
    } catch (err) {
      handleAuthError(err);
      setErrorMsg("Failed to retrieve profile credentials.");
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    const token = localStorage.getItem(`customerToken_${storeSlug}`);
    let dbOrders = [];
    if (token) {
      try {
        const res = await axios.get("/api/customers/orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        dbOrders = res.data || [];
      } catch (err) {
        handleAuthError(err);
      }
    }

    let localOrders = [];
    try {
      localOrders = JSON.parse(localStorage.getItem(`recentOrders_${storeSlug}`)) || [];
    } catch (_) {}

    const orderMap = new Map();
    [...localOrders, ...dbOrders].forEach(o => {
      if (o && (o._id || o.id)) {
        const key = o._id || o.id;
        orderMap.set(key, {
          ...o,
          _id: key,
          status: o.status || "confirmed"
        });
      }
    });

    const combinedOrders = Array.from(orderMap.values()).sort(
      (a, b) => new Date(b.createdAt || b.placedAt || 0) - new Date(a.createdAt || a.placedAt || 0)
    );

    setOrders(combinedOrders);
    setLoadingOrders(false);
  };

  useEffect(() => {
    if (storeSlug) {
      axios.get("/api/stores/" + storeSlug).then(r => setStoreData(r.data)).catch(() => {
        setStoreData({ name: storeSlug, softwareType: "restaurant" });
      });
      axios.get("/api/products/" + storeSlug).then(r => {
        setAllProducts(Array.isArray(r.data) ? r.data : r.data?.products || []);
      }).catch(() => {});

      fetchProfile();
      fetchOrders();
    }
  }, [storeSlug]);

  useEffect(() => {
    const storeName = storeData?.name || (storeSlug ? storeSlug.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : "Store");
    document.title = `My Account & Orders - ${storeName} | HighP Platform`;
  }, [storeData, storeSlug]);

  // Wishlist & Activity Items Computation
  const likedItems = useMemo(() => {
    try {
      const likedIds = JSON.parse(localStorage.getItem(`likes_${storeSlug}`)) || [];
      return allProducts.filter(p => likedIds.includes(p._id));
    } catch { return []; }
  }, [allProducts, storeSlug]);

  const viewedItems = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(`viewed_${storeSlug}`)) || [];
    } catch { return []; }
  }, [storeSlug]);

  const sharedItems = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(`shared_${storeSlug}`)) || [];
    } catch { return []; }
  }, [storeSlug]);

  const pastOrderedItems = useMemo(() => {
    const map = new Map();
    orders.forEach(o => {
      if (o.items && Array.isArray(o.items)) {
        o.items.forEach(item => {
          if (item && item.name) {
            const key = item.productId || item.name;
            if (!map.has(key)) {
              map.set(key, {
                _id: item.productId || key,
                name: item.name,
                price: item.price,
                variantLabel: item.variantLabel,
                image: item.image
              });
            }
          }
        });
      }
    });
    return Array.from(map.values());
  }, [orders]);

  const handleAddToCart = (product, variantLabel = "") => {
    try {
      const cartItemId = `${product._id}_${variantLabel || "default"}`;
      const cartItemName = variantLabel ? `${product.name} (${variantLabel})` : product.name;
      const existing = JSON.parse(localStorage.getItem(`cart_${storeSlug}`)) || [];
      const idx = existing.findIndex(i => i._id === cartItemId || (i.productId === product._id && i.variantLabel === variantLabel));

      if (idx > -1) {
        existing[idx].quantity += 1;
      } else {
        existing.push({
          _id: cartItemId,
          productId: product._id,
          name: cartItemName,
          price: product.price || 200,
          variantLabel: variantLabel || "Standard",
          quantity: 1,
          image: product.image || getFoodImage(product)
        });
      }
      localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(existing));
      setSuccessMsg(`Added "${product.name}" to cart!`);
      setTimeout(() => setSuccessMsg(""), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReorderAll = (order) => {
    if (!order || !order.items) return;
    try {
      const existing = JSON.parse(localStorage.getItem(`cart_${storeSlug}`)) || [];
      order.items.forEach(item => {
        const cartItemId = `${item.productId || item.name}_${item.variantLabel || "default"}`;
        const idx = existing.findIndex(i => i._id === cartItemId);
        if (idx > -1) {
          existing[idx].quantity += item.quantity || 1;
        } else {
          existing.push({
            _id: cartItemId,
            productId: item.productId || item._id,
            name: item.name,
            price: item.price,
            variantLabel: item.variantLabel || "",
            quantity: item.quantity || 1,
            image: item.image
          });
        }
      });
      localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(existing));
      navigate(`/${storeSlug}/cart`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");
    const token = localStorage.getItem(`customerToken_${storeSlug}`);

    try {
      const res = await axios.put(
        "/api/customers/profile",
        { name, phone, address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const storedUser = JSON.parse(localStorage.getItem(`customerUser_${storeSlug}`) || "{}");
      storedUser.name = res.data.name;
      storedUser.phone = res.data.phone;
      storedUser.address = res.data.address;
      localStorage.setItem(`customerUser_${storeSlug}`, JSON.stringify(storedUser));
      setCustomerUser(storedUser);

      setSuccessMsg("Personal information updated successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      handleAuthError(err);
      setErrorMsg("Failed to update profile info.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddrDetail.trim()) return;

    setSaving(true);
    const token = localStorage.getItem(`customerToken_${storeSlug}`);
    const updatedAddresses = [...addresses, { tag: newAddrTag, detail: newAddrDetail.trim(), isDefault: addresses.length === 0 }];

    try {
      const res = await axios.put(
        "/api/customers/profile",
        { addresses: updatedAddresses },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses(res.data.addresses || []);
      setNewAddrDetail("");
      setSuccessMsg("Drop point address added successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      handleAuthError(err);
      setErrorMsg("Failed to add new address.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (indexToDelete) => {
    const updatedAddresses = addresses.filter((_, idx) => idx !== indexToDelete);
    setSaving(true);
    const token = localStorage.getItem(`customerToken_${storeSlug}`);

    try {
      const res = await axios.put(
        "/api/customers/profile",
        { addresses: updatedAddresses },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses(res.data.addresses || []);
      setSuccessMsg("Address deleted successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      handleAuthError(err);
      setErrorMsg("Failed to delete address.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem(`customerToken_${storeSlug}`);
    localStorage.removeItem(`customerUser_${storeSlug}`);
    navigate(`/${storeSlug}`);
  };

  const getStatusClass = (status) => {
    const map = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      confirmed: "bg-blue-50 text-blue-700 border-blue-200",
      preparing: "bg-purple-50 text-purple-700 border-purple-200",
      out_for_delivery: "bg-indigo-50 text-indigo-700 border-indigo-200",
      completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
    };
    return map[status] || "bg-neutral-50 text-neutral-500 border-neutral-200";
  };

  if (loadingProfile && !storeData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="w-8 h-8 animate-spin text-[#D03D56] mb-3" />
        <p className="text-[10px] uppercase font-black tracking-widest text-[#737373] animate-pulse">Syncing Customer Workspace...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans pb-24 selection:bg-neutral-800 selection:text-white">
      
      {/* BRAND HEADER BAR */}
      <nav className="sticky top-0 z-40 bg-white border-b border-[#F5F5F0] px-4 sm:px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link 
            to={`/${storeSlug}`} 
            className="p-2 hover:bg-neutral-50 border border-[#F0EEEB] rounded-xl transition-colors text-neutral-600 hover:text-neutral-900 flex items-center justify-center cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-xs sm:text-sm font-black tracking-tight uppercase text-neutral-900 block leading-none">
              {storeData?.name || storeSlug} Workspace
            </span>
            <span className="text-[8px] text-neutral-400 font-mono tracking-widest uppercase mt-1 block">Customer Account</span>
          </div>
        </div>

        <button 
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-100 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Sign Out</span>
        </button>
      </nav>

      {/* CORE WRAPPER CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-10 grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
        
        {/* SIDEBAR NAVIGATION MODULE */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-[#F0EEEB] rounded-3xl p-5 sm:p-6 shadow-xs space-y-5 text-center">
            
            {/* Show user avatar card on desktop, or on mobile when viewing Personal Profile */}
            <div className={`space-y-3 ${activeTab === "orders" || activeTab === "wishlist" ? "hidden lg:block" : "block"}`}>
              <div className="w-16 h-16 rounded-2xl bg-[#F7EBEF] border border-[#F0EEEB] text-[#D03D56] font-black text-xl flex items-center justify-center mx-auto shadow-xs">
                {name ? name.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-black text-neutral-900 uppercase truncate px-1">{name || "Customer Account"}</h2>
                <p className="text-[10px] text-neutral-400 font-medium truncate mt-0.5 px-1">{email}</p>
              </div>
              <div className="h-px bg-[#F5F5F0]" />
            </div>

            {/* NAV TAB LINKS */}
            <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0 scrollbar-none">
              {[
                { id: "orders", label: "My Orders", icon: ShoppingBag, badge: orders.length },
                { id: "wishlist", label: "Wishlist", icon: Heart, badge: likedItems.length },
                { id: "info", label: "Personal Profile", icon: User },
                { id: "addresses", label: "Saved Addresses", icon: MapPin }
              ].map(t => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => { setActiveTab(t.id); setErrorMsg(""); setSuccessMsg(""); }}
                    className={`text-left px-3.5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer shrink-0 lg:shrink ${
                      isActive 
                        ? "bg-[#D03D56] text-white shadow-md shadow-[#D03D56]/15" 
                        : "text-[#737373] bg-neutral-50 border border-neutral-200/80 hover:text-neutral-900 hover:bg-neutral-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{t.label}</span>
                    {t.badge > 0 && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-700"}`}>
                        {t.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* WORKSPACE OPERATIONS VIEWPORT */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-[#F0EEEB] rounded-3xl p-5 sm:p-8 shadow-xs min-h-[540px] flex flex-col justify-between">
            
            <div className="space-y-6">
              {/* SYSTEM NOTIFICATION BANNERS */}
              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-100 text-red-800 text-xs font-semibold rounded-2xl flex items-start gap-2.5">
                  <AlertCircle className="w-4.5 h-4.5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold rounded-2xl flex items-start gap-2.5 animate-fade-in">
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* TAB 1: MY ORDERS */}
              {activeTab === "orders" && (
                <div className="space-y-6 animate-fade-up">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-neutral-955 uppercase tracking-tight">My Orders Ledger</h3>
                      <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-black mt-0.5">Historical log and real-time status of your orders.</p>
                    </div>
                    <span className="text-[10px] font-black bg-neutral-100 border border-neutral-200 text-neutral-700 px-3 py-1 rounded-full">
                      {orders.length} Total Placed
                    </span>
                  </div>

                  {loadingOrders ? (
                    <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
                      <Loader2 className="w-7 h-7 animate-spin text-[#D03D56] mb-2" />
                      <span className="text-[9px] font-black uppercase tracking-widest animate-pulse">Syncing order ledger...</span>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="py-20 text-center border border-dashed border-[#E8E6E3] rounded-3xl space-y-3 bg-neutral-50/50">
                      <ShoppingBag className="w-10 h-10 mx-auto text-neutral-300 stroke-[1.2]" />
                      <h4 className="text-xs font-black uppercase text-neutral-500 tracking-wider">No Orders Placed Yet</h4>
                      <p className="text-[9px] text-[#737373] max-w-xs mx-auto uppercase tracking-widest font-bold">Items ordered from your cart will appear right here.</p>
                      <Link to={`/${storeSlug}`} className="inline-block text-xs font-bold bg-[#D03D56] text-white px-5 py-2.5 rounded-xl shadow-xs hover:bg-black transition-all">
                        Browse Menu &amp; Order Now →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {orders.map((o) => (
                        <div key={o._id} className="bg-[#FAFAFA] border border-[#F0EEEB] p-4 sm:p-5 rounded-2xl space-y-4 shadow-xs hover:border-neutral-300 transition-colors">
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F5F0] pb-3">
                            <div>
                              <p className="text-[9px] text-[#737373] font-black uppercase tracking-widest">
                                Order ID: #{o._id.substring(o._id.length - 6).toUpperCase()}
                              </p>
                              <p className="text-[10px] text-neutral-400 font-medium mt-0.5">
                                {new Date(o.createdAt || Date.now()).toLocaleDateString("en-IN", { dateStyle: "medium" })} at {new Date(o.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2">
                              {o.status !== "completed" && o.status !== "cancelled" && (
                                <div className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-[#475569] border border-slate-200 px-2 py-0.5 rounded-md">
                                  <Clock className="w-3 h-3 text-neutral-500" />
                                  <span>Prep: {o.preparationTime || "15-20 mins"}</span>
                                </div>
                              )}
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${getStatusClass(o.status)}`}>
                                {o.status}
                              </span>
                            </div>
                          </div>

                          {/* ORDERED ITEMS LIST GRID */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {o.items.map((item, idx) => (
                              <div key={idx} className="bg-white border border-[#F5F5F0] p-2.5 rounded-xl flex items-center justify-between gap-2 shadow-2xs min-w-0">
                                <div className="min-w-0 space-y-0.5">
                                  <h4 className="text-xs font-bold text-neutral-900 truncate" title={item.name}>
                                    {item.name}
                                  </h4>
                                  <div className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wide">
                                    <span className="text-[#D03D56]">{item.quantity}x</span>
                                    {item.variantLabel && (
                                      <span className="text-neutral-400 font-medium">({item.variantLabel})</span>
                                    )}
                                  </div>
                                </div>
                                <span className="text-xs font-black text-neutral-955 flex-shrink-0 font-mono">
                                  ₹{item.price * item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* BILL SUMMARY RECEIPT BREAKDOWN */}
                          <div className="space-y-1.5 pt-3 border-t border-[#F5F5F0] text-xs">
                            {o.subtotal > 0 && (
                              <div className="flex justify-between text-neutral-500">
                                <span>Items Subtotal</span>
                                <span className="font-mono font-bold text-neutral-800">₹{o.subtotal}</span>
                              </div>
                            )}
                            {o.taxAmount > 0 && (
                              <div className="flex justify-between text-neutral-500">
                                <span>GST Tax ({o.taxRate || 5}%)</span>
                                <span className="font-mono font-bold text-neutral-800">₹{o.taxAmount}</span>
                              </div>
                            )}
                            {o.otherCharges > 0 && (
                              <div className="flex justify-between text-neutral-500">
                                <span>{o.otherChargesLabel || "Packaging & Service Fee"}</span>
                                <span className="font-mono font-bold text-neutral-800">₹{o.otherCharges}</span>
                              </div>
                            )}
                            {o.deliveryFee !== undefined && (
                              <div className="flex justify-between text-neutral-500">
                                <span>Delivery Fee</span>
                                <span className="font-mono font-bold text-neutral-800">
                                  {o.deliveryFee === 0 ? "Free" : `₹${o.deliveryFee}`}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Order Footer Actions & Re-order */}
                          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F5F5F0] pt-3">
                            <div>
                              <span className="uppercase tracking-widest text-[9px] text-[#737373] block font-bold">Total Paid</span>
                              <span className="text-base font-black text-neutral-955 font-mono">₹{o.totalAmount}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleReorderAll(o)}
                              className="flex items-center gap-1.5 bg-[#0f172a] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-black transition-all shadow-xs cursor-pointer active:scale-95"
                            >
                              <RefreshCw className="w-3.5 h-3.5" /> <span>Reorder All Items</span>
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: WISHLIST & ACTIVITY HUB */}
              {activeTab === "wishlist" && (
                <div className="space-y-6 animate-fade-up">
                  <div>
                    <h3 className="text-base font-black text-neutral-955 uppercase tracking-tight">Wishlist &amp; Activity Hub</h3>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-black mt-0.5">Browse saved items, recently viewed products, shared links, and past orders.</p>
                  </div>

                  {/* WISHLIST SUB-NAV PILLS */}
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                    {[
                      { id: "liked", label: `❤️ Wishlist (${likedItems.length})` },
                      { id: "viewed", label: `👁️ Recently Viewed (${viewedItems.length})` },
                      { id: "shared", label: `📤 Shared (${sharedItems.length})` },
                      { id: "ordered", label: `🛍️ Past Items (${pastOrderedItems.length})` }
                    ].map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setWishlistSubTab(st.id)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          wishlistSubTab === st.id 
                            ? "bg-[#D03D56] text-white shadow-sm" 
                            : "bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-600 hover:bg-neutral-100"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  {/* SUB-SECTION 1: LIKED / WISHLISTED */}
                  {wishlistSubTab === "liked" && (
                    <div className="space-y-4">
                      {likedItems.length === 0 ? (
                        <div className="py-16 text-center border border-dashed border-[#E8E6E3] rounded-3xl space-y-2 bg-neutral-50/50">
                          <Heart className="w-8 h-8 mx-auto text-neutral-300 stroke-[1.2]" />
                          <p className="text-xs font-bold text-neutral-500">Your wishlist is empty.</p>
                          <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Tap the heart icon on any product card to save it here.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {likedItems.map(p => (
                            <div key={p._id} className="bg-[#FAFAFA] border border-[#F0EEEB] rounded-2xl p-3 flex flex-col justify-between gap-3 shadow-2xs hover:border-neutral-300 transition-colors">
                              <Link to={`/${storeSlug}/product/${p._id}`} className="flex gap-3 items-center group cursor-pointer">
                                <div className="w-14 h-14 rounded-xl bg-white border border-neutral-200 overflow-hidden shrink-0">
                                  <img src={getFoodImage(p)} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-neutral-900 group-hover:text-[#D03D56] transition-colors truncate">{p.name}</h4>
                                  <span className="text-xs font-black text-[#D03D56] font-mono block mt-0.5">₹{p.price}</span>
                                </div>
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleAddToCart(p)}
                                className="w-full bg-[#0f172a] text-white text-xs font-bold py-2 rounded-xl hover:bg-black transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" /> <span>Add to Cart</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SUB-SECTION 2: RECENTLY VIEWED */}
                  {wishlistSubTab === "viewed" && (
                    <div className="space-y-4">
                      {viewedItems.length === 0 ? (
                        <div className="py-16 text-center border border-dashed border-[#E8E6E3] rounded-3xl space-y-2 bg-neutral-50/50">
                          <Eye className="w-8 h-8 mx-auto text-neutral-300 stroke-[1.2]" />
                          <p className="text-xs font-bold text-neutral-500">No recently viewed items.</p>
                          <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Products you open will automatically show up here.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {viewedItems.map(p => (
                            <div key={p._id} className="bg-[#FAFAFA] border border-[#F0EEEB] rounded-2xl p-3 flex flex-col justify-between gap-3 shadow-2xs hover:border-neutral-300 transition-colors">
                              <Link to={`/${storeSlug}/product/${p._id}`} className="flex gap-3 items-center group cursor-pointer">
                                <div className="w-14 h-14 rounded-xl bg-white border border-neutral-200 overflow-hidden shrink-0">
                                  <img src={p.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100"} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-neutral-900 group-hover:text-[#D03D56] transition-colors truncate">{p.name}</h4>
                                  <span className="text-xs font-black text-[#D03D56] font-mono block mt-0.5">₹{p.price}</span>
                                </div>
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleAddToCart(p)}
                                className="w-full bg-[#0f172a] text-white text-xs font-bold py-2 rounded-xl hover:bg-black transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" /> <span>Add to Cart</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SUB-SECTION 3: SHARED ITEMS */}
                  {wishlistSubTab === "shared" && (
                    <div className="space-y-4">
                      {sharedItems.length === 0 ? (
                        <div className="py-16 text-center border border-dashed border-[#E8E6E3] rounded-3xl space-y-2 bg-neutral-50/50">
                          <Share2 className="w-8 h-8 mx-auto text-neutral-300 stroke-[1.2]" />
                          <p className="text-xs font-bold text-neutral-500">No shared items tracked yet.</p>
                          <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Tap the share button on any item to save it here.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {sharedItems.map(p => (
                            <div key={p._id} className="bg-[#FAFAFA] border border-[#F0EEEB] rounded-2xl p-3 flex flex-col justify-between gap-3 shadow-2xs hover:border-neutral-300 transition-colors">
                              <Link to={`/${storeSlug}/product/${p._id}`} className="flex gap-3 items-center group cursor-pointer">
                                <div className="w-14 h-14 rounded-xl bg-white border border-neutral-200 overflow-hidden shrink-0">
                                  <img src={p.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100"} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-neutral-900 group-hover:text-[#D03D56] transition-colors truncate">{p.name}</h4>
                                  <span className="text-xs font-black text-[#D03D56] font-mono block mt-0.5">₹{p.price}</span>
                                </div>
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleAddToCart(p)}
                                className="w-full bg-[#0f172a] text-white text-xs font-bold py-2 rounded-xl hover:bg-black transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" /> <span>Add to Cart</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SUB-SECTION 4: PAST ORDERED ITEMS */}
                  {wishlistSubTab === "ordered" && (
                    <div className="space-y-4">
                      {pastOrderedItems.length === 0 ? (
                        <div className="py-16 text-center border border-dashed border-[#E8E6E3] rounded-3xl space-y-2 bg-neutral-50/50">
                          <ShoppingBag className="w-8 h-8 mx-auto text-neutral-300 stroke-[1.2]" />
                          <p className="text-xs font-bold text-neutral-500">No past ordered items found.</p>
                          <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Products from your completed orders will show up here for 1-tap reordering.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {pastOrderedItems.map((p, idx) => (
                            <div key={idx} className="bg-[#FAFAFA] border border-[#F0EEEB] rounded-2xl p-3 flex flex-col justify-between gap-3 shadow-2xs hover:border-neutral-300 transition-colors">
                              <div className="flex gap-3 items-center">
                                <div className="w-14 h-14 rounded-xl bg-white border border-neutral-200 overflow-hidden shrink-0">
                                  <img src={p.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100"} alt={p.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-neutral-900 truncate">{p.name}</h4>
                                  {p.variantLabel && <span className="text-[10px] text-neutral-500 font-medium block">{p.variantLabel}</span>}
                                  <span className="text-xs font-black text-[#D03D56] font-mono block mt-0.5">₹{p.price}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleAddToCart(p, p.variantLabel)}
                                className="w-full bg-[#D03D56] text-white text-xs font-bold py-2 rounded-xl hover:bg-black transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                              >
                                <RefreshCw className="w-3.5 h-3.5" /> <span>Reorder Item</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}

              {/* TAB 3: PERSONAL INFO */}
              {activeTab === "info" && (
                <div className="space-y-6 animate-fade-up">
                  <div>
                    <h3 className="text-base font-black text-neutral-955 uppercase tracking-tight">Personal Details</h3>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-black mt-0.5">Manage details and contact parameters.</p>
                  </div>
                  
                  <form onSubmit={handleUpdateInfo} className="space-y-5 max-w-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <input
                            required type="text"
                            className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-semibold"
                            value={name} onChange={e => setName(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="block text-[9px] font-black text-neutral-400 uppercase tracking-widest ml-1">Email ID</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <input
                            readOnly type="email"
                            className="w-full bg-neutral-50 border border-[#F0EEEB] text-neutral-450 pl-10 pr-4 py-2.5 text-xs rounded-xl cursor-not-allowed font-medium"
                            value={email}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="max-w-xs space-y-1">
                      <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest ml-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-semibold"
                          value={phone} onChange={e => setPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest ml-1">Default Delivery Address</label>
                      <textarea
                        rows={3}
                        placeholder="Building name, apartment number, street details, area..."
                        className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-3.5 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-semibold resize-none"
                        value={address} onChange={e => setAddress(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit" disabled={saving}
                      className="px-6 py-3 bg-[#D03D56] hover:bg-[#3F0712] text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Update Info →</span>}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: SAVED ADDRESSES */}
              {activeTab === "addresses" && (
                <div className="space-y-6 animate-fade-up">
                  <div>
                    <h3 className="text-base font-black text-neutral-955 uppercase tracking-tight">Saved Drop Points</h3>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-black mt-0.5">Manage drop points for checkout dispatches.</p>
                  </div>

                  <form onSubmit={handleAddAddress} className="bg-[#FAFAFA] border border-[#F0EEEB] p-4 sm:p-5 rounded-2xl space-y-4 max-w-xl shadow-xs">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-900">Add New Drop Point</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="sm:col-span-1">
                        <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1 ml-0.5">Tag</label>
                        <select
                          value={newAddrTag}
                          onChange={e => setNewAddrTag(e.target.value)}
                          className="w-full bg-white border border-[#F0EEEB] text-neutral-900 px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 font-semibold"
                        >
                          <option value="Home">Home 🏠</option>
                          <option value="Work">Work 💼</option>
                          <option value="Other">Other 📍</option>
                        </select>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1 ml-0.5">Address Detail</label>
                        <input
                          required type="text"
                          placeholder="e.g. Floor 3, Flat 4B, Emerald Court"
                          className="w-full bg-white border border-[#F0EEEB] text-neutral-900 px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 font-semibold"
                          value={newAddrDetail} onChange={e => setNewAddrDetail(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="submit" disabled={saving}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> <span>Add Address</span>
                    </button>
                  </form>

                  <div className="space-y-3 max-w-xl">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#737373]">Your Saved Drop Points</h4>
                    {addresses.length === 0 ? (
                      <p className="text-neutral-450 text-[10px] font-bold uppercase tracking-wider pl-1">No saved drop points found.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {addresses.map((addr, idx) => (
                          <div key={idx} className="bg-white border border-[#F0EEEB] p-4 rounded-xl flex items-center justify-between hover:border-neutral-300 transition-all shadow-2xs gap-4">
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest ${
                                  addr.tag === "Home" ? "bg-blue-50 text-blue-700" :
                                  addr.tag === "Work" ? "bg-amber-50 text-amber-700" : "bg-neutral-100 text-neutral-700"
                                }`}>
                                  {addr.tag}
                                </span>
                                {addr.isDefault && (
                                  <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Default Drop</span>
                                )}
                              </div>
                              <p className="text-xs font-bold text-neutral-800 break-words">{addr.detail}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteAddress(idx)}
                              className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                              title="Delete address"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* SECURE FOOTER */}
            <div className="border-t border-[#F5F5F0] pt-4 mt-6 flex items-center justify-center gap-1.5 text-[9px] text-[#737373] uppercase tracking-widest font-black text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> 
              <span>HighP Secure Multi-Tenant Framework</span>
            </div>

          </div>
        </div>

      </div>

    </div>

      {/* MOBILE STICKY 5-TAB INDEPENDENT BOTTOM NAV */}
      <MobileBottomNav storeSlug={storeSlug} />
    </>
  );
}