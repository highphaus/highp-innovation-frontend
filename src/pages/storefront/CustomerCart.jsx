import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CheckCircle,
  Loader2, User, CreditCard, MessageCircle, Package, MapPin,
  Phone as PhoneIcon, Clock, Hash, ExternalLink, ArrowRight, Check, ChevronRight, Banknote, QrCode, UtensilsCrossed
} from "lucide-react";
import axios from "axios";
import { getTheme, getVerticalDetails, checkIsNonVeg } from "./StorefrontHome";
import CustomerAuthModal from "../../components/CustomerAuthModal";
import MobileBottomNav from "../../components/MobileBottomNav";

export default function CustomerCart({ mode }) {
  const { storeSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active step based on prop or URL path: "cart" | "checkout"
  const isCheckoutPath = mode === "checkout" || location.pathname.endsWith("/checkout");
  const activeStep = isCheckoutPath ? "checkout" : "cart";

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
  const [customerPhone, setCustomerPhone] = useState(customerUser ? (customerUser.phone || "") : "");
  const [customerAddress, setCustomerAddress] = useState(customerUser ? (customerUser.address || "") : "");
  const [pincode, setPincode] = useState(customerUser ? (customerUser.pincode || "") : "");
  
  // Custom checkout options
  const [checkoutMethod, setCheckoutMethod] = useState("website"); // website | whatsapp
  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod | upi
  const [fulfillmentType, setFulfillmentType] = useState("delivery"); // delivery | pickup
  const [deliveryInstructions, setDeliveryInstructions] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingAuthOrder, setPendingAuthOrder] = useState(false);

  // Website UPI payment flow state
  const [showWebsiteUpiPayment, setShowWebsiteUpiPayment] = useState(false);
  const [utrReference, setUtrReference] = useState("");

  useEffect(() => {
    if (customerUser) {
      if (customerUser.name && !customerName) setCustomerName(customerUser.name);
      if (customerUser.phone && !customerPhone) setCustomerPhone(customerUser.phone);
      if (customerUser.address && !customerAddress) setCustomerAddress(customerUser.address);
      if (customerUser.pincode && !pincode) setPincode(customerUser.pincode);
    }
  }, [customerUser]);

  useEffect(() => {
    const fetchCartStore = () => {
      axios.get(`/api/stores/${storeSlug}`).then(r => {
        setStoreData(r.data);
        if (r.data) {
          setPaymentMethod(prev => {
            const codOk = r.data.codEnabled !== false;
            const upiOk = r.data.upiEnabled !== false;
            if (prev === "upi" && upiOk) return "upi";
            if (prev === "cod" && codOk) return "cod";
            if (upiOk) return "upi";
            if (codOk) return "cod";
            return prev;
          });
          if (r.data.checkoutMode) {
            setCheckoutMethod(r.data.checkoutMode);
          }
        }
      }).catch(() => {
        setStoreData({
          name: storeSlug,
          checkoutMode: "website",
          codEnabled: true,
          upiEnabled: true
        });
      });
    };

    fetchCartStore();
    const interval = setInterval(fetchCartStore, 8000);
    window.addEventListener("focus", fetchCartStore);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", fetchCartStore);
    };
  }, [storeSlug]);

  useEffect(() => {
    const storeName = storeData?.name || (storeSlug ? storeSlug.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : "Store");
    document.title = activeStep === "checkout" ? `Checkout - ${storeName}` : `Cart - ${storeName}`;
  }, [storeData, storeSlug, activeStep]);

  useEffect(() => {
    localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(cart));
  }, [cart, storeSlug]);

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeItem(id);
      return;
    }
    setCart(prev => prev.map(item => item._id === id ? { ...item, quantity: newQty } : item));
  };

  const removeItem = (id) => setCart(prev => prev.filter(item => item._id !== id));

  const subtotalAmount = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const isFreeDelivery = (storeData?.freeDeliveryAbove > 0 && subtotalAmount >= storeData.freeDeliveryAbove) || fulfillmentType === "pickup" || fulfillmentType === "dine-in";
  const storeDeliveryFee = isFreeDelivery ? 0 : (storeData?.deliveryFee !== undefined ? storeData.deliveryFee : 40);
  const storeCodEnabled = storeData?.codEnabled !== false;
  const storeUpiId = storeData?.upiId || "";
  const storeUpiEnabled = storeData?.upiEnabled !== false;
  const gstTaxRate = (storeData?.gstTaxRate && Number(storeData.gstTaxRate) !== 5) ? Number(storeData.gstTaxRate) : 0;
  const calculatedTax = Math.round(subtotalAmount * (gstTaxRate / 100));
  const otherChargesAmount = Number(storeData?.otherChargesAmount || 0);
  const otherChargesLabel = storeData?.otherChargesLabel || "Packaging & Service Fee";
  const grandTotal = subtotalAmount + storeDeliveryFee + calculatedTax + otherChargesAmount;

  // Formats UPI payment deep link for QR code and WhatsApp checkout redirection
  const getUpiPaymentUri = () => {
    const storeName = storeData?.name || "Store Payout";
    return `upi://pay?pa=${storeUpiId}&pn=${encodeURIComponent(storeName)}&am=${grandTotal}&cu=INR`;
  };

  // Triggers when user clicks "Confirm & Book Order"
  const handleCheckoutFormSubmit = (e) => {
    e.preventDefault();
    const effectiveAddress = (fulfillmentType === "pickup" && !customerAddress.trim()) ? "Self-Pickup at Store" : customerAddress.trim();
    if (!customerName.trim() || !customerPhone.trim() || (fulfillmentType === "delivery" && !effectiveAddress)) {
      alert("Please fill in all required contact and delivery address fields.");
      return;
    }

    if (storeData?.minOrderAmount > 0 && subtotalAmount < storeData.minOrderAmount) {
      alert(`Minimum order amount for this store is ₹${storeData.minOrderAmount}. Please add items worth ₹${storeData.minOrderAmount - subtotalAmount} more to proceed.`);
      return;
    }

    // IF CUSTOMER IS NOT LOGGED IN -> Trigger Login Modal ONLY NOW!
    if (!customerUser) {
      setPendingAuthOrder(true);
      setAuthModalOpen(true);
      return;
    }

    // IF ALREADY LOGGED IN -> Execute order placement immediately!
    executeSubmitOrder({});
  };

  // Called when login is successful via CustomerAuthModal
  const handleAuthSuccess = (user) => {
    setCustomerUser(user);
    if (user) {
      if (user.name && !customerName) setCustomerName(user.name);
      if (user.phone && !customerPhone) setCustomerPhone(user.phone);
      if (user.address && !customerAddress) setCustomerAddress(user.address);
    }

    // Auto-place order if auth was triggered by clicking "Confirm & Book Order"
    if (pendingAuthOrder) {
      setPendingAuthOrder(false);
      setTimeout(() => {
        executeSubmitOrder({ overrideUser: user });
      }, 150);
    }
  };

  const executeSubmitOrder = async ({ overrideUser = null, paymentStatus = "pending", paymentReference = "" }) => {
    const activeCustomer = overrideUser || customerUser;
    setSubmitting(true);

    const rawPhone = (storeData?.whatsappNumber || storeData?.phone || "").replace(/[^0-9]/g, "");
    const cleanPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

    // Pre-open WhatsApp tab if checkout mode is WhatsApp
    let waTab = null;
    if (checkoutMethod === "whatsapp" && cleanPhone) {
      waTab = window.open("about:blank", "_blank");
    }

    const itemsList = cart.map(item => `• ${item.name} x${item.quantity} - Rs.${item.price * item.quantity}`).join("\n");
    const fullAddressWithPin = pincode.trim() ? `${customerAddress.trim()} (PIN: ${pincode.trim()})` : customerAddress.trim();
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddressWithPin)}`;
    const upiPayLink = paymentMethod === "upi" ? `\n👉 Pay Online: ${getUpiPaymentUri()}` : "";
    
    // WhatsApp message format
    const taxMsgLine = gstTaxRate > 0 ? `\nTax (${gstTaxRate}%): Rs.${calculatedTax}` : "";
    const otherMsgLine = otherChargesAmount > 0 ? `\n${otherChargesLabel}: Rs.${otherChargesAmount}` : "";
    const waMessageEarly = `New Order\n\nItems:\n${itemsList}\n\nSubtotal: Rs.${subtotalAmount}${taxMsgLine}${otherMsgLine}\nDelivery: Rs.${storeDeliveryFee}\nTotal: Rs.${grandTotal}\n\nCustomer: ${customerName.trim()}\nPhone: ${customerPhone.trim()}\nAddress: ${fullAddressWithPin}\nLocation: ${mapsLink}\n\nInstructions: ${deliveryInstructions || "None"}\nPayment Method: ${paymentMethod === "cod" ? "Cash on Delivery" : `UPI (${storeUpiId})`}${upiPayLink}\n\nPlease confirm order. Thank you!`;
    const waUrlEarly = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessageEarly)}` : "";

    if (waTab && waUrlEarly) {
      try { waTab.location.href = waUrlEarly; } catch (_) {}
    } else if (cleanPhone && checkoutMethod === "whatsapp" && !waTab) {
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessageEarly)}`, "_blank");
    }

    try {
      const orderRes = await axios.post("/api/orders", {
        storeSlug,
        customerName: customerName.trim(),
        phone: customerPhone.trim(),
        address: fullAddressWithPin,
        pincode: pincode.trim(),
        customerId: activeCustomer ? String(activeCustomer.id || activeCustomer._id || "") : null,
        items: cart.map(i => ({
          productId: String(i._id || i.id || "prod_" + Math.random().toString(36).substr(2, 6)),
          name: i.name || "Item",
          quantity: Number(i.quantity) || 1,
          price: Number(i.price) || 0
        })),
        subtotal: subtotalAmount,
        taxAmount: calculatedTax,
        taxRate: gstTaxRate,
        otherCharges: otherChargesAmount,
        otherChargesLabel: otherChargesLabel,
        deliveryFee: storeDeliveryFee,
        totalAmount: grandTotal,
        estimatedPrepTime: storeData?.busyModeActive ? (20 + storeData.busyModeDuration) : 20,
        deliveryInstructions: deliveryInstructions.trim(),
        checkoutType: checkoutMethod,
        paymentMethod,
        paymentStatus,
        paymentReference
      });

      const createdOrder = orderRes.data || {};
      const orderId = createdOrder._id || createdOrder.id || "";
      const shortId = orderId ? `#${orderId.slice(-6).toUpperCase()}` : "#NEW";
      
      const finalMsg = `New Order ${shortId}\n\nItems:\n${itemsList}\n\nSubtotal: Rs.${subtotalAmount}${taxMsgLine}${otherMsgLine}\nDelivery: Rs.${storeDeliveryFee}\nTotal: Rs.${grandTotal}\n\nCustomer: ${customerName.trim()}\nPhone: ${customerPhone.trim()}\nAddress: ${fullAddressWithPin}\nLocation: ${mapsLink}\n\nInstructions: ${deliveryInstructions || "None"}\nPayment Method: ${paymentMethod === "cod" ? "Cash on Delivery" : `UPI (${storeUpiId})`}${upiPayLink}\n\nPlease confirm order. Thank you!`;
      const waUrlFinal = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(finalMsg)}` : waUrlEarly;

      if (waTab && waUrlFinal) {
        try { waTab.location.href = waUrlFinal; } catch (_) {}
      }

      // Cache order in localStorage so it immediately shows up in My Orders
      try {
        const existingLocal = JSON.parse(localStorage.getItem(`recentOrders_${storeSlug}`)) || [];
        const fullOrderForCache = {
          ...createdOrder,
          _id: orderId,
          status: createdOrder.status || "confirmed",
          createdAt: createdOrder.createdAt || new Date().toISOString()
        };
        const updatedLocal = [fullOrderForCache, ...existingLocal.filter(o => (o._id || o.id) !== orderId)];
        localStorage.setItem(`recentOrders_${storeSlug}`, JSON.stringify(updatedLocal));
      } catch (cacheErr) {
        console.error("Failed to cache recent order:", cacheErr);
      }

      // Clear cart
      setCart([]);
      localStorage.removeItem(`cart_${storeSlug}`);

      // Instantly navigate user to My Orders page
      navigate(`/${storeSlug}/profile?tab=orders`);
    } catch (err) {
      console.error("Order placement failure:", err);
      alert("Order placement failed. Check server connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const softwareType = storeData?.softwareType || "restaurant";
  const theme = getTheme(storeData);

  /* ─── PAGE STEP 1: SHOPPING CART PAGE ─── */
  if (activeStep === "cart") {
    return (
      <div className="min-h-screen bg-[#FAF9F8] text-[#111111] font-sans pb-32 sm:pb-36 selection:bg-[#D03D56] selection:text-white">
        
        {/* ── STICKY TOP HEADER ── */}
        <div className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-neutral-200/80 shadow-2xs">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
            <Link 
              to={`/${storeSlug}`}
              className="flex items-center gap-1.5 text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-600" />
              <span>Back to menu</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-900 font-manrope">Shopping Cart</span>
              {cart.length > 0 && (
                <span className="text-[10px] font-mono font-black text-white bg-[#D03D56] px-2 py-0.5 rounded-full shadow-xs">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">

          {cart.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16 px-4 bg-white border border-neutral-200/80 rounded-3xl shadow-xs my-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#D03D56]/10 text-[#D03D56] flex items-center justify-center mx-auto border border-[#D03D56]/20">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-neutral-900 text-base uppercase tracking-tight font-manrope">Your basket is empty</h3>
                <p className="text-xs text-neutral-500 font-medium">You haven't added any items to your cart yet.</p>
              </div>
              <Link 
                to={`/${storeSlug}`}
                className="px-5 py-3 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all inline-block shadow-md active:scale-95 cursor-pointer"
                style={{ backgroundColor: theme.colorCode || "#D03D56" }}
              >
                ← Browse Storefront
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

              {/* ── LEFT COLUMN (7 COLS): ITEMS LIST ── */}
              <div className="lg:col-span-7 space-y-6">

                <div className="bg-white border border-neutral-200/80 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
                  <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                    <h2 className="text-xs font-black text-neutral-900 uppercase tracking-widest font-manrope">
                      Items Summary ({cart.length})
                    </h2>
                    <span className="text-[10px] font-bold text-[#D03D56] bg-[#D03D56]/10 px-2.5 py-0.5 rounded-full font-mono">
                      {cart.reduce((s, i) => s + i.quantity, 0)} Items Selected
                    </span>
                  </div>

                  <div className="divide-y divide-neutral-100">
                    {cart.map((item, idx) => (
                      <div key={item._id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        
                        {/* Left: Item Info */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className="text-neutral-400 text-xs font-mono font-bold w-4 shrink-0">{idx + 1}.</span>
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-neutral-100 shrink-0 bg-neutral-50" />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-1.5">
                              <span className={`w-3.5 h-3.5 border rounded-xs flex items-center justify-center p-[1px] shrink-0 mt-0.5 ${checkIsNonVeg(item) ? "border-red-600" : "border-emerald-600"}`} title={checkIsNonVeg(item) ? "Non-Veg" : "Veg"}>
                                <span className={`w-1.5 h-1.5 rounded-full ${checkIsNonVeg(item) ? "bg-red-600" : "bg-emerald-600"}`} />
                              </span>
                              <h4 className="font-bold text-xs sm:text-[13px] text-neutral-900 leading-snug break-words">{item.name}</h4>
                            </div>
                            <p className="text-[11px] text-neutral-500 mt-0.5 font-mono font-medium">₹{item.price} each</p>
                          </div>
                        </div>

                        {/* Right: Quantity Controls & Price */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100/80 shrink-0">
                          <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50 h-7 shadow-2xs">
                            <button 
                              onClick={() => updateQty(item._id, -1)}
                              className="w-7 h-full flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors rounded-l-lg cursor-pointer active:scale-90"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-neutral-900 font-mono">{item.quantity}</span>
                            <button 
                              onClick={() => updateQty(item._id, 1)}
                              className="w-7 h-full flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors rounded-r-lg cursor-pointer active:scale-90"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs sm:text-[13px] font-extrabold text-neutral-900 font-mono min-w-[3.5rem] text-right">₹{item.price * item.quantity}</span>

                          <button 
                            onClick={() => removeItem(item._id)}
                            className="text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors p-1.5 rounded-lg cursor-pointer shrink-0"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* ── RIGHT COLUMN (5 COLS): STICKY BILL SUMMARY & PROCEED CTA ── */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20 self-start">

                <div className="bg-white border border-neutral-200/80 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
                  <h3 className="text-xs font-black text-neutral-900 uppercase tracking-widest font-manrope border-b border-neutral-100 pb-3">
                    Bill Summary
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between text-neutral-600">
                      <span>Subtotal</span>
                      <span className="font-bold text-neutral-900 font-mono">₹{subtotalAmount}</span>
                    </div>
                    {gstTaxRate > 0 && (
                      <div className="flex justify-between text-neutral-600">
                        <span>GST Tax ({gstTaxRate}%)</span>
                        <span className="font-bold text-neutral-900 font-mono">₹{calculatedTax}</span>
                      </div>
                    )}
                    {otherChargesAmount > 0 && (
                      <div className="flex justify-between text-neutral-600">
                        <span>{otherChargesLabel}</span>
                        <span className="font-bold text-neutral-900 font-mono">₹{otherChargesAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-neutral-600">
                      <span>Delivery Fee</span>
                      <span className="font-bold text-neutral-900 font-mono">
                        {storeDeliveryFee === 0 ? <span className="text-emerald-600 font-bold">Free</span> : `₹${storeDeliveryFee}`}
                      </span>
                    </div>
                    <div className="h-px bg-neutral-100 my-2" />
                    <div className="flex justify-between font-black text-neutral-950 text-sm sm:text-base">
                      <span>To Pay</span>
                      <span className="text-lg text-[#D03D56] font-mono font-black">₹{grandTotal}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={() => navigate(`/${storeSlug}/checkout`)}
                      className="w-full py-4 text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-md shadow-neutral-900/10"
                      style={{ backgroundColor: theme.colorCode || "#D03D56" }}
                    >
                      <span>Proceed to Checkout · ₹{grandTotal}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        <MobileBottomNav storeSlug={storeSlug} cartCount={cart.reduce((s, i) => s + i.quantity, 0)} />
      </div>
    );
  }

  /* ─── PAGE STEP 2: ORDER CHECKOUT PAGE ─── */
  return (
    <div className="min-h-screen bg-[#FAF9F8] text-[#111111] font-sans pb-32 sm:pb-36 selection:bg-[#D03D56] selection:text-white">
      
      {/* ── STICKY TOP HEADER WITH BACK TO CART ── */}
      <div className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-neutral-200/80 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link 
            to={`/${storeSlug}/cart`}
            className="flex items-center gap-1.5 text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-neutral-600" />
            <span>Back to Cart</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-neutral-900 font-manrope">Order Checkout</span>
            <span className="text-[10px] font-mono font-bold text-neutral-600 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-full">
              Step 2 of 2
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">

        {cart.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16 px-4 bg-white border border-neutral-200/80 rounded-3xl shadow-xs my-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#D03D56]/10 text-[#D03D56] flex items-center justify-center mx-auto border border-[#D03D56]/20">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-neutral-900 text-base uppercase tracking-tight font-manrope">Your cart is empty</h3>
              <p className="text-xs text-neutral-500 font-medium">Please add items to your cart before proceeding to checkout.</p>
            </div>
            <Link 
              to={`/${storeSlug}`}
              className="px-5 py-3 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all inline-block shadow-md active:scale-95 cursor-pointer"
              style={{ backgroundColor: theme.colorCode || "#D03D56" }}
            >
              ← Browse Storefront
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

            {/* ── LEFT COLUMN (7 COLS): CUSTOMER & DELIVERY FORM ── */}
            <div className="lg:col-span-7 space-y-6">

              {/* FULFILLMENT MODE SELECTOR (If Store Supports Self-Pickup) */}
              {storeData?.selfPickup && (
                <div className="bg-white border border-neutral-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="border-b border-neutral-100 pb-2">
                    <h3 className="text-[10px] font-black text-neutral-900 uppercase tracking-widest font-manrope">Select Fulfillment Option</h3>
                    <p className="text-[10px] text-neutral-400 font-bold mt-0.5">Choose between direct store pickup or home delivery</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setFulfillmentType("delivery")}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                        fulfillmentType === "delivery" ? "bg-[#D03D56] text-white border-[#D03D56] shadow-sm" : "bg-[#FAF9F8] border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      <Package className="w-4 h-4 shrink-0" />
                      <span>Home Delivery</span>
                    </button>

                    {storeData?.selfPickup !== false && (
                      <button
                        type="button"
                        onClick={() => setFulfillmentType("pickup")}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                          fulfillmentType === "pickup" ? "bg-[#D03D56] text-white border-[#D03D56] shadow-sm" : "bg-[#FAF9F8] border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                        }`}
                      >
                        <User className="w-4 h-4 shrink-0" />
                        <span>Self-Pickup / Takeaway</span>
                      </button>
                    )}

                    {storeData?.dineInEnabled !== false && (
                      <button
                        type="button"
                        onClick={() => setFulfillmentType("dine-in")}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                          fulfillmentType === "dine-in" ? "bg-[#D03D56] text-white border-[#D03D56] shadow-sm" : "bg-[#FAF9F8] border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                        }`}
                      >
                        <UtensilsCrossed className="w-4 h-4 shrink-0" />
                        <span>Dine-In / Eat in Shop</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-white border border-neutral-200/80 rounded-3xl p-4 sm:p-6 shadow-xs space-y-5">
                <div className="border-b border-neutral-100 pb-3">
                  <h2 className="text-xs font-black text-neutral-900 uppercase tracking-widest font-manrope">
                    {fulfillmentType === "pickup" ? "Customer Contact Information" : "Delivery Coordinates & Information"}
                  </h2>
                  <p className="text-[10px] text-neutral-400 font-bold mt-0.5">
                    {fulfillmentType === "pickup" ? "Provide contact details for takeaway order pickup" : "Please provide destination details for fulfillment"}
                  </p>
                </div>

                <form id="checkout-form" onSubmit={handleCheckoutFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label htmlFor="cart-name" className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Your Name *</label>
                      <input 
                        required 
                        id="cart-name"
                        type="text" 
                        placeholder="Full name"
                        value={customerName} 
                        onChange={e => setCustomerName(e.target.value)}
                        className="w-full bg-[#FAF9F8] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#D03D56] focus:bg-white transition-all font-sans" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="cart-phone" className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Phone Number *</label>
                      <input 
                        required 
                        id="cart-phone"
                        type="tel" 
                        placeholder="+91 98765 43210"
                        value={customerPhone} 
                        onChange={e => setCustomerPhone(e.target.value)}
                        className="w-full bg-[#FAF9F8] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#D03D56] focus:bg-white transition-all font-sans" 
                      />
                    </div>
                  </div>

                  {fulfillmentType === "delivery" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="sm:col-span-2 space-y-1.5">
                        <label htmlFor="cart-address" className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Delivery Address *</label>
                        <input 
                          required 
                          id="cart-address"
                          type="text"
                          placeholder="House / Flat No, Street details, Locality..."
                          value={customerAddress} 
                          onChange={e => setCustomerAddress(e.target.value)}
                          className="w-full bg-[#FAF9F8] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#D03D56] focus:bg-white transition-all font-sans" 
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="cart-pincode" className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">PIN Code / Zip *</label>
                        <input 
                          required 
                          id="cart-pincode"
                          type="text"
                          placeholder="e.g. 695608"
                          maxLength={6}
                          value={pincode} 
                          onChange={e => setPincode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                          className="w-full bg-[#FAF9F8] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#D03D56] focus:bg-white transition-all font-mono" 
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label htmlFor="cart-instructions" className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      {fulfillmentType === "pickup" ? "Pickup Note / Instructions (Optional)" : fulfillmentType === "dine-in" ? "Table Number / Seat Details (Optional)" : "Delivery Instructions (Optional)"}
                    </label>
                    <input 
                      id="cart-instructions"
                      type="text" 
                      placeholder={fulfillmentType === "pickup" ? "e.g. Preparing for 2 PM pickup..." : fulfillmentType === "dine-in" ? "e.g. Table 4 / Counter seat..." : "e.g. Leave at gate, Ring doorbell..."}
                      value={deliveryInstructions} 
                      onChange={e => setDeliveryInstructions(e.target.value)}
                      className="w-full bg-[#FAF9F8] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#D03D56] focus:bg-white transition-all font-sans" 
                    />
                  </div>
                </form>
              </div>

            </div>

            {/* ── RIGHT COLUMN (5 COLS): STICKY ORDER MINI-SUMMARY & SUBMIT ── */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20 self-start">

              {/* ── ORDER ITEMS MINI-SUMMARY ── */}
              <div className="bg-white border border-neutral-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-2.5">
                  <h3 className="text-[10px] font-black text-neutral-900 uppercase tracking-widest font-manrope">Order Items ({cart.length})</h3>
                  <Link to={`/${storeSlug}/cart`} className="text-[10px] font-bold text-[#D03D56] hover:underline">Edit Cart</Link>
                </div>
                <div className="max-h-40 overflow-y-auto divide-y divide-neutral-100 pr-1">
                  {cart.map(item => (
                    <div key={item._id} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className="font-bold text-neutral-900 font-mono text-[11px] shrink-0">{item.quantity}x</span>
                        <span className="truncate text-neutral-800 font-medium text-[11px]">{item.name}</span>
                      </div>
                      <span className="font-bold text-neutral-900 font-mono text-[11px] shrink-0">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── PAYMENT METHOD SELECTOR ── */}
              {(storeCodEnabled || storeUpiEnabled) && (
                <div className="bg-white border border-neutral-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
                  <h3 className="text-[10px] font-black text-neutral-900 uppercase tracking-widest font-manrope">Payment Method</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                    {storeCodEnabled && (
                      <button 
                        type="button" 
                        onClick={() => setPaymentMethod("cod")}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                          paymentMethod === "cod" ? "bg-[#D03D56] text-white border-[#D03D56] shadow-sm" : "bg-[#FAF9F8] border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                        }`}
                      >
                        <Banknote className="w-4 h-4 shrink-0" />
                        <span>Cash on Delivery (COD)</span>
                      </button>
                    )}
                    {storeUpiEnabled && (
                      <button 
                        type="button" 
                        onClick={() => setPaymentMethod("upi")}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                          paymentMethod === "upi" ? "bg-[#D03D56] text-white border-[#D03D56] shadow-sm" : "bg-[#FAF9F8] border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                        }`}
                      >
                        <QrCode className="w-4 h-4 shrink-0" />
                        <span>UPI / Online Payment</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ── BILL DETAILS CARD ── */}
              <div className="bg-white border border-neutral-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
                <h3 className="text-[10px] font-black text-neutral-900 uppercase tracking-widest font-manrope">Bill Details</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-neutral-900 font-mono">₹{subtotalAmount}</span>
                  </div>
                  {gstTaxRate > 0 && (
                    <div className="flex justify-between text-neutral-600">
                      <span>GST Tax ({gstTaxRate}%)</span>
                      <span className="font-bold text-neutral-900 font-mono">₹{calculatedTax}</span>
                    </div>
                  )}
                  {otherChargesAmount > 0 && (
                    <div className="flex justify-between text-neutral-600">
                      <span>{otherChargesLabel}</span>
                      <span className="font-bold text-neutral-900 font-mono">₹{otherChargesAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-600">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-neutral-900 font-mono">
                      {storeDeliveryFee === 0 ? <span className="text-emerald-600 font-bold">Free</span> : `₹${storeDeliveryFee}`}
                    </span>
                  </div>
                  <div className="h-px bg-neutral-100 my-2" />
                  <div className="flex justify-between font-black text-neutral-950 text-sm sm:text-base">
                    <span>To Pay</span>
                    <span className="text-lg text-[#D03D56] font-mono font-black">₹{grandTotal}</span>
                  </div>
                </div>

                <div className="pt-2">
                  {storeData?.storeIsOpen === false ? (
                    <button 
                      type="button"
                      disabled
                      className="w-full py-4 text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 bg-neutral-400 cursor-not-allowed shadow-none"
                    >
                      <AlertTriangle className="w-4 h-4 text-white" />
                      <span>🔴 Store is Closed — Orders Paused</span>
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      form="checkout-form"
                      disabled={submitting}
                      className="w-full py-4 text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer shadow-md shadow-neutral-900/10"
                      style={{ backgroundColor: checkoutMethod === "whatsapp" ? "#16a34a" : (theme.colorCode || "#D03D56") }}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Processing Order...</span>
                        </>
                      ) : (
                        <>
                          {checkoutMethod === "whatsapp" ? <MessageCircle className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                          <span>{checkoutMethod === "whatsapp" ? "Confirm & Book via WhatsApp" : "Confirm & Book Order"}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      <CustomerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        storeSlug={storeSlug}
        theme={theme}
        onAuthSuccess={handleAuthSuccess}
      />

      <MobileBottomNav storeSlug={storeSlug} cartCount={cart.reduce((s, i) => s + i.quantity, 0)} />
    </div>
  );
}
