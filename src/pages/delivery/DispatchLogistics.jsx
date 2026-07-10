import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Bike, MapPin, PackageCheck, Clock, Home, BookOpen, Scissors, Droplets, Dumbbell, Wrench, Truck } from "lucide-react";
import axios from "axios";
import { getTheme } from "../storefront/StorefrontHome";

// ─── DYNAMIC LABELS RESOLVER FOR DISPATCH LOGISTICS ────────
function getDispatchLabels(softwareType) {
  const map = {
    restaurant: { title: "Delivery Fleet", centerLabel: "Logistics Dispatch Center", countLabel: "Packages Ready", cardStatus: "Ready to Ship", actionLabel: "Dropoff Confirmed", billingLabel: "Collect COD Value" },
    retail: { title: "Couriers Dispatch", centerLabel: "Fulfillment Courier Routing", countLabel: "Orders Ready", cardStatus: "Ready to Ship", actionLabel: "Shipment Delivered", billingLabel: "Collect Payment" },
    workshop: { title: "Instructors Portal", centerLabel: "Class Coordination Desk", countLabel: "Classes Ready", cardStatus: "Booked Session", actionLabel: "Session Completed", billingLabel: "Total Course Fee" },
    salon: { title: "Stylist Desk", centerLabel: "Stylists Seat Allocations", countLabel: "Appointments Pending", cardStatus: "Stylist Assigned", actionLabel: "Mark Service Done", billingLabel: "Service Charge" },
    water: { title: "Fleet Logistics", centerLabel: "Fluid Delivery Routing", countLabel: "Shipments Pending", cardStatus: "Ready to Load", actionLabel: "Delivery Confirmed", billingLabel: "Collect COD Value" },
    gym: { title: "Trainer Logs", centerLabel: "Trainer Session Allocations", countLabel: "Active Members", cardStatus: "Approved Access", actionLabel: "Check-out Member", billingLabel: "Membership Cost" },
    repair: { title: "Technicians Dispatch", centerLabel: "Field Service Allocations", countLabel: "Repairs Pending", cardStatus: "Ready to Fix", actionLabel: "Job Completed", billingLabel: "Repair Cost" }
  };
  return map[softwareType || "restaurant"] || map.restaurant;
}

function getDispatchIcon(softwareType) {
  const map = {
    restaurant: Bike,
    retail: Truck,
    workshop: BookOpen,
    salon: Scissors,
    water: Droplets,
    gym: Dumbbell,
    repair: Wrench
  };
  return map[softwareType || "restaurant"] || Bike;
}

