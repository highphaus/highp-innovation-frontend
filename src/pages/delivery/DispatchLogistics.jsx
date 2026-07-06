import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Bike, MapPin, CheckCircle, PackageCheck, Clock, Home } from "lucide-react";
import axios from "axios";

export default function DispatchLogistics() {
  const { storeSlug } = useParams();
  const [deliveryQueue, setDeliveryQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveryQueue = () => {
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
      await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, { status: 'completed' });
      setDeliveryQueue(deliveryQueue.filter(order => order._id !== orderId));
      alert("📦 Order logged as Delivered.");
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#737373] flex items-center justify-center">
      <div className="text-xs uppercase font-black tracking-widest animate-pulse">Initializing Dispatch logs...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans p-6 selection:bg-[#5C0E1E] selection:text-white">
      
      {/* FLEET LOGISTICS HEADER */}
      <header className="border-b border-[#1A1A1A] pb-5 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neutral-900 border border-[#262626] rounded-xl flex items-center justify-center shadow-lg">
            <Bike className="w-5 h-5 text-sky-400 animate-bounce" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider">{storeSlug} Delivery Fleet</h1>
            <p className="text-[9px] text-[#737373] font-bold uppercase tracking-widest mt-0.5">Logistics Dispatch Center</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="bg-neutral-900 border border-[#1A1A1A] text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl text-slate-300 font-mono">
            Packages Ready: {deliveryQueue.length}
          </span>
          <Link 
            to={`/${storeSlug}/admin`} 
            className="text-xs font-bold text-[#737373] hover:text-white transition-colors bg-neutral-900 border border-[#262626] px-4 py-2 rounded-xl flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" /> Dashboard
          </Link>
        </div>
      </header>

      {/* DISPATCH GRID */}
      {deliveryQueue.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-[#737373] bg-[#0F0F0F] border border-dashed border-[#262626] rounded-2xl">
          <Clock className="w-12 h-12 mb-3 stroke-[1.2]" />
          <p className="text-xs font-black uppercase tracking-widest">Fleet Clear</p>
          <p className="text-[10px] text-[#555] mt-1 font-bold uppercase tracking-wider">No shipments pending handover.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliveryQueue.map((order) => (
            <div 
              key={order._id} 
              className="bg-neutral-950/85 border border-[#1A1A1A] rounded-2xl flex flex-col justify-between overflow-hidden shadow-xl"
            >
              <div>
                {/* HEADER BANNER */}
                <div className="p-5 bg-neutral-900/40 border-b border-[#1A1A1A] flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-sm text-neutral-200">{order.customerName}</h3>
                    <p className="text-[9px] text-[#737373] font-bold uppercase tracking-wider mt-0.5">
                      Ready: {new Date(order.updatedAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className="text-[9px] px-2.5 py-1 rounded-lg font-black bg-sky-500/10 border border-sky-500/20 text-sky-400 uppercase tracking-wider">
                    Ready to Ship
                  </span>
                </div>

                {/* MANIFEST */}
                <div className="p-5 border-b border-[#1A1A1A]">
                  <span className="text-[9px] font-black text-[#737373] uppercase tracking-widest block mb-3">Package Manifest</span>
                  <div className="space-y-2 text-xs text-neutral-300">
                    {order.items.map((item, idx) => (
                      <p key={idx} className="font-semibold">
                        <span className="text-[#5C0E1E] font-black mr-1.5">{item.quantity}x</span> {item.name}
                      </p>
                    ))}
                  </div>
                </div>

                {/* LOCATION */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#737373]">
                    <MapPin className="w-4 h-4 text-neutral-500" />
                    <span className="font-medium">Delivery Address / Counter Pick</span>
                  </div>
                  
                  <div className="h-px bg-[#1A1A1A]" />

                  <div className="text-xs font-black text-slate-400 flex justify-between items-center pt-1.5">
                    <span className="uppercase tracking-widest">Collect COD Value</span>
                    <span className="text-lg font-black text-emerald-400">₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* ACTION CALL */}
              <div className="p-5 bg-neutral-900/20 border-t border-[#1A1A1A]">
                <button 
                  onClick={() => handleMarkDelivered(order._id)}
                  className="w-full h-11 bg-[#5C0E1E] hover:bg-[#3F0712] text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95"
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