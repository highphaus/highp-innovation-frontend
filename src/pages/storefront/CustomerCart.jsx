import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CheckCircle,
  Loader2, User, CreditCard, MessageCircle, Package, MapPin,
  Phone as PhoneIcon, Clock, Hash, ExternalLink, ArrowRight, Check
} from "lucide-react";
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
  
  // Custom checkout options
  const [checkoutMethod, setCheckoutMethod] = useState("website"); // website | whatsapp
  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod | upi
  const [deliveryInstructions, setDeliveryInstructions] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [whatsappUrl, setWhatsappUrl] = useState("");

  // Website UPI payment flow state
  const [showWebsiteUpiPayment, setShowWebsiteUpiPayment] = useState(false);
  const [utrReference, setUtrReference] = useState("");

  useEffect(() => {
    if (customerUser) {
      setCustomerName(customerUser.name);
      setCustomerPhone(customerUser.phone || "");
      const token = localStorage.getItem(`customerToken_${storeSlug}`);
      axios.get("/api/customers/me", {
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
    axios.get(`/api/stores/${storeSlug}`).then(r => {
      setStoreData(r.data);
      if (r.data) {
        if (!r.data.codEnabled && r.data.upiId) {
          setPaymentMethod("upi");
        }
        if (r.data.checkoutMode) {
          setCheckoutMethod(r.data.checkoutMode);
        }
      }
    }).catch(() => {});
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
  const calculatedTax = Math.round(subtotalAmount * 0.05); // 5% standard tax
  const grandTotal = subtotalAmount + storeDeliveryFee + calculatedTax;

  // Formats UPI payment deep link for QR code and WhatsApp checkout redirection
  const getUpiPaymentUri = () => {
    const storeName = storeData?.name || "Store Payout";
    return `upi://pay?pa=${storeUpiId}&pn=${encodeURIComponent(storeName)}&am=${grandTotal}&cu=INR`;
  };

  const handleCheckoutFormSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert("Please fill in all checkout fields.");
      return;
    }

    // Validate WhatsApp number is configured when checkout mode is WhatsApp
    if (checkoutMethod === "whatsapp") {
      const cleanPhone = (storeData?.whatsappNumber || "").replace(/[^0-9]/g, "");
      if (!cleanPhone) {
        alert("This store has not configured a WhatsApp number yet. Please contact the store owner.");
        return;
      }
      // Open the WhatsApp tab HERE (synchronous, direct user gesture)
      // so browsers don't block it as a popup.
      // We store a reference and update the URL after the order is saved.
      const waTab = window.open("about:blank", "_blank");
      executeSubmitOrder({ paymentStatus: "pending", paymentReference: "", waTab });
    } else if (checkoutMethod === "website" && paymentMethod === "upi") {
      // Trigger the interactive payment verification screen
      setShowWebsiteUpiPayment(true);
    } else {
      // Proceed directly to submit standard COD order
      executeSubmitOrder({ paymentStatus: "pending", paymentReference: "" });
    }
  };

  const executeSubmitOrder = async ({ paymentStatus = "pending", paymentReference = "", waTab = null }) => {
    setSubmitting(true);

    const cleanPhone = (storeData?.whatsappNumber || "").replace(/[^0-9]/g, "");
    const itemsList = cart.map(item => `* ${item.name} x${item.quantity} - Rs.${item.price * item.quantity}`).join("\n");
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customerAddress.trim())}`;
    
    // Add QR/Pay Link for WhatsApp orders if UPI is selected
    const upiPayLink = paymentMethod === "upi" ? `\n👉 Pay Online: ${getUpiPaymentUri()}` : "";
    
    const waMessageEarly = `New Order from ${storeData?.name || storeSlug}\n\nItems:\n${itemsList}\n\nSubtotal: Rs.${subtotalAmount}\nTax (5%): Rs.${calculatedTax}\nDelivery: Rs.${storeDeliveryFee}\nTotal: Rs.${grandTotal}\n\nCustomer: ${customerName.trim()}\nPhone: ${customerPhone.trim()}\nAddress: ${customerAddress.trim()}\nDirections: ${mapsLink}\n\nInstructions: ${deliveryInstructions || "None"}\nPayment Method: ${paymentMethod === "cod" ? "Cash on Delivery" : `UPI (${storeUpiId})`}${upiPayLink}\n\nPlease confirm order. Thank you!`;
    const waUrlEarly = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessageEarly)}` : "";

    // If a WhatsApp tab was pre-opened synchronously, redirect it now
    if (waTab && waUrlEarly) {
      waTab.location.href = waUrlEarly;
    }

    try {
      const orderRes = await axios.post("/api/orders", {
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
        totalAmount: grandTotal,
        estimatedPrepTime: storeData?.busyModeActive ? (20 + storeData.busyModeDuration) : 20,
        deliveryInstructions: deliveryInstructions.trim(),
        checkoutType: checkoutMethod,
        paymentMethod,
        paymentStatus,
        paymentReference
      });

      const orderId = orderRes.data?._id || orderRes.data?.id || "";
      const shortId = orderId ? `#${orderId.slice(-6).toUpperCase()}` : "#NEW";
      const finalMsg = waMessageEarly.replace("New Order from", `New Order ${shortId} from`);
      const waUrlFinal = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(finalMsg)}` : waUrlEarly;

      // Update the already-open WhatsApp tab with the final URL that includes the real order ID
      if (waTab && waUrlFinal) {
        try { waTab.location.href = waUrlFinal; } catch (_) {}
      }

      setPlacedOrder({
        id: orderId, shortId,
        customerName: customerName.trim(),
        phone: customerPhone.trim(),
        address: customerAddress.trim(),
        items: [...cart],
        subtotal: subtotalAmount,
        deliveryFee: storeDeliveryFee,
        tax: calculatedTax,
        grandTotal,
        placedAt: new Date(),
        storeName: storeData?.name || storeSlug,
        estimatedPrepTime: storeData?.busyModeActive ? (20 + storeData.busyModeDuration) : 20,
        deliveryInstructions: deliveryInstructions.trim(),
        paymentMethod,
        paymentStatus,
        paymentReference
      });
      setWhatsappUrl(waUrlFinal);
      setCart([]);
      localStorage.removeItem(`cart_${storeSlug}`);
      setPlaced(true);
      setShowWebsiteUpiPayment(false);
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

  /* ─── INTERACTIVE WEBSITE UPI PAYMENT SCREEN ─── */
  if (showWebsiteUpiPayment) {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(getUpiPaymentUri())}`;
    
    return (
      <div className="min-h-screen bg-[#F9F9FB] font-sans py-12 px-4 flex items-center justify-center selection:bg-neutral-800 selection:text-white">
        <div className="max-w-md w-full bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl animate-fade-up">
          
          <div className="text-center space-y-1">
            <h1 className="text-lg font-black text-neutral-900 font-manrope uppercase tracking-wider">UPI Payment Gateway</h1>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Scan the QR code below to complete your bill settlement</p>
          </div>

          <div className="h-px bg-neutral-100" />

          {/* Dynamic Invoice Summary */}
          <div className="bg-[#FAFAFA] border border-neutral-200/60 rounded-xl p-4 flex justify-between items-center text-xs">
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase block tracking-wider">Amount to Pay</span>
              <span className="text-lg font-black text-neutral-900 block font-numbers mt-0.5">Rs.{grandTotal}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-neutral-400 uppercase block tracking-wider">UPI ID Reference</span>
              <span className="text-xs font-bold text-neutral-700 block mt-0.5">{storeUpiId}</span>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-4 flex justify-center items-center max-w-[200px] mx-auto shadow-sm">
            <img src={qrCodeUrl} alt="UPI Payment QR Code" className="w-full h-auto" />
          </div>

          <div className="text-center">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-relaxed">
              Open Google Pay, PhonePe, Paytm, or BHIM<br />and scan QR to transfer exactly <span className="text-neutral-900 font-black">Rs.{grandTotal}</span>
            </p>
          </div>

          <div className="h-px bg-neutral-100" />

          {/* Payment Verification Input */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">UPI Transaction ID (UTR)</label>
              <input required type="text" placeholder="Enter 12-digit transaction ID..."
                value={utrReference} onChange={e => setUtrReference(e.target.value.replace(/[^0-9]/g, "").slice(0, 12))}
                className="w-full bg-white border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-neutral-900 placeholder-neutral-300 focus:outline-none focus:border-neutral-400 focus:bg-neutral-50/20 transition-all font-numbers tracking-widest" />
              <span className="block text-[9px] text-neutral-400 font-medium">Verify your payment via the reference ID listed in your banking App.</span>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setShowWebsiteUpiPayment(false); setUtrReference(""); }}
                className="flex-1 py-3 border border-neutral-200 text-neutral-600 hover:bg-neutral-50 font-bold text-xs rounded-lg transition-colors cursor-pointer text-center">
                Change Details
              </button>
              
              <button type="button" disabled={utrReference.length !== 12 || submitting}
                onClick={() => executeSubmitOrder({ paymentStatus: "completed", paymentReference: utrReference })}
                className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-950 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50">
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Verify &amp; Book</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  /* ─── ORDER CONFIRMATION SCREEN ─── */
  if (placed && placedOrder) return (
    <div className="min-h-screen bg-white font-sans selection:bg-neutral-800 selection:text-white">
      <div className="border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center bg-emerald-50 text-emerald-600">
            <CheckCircle className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 font-manrope">Order Confirmed</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to={`/${storeSlug}/profile?tab=orders`} className="text-xs font-bold text-neutral-800 hover:underline">
            View My Orders
          </Link>
          <Link to={`/${storeSlug}`} className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
          </Link>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-10 space-y-6 animate-fade-up">
        {/* Banner timeline */}
        <div className="bg-neutral-50 border border-neutral-200/60 rounded-xl p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-lg font-black text-neutral-900 font-manrope">Order Submitted!</h1>
            <p className="text-xs text-neutral-500 font-medium mt-1">
              Estimated Delivery Time: <span className="font-bold text-neutral-800 font-numbers">{placedOrder.estimatedPrepTime} minutes</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="inline-flex items-center gap-1.5 bg-white border border-neutral-200 rounded-full px-3 py-1 text-[10px] font-bold text-neutral-700 font-numbers">
              <Hash className="w-3 h-3 text-neutral-400" />
              <span>Order ID: {placedOrder.shortId}</span>
            </div>
            <Link to={`/${storeSlug}/profile?tab=orders`}
              className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-950 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors shadow-sm">
              Track in Profile Orders ➔
            </Link>
          </div>
        </div>

        {/* Dynamic Timeline Tracker */}
        <div className="border border-neutral-200 rounded-xl p-5 bg-white space-y-4">
          <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Order Status Timeline</h3>
          <div className="relative pl-6 space-y-5 border-l border-neutral-100">
            <div className="relative">
              <span className="absolute -left-[30px] top-0 w-4 h-4 rounded-full border bg-emerald-600 border-white shadow-sm flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-white" />
              </span>
              <p className="text-xs font-bold text-neutral-900">Order Placed &amp; Logged</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">{placedOrder.placedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[30px] top-0 w-4 h-4 rounded-full border bg-white border-neutral-300 shadow-sm flex items-center justify-center" />
              <p className="text-xs font-bold text-neutral-400">Accepted &amp; Preparing in Kitchen</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">Est. preparation delay: {placedOrder.estimatedPrepTime}m</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[30px] top-0 w-4 h-4 rounded-full border bg-white border-neutral-300 shadow-sm flex items-center justify-center" />
              <p className="text-xs font-bold text-neutral-400">Out for Dispatch</p>
            </div>
          </div>
        </div>

        {whatsappUrl && (
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between w-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl transition-colors font-semibold text-xs shadow-sm">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-white" />
              <span>Validate / Update Order via WhatsApp</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        )}

        <div className="border border-neutral-200 rounded-xl bg-white divide-y divide-neutral-100">
          <div className="p-4 space-y-3">
            <h2 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest font-manrope">Items Confirmed</h2>
            <div className="space-y-3">
              {placedOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-neutral-900">{item.name}</span>
                    <span className="text-neutral-400 font-mono ml-2 font-numbers">x{item.quantity}</span>
                  </div>
                  <span className="font-bold text-neutral-800 font-numbers">Rs.{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-500">
              <span>Subtotal</span><span className="font-numbers">Rs.{placedOrder.subtotal}</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Tax (5%)</span><span className="font-numbers">Rs.{placedOrder.tax}</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Delivery Fee</span>
              <span>{placedOrder.deliveryFee === 0 ? "Free" : `Rs.${placedOrder.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between font-bold text-neutral-900 pt-1 text-sm">
              <span>Grand Total</span>
              <span className="font-numbers">Rs.{placedOrder.grandTotal}</span>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <h2 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest font-manrope">Payment Method</h2>
            <p className="text-xs text-neutral-850 font-bold bg-neutral-50 p-3 rounded-lg border border-neutral-100">
              {placedOrder.paymentMethod === "cod" ? "Cash on Delivery (COD)" : `UPI Payment - Status: ${placedOrder.paymentStatus.toUpperCase()}`}
            </p>
            {placedOrder.paymentReference && (
              <p className="text-[10px] text-neutral-400 font-mono mt-1 font-numbers">
                UTR Reference: {placedOrder.paymentReference}
              </p>
            )}
          </div>

          <div className="p-4 space-y-3">
            <h2 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest font-manrope">Delivery Instructions</h2>
            <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50 p-3 rounded-lg border border-neutral-100">
              {placedOrder.deliveryInstructions || "No special instructions provided."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── MAIN CART PAGE ─── */
  return (
    <div className="min-h-screen bg-white font-sans pb-24 selection:bg-neutral-800 selection:text-white">
      
      {/* ── HEADER ── */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-neutral-700" />
            <h1 className="font-bold text-sm text-neutral-900 font-manrope">Your Basket</h1>
          </div>
          <Link to={`/${storeSlug}`}
            className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-955 text-xs font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to menu
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-6">

        {/* ── ITEMS LIST ── */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Items Summary
            </h2>
            <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded font-numbers">
              {cart.length} item{cart.length !== 1 ? "s" : ""}
            </span>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-16 bg-neutral-50 border border-dashed border-neutral-300/80 rounded-xl">
              <ShoppingCart className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
              <h3 className="font-bold text-neutral-700 mb-1 text-sm">Your basket is empty</h3>
              <p className="text-xs text-neutral-400 mb-4">No items added to the cart yet.</p>
              <Link to={`/${storeSlug}`}
                className="px-4 py-2 text-white font-semibold text-xs rounded-lg transition-all inline-block"
                style={{ backgroundColor: theme.colorCode || "#2563eb" }}>
                Browse Storefront
              </Link>
            </div>
          ) : (
            <div className="border border-neutral-200 rounded-xl bg-white divide-y divide-neutral-100 overflow-hidden shadow-sm">
              {cart.map((item, idx) => (
                <div key={item._id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-neutral-400 text-xs font-mono w-4 font-numbers">{idx + 1}.</span>
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover border border-neutral-100 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-neutral-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5 font-numbers">Rs.{item.price} each</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="flex items-center rounded border border-neutral-200 bg-neutral-50 h-8">
                      <button onClick={() => updateQty(item._id, -1)}
                        className="w-8 h-full flex items-center justify-center text-neutral-500 hover:bg-neutral-150 transition-colors">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-neutral-800 font-numbers">{item.quantity}</span>
                      <button onClick={() => updateQty(item._id, 1)}
                        className="w-8 h-full flex items-center justify-center text-neutral-500 hover:bg-neutral-150 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-neutral-900 w-16 text-right font-numbers">Rs.{item.price * item.quantity}</span>

                    <button onClick={() => removeItem(item._id)}
                      className="text-neutral-300 hover:text-red-500 transition-colors p-1.5 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="space-y-6">

            {/* ── PAYMENT METHOD SELECTOR ── */}
            {(storeCodEnabled || storeUpiId) && (
              <div className="border border-neutral-200 rounded-xl bg-white p-5 shadow-sm space-y-3">
                <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-manrope">Select Payment Method</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {storeCodEnabled && (
                    <button type="button" onClick={() => setPaymentMethod("cod")}
                      className={`p-3 rounded-lg border text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                        paymentMethod === "cod" ? "bg-neutral-900 text-white border-transparent" : "bg-white border-neutral-250 text-neutral-600 hover:bg-neutral-50"
                      }`}>
                      <CreditCard className="w-4 h-4" />
                      <span>Cash on Delivery (COD)</span>
                    </button>
                  )}
                  {storeUpiId && (
                    <button type="button" onClick={() => setPaymentMethod("upi")}
                      className={`p-3 rounded-lg border text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                        paymentMethod === "upi" ? "bg-neutral-900 text-white border-transparent" : "bg-white border-neutral-250 text-neutral-600 hover:bg-neutral-50"
                      }`}>
                      <MessageCircle className="w-4 h-4" />
                      <span>UPI Payment</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── BILL DETAILS ── */}
            <div className="border border-neutral-200 rounded-xl bg-white p-5 shadow-sm space-y-3">
              <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-manrope">Bill Details</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-800 font-numbers">Rs.{subtotalAmount}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Tax (5% GST)</span>
                  <span className="font-semibold text-neutral-800 font-numbers">Rs.{calculatedTax}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-neutral-800">
                    {storeDeliveryFee === 0 ? <span className="text-emerald-600 font-bold">Free</span> : `Rs.${storeDeliveryFee}`}
                  </span>
                </div>
                <div className="h-px bg-neutral-200 my-2" />
                <div className="flex justify-between font-bold text-neutral-950 text-sm">
                  <span>To Pay</span>
                  <span className="text-base text-neutral-900 font-numbers">Rs.{grandTotal}</span>
                </div>
              </div>
            </div>

            {/* ── WHATSAPP MISSING NUMBER WARNING ── */}
            {checkoutMethod === "whatsapp" && !(storeData?.whatsappNumber || "").replace(/[^0-9]/g, "") && (
              <div className="border border-amber-300 bg-amber-50 rounded-xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-800">WhatsApp number not configured</p>
                  <p className="text-[10px] text-amber-700 mt-0.5 leading-relaxed">
                    The store owner has not added their WhatsApp number yet. Orders cannot be sent via WhatsApp until it is set up in the store settings.
                  </p>
                </div>
              </div>
            )}

            {/* ── CUSTOMER & CHECKOUT DETAILS ── */}
            <div className="border border-neutral-200 rounded-xl bg-white p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                <div>
                  <h3 className="font-bold text-xs text-neutral-900 font-manrope">Customer Details</h3>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Please provide delivery coordinates</p>
                </div>
                {customerUser && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full">
                    <User className="w-3.5 h-3.5" />
                    <span>Logged In</span>
                  </div>
                )}
              </div>

              {!customerUser ? (
                <div className="rounded-lg p-5 text-center space-y-3 bg-neutral-50 border border-neutral-200">
                  <div className="w-10 h-10 bg-white border border-neutral-200 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800">Authentication Required</h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">Sign in or register to place your order and trace status.</p>
                  </div>
                  <button type="button" onClick={() => setAuthModalOpen(true)}
                    className="w-full py-3 bg-neutral-850 hover:bg-neutral-900 active:scale-98 text-white font-semibold text-xs rounded-lg transition-all cursor-pointer">
                    Sign In / Register
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCheckoutFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="cart-name" className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider">Your Name</label>
                      <input 
                        required 
                        id="cart-name"
                        type="text" 
                        placeholder="Full name"
                        value={customerName} 
                        onChange={e => setCustomerName(e.target.value)}
                        className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-neutral-900 placeholder-neutral-300 focus:outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-250 transition-all font-sans" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="cart-phone" className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider">Phone Number</label>
                      <input 
                        required 
                        id="cart-phone"
                        type="tel" 
                        placeholder="+91 98765 43210"
                        value={customerPhone} 
                        onChange={e => setCustomerPhone(e.target.value)}
                        className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-neutral-900 placeholder-neutral-300 focus:outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-250 transition-all font-sans" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="cart-address" className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider">Delivery Address</label>
                    <textarea 
                      required 
                      id="cart-address"
                      rows={3} 
                      placeholder="Building name, apartment number, street details, area..."
                      value={customerAddress} 
                      onChange={e => setCustomerAddress(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-neutral-900 placeholder-neutral-300 focus:outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-250 transition-all resize-none font-sans" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="cart-instructions" className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider">Delivery Instructions</label>
                    <input 
                      id="cart-instructions"
                      type="text" 
                      placeholder="e.g. Leave at gate, Ring doorbell..."
                      value={deliveryInstructions} 
                      onChange={e => setDeliveryInstructions(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-neutral-900 placeholder-neutral-300 focus:outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-250 transition-all font-sans" 
                    />
                  </div>

                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center justify-between text-[11px] text-neutral-600">
                    <span className="font-semibold">Selected Payment Method</span>
                    <span className="font-bold text-neutral-900">
                      {paymentMethod === "cod" ? "Cash on Delivery" : `UPI Payment`}
                    </span>
                  </div>

                  <button type="submit" disabled={submitting}
                    className="w-full py-3.5 text-white font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer shadow-md"
                    style={{ backgroundColor: checkoutMethod === "whatsapp" ? "#16a34a" : (theme.colorCode || "#2563eb") }}>
                    {submitting ? (
                      <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing...</span>
                      </>
                    ) : (
                      <>
                      {checkoutMethod === "whatsapp" ? <MessageCircle className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      <span>{checkoutMethod === "whatsapp" ? "Confirm & Book via WhatsApp" : "Confirm & Book"}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

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
