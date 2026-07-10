import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ChefHat, Flame, Check, Clock, Home, ShoppingBag, 
  BookOpen, Scissors, Droplets, Dumbbell, Wrench, 
  Package, Truck
} from "lucide-react";
import axios from "axios";
import { getTheme } from "../storefront/StorefrontHome";
import { getVerticalAdminLabels } from "../admin/AdminDashboard";

// ─── DYNAMIC ICONS & LABELS RESOLVER FOR LIVE QUEUES ────────
function getKdsIconsAndActions(softwareType) {
  const map = {
    restaurant: { icon: ChefHat, actionIcon: Flame, actionLabel: "Start Preparing", finishLabel: "Dispatch Order" },
    retail: { icon: ShoppingBag, actionIcon: Package, actionLabel: "Pack Order", finishLabel: "Ship Package" },
    workshop: { icon: BookOpen, actionIcon: Clock, actionLabel: "Start Session", finishLabel: "Complete Session" },
    salon: { icon: Scissors, actionIcon: Scissors, actionLabel: "Start Service", finishLabel: "Complete Service" },
    water: { icon: Droplets, actionIcon: Truck, actionLabel: "Load Dispatch", finishLabel: "Complete Delivery" },
    gym: { icon: Dumbbell, actionIcon: Clock, actionLabel: "Activate Pass", finishLabel: "Complete Session" },
    repair: { icon: Wrench, actionIcon: Wrench, actionLabel: "Assign Repair", finishLabel: "Resolve Job" }
  };
  return map[softwareType || "restaurant"] || map.restaurant;
}

export default function LiveKDSFeed() {
  const { storeSlug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(`token_${storeSlug}`);
    const role = localStorage.getItem(`role_${storeSlug}`);
    if (!token || !["kitchen", "admin"].includes(role)) {
      navigate(`/${storeSlug}/login`);
    }
  }, [storeSlug, navigate]);

  const [orders, setOrders] = useState([]);
  const [storeData, setStoreData] = useState(null);
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
    axios.get(`http://localhost:5000/api/stores/${storeSlug}`)
      .then(r => setStoreData(r.data))
      .catch(() => {});
  }, [storeSlug]);

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
      alert("Failed to advance order status.");
    }
  };

  const softwareType = storeData?.softwareType || "restaurant";
  const theme = getTheme(storeData);
  const adminLabels = getVerticalAdminLabels(softwareType);
  const kdsInfo = getKdsIconsAndActions(softwareType);
  const IconComponent = kdsInfo.icon;
  const ActionIcon = kdsInfo.actionIcon;

  if (loading) return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#737373] flex items-center justify-center">
      <div className="text-xs uppercase font-black tracking-widest animate-pulse">Initializing Live Queue Stream...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans p-6 overflow-x-hidden selection:bg-neutral-800 selection:text-white">
      
      {/* HEADER */}
      <header className="bg-white border border-[#F0EEEB] p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FAFAFA] border border-[#F0EEEB] rounded-xl flex items-center justify-center shadow-sm">
            <IconComponent className="w-5 h-5 animate-pulse" style={{ color: theme.colorCode }} />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider text-neutral-900">{storeData?.name || storeSlug} Operations Board</h1>
            <p className="text-[9px] text-[#737373] font-bold uppercase tracking-widest mt-0.5">{adminLabels.activeTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="bg-[#FAFAFA] border border-[#F5F5F0] text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl text-neutral-700 font-mono">
            Active Tickets: {orders.length}
          </span>
          <Link 
            to={`/${storeSlug}/admin`} 
            className="text-xs font-bold text-neutral-600 hover:text-neutral-900 transition-colors bg-[#FAFAFA] border border-[#F0EEEB] px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <Home className="w-3.5 h-3.5" /> Dashboard
          </Link>
        </div>
      </header>

      {/* TICKETS CONTAINER */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-[#737373] bg-white border border-dashed border-[#E8E6E3] rounded-2xl">
          <Clock className="w-12 h-12 mb-3 stroke-[1.2] text-neutral-400" />
          <p className="text-xs font-black uppercase tracking-widest text-neutral-500">Queue Clear</p>
          <p className="text-[10px] text-neutral-450 mt-1 font-bold uppercase tracking-wider">No active check-in or request tickets found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {orders.map((order) => {
            const isPreparing = order.status === 'preparing';
            return (
              <div 
                key={order._id} 
                className="rounded-2xl border flex flex-col justify-between overflow-hidden shadow-sm bg-white hover:shadow-md transition-all"
                style={{ 
                  borderColor: isPreparing ? theme.colorCode : '#F0EEEB',
                  boxShadow: isPreparing ? `${theme.colorCode}15 0px 8px 30px` : 'none'
                }}
              >
                <div>
                  {/* CARD HEADER */}
                  <div 
                    className="p-5 border-b flex justify-between items-center"
                    style={{ 
                      backgroundColor: isPreparing ? `${theme.colorCode}08` : '#FAFAFA',
                      borderColor: isPreparing ? `${theme.colorCode}20` : '#F0EEEB'
                    }}
                  >
                    <div>
                      <h3 className="font-black text-sm text-neutral-900">{order.customerName}</h3>
                      <p className="text-[9px] text-[#737373] font-bold uppercase tracking-wider mt-0.5">
                        Received: {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <span 
                      className="text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-wider border"
                      style={{ 
                        backgroundColor: isPreparing ? `${theme.colorCode}15` : 'rgba(245,158,11,0.08)',
                        borderColor: isPreparing ? `${theme.colorCode}30` : 'rgba(245,158,11,0.2)',
                        color: isPreparing ? theme.colorCode : '#d97706'
                      }}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* FOOD ITEMS LIST */}
                  <div className="p-5 space-y-3.5">
                    <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest block">Docket Manifest</span>
                    <div className="space-y-2.5 text-xs text-neutral-800">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start border-b border-[#F5F5F0] pb-2 last:border-0 last:pb-0">
                          <span className="font-semibold">
                            <span className="font-black mr-1.5" style={{ color: theme.colorCode }}>{item.quantity}x</span> 
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* BOTTOM ACTION BUTTON */}
                <div className="p-5 bg-[#FAFAFA] border-t border-[#F0EEEB] flex gap-2">
                  {!isPreparing ? (
                    <button 
                      onClick={() => updateStatus(order._id, 'preparing')}
                      className="w-full h-11 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                      style={{ backgroundColor: theme.colorCode }}
                    >
                      <ActionIcon className="w-4 h-4" /> {kdsInfo.actionLabel}
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateStatus(order._id, 'completed')}
                      className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> {kdsInfo.finishLabel}
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