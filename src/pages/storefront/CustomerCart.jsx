import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CheckCircle, Loader2, User, CreditCard } from "lucide-react";
import axios from "axios";
import { getTheme, getVerticalDetails } from "./StorefrontHome";

export default function CustomerCart() {
  const { storeSlug } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`cart_${storeSlug}`)) || []; }
    catch { return []; }
  });
  const [storeData, setStoreData] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);

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

  const totalAmount = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) return;
    setSubmitting(true);
    try {
      await axios.post("http://localhost:5000/api/orders", {
        storeSlug,
        customerName: customerName.trim(),
        items: cart.map(i => ({ 
          productId: i._id, 
          name: i.name, 
          quantity: i.quantity, 
          price: i.price 
        })),
        totalAmount
      });
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
                <div key={item._id} className="bg-white border border-[#F5F5F0] rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
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
                      className={`w-7 h-7 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center ml-1 transition-all`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-sm font-black text-neutral-900 w-16 text-right">₹{item.price * item.quantity}</span>
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
                  <span className="font-bold text-neutral-900">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Tax / GST</span>
                  <span className="font-bold text-neutral-950">Calculated</span>
                </div>
                <div className="h-px bg-[#F5F5F0]" />
                <div className="flex justify-between items-center text-sm font-black text-neutral-900 pt-1.5">
                  <span>Total Amount</span>
                  <span className="text-lg font-black text-neutral-950">₹{totalAmount}</span>
                </div>
              </div>

              <form onSubmit={handleCheckout} className="space-y-4">
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
                      className="w-full bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-neutral-300 focus:bg-white transition-all text-neutral-905" 
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-[#737373]" />
                  <div>
                    <span className="text-[9px] font-black uppercase text-[#737373] block tracking-wider">Payment Node</span>
                    <span className="text-[10px] font-bold text-neutral-800 block">Cash on Delivery / On-site Payment</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className={`w-full py-3.5 ${theme.bg} ${theme.hover} text-white font-black text-[11px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md disabled:opacity-50`}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
