import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShieldCheck, ShoppingBag, ClipboardList, TrendingUp,
  RefreshCw, AlertTriangle, Package, ChefHat, Bike, LogIn, Store
} from "lucide-react";
import axios from "axios";

export default function AdminDashboard() {
  const { storeSlug } = useParams();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [storeData, setStoreData] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [errorCondition, setErrorCondition] = useState(false);

  const fetchDashboardMetrics = () => {
    setErrorCondition(false);
    setMetricsLoading(true);
    Promise.all([
      axios.get(`http://localhost:5000/api/stores/${storeSlug.toLowerCase().trim()}`),
      axios.get(`http://localhost:5000/api/products/${storeSlug.toLowerCase().trim()}`),
      axios.get(`http://localhost:5000/api/orders/${storeSlug.toLowerCase().trim()}`)
    ])
      .then(([storeRes, productsRes, ordersRes]) => {
        setStoreData(storeRes.data);
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
        setMetricsLoading(false);
      })
      .catch(err => {
        console.error("Dashboard metric compilation error:", err);
        setErrorCondition(true);
        setMetricsLoading(false);
      });
  };

  useEffect(() => {
    if (storeSlug) fetchDashboardMetrics();
  }, [storeSlug]);

  const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;

  if (metricsLoading) return (
    <div className="min-h-screen bg-neutral-950 text-neutral-400 flex flex-col items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-3" />
      <div className="font-bold text-xs uppercase tracking-widest animate-pulse">
        Compiling Enterprise Dashboard Metrics...
      </div>
    </div>
  );

  if (errorCondition || !storeData) return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 p-6 rounded-[24px] text-center shadow-xl">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3 animate-bounce" />
        <h3 className="font-black uppercase text-sm text-neutral-200">Error Connecting to Gateway Node</h3>
        <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
          The profile data mapping for endpoint [/{storeSlug}] could not be resolved from MongoDB. Check server logs.
        </p>
        <button 
          onClick={fetchDashboardMetrics} 
          className="mt-4 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry Synchronization
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 text-[#0D0D0D] font-sans pb-20 selection:bg-neutral-950 selection:text-white">
      
      {/* TOP HEADER BAR */}
      <div className="bg-neutral-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center border border-white/5">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <span className="font-black text-xs uppercase tracking-wider">{storeData.name} Enterprise Panel</span>
        </div>
        <Link 
          to={`/${storeSlug}`} 
          className="text-xs font-bold text-neutral-400 hover:text-white transition-colors bg-neutral-800 px-3.5 py-2 rounded-xl flex items-center gap-1.5"
        >
          <Store className="w-3.5 h-3.5" /> View Menu Storefront
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* KPI CARDS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Realized Revenue", value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "Total Orders Logs", value: `${orders.length} Logged`, icon: ClipboardList, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Catalog Listings", value: `${products.length} Products`, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Active Operations", value: `${activeOrders} Active`, icon: Package, color: "text-purple-500", bg: "bg-purple-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">{label}</span>
                <span className="text-xl font-black text-neutral-900 mt-1 block">{value}</span>
              </div>
              <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* SHORTCUT CONTROL TILES */}
        <h2 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-5 ml-1">Workspace Control Centers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            {
              to: `/${storeSlug}/admin/inventory`,
              icon: ShoppingBag, iconColor: "text-blue-500", iconBg: "bg-blue-50",
              title: "Inventory Catalog Manager",
              desc: "Deploy new dining menu listings, manage price values, and organize stock assets.",
              badge: `${products.length} items`,
              badgeColor: "bg-blue-150 text-blue-700"
            },
            {
              to: `/${storeSlug}/admin/analytics`,
              icon: TrendingUp, iconColor: "text-emerald-500", iconBg: "bg-emerald-50",
              title: "Analytical Operations",
              desc: "Deep dive statistics, total earnings breakdowns, and lifecycle metrics auditing.",
              badge: `₹${totalRevenue.toLocaleString('en-IN')} rev`,
              badgeColor: "bg-emerald-150 text-emerald-700"
            },
            {
              to: `/${storeSlug}/kitchen`,
              icon: ChefHat, iconColor: "text-orange-500", iconBg: "bg-orange-50",
              title: "Kitchen Monitor (KDS)",
              desc: "Instant live production dockets, chef queue panels, and ticket dispatch gates.",
              badge: `${activeOrders} live`,
              badgeColor: "bg-orange-150 text-orange-700"
            },
            {
              to: `/${storeSlug}/delivery`,
              icon: Bike, iconColor: "text-sky-500", iconBg: "bg-sky-50",
              title: "Fulfillment Courier Hub",
              desc: "Fleet riders coordination desk, ready shipment logistics, and dropped package records.",
              badge: "Dispatch Node",
              badgeColor: "bg-sky-150 text-sky-700"
            },
            {
              to: `/${storeSlug}/login`,
              icon: LogIn, iconColor: "text-neutral-500", iconBg: "bg-neutral-100",
              title: "Staff Gate Terminal",
              desc: "Lock screens logins to direct staff members to KDS or dispatch grids securely.",
              badge: "Role Gate",
              badgeColor: "bg-neutral-200 text-neutral-600"
            },
            {
              to: `/${storeSlug}`,
              icon: Store, iconColor: "text-emerald-500", iconBg: "bg-emerald-50",
              title: "Digital Menu Preview",
              desc: "Client-facing catalog checkout experience. Inspect dynamic styling presets.",
              badge: "Online",
              badgeColor: "bg-emerald-150 text-emerald-700"
            }
          ].map(({ to, icon: Icon, iconColor, iconBg, title, desc, badge, badgeColor }) => (
            <Link 
              key={to} 
              to={to}
              className="bg-white border border-neutral-200 rounded-[24px] p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-4 group"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${badgeColor}`}>{badge}</span>
                </div>
                <h3 className="font-black text-sm text-neutral-900 group-hover:text-neutral-700 transition-colors">{title}</h3>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{desc}</p>
              </div>
              <span className="text-[10px] font-bold text-neutral-400 group-hover:text-neutral-900 flex items-center gap-1 mt-2">
                Open module →
              </span>
            </Link>
          ))}
        </div>

        {/* LIVE ORDERS AUDIT SHEET */}
        <div className="bg-white border border-neutral-200 rounded-[28px] shadow-sm overflow-hidden animate-fade-up">
          <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-neutral-900 uppercase tracking-widest">Recent Logs Pipeline</h2>
              <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider mt-0.5">Real-time database records feed</p>
            </div>
            <button 
              onClick={fetchDashboardMetrics} 
              className="text-xs text-neutral-400 hover:text-neutral-700 flex items-center gap-1.5 transition-colors border px-3 py-1.5 rounded-xl bg-neutral-50"
            >
              <RefreshCw className="w-3 h-3" /> Sync Logs
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="py-20 text-center text-neutral-400">
              <ClipboardList className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
              <p className="text-sm font-semibold">No transactions recorded yet.</p>
              <p className="text-xs mt-1">Share the menu URL storefront link to attract first orders.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {orders.slice(0, 8).map(order => {
                const statusColors = {
                  pending: "bg-amber-50 border-amber-100 text-amber-700",
                  preparing: "bg-orange-50 border-orange-100 text-orange-700",
                  completed: "bg-emerald-50 border-emerald-100 text-emerald-700",
                  cancelled: "bg-red-50 border-red-100 text-red-700"
                };
                return (
                  <div key={order._id} className="px-6 py-4.5 flex items-center justify-between hover:bg-neutral-50/50 transition-colors">
                    <div>
                      <p className="text-xs font-black text-neutral-900">{order.customerName}</p>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">{order.items?.length || 0} Products · {new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-black text-neutral-950">₹{order.totalAmount}</span>
                      <span className={`text-[9px] font-black border uppercase tracking-wider px-2.5 py-1 rounded-lg ${statusColors[order.status] || 'bg-neutral-50 text-neutral-500'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 🌟 Local helper import loader stub to prevent render errors if imported inline
function Loader2({ className }) {
  return (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}