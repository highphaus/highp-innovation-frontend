import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  TrendingUp, ClipboardList, Users2, Landmark,
  ArrowUpRight, RefreshCw, ShoppingBag, ChefHat,
  Bike, BarChart3, ShieldCheck, Store, BookOpen, Scissors, Droplets, Dumbbell, Wrench,
  Menu, X, Clock, AlertTriangle, AlertCircle
} from "lucide-react";
import axios from "axios";
import { getTheme, getVerticalDetails } from "../storefront/StorefrontHome";

/* ─── MOCK FALLBACK DATA (renders if backend is unreachable) ─ */
const FALLBACK_STORE = { name: "Your Store", slug: "" };
const FALLBACK_PRODUCTS = [];
const FALLBACK_ORDERS = [];

// ─── VERTICAL LABEL TRANSLATOR FOR WORKSPACE OPERATIONS ───
export function getVerticalAdminLabels(softwareType) {
  const map = {
    restaurant: { kds: "Kitchen KDS", delivery: "Delivery Dispatch", activeTitle: "Live Kitchen Queue" },
    retail: { kds: "Order Dispatch", delivery: "Couriers Feed", activeTitle: "Order Preparation" },
    workshop: { kds: "Roster Board", delivery: "Instructors Desk", activeTitle: "Active Registrants" },
    salon: { kds: "Chair Queue", delivery: "Stylists Assignment", activeTitle: "Waitlist Queue" },
    water: { kds: "Dispatch Queue", delivery: "Fleet Routing", activeTitle: "Subscription Deliveries" },
    gym: { kds: "Gate Scanner", delivery: "Trainers Log", activeTitle: "Member Gate Check-ins" },
    repair: { kds: "Work Orders", delivery: "Tech Assignments", activeTitle: "Service Jobs Queue" }
  };
  return map[softwareType || "restaurant"] || map.restaurant;
}

/* ─── Inline Sparkline (SVG line chart) ──────────────────── */
function SparklineChart({ data, color = "#D03D56", height = 40 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100 / (data.length - 1);
  const points = data.map((v, i) => `${i * w},${height - ((v - min) / range) * height}`).join(" ");

  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} 100,${height}`}
        fill="url(#sparkGrad)"
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => (
        <circle
          key={i}
          cx={i * w}
          cy={height - ((v - min) / range) * height}
          r="1.5"
          fill={color}
        />
      ))}
    </svg>
  );
}

/* ─── Revenue Bar Chart (SVG) ────────────────────────────── */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const REVENUE_DATA = [3.1, 4.4, 3.8, 5.2, 6.1, 4.9, 7.3, 8.2];
const MAX_REV = Math.max(...REVENUE_DATA);

/* ─── METRIC CARD ─────────────────────────────────────────── */
function MetricCard({ title, value, change, positive, icon: Icon, sparkData, iconBg, iconColor, themeColor }) {
  return (
    <div className="bg-white border border-[#F0EEEB] rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#737373]">{title}</span>
        <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-black tracking-tight text-neutral-955">{value}</h3>
        <p className={`text-[10px] font-bold mt-0.5 ${positive ? "text-emerald-600" : "text-red-500"}`}>
          {positive ? "↑" : "↓"} {change}
        </p>
      </div>
      {sparkData && (
        <div className="border-t border-[#F5F5F0] pt-3">
          <SparklineChart data={sparkData} color={themeColor} height={32} />
        </div>
      )}
    </div>
  );
}

/* ─── STATUS BADGE ────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    preparing: "bg-orange-50 text-orange-700 border-orange-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${map[status] || "bg-neutral-50 text-neutral-500 border-neutral-200"}`}>
      {status}
    </span>
  );
}

