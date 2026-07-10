import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  User, MapPin, ShoppingBag, Award, LogOut, ArrowLeft, Loader2,
  AlertCircle, CheckCircle, Plus, Trash, Phone, Mail, ChevronRight, Sparkles, ShieldCheck
} from "lucide-react";
import axios from "axios";
import { getTheme } from "./StorefrontHome";

export default function CustomerProfile() {
  const { storeSlug } = useParams();
  const navigate = useNavigate();

  const [customerUser, setCustomerUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`customerUser_${storeSlug}`)) || null;
    } catch {
      return null;
    }
  });

  // Access Control: Redirect if not logged in
  useEffect(() => {
    if (!customerUser) {
      navigate(`/${storeSlug}`);
    }
  }, [customerUser, storeSlug, navigate]);

  const [storeData, setStoreData] = useState(null);
  const [activeTab, setActiveTab] = useState("info"); // info, addresses, orders, rewards

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);

  // Temp State for New Address
  const [newAddrTag, setNewAddrTag] = useState("Home");
  const [newAddrDetail, setNewAddrDetail] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchProfile = async () => {
    setLoadingProfile(true);
    setErrorMsg("");
    const token = localStorage.getItem(`customerToken_${storeSlug}`);

    try {
      const res = await axios.get("http://localhost:5000/api/customers/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setName(res.data.name || "");
      setEmail(res.data.email || "");
      setPhone(res.data.phone || "");
      setAddresses(res.data.addresses || []);
    } catch (err) {
      setErrorMsg("Failed to retrieve profile credentials from the database.");
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    const token = localStorage.getItem(`customerToken_${storeSlug}`);
    try {
      const res = await axios.get("http://localhost:5000/api/customers/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch {
      console.error("Failed to load historical orders.");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (storeSlug) {
      axios.get(`http://localhost:5000/api/stores/${storeSlug}`).then(r => setStoreData(r.data)).catch(() => {});
      fetchProfile();
      fetchOrders();
    }
  }, [storeSlug]);

  const theme = getTheme(storeData);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");
    const token = localStorage.getItem(`customerToken_${storeSlug}`);

    try {
      const res = await axios.put(
        "http://localhost:5000/api/customers/profile",
        { name, phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const storedUser = JSON.parse(localStorage.getItem(`customerUser_${storeSlug}`) || "{}");
      storedUser.name = res.data.name;
      storedUser.phone = res.data.phone;
      localStorage.setItem(`customerUser_${storeSlug}`, JSON.stringify(storedUser));
      setCustomerUser(storedUser);

      setSuccessMsg("Personal information updated successfully.");
    } catch (err) {
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
        "http://localhost:5000/api/customers/profile",
        { addresses: updatedAddresses },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses(res.data.addresses || []);
      setNewAddrDetail("");
      setSuccessMsg("Address added successfully.");
    } catch {
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
        "http://localhost:5000/api/customers/profile",
        { addresses: updatedAddresses },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses(res.data.addresses || []);
      setSuccessMsg("Address deleted successfully.");
    } catch {
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
      preparing: "bg-blue-50 text-blue-700 border-blue-200",
      completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
    };
    return map[status] || "bg-neutral-50 text-neutral-500 border-neutral-200";
  };

  if (loadingProfile && !storeData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="w-8 h-8 animate-spin text-[#D03D56] mb-3" />
        <p className="text-[10px] uppercase font-black tracking-widest text-[#737373] animate-pulse">Syncing Customer Profile Desk...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans pb-20 selection:bg-neutral-800 selection:text-white">
      
      {/* BRAND HEADER BAR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#F5F5F0] px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link 
            to={`/${storeSlug}`} 
            className="p-2 hover:bg-neutral-50 border border-[#F0EEEB] rounded-xl transition-colors text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-sm font-black tracking-tight uppercase text-neutral-955 block leading-none">
              {storeData?.name} Account
            </span>
            <span className="text-[8px] text-neutral-400 font-mono tracking-widest uppercase mt-0.5 block">Customer Workspace</span>
          </div>
        </div>

        <button 
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-100 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Sign Out</span>
        </button>
      </nav>

      {/* BODY CONSOLE */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT COLUMN: SIDE NAVIGATION CARD */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-[#F0EEEB] rounded-3xl p-6 shadow-sm space-y-6 text-center">
            
            {/* AVATAR BADGE */}
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-[#F7EBEF] border border-[#F0EEEB] text-[#D03D56] font-black text-xl flex items-center justify-center mx-auto shadow-sm">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-sm font-black text-neutral-955 uppercase truncate">{name}</h2>
                <p className="text-[10px] text-neutral-400 font-medium truncate mt-0.5">{email}</p>
              </div>
            </div>

            <div className="h-px bg-[#F5F5F0]" />

            {/* QUICK ACTIONS */}
            <nav className="flex flex-col gap-1.5">
              {[
                { id: "info", label: "Personal Information", icon: User },
                { id: "addresses", label: "Delivery Addresses", icon: MapPin },
                { id: "orders", label: "Order History Logs", icon: ShoppingBag }
              ].map(t => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => { setActiveTab(t.id); setErrorMsg(""); setSuccessMsg(""); }}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center gap-3 transition-all ${
                      isActive 
                        ? "bg-[#D03D56] text-white shadow-md shadow-[#D03D56]/15" 
                        : "text-[#737373] hover:text-neutral-900 hover:bg-[#FAFAFA] border border-transparent"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{t.label}</span>
                    <ChevronRight className="w-3 h-3 ml-auto opacity-40" />
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* RIGHT COLUMN: WORKSPACE WORKFLOW PANEL */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-[#F0EEEB] rounded-3xl p-6 sm:p-8 shadow-sm min-h-[500px] flex flex-col justify-between">
            
            <div className="space-y-6">
              {/* ALERTS SYSTEM */}
              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-100 text-red-800 text-xs font-semibold rounded-2xl flex items-start gap-2.5">
                  <AlertCircle className="w-4.5 h-4.5 text-red-650 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold rounded-2xl flex items-start gap-2.5 animate-fade-in">
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-650 flex-shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* 1. PERSONAL INFORMATION WORKSPACE */}
              {activeTab === "info" && (
                <div className="space-y-6 animate-fade-up">
                  <div>
                    <h3 className="text-base font-black text-neutral-950 uppercase tracking-tight">Personal Details Workspace</h3>
                    <p className="text-[10px] text-neutral-450 uppercase tracking-widest font-black mt-0.5">Manage details and contact parameters.</p>
                  </div>
                  
                  <form onSubmit={handleUpdateInfo} className="space-y-5 max-w-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <input
                            required type="text"
                            className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-semibold"
                            value={name} onChange={e => setName(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Email ID (Primary Identity)</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-350" />
                          <input
                            readOnly type="email"
                            className="w-full bg-neutral-50 border border-[#F0EEEB] text-neutral-450 pl-10 pr-4 py-2.5 text-xs rounded-xl cursor-not-allowed font-medium"
                            value={email}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="max-w-xs">
                      <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                          type="tel"
                          placeholder="e.g. +91 98765 43210"
                          className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-semibold"
                          value={phone} onChange={e => setPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="submit" disabled={saving}
                      className="px-6 py-3 bg-[#D03D56] hover:bg-[#3F0712] text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Update Info →</span>}
                    </button>
                  </form>
                </div>
              )}

              {/* 2. SAVED ADDRESSES WORKSPACE */}
              {activeTab === "addresses" && (
                <div className="space-y-6 animate-fade-up">
                  <div>
                    <h3 className="text-base font-black text-neutral-955 uppercase tracking-tight">Saved Delivery Addresses</h3>
                    <p className="text-[10px] text-neutral-450 uppercase tracking-widest font-black mt-0.5">Manage drop points for checkout dispatches.</p>
                  </div>

                  {/* Add New Address Form */}
                  <form onSubmit={handleAddAddress} className="bg-[#FAFAFA] border border-[#F0EEEB] p-5 rounded-2xl space-y-4 max-w-xl shadow-sm">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-900">Add New Drop Point</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> <span>Add Address</span>
                    </button>
                  </form>

                  {/* List of Saved Addresses */}
                  <div className="space-y-3.5 max-w-xl">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#737373]">Your Drop Points</h4>
                    {addresses.length === 0 ? (
                      <p className="text-neutral-450 text-[10px] font-bold uppercase tracking-wider pl-1">No saved drop points found. Add one above to simplify checkout dispatches.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {addresses.map((addr, idx) => (
                          <div key={idx} className="bg-white border border-[#F0EEEB] p-4 rounded-xl flex items-center justify-between hover:border-neutral-350 transition-all shadow-sm">
                            <div className="space-y-1">
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
                              <p className="text-xs font-bold text-neutral-850">{addr.detail}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteAddress(idx)}
                              className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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

              {/* 3. ORDER HISTORY WORKSPACE */}
              {activeTab === "orders" && (
                <div className="space-y-6 animate-fade-up">
                  <div>
                    <h3 className="text-base font-black text-neutral-955 uppercase tracking-tight">Order Logs Ledger</h3>
                    <p className="text-[10px] text-neutral-450 uppercase tracking-widest font-black mt-0.5">Historical log of all checkout submissions.</p>
                  </div>

                  {loadingOrders ? (
                    <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
                      <Loader2 className="w-7 h-7 animate-spin text-[#D03D56] mb-2" />
                      <span className="text-[9px] font-black uppercase tracking-widest animate-pulse">Syncing order history...</span>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="py-20 text-center border border-dashed border-[#E8E6E3] rounded-3xl space-y-3">
                      <ShoppingBag className="w-10 h-10 mx-auto text-neutral-300 stroke-[1.2]" />
                      <h4 className="text-xs font-black uppercase text-neutral-500 tracking-wider">No Orders Placed Yet</h4>
                      <p className="text-[9px] text-[#737373] max-w-xs mx-auto uppercase tracking-widest font-bold">Checkout items from your cart to populate this logs ledger.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((o) => (
                        <div key={o._id} className="bg-[#FAFAFA] border border-[#F0EEEB] p-5 rounded-2xl space-y-4 shadow-sm">
                          <div className="flex justify-between items-start border-b border-[#F5F5F0] pb-3.5">
                            <div>
                              <p className="text-[9px] text-[#737373] font-black uppercase tracking-widest">
                                Order ID: #{o._id.substring(o._id.length - 6).toUpperCase()}
                              </p>
                              <p className="text-[10px] text-neutral-500 font-medium mt-0.5">
                                {new Date(o.createdAt).toLocaleDateString()} at {new Date(o.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusClass(o.status)}`}>
                              {o.status}
                            </span>
                          </div>

                          <div className="space-y-2.5">
                            {o.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-xs text-neutral-700">
                                <span>
                                  <span className="font-black text-[#D03D56] mr-1.5">{item.quantity}x</span>
                                  {item.name}
                                </span>
                                <span className="font-bold text-neutral-900">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between items-center border-t border-[#F5F5F0] pt-3.5 text-xs font-black text-neutral-900">
                            <span className="uppercase tracking-widest text-[9px] text-[#737373]">Total Paid Amount</span>
                            <span className="text-base font-black text-neutral-955">₹{o.totalAmount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}



            </div>

            {/* PLATFORM SECURE FOOTNOTE */}
            <div className="border-t border-[#F5F5F0] pt-5 mt-8 flex items-center justify-center gap-1.5 text-[9px] text-[#737373] uppercase tracking-widest font-black">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> HighP Secure Multi-Tenant Framework
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
