import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Mail, Lock, User, Globe, Shield,
  ChevronRight, CheckCircle, Star, Sparkles,
  Utensils, BookOpen, Scissors, Droplets, ShoppingBag, Dumbbell, Wrench,
  BarChart2, Users, Bell, Truck, CreditCard, Zap, Package, PieChart,
  HelpCircle, Settings, Layers
} from "lucide-react";
import axios from "axios";

const VERTICALS = [
  {
    id: "restaurant",
    icon: Utensils,
    label: "Restaurant & Cafe",
    desc: "Table configurations, delivery mapping & live kitchen production ticketing.",
    badge: "F&B Engine",
    theme: { color: "red", primary: "text-[#5C0E1E]", bg: "bg-[#5C0E1E]", hover: "hover:bg-[#3F0712]" }
  },
  {
    id: "retail",
    icon: ShoppingBag,
    label: "Retail & Commerce",
    desc: "Dynamic catalogs, customer baskets, discount matrices & payments.",
    badge: "eComm Core",
    theme: { color: "blue", primary: "text-blue-600", bg: "bg-blue-600", hover: "hover:bg-blue-700" }
  },
  {
    id: "workshop",
    icon: BookOpen,
    label: "Workshops & Classes",
    desc: "Interactive calendars, student rosters, scheduling & attendance logs.",
    badge: "Bookings",
    theme: { color: "emerald", primary: "text-emerald-600", bg: "bg-emerald-600", hover: "hover:bg-emerald-700" }
  },
  {
    id: "salon",
    icon: Scissors,
    label: "Salon & Lifestyle",
    desc: "Queue coordination, stylist allocation & service time tracking.",
    badge: "Scheduler",
    theme: { color: "rose", primary: "text-rose-600", bg: "bg-rose-600", hover: "hover:bg-rose-700" }
  },
  {
    id: "water",
    icon: Droplets,
    label: "Fluid & Hydration",
    desc: "Automated subscriptions, distribution fleet dispatch & routing.",
    badge: "Subscriptions",
    theme: { color: "sky", primary: "text-sky-600", bg: "bg-sky-600", hover: "hover:bg-sky-700" }
  },
  {
    id: "gym",
    icon: Dumbbell,
    label: "Gym & Fitness",
    desc: "Membership tiers, check-in gates, trainer logs & auto-renewals.",
    badge: "Memberships",
    theme: { color: "purple", primary: "text-purple-600", bg: "bg-purple-600", hover: "hover:bg-purple-700" }
  },
  {
    id: "repair",
    icon: Wrench,
    label: "Service & Repairs",
    desc: "Field dispatch, technician status tracking & material invoices.",
    badge: "Field Ops",
    theme: { color: "slate", primary: "text-slate-600", bg: "bg-slate-600", hover: "hover:bg-slate-700" }
  },
];

const CAPABILITIES = [
  { icon: BarChart2, title: "Executive Analytics", desc: "Compile revenue timelines, average ticket values, and visual pipeline indicators in a clean, unified workspace dashboard." },
  { icon: Users, title: "Role Gateways", desc: "Provision isolated secure views for managers, kitchen staff, delivery riders, and trainers with custom credentials." },
  { icon: Bell, title: "Real-time Synchronization", desc: "Live-updating KDS feeds and dispatch boards powered by socket-driven state tracking. Zero page reloads required." },
  { icon: Truck, title: "Logistics Coordination", desc: "Assign couriers, log cash-on-delivery values, and record proof-of-delivery milestones from a central operations desk." },
  { icon: CreditCard, title: "Billing & Invoicing", desc: "Support cash, UPI, and manual card charges. Generate digital receipts and download historical auditing sheets." },
  { icon: Package, title: "Dynamic Catalogs", desc: "Add, edit, or archive menu items instantly. Set unique pricing, rich text descriptions, and high-res image assets." },
  { icon: PieChart, title: "Visual Growth Reports", desc: "Monitor month-over-month revenue growth, identify top-performing listings, and download corporate ledger audits." },
  { icon: Zap, title: "Instant Deployment", desc: "Provision a new tenant storefront cluster in under 90 seconds. All databases, routes, and keys configured automatically." },
];

const FAQS = [
  { q: "How does the multi-tenant architecture work?", a: "Each business registered on HighP receives an isolated subdomain slug and database namespace. Your data, products, orders, and staff credentials remain entirely separate from other tenants." },
  { q: "Can I manage multiple business locations?", a: "Yes. The HighP operations workspace is designed to let you control multiple storefronts, catalogs, and staff roles from a single administrator login." },
  { q: "What hardware is required for the KDS?", a: "HighP works on any standard web browser. You can mount any tablet, iPad, or smart TV screen in your kitchen or dispatch desk to run the live feeds." },
];

