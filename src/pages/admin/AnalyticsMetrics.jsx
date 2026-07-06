import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { TrendingUp, ShoppingBag, ClipboardList, ArrowLeft, IndianRupee, Package, Clock, ShieldCheck, Activity } from "lucide-react";
import axios from "axios";

export default function AnalyticsMetrics() {
  const { storeSlug } = useParams();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storeSlug) return;
    Promise.all([
      axios.get(`http://localhost:5000/api/orders/${storeSlug}`),
      axios.get(`http://localhost:5000/api/products/${storeSlug}`)
    ]).then(([ordersRes, productsRes]) => {
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [storeSlug]);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const preparingOrders = orders.filter(o => o.status === 'preparing').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

  const statusConfig = {
    pending: { label: "Pending", color: "bg-amber-50 text-amber-700 border-amber-200" },
    preparing: { label: "Preparing", color: "bg-orange-50 text-orange-700 border-orange-200" },
    completed: { label: "Completed", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    cancelled: { label: "Cancelled", color: "bg-red-50 text-red-700 border-red-200" },
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-20 selection:bg-[#5C0E1E] selection:text-white">
      
      {/* HEADER */}
      <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center border border-white/5">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-xs uppercase tracking-wider">{storeSlug} — Analytics Suite</span>
        </div>
        <Link to={`/${storeSlug}/admin`} className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-white transition-colors bg-neutral-800 px-3.5 py-2 rounded-xl">
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-8">
        {loading ? (
          <div className="text-center py-20 text-[#737373] animate-pulse text-xs uppercase tracking-widest font-bold">Compiling metric assets...</div>
        ) : (
          <>
            {/* KPI METRIC TILES */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {[
                { label: "Gross Generated Revenue", value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: "text-[#5C0E1E]", bg: "bg-[#5C0E1E]/8" },
                { label: "Order Transaction Logs", value: `${orders.length} Logged`, icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Catalog Listings", value: `${products.length} Products`, icon: Package, color: "text-purple-500", bg: "bg-purple-55" },
                { label: "Incoming Active Queue", value: `${pendingOrders + preparingOrders} Tickets`, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white border border-[#F5F5F0] rounded-2xl p-5 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-black text-[#737373] uppercase tracking-widest block">{label}</span>
                    <span className="text-xl font-black text-neutral-900 mt-1 block">{value}</span>
                  </div>
                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-4.5 h-4.5 ${color}`} />
                  </div>
                </div>
              ))}
            </div>

            {/* CHARTS WORKSPACE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              
              {/* ORDER STATUS SEGMENTS */}
              <div className="bg-white border border-[#F5F5F0] rounded-2xl p-6 shadow-sm lg:col-span-1 space-y-5">
                <h3 className="font-black text-xs uppercase tracking-widest text-[#737373] flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#737373]" /> Pipeline Segments
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Completed Operations", count: completedOrders, color: "bg-emerald-500" },
                    { label: "Active Preparation", count: preparingOrders, color: "bg-orange-500" },
                    { label: "Pending Verification", count: pendingOrders, color: "bg-amber-500" },
                    { label: "Cancelled Tickets", count: cancelledOrders, color: "bg-red-505" },
                  ].map(({ label, count, color }) => (
                    <div key={label} className="bg-[#FAFAFA] p-4 rounded-xl border border-[#F5F5F0]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-black text-neutral-700">{label}</span>
                        <span className="text-xs font-black text-neutral-900 bg-white px-2 py-0.5 border border-[#F5F5F0] rounded shadow-sm">{count}</span>
                      </div>
                      <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${color} rounded-full transition-all duration-500`}
                          style={{ width: orders.length ? `${(count / orders.length) * 100}%` : "0%" }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RECENT TRANSACTION DOCKETS */}
              <div className="bg-white border border-[#F5F5F0] rounded-2xl p-6 shadow-sm lg:col-span-2 space-y-5">
                <h3 className="font-black text-xs uppercase tracking-widest text-[#737373] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#737373]" /> Ledger Auditing
                </h3>
                
                {orders.length === 0 ? (
                  <div className="text-center py-20 text-neutral-400">
                    <ClipboardList className="w-10 h-10 text-neutral-250 mx-auto mb-2" />
                    <p className="text-xs font-semibold">No transactions found inside database logs.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
                    {orders.slice(0, 10).map(order => {
                      const cfg = statusConfig[order.status] || statusConfig.pending;
                      return (
                        <div key={order._id} className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-2xl border border-[#F5F5F0] hover:border-neutral-250 transition-all">
                          <div>
                            <p className="text-xs font-black text-neutral-900">{order.customerName}</p>
                            <p className="text-[9px] text-[#737373] font-bold uppercase tracking-wider mt-0.5">
                              {order.items?.length || 0} Items · {new Date(order.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-black text-neutral-950">₹{order.totalAmount}</span>
                            <span className={`text-[9px] px-2.5 py-1 rounded-lg font-black border uppercase tracking-wider ${cfg.color}`}>{cfg.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}
