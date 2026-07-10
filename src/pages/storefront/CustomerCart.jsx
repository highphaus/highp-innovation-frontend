import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CheckCircle, Loader2, User, CreditCard } from "lucide-react";
import axios from "axios";
import { getTheme, getVerticalDetails } from "./StorefrontHome";
import CustomerAuthModal from "../../components/CustomerAuthModal";

export default function CustomerCart() {
  const { storeSlug } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`cart_${storeSlug}`)) || []; }
    catch { return []; }
  });
  const [storeData, setStoreData] = useState(null);

  const [customerUser, setCustomerUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`customerUser_${storeSlug}`)) || null;
    } catch {
      return null;
    }
  });

  const [customerName, setCustomerName] = useState(customerUser ? customerUser.name : "");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Sync customer info and fetch profile if logged in
  useEffect(() => {
    if (customerUser) {
      setCustomerName(customerUser.name);
      setCustomerPhone(customerUser.phone || "");
      const token = localStorage.getItem(`customerToken_${storeSlug}`);
      axios.get("http://localhost:5000/api/customers/me", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setCustomerPhone(res.data.phone || "");
        setCustomerAddress(res.data.address || "");
      }).catch(() => {});
    } else {
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
    }
  }, [customerUser, storeSlug]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/stores/${storeSlug}`).then(r => setStoreData(r.data)).catch(() => {});
  }, [storeSlug]);

  useEffect(() => {
    localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(cart));
  }, [cart, storeSlug]);

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => item._id === id
      ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeItem = (id) => setCart(prev => prev.filter(item => item._id !== id));

  const subtotalAmount = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const storeDeliveryFee = storeData?.deliveryFee !== undefined ? storeData.deliveryFee : 40;
  const storeCodEnabled = storeData?.codEnabled !== false;
  const storeUpiId = storeData?.upiId || "";
  const grandTotal = subtotalAmount + storeDeliveryFee;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert("Please fill in all checkout fields.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post("http://localhost:5000/api/orders", {
        storeSlug,
        customerName: customerName.trim(),
        phone: customerPhone.trim(),
        address: customerAddress.trim(),
        customerId: customerUser ? (customerUser.id || customerUser._id) : null,
        items: cart.map(i => ({ 
          productId: i._id, 
          name: i.name, 
          quantity: i.quantity, 
          price: i.price 
        })),
        totalAmount: grandTotal
      });

      // Redirect customer to store's WhatsApp with order details
      const cleanPhone = (storeData?.whatsappNumber || "").replace(/[^0-9]/g, "");
      if (cleanPhone) {
        const itemsList = cart.map(item => `- ${item.name} x ${item.quantity} (₹${item.price * item.quantity})`).join("\n");
        const message = `Hello! I would like to place an order at ${storeData?.name || storeSlug}:\n\n*Order Details:*\n${itemsList}\n\n*Delivery Fee:* ₹${storeDeliveryFee}\n*Total Amount:* ₹${grandTotal}\n\n*Delivery Details:*\n- *Name:* ${customerName.trim()}\n- *Phone:* ${customerPhone.trim()}\n- *Address:* ${customerAddress.trim()}\n\nThank you!`;
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
      }

      setCart([]);
      localStorage.removeItem(`cart_${storeSlug}`);
      setPlaced(true);
    } catch (err) {
      console.error("Order placement failure:", err);
      alert("Order placement failed. Check server connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const softwareType = storeData?.softwareType || "restaurant";
  const details = getVerticalDetails(softwareType);
  const theme = getTheme(storeData);

  if (placed) return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 selection:bg-neutral-800 selection:text-white">
      <div className="bg-white border border-[#F5F5F0] rounded-2xl p-10 text-center max-w-sm shadow-sm animate-fade-up">
        <div className={`w-16 h-16 ${theme.lightBg} rounded-full flex items-center justify-center mx-auto mb-5`}>
          <CheckCircle className={`w-8 h-8 ${theme.primary}`} />
        </div>
        <h2 className="text-lg font-black text-neutral-900 mb-2">Request Confirmed</h2>
        <p className="text-[#737373] text-xs mb-6 leading-relaxed">
          Your details have been registered inside the multi-tenant system and dispatched directly to the active operator live feed.
        </p>
        <Link 
          to={`/${storeSlug}`} 
          className={`block py-3.5 ${theme.bg} ${theme.hover} text-white text-[10px] font-black uppercase tracking-wider rounded-xl text-center shadow-md transition-all active:scale-95`}
        >
          Return to Storefront
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-20 selection:bg-neutral-800 selection:text-white">
      
      {/* HEADER */}
      <div className="bg-white border-b border-[#F5F5F0] px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-neutral-905" />
          <span className="font-black text-xs uppercase tracking-wider text-neutral-900">Your Basket</span>
        </div>
        <Link to={`/${storeSlug}`} className={`flex items-center gap-1.5 text-xs font-bold text-[#737373] hover:${theme.primary} transition-colors`}>
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* BASKET ITEMS LIST */}
        <div className="lg:col-span-2">
          <h2 className="font-black text-[10px] uppercase tracking-widest text-[#737373] mb-5 ml-1">
            Order Manifest ({cart.length} Item{cart.length !== 1 ? 's' : ''})
          </h2>
          
          {cart.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#F5F5F0] rounded-2xl shadow-sm">
              <ShoppingCart className="w-12 h-12 text-[#737373] mx-auto mb-4 stroke-[1.2]" />
              <h3 className="font-black text-neutral-805 mb-2">Your basket is empty</h3>
              <p className="text-xs text-[#737373] mb-6">You haven't cataloged any items inside your order yet.</p>
              <Link to={`/${storeSlug}`} className={`px-5 py-3 ${theme.bg} ${theme.hover} text-white font-black text-[10px] uppercase tracking-wider rounded-xl inline-block shadow-sm`}>
                Explore Storefront
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item._id} className="bg-white border border-[#F5F5F0] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 flex-1">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-[#F5F5F0]" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-350 border border-[#F5F5F0] flex-shrink-0">
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-black text-sm text-neutral-900 leading-snug">{item.name}</p>
                      <p className="text-[9px] font-black text-[#737373] uppercase tracking-widest mt-1">₹{item.price} each</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F5F5F0]">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQty(item._id, -1)} 
                        className="w-7 h-7 rounded-lg bg-[#FAFAFA] border border-[#F5F5F0] hover:bg-neutral-100 flex items-center justify-center transition-colors active:scale-90"
                      >
                        <Minus className="w-3 h-3 text-neutral-700" />
                      </button>
                      <span className="text-xs font-black w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQty(item._id, 1)} 
                        className="w-7 h-7 rounded-lg bg-[#FAFAFA] border border-[#F5F5F0] hover:bg-neutral-100 flex items-center justify-center transition-colors active:scale-90"
                      >
                        <Plus className="w-3 h-3 text-neutral-700" />
                      </button>
                      <button 
                        onClick={() => removeItem(item._id)} 
                        className="w-7 h-7 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center ml-1 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-sm font-black text-neutral-900 w-16 text-right">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CHECKOUT BILLING */}
        {cart.length > 0 && (
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#F5F5F0] rounded-2xl p-6 shadow-sm sticky top-6 space-y-6">
              <div>
                <h3 className="font-black text-[10px] uppercase tracking-widest text-[#737373]">Checkout Summary</h3>
                <div className={`h-0.5 w-8 ${theme.bg} mt-2 rounded-full`} />
              </div>
              
              <div className="space-y-3.5 text-xs text-[#737373]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-neutral-900">₹{subtotalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-neutral-950">
                    {storeDeliveryFee === 0 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      `₹${storeDeliveryFee}`
                    )}
                  </span>
                </div>
                <div className="h-px bg-[#F5F5F0]" />
                <div className="flex justify-between items-center text-sm font-black text-neutral-900 pt-1.5">
                  <span>Grand Total</span>
                  <span className="text-lg font-black text-neutral-950">₹{grandTotal}</span>
                </div>
              </div>

              {!customerUser ? (
                <div className="bg-[#F7EBEF] border border-[#F0EEEB] rounded-2xl p-5 text-center space-y-4 shadow-sm animate-fade-up">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto shadow-sm">
                    <User className="w-5 h-5 text-[#D03D56]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase text-neutral-900 tracking-wider">Authentication Required</h4>
                    <p className="text-[10px] text-[#737373] leading-relaxed">
                      Register or sign in to complete checkout, track status live, and view order logs.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAuthModalOpen(true)}
                    className="w-full py-2.5 bg-[#D03D56] hover:bg-[#3F0712] text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Authenticate Account
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCheckout} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Your Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                      <input 
                        required 
                        type="text" 
                        placeholder="e.g. Shamsaifudheen" 
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        className="w-full bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-neutral-300 focus:bg-white transition-all text-neutral-900" 
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                      <input 
                        required 
                        type="tel" 
                        placeholder="e.g. +91 98765 43210" 
                        value={customerPhone}
                        onChange={e => setCustomerPhone(e.target.value)}
                        className="w-full bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-neutral-300 focus:bg-white transition-all text-neutral-900" 
                      />
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Delivery Address</label>
                    <textarea 
                      required 
                      rows={3}
                      placeholder="Enter building, flat, street details..." 
                      value={customerAddress}
                      onChange={e => setCustomerAddress(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-neutral-300 focus:bg-white transition-all text-neutral-900 resize-none" 
                    />
                  </div>

                  <div className="p-3.5 bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-[#737373]" />
                    <div>
                      <span className="text-[9px] font-black uppercase text-[#737373] block tracking-wider">Payment Method</span>
                      <span className="text-[10px] font-bold text-neutral-800 block">
                        {storeCodEnabled ? "Cash on Delivery" : ""}
                        {storeCodEnabled && storeUpiId ? " / " : ""}
                        {storeUpiId ? `UPI: ${storeUpiId}` : (!storeCodEnabled ? "Online Payment" : "")}
                      </span>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className={`w-full py-3.5 ${theme.bg} ${theme.hover} text-white font-black text-[11px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md disabled:opacity-50 cursor-pointer`}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Confirm & Book</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* AUTH CUSTOMERS MODAL */}
      <CustomerAuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        storeSlug={storeSlug} 
        theme={theme} 
        onAuthSuccess={(user) => setCustomerUser(user)}
      />
    </div>
  );
}