export default function PlatformHome() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", slug: "", email: "", password: "", tagline: ""
  });
  const [selectedSoftware, setSelectedSoftware] = useState("restaurant");
  const [subscriptionPlan, setSubscriptionPlan] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);

  // Success deployment approval state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredSlug, setRegisteredSlug] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "slug") {
      setFormData(prev => ({
        ...prev,
        [name]: value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleOnboardSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // Map theme properties based on chosen software vertical
    const targetVertical = VERTICALS.find(v => v.id === selectedSoftware) || VERTICALS[0];
    const submitPayload = {
      ...formData,
      softwareType: selectedSoftware,
      subscriptionPlan,
      themeColor: targetVertical.theme.color,
      primaryColor: targetVertical.theme.primary,
      bgColor: targetVertical.theme.bg,
      hoverColor: targetVertical.theme.hover
    };

    try {
      const res = await axios.post("http://localhost:5000/api/stores/register", submitPayload);
      setRegisteredSlug(res.data.slug);
      setShowSuccessModal(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.response?.data?.error || "Provisioning cluster timeout. Check DB connectivity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans antialiased selection:bg-[#5C0E1E] selection:text-white relative">

      {/* Ambient background decoration */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-gradient-to-b from-[#5C0E1E]/5 to-transparent blur-3xl pointer-events-none" />

      {/* SUCCESS MODAL FOR TRIAL / PENDING APPROVAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#F5F5F0] rounded-2xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 animate-fade-up">
            <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-neutral-900 uppercase tracking-wide">Deployment Provisioned</h3>
              <p className="text-xs text-[#737373] leading-relaxed">
                Your store instance <span className="font-mono text-neutral-950 font-bold">/{registeredSlug}</span> is provisioned. Access is locked pending manual activation approval of your subscription plan ({subscriptionPlan}).
              </p>
            </div>
            <div className="bg-[#FAFAFA] border border-[#F5F5F0] p-4 rounded-xl text-left space-y-2">
              <span className="text-[9px] font-black text-[#737373] uppercase tracking-widest block">Next Steps</span>
              <p className="text-[10px] text-[#737373] leading-relaxed">
                1. Contact HighP support at billing@highp.com to activate your node.<br />
                2. Once approved, use the Staff Login link to access your dashboard.
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate(`/${registeredSlug}/login`);
                }}
                className="flex-1 py-3 bg-[#5C0E1E] hover:bg-[#3F0712] text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
              >
                Go to Staff Login
              </button>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="px-5 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION HEADER */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#F5F5F0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#5C0E1E] rounded-xl flex items-center justify-center shadow-md shadow-[#5C0E1E]/10">
              <span className="font-black text-white text-xs">HP</span>
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-neutral-955 block">HighP Platform</span>
              <span className="text-[9px] text-[#737373] font-bold uppercase tracking-widest block mt-0.5">Enterprise Cloud</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold text-[#737373] uppercase tracking-wider">
            {["Solutions", "Modules", "Pricing", "Docs"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#5C0E1E] transition-colors">{l}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a href="#register" className="text-[11px] font-black uppercase tracking-widest px-5 py-2.5 bg-[#5C0E1E] hover:bg-[#3F0712] text-white rounded-xl transition-all shadow-sm shadow-[#5C0E1E]/15">
              Deploy Free
            </a>
          </div>
        </div>
      </nav>

      {/* HERO LAYOUT */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* LEFT: EDITORIAL PRESENTATION */}
          <div className="lg:col-span-5 space-y-8">
            <div className="inline-flex items-center gap-2 bg-[#5C0E1E]/6 border border-[#5C0E1E]/10 px-3.5 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#5C0E1E]" />
              <span className="text-[9px] font-black text-[#5C0E1E] uppercase tracking-widest">
                Unified Multi-Tenant Engine
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-neutral-955 leading-[1.05]">
                One gateway.
                <br />
                <span className="italic font-light text-[#5C0E1E]" style={{ fontFamily: "'Georgia', serif" }}>
                  Every commercial
                </span>
                <br />
                workspace.
              </h1>
              <p className="text-[#737373] text-xs sm:text-sm leading-relaxed max-w-lg">
                HighP provisions completely isolated sub-retail networks. Switch your layout engine between restaurants, digital catalogs, scheduling desks, or class bookings with a single click.
              </p>
            </div>

            {/* INTEGRATED ARCHITECTURE HIGHLIGHTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#F5F5F0] pt-6">
              {[
                { title: "No-Code Provisioning", desc: "Databases, route trees, and SSL initialized automatically." },
                { title: "Universal Integrations", desc: "Live KDS monitors, driver hubs, and transaction ledgers." },
              ].map(({ title, desc }) => (
                <div key={title} className="space-y-1">
                  <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#5C0E1E]" /> {title}
                  </h4>
                  <p className="text-[10px] text-[#737373] leading-relaxed pl-5">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: PREMIUM REGISTRATION FORM */}
          <div className="lg:col-span-7" id="register">
            <div className="bg-white border border-[#F5F5F0] rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.04)] overflow-hidden">
              
              <div className="bg-[#5C0E1E] px-8 py-6 text-white relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-6 -mt-6 blur-xl" />
                <h2 className="text-lg font-black tracking-tight">Deploy Custom Node</h2>
                <p className="text-white/60 text-[11px] mt-0.5">Configure your custom node options to deploy.</p>
              </div>

              <div className="p-8 space-y-6">
                {errorMsg && (
                  <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200/60 text-red-700 text-[11px] font-semibold rounded-xl">
                    <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleOnboardSubmit} className="space-y-5">
                  
                  {/* SOFTWARE CORE DROPDOWN */}
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">
                      Choose Software Engine
                    </label>
                    <div className="relative">
                      <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                      <select 
                        value={selectedSoftware}
                        onChange={e => setSelectedSoftware(e.target.value)}
                        className="w-full bg-[#FAFAFA] border border-[#F5F5F0] text-neutral-900 pl-10 pr-10 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#5C0E1E]/50 focus:bg-white transition-all font-semibold appearance-none cursor-pointer"
                      >
                        {VERTICALS.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.label} ({v.badge})
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs font-bold text-neutral-400">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* SUBSCRIPTION PLAN DROPDOWN */}
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">
                      Select Subscription Plan
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                      <select 
                        value={subscriptionPlan}
                        onChange={e => setSubscriptionPlan(e.target.value)}
                        className="w-full bg-[#FAFAFA] border border-[#F5F5F0] text-neutral-900 pl-10 pr-10 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#5C0E1E]/50 focus:bg-white transition-all font-semibold appearance-none cursor-pointer"
                      >
                        <option value="basic">Basic Plan - 4,999 INR / month</option>
                        <option value="pro">Pro Scale Plan - 9,999 INR / month</option>
                        <option value="enterprise">Custom Enterprise Plan - 24,999 INR / month</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs font-bold text-neutral-400">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* COMPANY & SLUG */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Company / Store Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                          type="text" name="name" required
                          placeholder="e.g. Taste N Park"
                          className="w-full bg-[#FAFAFA] border border-[#F5F5F0] text-neutral-900 pl-10 pr-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-neutral-350 focus:bg-white transition-all font-semibold"
                          value={formData.name} onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Subdomain URL Slug</label>
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                          type="text" name="slug" required
                          placeholder="tastenpark"
                          className="w-full bg-[#FAFAFA] border border-[#F5F5F0] text-[#5C0E1E] font-mono pl-10 pr-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-neutral-350 focus:bg-white transition-all font-bold tracking-wider"
                          value={formData.slug} onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* EMAIL & PASSWORD */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Admin Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                          type="email" name="email" required
                          placeholder="admin@brand.com"
                          className="w-full bg-[#FAFAFA] border border-[#F5F5F0] text-neutral-900 pl-10 pr-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-neutral-350 focus:bg-white transition-all font-semibold"
                          value={formData.email} onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Vault Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                          type="password" name="password" required
                          placeholder="••••••••"
                          className="w-full bg-[#FAFAFA] border border-[#F5F5F0] text-neutral-900 pl-10 pr-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-neutral-350 focus:bg-white transition-all font-medium"
                          value={formData.password} onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* TAGLINE */}
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Brand Tagline</label>
                    <input
                      type="text" name="tagline"
                      placeholder="e.g. Gourmet Artisan Kitchen"
                      className="w-full bg-[#FAFAFA] border border-[#F5F5F0] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-neutral-350 focus:bg-white transition-all font-semibold italic"
                      value={formData.tagline} onChange={handleInputChange}
                    />
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit" disabled={loading}
                    className="w-full py-3.5 bg-[#5C0E1E] hover:bg-[#3F0712] active:scale-[0.99] text-white font-black text-[11px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-[#5C0E1E]/15 mt-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Provisioning Workspace...
                      </>
                    ) : (
                      <>Deploy Instance <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* BUSINESS VERTICALS */}
      <section className="bg-[#F5F5F0] border-y border-neutral-200/50 py-20" id="solutions">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <p className="text-[10px] font-black text-[#5C0E1E] uppercase tracking-widest">Architectural Presets</p>
            <h2 className="text-3xl font-black tracking-tight text-neutral-955 font-sans">
              Adapts to any business model.
            </h2>
            <p className="text-[#737373] text-xs leading-relaxed">
              HighP adapts dynamically to serve specific vertical frameworks. No manual templates, no configuration overhead.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {VERTICALS.map((vertical, i) => {
              const Icon = vertical.icon;
              return (
                <div
                  key={i}
                  className="bg-white border border-neutral-200/60 p-5 rounded-2xl flex flex-col justify-between items-start gap-4 hover:border-[#5C0E1E]/30 hover:shadow-md transition-all group shadow-sm"
                >
                  <div className="w-9 h-9 bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#5C0E1E]/8 group-hover:border-[#5C0E1E]/10 transition-all">
                    <Icon className="w-4 h-4 text-[#737373] group-hover:text-[#5C0E1E] transition-colors" strokeWidth={1.8} />
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-[#737373] uppercase tracking-wider block mb-1">
                      {vertical.badge}
                    </span>
                    <h3 className="text-xs font-black text-neutral-900 leading-snug">{vertical.label}</h3>
                    <p className="text-[9px] text-[#737373] mt-1 leading-relaxed md:hidden lg:block">{vertical.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CAPABILITIES MODULES */}
      <section className="py-20 bg-white" id="modules">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="max-w-xl mb-16 space-y-3">
            <p className="text-[10px] font-black text-[#5C0E1E] uppercase tracking-widest">Platform capabilities</p>
            <h2 className="text-3xl font-black tracking-tight text-neutral-955 font-sans">
              Completely integrated infrastructure.
            </h2>
            <p className="text-[#737373] text-xs leading-relaxed">
              Avoid scattered tools. HighP bundles core databases, live production views, payment gateways, and staff nodes in one codebase.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAPABILITIES.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <div
                  key={i}
                  className="bg-[#FAFAFA] border border-[#F5F5F0] p-6 rounded-2xl hover:bg-white hover:border-[#5C0E1E]/20 hover:shadow-lg transition-all group"
                >
                  <div className="w-9 h-9 bg-white border border-[#F5F5F0] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#5C0E1E]/8 group-hover:border-[#5C0E1E]/15 transition-all">
                    <Icon className="w-4.5 h-4.5 text-[#5C0E1E]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xs font-black text-neutral-955 mb-1.5 uppercase tracking-wide">{cap.title}</h3>
                  <p className="text-[10px] text-[#737373] leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-[#FAFAFA] border-t border-[#F5F5F0] py-20">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center mb-12">
            <p className="text-[10px] font-black text-[#5C0E1E] uppercase tracking-widest">FAQ</p>
            <h2 className="text-2xl font-black tracking-tight text-neutral-955 mt-1 font-sans">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="bg-white border border-[#F5F5F0] rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between font-bold text-xs text-neutral-900 focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <HelpCircle className={`w-4 h-4 text-[#737373] transition-transform ${isOpen ? 'rotate-180 text-[#5C0E1E]' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-[11px] text-[#737373] leading-relaxed border-t border-[#FAFAFA] pt-3 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#F5F5F0] py-10 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-[#5C0E1E] rounded-lg flex items-center justify-center shadow-md shadow-[#5C0E1E]/5">
              <span className="text-white font-black text-[9px]">HP</span>
            </div>
            <span className="font-black text-xs uppercase tracking-widest text-neutral-700">HighP Platform</span>
          </div>
          <div className="flex items-center gap-6 text-[10px] text-[#737373] font-bold uppercase tracking-wider">
            <a href="#" className="hover:text-neutral-955 transition-colors">Privacy</a>
            <a href="#" className="hover:text-neutral-955 transition-colors">Terms</a>
            <a href="#" className="hover:text-neutral-955 transition-colors">Support</a>
          </div>
          <p className="text-[10px] text-[#737373] font-mono">© 2026 HighP Cloud Inc.</p>
        </div>
      </footer>

    </div>
  );
}