/* ─── MAIN DASHBOARD ──────────────────────────────────────── */
export default function AdminDashboard() {
  const { storeSlug } = useParams();
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [busyModeActive, setBusyModeActive] = useState(false);
  const [busyModeDuration, setBusyModeDuration] = useState(30);
  const [customDuration, setCustomDuration] = useState("");
  const [busyModeMessage, setBusyModeMessage] = useState("");
  const [busySubmitting, setBusySubmitting] = useState(false);

  useEffect(() => {
    if (storeData) {
      setBusyModeActive(storeData.busyModeActive || false);
      setBusyModeDuration(storeData.busyModeDuration || 30);
      setBusyModeMessage(storeData.busyModeMessage || "");
    }
  }, [storeData]);

  const handleUpdateBusyMode = async (activeState, durationVal, messageVal) => {
    setBusySubmitting(true);
    try {
      const duration = parseInt(durationVal) || 0;
      const endTime = activeState ? new Date(Date.now() + duration * 60000) : null;
      const res = await axios.put(`http://localhost:5000/api/stores/${storeSlug.toLowerCase().trim()}`, {
        busyModeActive: activeState,
        busyModeDuration: duration,
        busyModeEndTime: endTime,
        busyModeMessage: messageVal
      });
      setStoreData(res.data);
    } catch (err) {
      console.error("Busy mode update failure:", err);
      alert("Failed to update busy mode settings.");
    } finally {
      setBusySubmitting(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem(`token_${storeSlug}`);
    const role = localStorage.getItem(`role_${storeSlug}`);
    if (!token || role !== "admin") {
      navigate(`/${storeSlug}/login`);
    }
  }, [storeSlug, navigate]);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      axios.get(`http://localhost:5000/api/stores/${storeSlug.toLowerCase().trim()}`),
      axios.get(`http://localhost:5000/api/products/${storeSlug.toLowerCase().trim()}`),
      axios.get(`http://localhost:5000/api/orders/${storeSlug.toLowerCase().trim()}`),
    ])
      .then(([storeRes, productsRes, ordersRes]) => {
        setStoreData(storeRes.data);
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
        setLastSync(new Date());
        setLoading(false);
      })
      .catch(() => {
        /* ── CATCH-HANDLER FALLBACK: render default template values instead of blank screen ── */
        setStoreData({ ...FALLBACK_STORE, name: storeSlug.toUpperCase() + " Hub", slug: storeSlug });
        setProducts(FALLBACK_PRODUCTS);
        setOrders(FALLBACK_ORDERS);
        setLastSync(new Date());
        setLoading(false);
      });
  };

  useEffect(() => { if (storeSlug) fetchAll(); }, [storeSlug]);

  const softwareType = storeData?.softwareType || "restaurant";
  const details = getVerticalDetails(softwareType);
  const theme = getTheme(storeData);
  const adminLabels = getVerticalAdminLabels(softwareType);

  /* ─── Computed Metrics ──────────────────────────────────── */
  const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const activeOrders = orders.filter(o => ["pending", "preparing"].includes(o.status)).length;

  /* ─── LOADING STATE ─────────────────────────────────────── */
  if (loading) return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className={`w-8 h-8 border-2 border-neutral-200 border-t-[#D03D56] rounded-full animate-spin mx-auto`} style={{ borderTopColor: theme.colorCode }} />
        <p className="text-[10px] font-black text-[#737373] uppercase tracking-widest animate-pulse">
          Syncing Operational Metrics...
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans antialiased selection:bg-neutral-800 selection:text-white">

      {/* ─── TOP NAV HEADER ──────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#F0EEEB] px-6 lg:px-10 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* LEFT: BRAND ID */}
          <div className="flex items-center gap-3">
            <div className={`w-7 h-7 ${theme.bg} rounded-lg flex items-center justify-center`}>
              <span className="font-black text-white text-xs">H</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-xs uppercase tracking-widest text-neutral-900 block">
                {storeData?.name}
              </span>
              <span className="text-[9px] text-[#737373] font-mono">/{storeSlug} ({softwareType})</span>
            </div>
          </div>

          {/* CENTER: QUICK NAV PILLS */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { to: `/${storeSlug}/admin`, label: "Dashboard", active: true },
              { to: `/${storeSlug}/admin/inventory`, label: "Inventory" },
              { to: `/${storeSlug}/admin/prices`, label: "Prices" },
              { to: `/${storeSlug}/admin/campaigns`, label: "Campaigns" },
              { to: `/${storeSlug}/admin/analytics`, label: "Analytics" },
              { to: `/${storeSlug}/admin/staff`, label: "Staff" },
              { to: `/${storeSlug}/kitchen`, label: adminLabels.kds },
              { to: `/${storeSlug}/delivery`, label: adminLabels.delivery },
            ].map(({ to, label, active }) => (
              <Link
                key={to} to={to}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  active
                    ? `${theme.bg} text-white`
                    : "text-[#737373] hover:text-neutral-900 hover:bg-[#F5F5F0]"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* RIGHT: ACTIONS */}
          <div className="flex items-center gap-3">
            {lastSync && (
              <span className="hidden sm:block text-[9px] text-[#737373] font-mono">
                Synced {lastSync.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchAll}
              className="p-2 hover:bg-[#F5F5F0] rounded-lg transition-colors text-[#737373] hover:text-neutral-900"
              title="Refresh data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <Link
              to={`/${storeSlug}`}
              className={`hidden xs:flex items-center gap-1.5 text-[10px] font-black ${theme.primary} ${theme.lightBg} hover:bg-neutral-100 px-3 py-1.5 rounded-lg transition-all`}
            >
              <Store className="w-3 h-3" /> Storefront <ArrowUpRight className="w-2.5 h-2.5" />
            </Link>
            
            {/* Mobile Nav Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-[#F5F5F0] rounded-lg transition-colors text-[#737373] hover:text-neutral-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE NAV DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#F0EEEB] px-6 py-3 space-y-1.5 animate-fade-down shadow-sm">
          {[
            { to: `/${storeSlug}/admin`, label: "Dashboard", active: true },
            { to: `/${storeSlug}/admin/inventory`, label: "Inventory" },
            { to: `/${storeSlug}/admin/prices`, label: "Prices" },
            { to: `/${storeSlug}/admin/campaigns`, label: "Campaigns" },
            { to: `/${storeSlug}/admin/analytics`, label: "Analytics" },
            { to: `/${storeSlug}/admin/staff`, label: "Staff" },
            { to: `/${storeSlug}/kitchen`, label: adminLabels.kds },
            { to: `/${storeSlug}/delivery`, label: adminLabels.delivery },
          ].map(({ to, label, active }) => (
            <Link
              key={to} to={to}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                active
                  ? `${theme.bg} text-white`
                  : "text-[#737373] hover:text-neutral-900 hover:bg-[#F5F5F0]"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}

      {/* ─── MAIN CONTENT ────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-8 space-y-8">

        {/* ⚠️ PENDING ACTIVATION BANNER NOTICE */}
        {storeData && !storeData.isApproved && (
          <div className="bg-amber-500 text-white text-center py-2.5 px-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-2xl">
            <span>⚠️ Workspace Pending Activation. Please contact billing@highp.com to activate your node.</span>
          </div>
        )}

        {/* PAGE TITLE */}
        <div className="flex items-end justify-between border-b border-[#F0EEEB] pb-5">
          <div>
            <p className={`text-[10px] font-black ${theme.primary} uppercase tracking-widest mb-1`}>
              Operations Dashboard
            </p>
            <h1 className="text-2xl font-black tracking-tight text-neutral-950">
              Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"} ✦
            </h1>
            <p className="text-[11px] text-[#737373] font-medium mt-0.5">
              Here's what's happening in your {storeData?.name} {softwareType} engine today.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-[#737373] font-semibold bg-white border border-[#F0EEEB] px-3 py-2 rounded-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Data
          </div>
        </div>

        {/* 🚨 BUSY MODE SETTINGS DESK */}
        <div className="bg-white border border-[#F0EEEB] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F5F5F0] pb-4">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl flex items-center justify-center ${busyModeActive ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-neutral-50 text-neutral-400'}`}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                  Busy Mode / Operations Delay
                  {busyModeActive && (
                    <span className="text-[8px] px-2 py-0.5 rounded-full bg-red-500 text-white font-black uppercase tracking-widest animate-pulse">
                      Active
                    </span>
                  )}
                </h3>
                <p className="text-[10px] text-[#737373] mt-0.5 font-semibold">
                  Signal high demand to consumers. Selecting a delay updates delivery estimates and shows website alert notifications.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const nextState = !busyModeActive;
                setBusyModeActive(nextState);
                handleUpdateBusyMode(nextState, busyModeDuration, busyModeMessage);
              }}
              disabled={busySubmitting}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                busyModeActive
                  ? "bg-red-600 hover:bg-red-700 text-white shadow-md active:scale-95"
                  : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900"
              }`}
            >
              {busySubmitting ? "Updating..." : busyModeActive ? "Disable Busy Mode" : "Enable Busy Mode"}
            </button>
          </div>

          {busyModeActive && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1 animate-fade-down">
              {/* Left Column: Delay Selectors */}
              <div className="space-y-3">
                <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest">
                  Estimated Delay Duration (Minutes)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[5, 10, 15, 20, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => {
                        setBusyModeDuration(mins);
                        setCustomDuration("");
                        handleUpdateBusyMode(true, mins, busyModeMessage);
                      }}
                      className={`px-3 py-2 rounded-xl text-[10px] font-black tracking-wider border transition-all cursor-pointer ${
                        busyModeDuration === mins && !customDuration
                          ? `${theme.bg} text-white border-transparent shadow-sm`
                          : "bg-white border-[#F0EEEB] hover:border-neutral-300 text-neutral-700 hover:text-neutral-900"
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      placeholder="Custom"
                      value={customDuration}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomDuration(val);
                        if (val) {
                          setBusyModeDuration(parseInt(val) || 0);
                        }
                      }}
                      className="w-16 bg-[#FAFAFA] border border-[#F0EEEB] rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-neutral-300 text-neutral-900"
                    />
                    {customDuration && (
                      <button
                        onClick={() => handleUpdateBusyMode(true, customDuration, busyModeMessage)}
                        className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase text-white ${theme.bg}`}
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Custom Message */}
              <div className="space-y-3">
                <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest">
                  Custom Notification Banner Message
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. High volume of orders. Standard deliveries may take longer."
                    value={busyModeMessage}
                    onChange={(e) => setBusyModeMessage(e.target.value)}
                    className="flex-1 bg-[#FAFAFA] border border-[#F0EEEB] rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-neutral-300 text-neutral-900"
                  />
                  <button
                    onClick={() => handleUpdateBusyMode(true, busyModeDuration, busyModeMessage)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-white shadow-sm cursor-pointer ${theme.bg}`}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── 4 KPI METRIC TILES ──────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="Total Earnings"
            value={`₹${(totalRevenue || 248000).toLocaleString("en-IN")}`}
            change="12.5% from last month"
            positive={true}
            icon={Landmark}
            iconBg={theme.lightBg}
            iconColor={theme.primary}
            sparkData={[3.1, 3.8, 4.2, 3.9, 5.1, 6.2, 5.8, 7.3]}
            themeColor={theme.colorCode}
          />
          <MetricCard
            title="Total Bookings / Sales"
            value={orders.length || "1,243"}
            change="8.2% from last month"
            positive={true}
            icon={ClipboardList}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            sparkData={[12, 18, 14, 22, 19, 28, 24, 31]}
            themeColor={theme.colorCode}
          />
          <MetricCard
            title="Active Customers"
            value="3,682"
            change="16.1% from last month"
            positive={true}
            icon={Users2}
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
            sparkData={[200, 320, 280, 410, 390, 520, 480, 610]}
            themeColor={theme.colorCode}
          />
          <MetricCard
            title="Pending Settlements"
            value={`₹${activeOrders > 0 ? (activeOrders * 850).toLocaleString("en-IN") : "24,500"}`}
            change="6.0% from last month"
            positive={false}
            icon={ShoppingBag}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            sparkData={[8, 12, 7, 15, 11, 9, 13, 10]}
            themeColor={theme.colorCode}
          />
        </div>

        {/* ─── REVENUE CHART + ORDERS LEDGER ──────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* REVENUE LINE GRAPH BLOCK */}
          <div className="lg:col-span-2 bg-white border border-[#F0EEEB] rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-neutral-950">Revenue Overview</h3>
                <p className="text-[10px] text-[#737373] font-medium mt-0.5">Monthly cumulative income projection</p>
              </div>
              <select className="text-[10px] border border-[#F0EEEB] rounded-xl px-3 py-1.5 bg-[#FAFAFA] font-bold text-[#737373] focus:outline-none">
                <option>This Year</option>
                <option>Last Year</option>
              </select>
            </div>

            {/* CHART AREA */}
            <div className="relative h-52 flex items-end justify-between gap-2 pt-4">
              {/* Horizontal dashed grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none px-0 py-0">
                {["₹8L", "₹6L", "₹4L", "₹2L", "₹0"].map((label, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[8px] font-mono text-[#737373] w-8 text-right flex-shrink-0">{label}</span>
                    <div className="flex-1 border-t border-dashed border-[#F0EEEB]" />
                  </div>
                ))}
              </div>

              {/* SVG LINE GRAPH */}
              <div className="absolute inset-0 pl-10 pr-2 pt-2 pb-6">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={theme.colorCode} stopOpacity="0.12" />
                      <stop offset="100%" stopColor={theme.colorCode} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Area fill */}
                  <polygon
                    points={`0,100 ${REVENUE_DATA.map((v, i) => `${i * (100 / (REVENUE_DATA.length - 1))},${100 - (v / MAX_REV) * 90}`).join(" ")} 100,100`}
                    fill="url(#revenueGrad)"
                  />
                  {/* Main line */}
                  <polyline
                    points={REVENUE_DATA.map((v, i) => `${i * (100 / (REVENUE_DATA.length - 1))},${100 - (v / MAX_REV) * 90}`).join(" ")}
                    fill="none" stroke={theme.colorCode} strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round"
                  />
                  {/* Data points */}
                  {REVENUE_DATA.map((v, i) => (
                    <circle
                      key={i}
                      cx={i * (100 / (REVENUE_DATA.length - 1))}
                      cy={100 - (v / MAX_REV) * 90}
                      r="2" fill={theme.colorCode}
                    />
                  ))}
                </svg>
              </div>

              {/* X-AXIS MONTH LABELS */}
              <div className="absolute bottom-0 left-10 right-2 flex justify-between">
                {MONTHS.map(m => (
                  <span key={m} className="text-[8px] font-bold text-[#737373] uppercase tracking-wider">{m}</span>
                ))}
              </div>
            </div>

            {/* LEGEND */}
            <div className="flex items-center gap-6 pt-2 border-t border-[#F5F5F0] text-[10px] font-semibold text-[#737373]">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded" style={{ backgroundColor: theme.colorCode }} />
                Revenue 2026
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-[#F0EEEB] border border-[#737373]/30 rounded" style={{ borderStyle: "dashed" }} />
                Target
              </div>
            </div>
          </div>

          {/* TRANSACTION LOG LEDGER */}
          <div className="bg-white border border-[#F0EEEB] rounded-2xl shadow-sm flex flex-col overflow-hidden">
            <div className="p-5 border-b border-[#F5F5F0] flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-neutral-955">Transaction Ledger</h3>
                <p className="text-[9px] text-[#737373] font-medium mt-0.5">
                  {orders.length} records indexed
                </p>
              </div>
              <Link
                to={`/${storeSlug}/admin/analytics`}
                className={`text-[9px] font-black ${theme.primary} hover:underline uppercase tracking-wider`}
              >
                View All →
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#F5F5F0] max-h-[280px]">
              {orders.length > 0 ? (
                orders.slice(0, 10).map((order, i) => (
                  <div key={order._id || i} className="p-4 hover:bg-[#FAFAFA] transition-colors">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h4 className="text-[11px] font-bold text-neutral-900">{order.customerName}</h4>
                        {order.phone && <p className="text-[9px] text-[#737373] font-mono mt-0.5">📞 {order.phone}</p>}
                        {order.address && <p className="text-[9px] text-neutral-500 font-semibold mt-0.5 max-w-[200px] truncate" title={order.address}>📍 {order.address}</p>}
                      </div>
                      <span className="text-[11px] font-black text-neutral-955">₹{order.totalAmount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-[#737373]">
                        {order.items?.length || 0} units · {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                ))
              ) : (
                [
                  { id: "#TX-1245", item: "Customer Registration", price: "₹450", date: "Today 14:20", status: "completed" },
                  { id: "#TX-1244", item: "Core Service Charge", price: "₹349", date: "Today 13:55", status: "preparing" },
                  { id: "#TX-1243", item: "Basic Pass Entry", price: "₹169", date: "Today 13:10", status: "completed" },
                  { id: "#TX-1242", item: "Artisanal Premium Session", price: "₹289", date: "Today 12:40", status: "pending" },
                  { id: "#TX-1241", item: "Subscription Package", price: "₹299", date: "Yesterday", status: "completed" },
                ].map((order, i) => (
                  <div key={i} className="p-4 hover:bg-[#FAFAFA] transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-[11px] font-bold text-neutral-900">{order.item}</h4>
                      <span className="text-[11px] font-black text-neutral-950">{order.price}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-[#737373]">Mock {order.id} · {order.date}</span>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ─── WORKSPACE SHORTCUT GRID ─────────────────── */}
        <div>
          <p className="text-[10px] font-black text-[#737373] uppercase tracking-widest mb-4">Quick Access Operations Desk</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {[
              { to: `/${storeSlug}/admin/inventory`, icon: ShoppingBag, label: "Inventory", count: `${products.length} items`, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
              { to: `/${storeSlug}/admin/analytics`, icon: BarChart3, label: "Analytics", count: "Ledger report", iconBg: "bg-indigo-50", iconColor: "text-indigo-600" },
              { to: `/${storeSlug}/admin/staff`, icon: Users2, label: "Staff Roster", count: "Manage users", iconBg: theme.lightBg, iconColor: theme.primary },
              { to: `/${storeSlug}/kitchen`, icon: ChefHat, label: adminLabels.kds, count: `${activeOrders} active`, iconBg: "bg-orange-50", iconColor: "text-orange-600" },
              { to: `/${storeSlug}/delivery`, icon: Bike, label: adminLabels.delivery, count: "Dispatch board", iconBg: "bg-sky-50", iconColor: "text-sky-600" },
              { to: `/${storeSlug}/login`, icon: ShieldCheck, label: "Staff Login", count: "Role access", iconBg: "bg-violet-50", iconColor: "text-violet-600" },
              { to: `/${storeSlug}`, icon: Store, label: "Storefront", count: "Live site", iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
            ].map(({ to, icon: Icon, label, count, iconBg, iconColor }) => (
              <Link
                key={to} to={to}
                className="bg-white border border-[#F0EEEB] rounded-2xl p-4 flex flex-col items-start gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all group shadow-sm"
              >
                <div className={`w-8 h-8 ${iconBg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <div>
                  <p className={`text-[11px] font-black text-neutral-900 group-hover:${theme.primary} transition-colors`}>{label}</p>
                  <p className="text-[9px] text-[#737373] font-medium">{count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}