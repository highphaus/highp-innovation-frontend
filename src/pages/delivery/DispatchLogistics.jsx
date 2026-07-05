import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Bike, MapPin, CheckCircle, PackageCheck, Clock, Home } from "lucide-react";
import axios from "axios";

export default function DispatchLogistics() {
  const { storeSlug } = useParams();
  const [deliveryQueue, setDeliveryQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveryQueue = () => {
    // Uses the ?role=delivery parameter to selectively isolate ready packages
    axios.get(`http://localhost:5000/api/orders/${storeSlug}?role=delivery`)
      .then(res => {
        setDeliveryQueue(res.data);
        setLoading(false);
      })
      .catch(err => console.error("Fleet dashboard sync issue:", err));
  };

  useEffect(() => {
    fetchDeliveryQueue();
    const interval = setInterval(fetchDeliveryQueue, 5000);
    return () => clearInterval(interval);
  }, [storeSlug]);

  const handleMarkDelivered = async (orderId) => {
    try {
      // Advance order state to clear it out of the active operational pipeline
      await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, { status: 'completed' });
      setDeliveryQueue(deliveryQueue.filter(order => order._id !== orderId));
      alert("📦 Order successfully logged as Delivered!");
    } catch (err) {
      alert("Failed to update delivery node status.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0F172A] text-slate-400 flex items-center justify-center">
      <div className="text-xs uppercase font-black tracking-widest animate-pulse">Initializing Courier Logistics Node...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans p-6 selection:bg-[#1E293B] selection:text-white">
      
      {/* FLEET LOGISTICS HEADER */}
      <header className="border-b border-slate-800 pb-5 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-950 border border-slate-850 rounded-2xl flex items-center justify-center shadow-lg">
            <Bike className="w-5.5 h-5.5 text-sky-400 animate-bounce" />
          </div>
          <div>
            <h1 className="text-lg font-black uppercase tracking-wider">{storeSlug} Delivery Fleet</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Logistics Dispatch Center</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="bg-slate-900 border border-slate-800 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl text-slate-300 font-mono">
            Packages Ready: {deliveryQueue.length}
          </span>
          <Link 
            to={`/${storeSlug}/admin`} 
            className="text-xs font-bold text-slate-450 hover:text-white transition-colors bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" /> Dashboard
          </Link>
        </div>
      </header>

      {/* DISPATCH GRID */}
      {deliveryQueue.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-500 bg-slate-900/10 border border-dashed border-slate-900 rounded-[28px]">
          <Clock className="w-14 h-14 mb-3 stroke-[1.2] text-slate-655" />
          <p className="text-xs font-black uppercase tracking-widest">Fleet Logistics Clear</p>
          <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mt-1">No orders pending courier handoff at this segment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliveryQueue.map((order) => (
            <div 
              key={order._id} 
              className="bg-slate-950/80 border border-slate-850 rounded-[28px] flex flex-col justify-between overflow-hidden shadow-2xl transition-all"
            >
              <div>
                {/* METRICS HEADER BANNER */}
                <div className="p-5 bg-slate-900/40 border-b border-slate-900 flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-sm text-slate-200">{order.customerName}</h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                      Ready: {new Date(order.updatedAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className="text-[9px] px-2.5 py-1 rounded-lg font-black bg-sky-500/10 border border-sky-500/20 text-sky-400 uppercase tracking-wider">
                    Ready to Ship
                  </span>
                </div>

                {/* FOOD MANIFEST SLIP */}
                <div className="p-5 border-b border-slate-900">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-3">Package Manifest</span>
                  <div className="space-y-2 text-xs text-slate-350">
                    {order.items.map((item, idx) => (
                      <p key={idx} className="font-semibold">
                        <span className="text-sky-400 font-black mr-1.5">{item.quantity}x</span> {item.name}
                      </p>
                    ))}
                  </div>
                </div>

                {/* BILLING AND TARGET ROUTING METRICS */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span className="font-medium">Standard Delivery Address / Counter Pick</span>
                  </div>
                  
                  <div className="divider" />

                  <div className="text-xs font-black text-slate-400 flex justify-between items-center pt-1.5">
                    <span className="uppercase tracking-widest">Collect COD Value</span>
                    <span className="text-lg font-black text-emerald-400">₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* ACTION CALL */}
              <div className="p-5 bg-slate-900/20 border-t border-slate-900">
                <button 
                  onClick={() => handleMarkDelivered(order._id)}
                  className="w-full h-11 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                >
                  <PackageCheck className="w-4.5 h-4.5" /> Dropoff Confirmed
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}