export default function DispatchLogistics() {
  const { storeSlug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(`token_${storeSlug}`);
    const role = localStorage.getItem(`role_${storeSlug}`);
    if (!token || !["delivery", "admin"].includes(role)) {
      navigate(`/${storeSlug}/login`);
    }
  }, [storeSlug, navigate]);

  const [deliveryQueue, setDeliveryQueue] = useState([]);
  const [storeData, setStoreData] = useState(null);
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
    axios.get(`http://localhost:5000/api/stores/${storeSlug}`)
      .then(r => setStoreData(r.data))
      .catch(() => {});
  }, [storeSlug]);

  useEffect(() => {
    fetchDeliveryQueue();
    const interval = setInterval(fetchDeliveryQueue, 5000);
    return () => clearInterval(interval);
  }, [storeSlug]);

  const handleMarkDelivered = async (orderId) => {
    try {
      await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, { status: 'completed' });
      setDeliveryQueue(deliveryQueue.filter(order => order._id !== orderId));
      alert("Shipment logged and completed.");
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const softwareType = storeData?.softwareType || "restaurant";
  const theme = getTheme(storeData);
  const labels = getDispatchLabels(softwareType);
  const IconComponent = getDispatchIcon(softwareType);

  if (loading) return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#737373] flex items-center justify-center">
      <div className="text-xs uppercase font-black tracking-widest animate-pulse">Initializing Dispatch logs...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans p-6 selection:bg-neutral-800 selection:text-white">
      
      {/* FLEET LOGISTICS HEADER */}
      <header className="bg-white border border-[#F0EEEB] p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FAFAFA] border border-[#F0EEEB] rounded-xl flex items-center justify-center shadow-sm">
            <IconComponent className="w-5 h-5 animate-bounce" style={{ color: theme.colorCode }} />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider text-neutral-900">{storeData?.name || storeSlug} {labels.title}</h1>
            <p className="text-[9px] text-[#737373] font-bold uppercase tracking-widest mt-0.5">{labels.centerLabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="bg-[#FAFAFA] border border-[#F5F5F0] text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl text-neutral-700 font-mono">
            {labels.countLabel}: {deliveryQueue.length}
          </span>
          <Link 
            to={`/${storeSlug}/admin`} 
            className="text-xs font-bold text-neutral-600 hover:text-neutral-900 transition-colors bg-[#FAFAFA] border border-[#F0EEEB] px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <Home className="w-3.5 h-3.5" /> Dashboard
          </Link>
        </div>
      </header>

      {/* DISPATCH GRID */}
      {deliveryQueue.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-[#737373] bg-white border border-dashed border-[#E8E6E3] rounded-2xl">
          <Clock className="w-12 h-12 mb-3 stroke-[1.2] text-neutral-400" />
          <p className="text-xs font-black uppercase tracking-widest text-neutral-500">Fleet Clear</p>
          <p className="text-[10px] text-neutral-450 mt-1 font-bold uppercase tracking-wider">No shipments pending handover.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliveryQueue.map((order) => (
            <div 
              key={order._id} 
              className="bg-white border border-[#F0EEEB] rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div>
                {/* HEADER BANNER */}
                <div className="p-5 bg-[#FAFAFA] border-b border-[#F0EEEB] flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-sm text-neutral-900">{order.customerName}</h3>
                    <p className="text-[9px] text-[#737373] font-bold uppercase tracking-wider mt-0.5">
                      Ready: {new Date(order.updatedAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className="text-[9px] px-2.5 py-1 rounded-lg font-black bg-sky-50 border border-sky-100 text-sky-700 uppercase tracking-wider">
                    {labels.cardStatus}
                  </span>
                </div>

                {/* MANIFEST */}
                <div className="p-5 border-b border-[#F5F5F0]">
                  <span className="text-[9px] font-black text-[#737373] uppercase tracking-widest block mb-3">Manifest</span>
                  <div className="space-y-2 text-xs text-neutral-800">
                    {order.items.map((item, idx) => (
                      <p key={idx} className="font-semibold">
                        <span className="font-black mr-1.5" style={{ color: theme.colorCode }}>{item.quantity}x</span> {item.name}
                      </p>
                    ))}
                  </div>
                </div>

                {/* LOCATION & QUICK CONTACTS */}
                <div className="p-5 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#737373]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Delivery Address</span>
                    </div>
                    <p className="text-xs font-semibold text-neutral-850 pl-5.5 leading-relaxed">
                      {order.address || "Counter Pickup"}
                    </p>
                  </div>

                  {order.phone && (
                    <div className="space-y-2 pt-1">
                      <div className="flex gap-2">
                        <a 
                          href={`tel:${order.phone}`}
                          className="flex-1 py-2 bg-[#FAFAFA] border border-[#F0EEEB] hover:border-neutral-300 text-neutral-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-1.5 transition-all"
                        >
                          📞 Call Rider
                        </a>
                        <a 
                          href={`https://wa.me/${order.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${order.customerName}! I am your delivery partner for your order at ${storeData?.name || 'our store'}. I am on my way to deliver your order.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 bg-[#FAFAFA] border border-[#F0EEEB] hover:border-neutral-300 text-neutral-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-1.5 transition-all"
                        >
                          💬 WhatsApp
                        </a>
                      </div>
                      
                      {order.address && (
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 bg-emerald-50 border border-emerald-100 hover:border-emerald-200 text-emerald-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-1.5 transition-all"
                        >
                          🗺️ Maps Navigate
                        </a>
                      )}
                    </div>
                  )}
                  
                  <div className="h-px bg-[#F5F5F0]" />

                  <div className="text-xs font-black text-[#737373] flex justify-between items-center pt-1.5">
                    <span className="uppercase tracking-widest">{labels.billingLabel}</span>
                    <span className="text-lg font-black text-emerald-600">₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* ACTION CALL */}
              <div className="p-5 bg-[#FAFAFA] border-t border-[#F0EEEB]">
                <button 
                  onClick={() => handleMarkDelivered(order._id)}
                  className="w-full h-11 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
                  style={{ backgroundColor: theme.colorCode }}
                >
                  <PackageCheck className="w-4.5 h-4.5" /> {labels.actionLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}