import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CheckCircle, Loader2, User, CreditCard } from "lucide-react";
import axios from "axios";

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
      // 🌟 CRITICAL MNC UPGRADE: Map productId parameter to satisfy strict Mongoose subdocument schema rules
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

  if (placed) return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 selection:bg-neutral-950 selection:text-white">
      <div className="bg-white border border-neutral-200 rounded-[32px] p-10 text-center max-w-sm shadow-xl animate-fade-up">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-xl font-black text-neutral-900 mb-2">Order Dispatched!</h2>
        <p className="text-neutral-500 text-xs mb-6 leading-relaxed">
          Your order has been successfully queued in the system database and sent directly to the kitchen production board.
        </p>
        <Link 
          to={`/${storeSlug}`} 
          className={`block py-3.5 text-white text-xs font-black uppercase tracking-wider rounded-xl text-center shadow-md transition-all active:scale-95 ${storeData?.bgColor || 'bg-neutral-900'}`}
        >
          Back to storefront Menu
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 font-sans pb-20 selection:bg-neutral-950 selection:text-white">
      
      {/* HEADER */}
      <div className={`text-white px-6 py-4 flex items-center justify-between shadow-md ${storeData?.bgColor || 'bg-neutral-900'}`}>
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          <span className="font-black text-sm tracking-wide uppercase">Your Basket</span>
        </div>
        <Link to={`/${storeSlug}`} className="flex items-center gap-1.5 text-xs font-bold opacity-90 hover:opacity-100 transition-opacity">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* BASKET ITEMS LIST */}
        <div className="lg:col-span-2">
          <h2 className="font-black text-sm uppercase tracking-widest text-neutral-400 mb-5">
            Order Manifest ({cart.length} Item{cart.length !== 1 ? 's' : ''})
          </h2>
          
          {cart.length === 0 ? (
            <div className="text-center py-20 bg-white border border-neutral-200 rounded-[28px] shadow-sm">
              <ShoppingCart className="w-14 h-14 text-neutral-300 mx-auto mb-4 stroke-[1.5]" />
              <h3 className="font-black text-neutral-800 mb-2">Your basket is empty</h3>
              <p className="text-xs text-neutral-400 mb-6">You haven't cataloged any items inside your order yet.</p>
              <Link to={`/${storeSlug}`} className="px-5 py-3 bg-neutral-900 text-white font-black text-xs uppercase tracking-wider rounded-xl inline-block shadow-sm">
                Explore Menu Selection
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item._id} className="bg-white border border-neutral-200/80 rounded-3xl p-5 flex items-center gap-4 shadow-sm animate-fade-in hover:shadow-md transition-shadow">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-450 border flex-shrink-0">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-black text-sm text-neutral-900">{item.name}</p>
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wide mt-0.5">₹{item.price} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQty(item._id, -1)} 
                      className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-250 flex items-center justify-center transition-colors active:scale-90"
                    >
                      <Minus className="w-3 h-3 text-neutral-700" />
                    </button>
                    <span className="text-xs font-black w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQty(item._id, 1)} 
                      className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-250 flex items-center justify-center transition-colors active:scale-90"
                    >
                      <Plus className="w-3 h-3 text-neutral-700" />
                    </button>
                    <button 
                      onClick={() => removeItem(item._id)} 
                      className="w-7 h-7 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center ml-2 transition-all"
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

        {/* CHECKOUT BILLING & METRICS PANEL */}
        {cart.length > 0 && (
          <div className="lg:col-span-1">
            <div className="bg-white border border-neutral-200/80 rounded-[28px] p-6 shadow-sm sticky top-6">
              <h3 className="font-black text-xs uppercase tracking-widest text-neutral-400 mb-5">Checkout Summary</h3>
              
              <div className="space-y-3.5 mb-6 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-neutral-900">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Tax (GST 5%)</span>
                  <span className="font-bold text-neutral-900">Calculated</span>
                </div>
                <div className="divider" />
                <div className="flex justify-between items-center text-sm font-black text-neutral-900">
                  <span>Total Amount</span>
                  <span className="text-lg font-black text-neutral-950">₹{totalAmount}</span>
                </div>
              </div>

              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-wider mb-1.5 ml-1">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. Muhammed Syam" 
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full h-11 border border-neutral-200/80 rounded-xl pl-10 pr-4 text-xs font-semibold focus:outline-none focus:border-neutral-400 transition-all" 
                    />
                  </div>
                </div>

                <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-xl flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-neutral-500" />
                  <div>
                    <span className="text-[9px] font-black uppercase text-neutral-400 block tracking-wider">Payment Node</span>
                    <span className="text-[10px] font-bold text-neutral-700 block">Cash on Delivery / Counter</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className={`w-full h-12 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md disabled:opacity-50 ${storeData?.bgColor || 'bg-neutral-900'} ${storeData?.hoverColor || 'hover:bg-neutral-800'}`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Securing Node...</span>
                    </>
                  ) : (
                    <span>Submit & Checkout Order</span>
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
