import { useState, useEffect } from "react";
import { X, Clock, ShoppingBag, Loader2, AlertCircle } from "lucide-react";
import axios from "axios";

export default function OrderHistoryDrawer({ isOpen, onClose, storeSlug, theme }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    setLoading(true);
    setErrorMsg("");
    const token = localStorage.getItem(`customerToken_${storeSlug}`);

    try {
      const res = await axios.get("/api/customers/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      setErrorMsg("Failed to sync historical order metrics.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Status Badge Helper
  const getStatusClass = (status) => {
    const map = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      preparing: "bg-orange-50 text-orange-700 border-orange-200",
      completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
    };
    return map[status] || "bg-neutral-50 text-neutral-500 border-neutral-200";
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex justify-end animate-fade-in font-sans">
      <div 
        className="w-full max-w-md bg-white border-l border-[#F0EEEB] h-full flex flex-col justify-between shadow-2xl relative animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-6 border-b border-[#F5F5F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 ${theme.lightBg} rounded-xl flex items-center justify-center`}>
              <ShoppingBag className={`w-4 h-4 ${theme.primary}`} />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">Order Logs</h2>
              <p className="text-[9px] text-[#737373] uppercase tracking-widest font-black mt-0.5">Historical Manifest</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-900 transition-colors p-1.5 hover:bg-neutral-50 rounded-xl"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center py-24 text-neutral-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#D03D56] mb-3" />
              <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Syncing order entries...</span>
            </div>
          ) : errorMsg ? (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2.5 text-red-800 text-xs">
              <AlertCircle className="w-4.5 h-4.5 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-neutral-400 border border-dashed border-[#E8E6E3] rounded-2xl">
              <Clock className="w-10 h-10 mb-3 stroke-[1.2] text-neutral-350" />
              <p className="text-xs font-black uppercase tracking-widest text-neutral-500">No Orders Logged</p>
              <p className="text-[9px] text-neutral-400 mt-1 font-bold text-center px-6">
                Register active items inside your storefront catalog to initialize logs.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-[#FAFAFA] border border-[#F0EEEB] rounded-2xl p-5 space-y-4">
                  {/* ORDER SUMMARY */}
                  <div className="flex justify-between items-start border-b border-[#F5F5F0] pb-3">
                    <div>
                      <p className="text-[9px] text-[#737373] font-bold uppercase tracking-widest">
                        Order #{order._id.substring(order._id.length - 6).toUpperCase()}
                      </p>
                      <p className="text-[10px] text-neutral-500 font-medium mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()} · {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* MANIFEST ITEMS */}
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-neutral-700">
                        <span>
                          <span className="font-black text-[#D03D56] mr-1.5">{item.quantity}x</span>
                          {item.name}
                        </span>
                        <span className="font-bold text-neutral-900">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* TOTAL SUM */}
                  <div className="flex justify-between items-center border-t border-[#F5F5F0] pt-3 text-xs font-black text-neutral-900">
                    <span className="uppercase tracking-widest text-[9px] text-[#737373]">Total Paid</span>
                    <span className="text-sm font-black text-neutral-950">₹{order.totalAmount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-[#F5F5F0] bg-[#FAFAFA] text-center">
          <p className="text-[9px] text-[#737373] uppercase tracking-widest font-black">
            HighP Platform · secure ledger node
          </p>
        </div>
      </div>
    </div>
  );
}
