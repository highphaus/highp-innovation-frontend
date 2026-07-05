import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChefHat, Flame, Check, Clock, Home } from "lucide-react";
import axios from "axios";

export default function LiveKDSFeed() {
  const { storeSlug } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActiveTickets = () => {
    axios.get(`http://localhost:5000/api/orders/${storeSlug}`)
      .then(res => {
        const activeTickets = res.data.filter(order => order.status === 'pending' || order.status === 'preparing');
        setOrders(activeTickets);
        setLoading(false);
      })
      .catch(err => console.error("KDS sync issue:", err));
  };

  useEffect(() => {
    fetchActiveTickets();
    const interval = setInterval(fetchActiveTickets, 5000);
    return () => clearInterval(interval);
  }, [storeSlug]);

  const updateStatus = async (orderId, nextStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, { status: nextStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: nextStatus } : o).filter(o => nextStatus !== 'completed'));
    } catch (err) {
      alert("Failed to advance order lifecycle status.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-400 flex items-center justify-center">
      <div className="text-xs uppercase font-black tracking-widest animate-pulse">Initializing KDS Stream...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans p-6 overflow-x-hidden selection:bg-neutral-800 selection:text-white">
      
      {/* HEADER */}
      <header className="border-b border-neutral-900 pb-5 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neutral-950 border border-neutral-850 rounded-2xl flex items-center justify-center shadow-lg">
            <ChefHat className="w-5.5 h-5.5 text-orange-500 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black uppercase tracking-wider">{storeSlug} Live KDS</h1>
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5">Production Queue Desk</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="bg-neutral-900 border border-neutral-800 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl text-neutral-300 font-mono">
            Active Tickets: {orders.length}
          </span>
          <Link 
            to={`/${storeSlug}/admin`} 
            className="text-xs font-bold text-neutral-400 hover:text-white transition-colors bg-neutral-900 border border-neutral-850 px-4 py-2 rounded-xl flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" /> Dashboard
          </Link>
        </div>
      </header>

      {/* TICKETS CONTAINER */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-neutral-600 bg-neutral-900/10 border border-dashed border-neutral-900 rounded-[28px]">
          <Clock className="w-14 h-14 mb-3 stroke-[1.2] text-neutral-700" />
          <p className="text-xs font-black uppercase tracking-widest">Queue Clear</p>
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mt-1">No incoming dockets registered in current cycle.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {orders.map((order) => {
            const isPreparing = order.status === 'preparing';
            return (
              <div 
                key={order._id} 
                className={`rounded-[28px] border flex flex-col justify-between overflow-hidden shadow-2xl bg-neutral-950/80 transition-all ${
                  isPreparing 
                    ? 'border-orange-500/50 ring-1 ring-orange-500/10 shadow-orange-950/5' 
                    : 'border-neutral-900'
                }`}
              >
                <div>
                  {/* CARD HEADER */}
                  <div className={`p-5 border-b flex justify-between items-center ${
                    isPreparing ? 'bg-orange-950/20 border-orange-900/10' : 'bg-neutral-900/40 border-neutral-900'
                  }`}>
                    <div>
                      <h3 className="font-black text-sm text-neutral-200">{order.customerName}</h3>
                      <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">
                        Received: {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className={`text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-wider border ${
                      isPreparing 
                        ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' 
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  {/* FOOD ITEMS LIST */}
                  <div className="p-5 space-y-3.5">
                    <span className="text-[9px] font-black text-neutral-550 uppercase tracking-widest block">Docket Manifest</span>
                    <div className="space-y-2.5 text-xs text-neutral-300">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start border-b border-neutral-900/60 pb-2 last:border-0 last:pb-0">
                          <span className="font-semibold">
                            <span className="text-orange-500 font-black mr-1.5">{item.quantity}x</span> 
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* BOTTOM ACTION BUTTON */}
                <div className="p-5 bg-neutral-900/20 border-t border-neutral-900/80 flex gap-2">
                  {!isPreparing ? (
                    <button 
                      onClick={() => updateStatus(order._id, 'preparing')}
                      className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-97"
                    >
                      <Flame className="w-4 h-4" /> Start Preparing
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateStatus(order._id, 'completed')}
                      className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-97"
                    >
                      <Check className="w-4 h-4" /> Dispatch Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}