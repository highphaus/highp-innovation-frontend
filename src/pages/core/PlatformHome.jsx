import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Mail, Lock, User, Globe, Shield,
  ChevronRight, CheckCircle, Star,
  Utensils, BookOpen, Scissors, Droplets, ShoppingBag, Dumbbell, Wrench,
  BarChart2, Users, Bell, Truck, CreditCard, Zap, Package, PieChart
} from "lucide-react";
import axios from "axios";

/* ─────────────────────────────────────────────────────────────
   BUSINESS VERTICALS — Clean, enterprise icons. No cartoons.
───────────────────────────────────────────────────────────── */
const VERTICALS = [
  {
    icon: Utensils,
    label: "Restaurant & Café",
    desc: "Full table service, delivery & KDS management",
  },
  {
    icon: ShoppingBag,
    label: "Retail & eCommerce",
    desc: "Catalog, cart, checkout & order fulfillment",
  },
  {
    icon: BookOpen,
    label: "Workshop & Classes",
    desc: "Booking, scheduling & attendance tracking",
  },
  {
    icon: Scissors,
    label: "Salon & Wellness",
    desc: "Appointment queue & stylist assignment",
  },
  {
    icon: Droplets,
    label: "Water & Hydration",
    desc: "Subscription delivery & route dispatch",
  },
  {
    icon: Dumbbell,
    label: "Gym & Fitness",
    desc: "Membership tiers, class booking & renewals",
  },
  {
    icon: Wrench,
    label: "Service & Repair",
    desc: "Job ticketing, field technician dispatch",
  },
];

/* ─────────────────────────────────────────────────────────────
   PLATFORM CAPABILITIES
───────────────────────────────────────────────────────────── */
const CAPABILITIES = [
  { icon: BarChart2, title: "Analytics Suite", desc: "Revenue trends, order metrics, and performance KPIs in a clean workspace dashboard." },
  { icon: Users, title: "User Management", desc: "Role-based access for admins, kitchen staff, delivery drivers, and workshop trainers." },
  { icon: Bell, title: "Live Order Routing", desc: "Real-time kitchen display screens and dispatch boards updated on every order event." },
  { icon: Truck, title: "Delivery Fleet", desc: "Assign riders, track shipments, and mark deliveries complete from a logistics desk." },
  { icon: CreditCard, title: "Payment & Invoicing", desc: "Accept cash, UPI, and card orders. Generate and export invoice records instantly." },
  { icon: Package, title: "Inventory Control", desc: "Add, update, and remove catalog items with image URLs, pricing, and descriptions." },
  { icon: PieChart, title: "Business Reports", desc: "Month-over-month revenue charts, top products, and customer acquisition data." },
  { icon: Zap, title: "Instant Deployment", desc: "Spin up a fully isolated tenant node in under 90 seconds. Zero setup overhead." },
];

/* ─────────────────────────────────────────────────────────────
   TRUSTED BRANDS (social proof logos as text marks)
───────────────────────────────────────────────────────────── */
const BRANDS = ["Taste N Park", "Vana Herbals", "The Flour Studio", "Quartz Kitchen", "FitLife Arena", "AquaDrop Co."];

export default function PlatformHome() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", slug: "", email: "", password: "", tagline: "", themeColor: "red"
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
    try {
      const res = await axios.post("http://localhost:5000/api/stores/register", formData);
      localStorage.setItem(`token_${res.data.slug}`, res.data.token);
      localStorage.setItem(`role_${res.data.slug}`, "admin");
      navigate(`/${res.data.slug}/admin`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans antialiased selection:bg-[#5C0E1E] selection:text-white">

      {/* ══════════════════════════════════════════════════
          NAVIGATION
      ══════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 h-14 flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-6 h-6 bg-[#5C0E1E] rounded flex items-center justify-center">
              <span className="font-black text-white text-[10px] tracking-tight">HP</span>
            </div>
            <span className="font-black text-sm tracking-tight text-neutral-900">HighP</span>
            <span className="text-[9px] font-bold text-[#737373] px-1.5 py-0.5 bg-neutral-100 rounded uppercase tracking-wider">Platform</span>
          </div>

          {/* CENTER LINKS */}
          <div className="hidden md:flex items-center gap-7 text-[11px] font-medium text-neutral-500">
            {["Features", "Verticals", "Pricing", "Docs", "Blog"].map(l => (
              <a key={l} href="#" className="hover:text-neutral-900 transition-colors">{l}</a>
            ))}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">
            <a href="#" className="hidden sm:block text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 transition-colors">Log in</a>
            <a href="#register" className="text-[11px] font-bold px-4 py-2 bg-[#5C0E1E] text-white rounded-lg hover:bg-[#3F0712] transition-all">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-5 lg:px-10 pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">

          {/* LEFT: EDITORIAL COPY */}
          <div className="lg:col-span-6 space-y-7">

            {/* STATUS BADGE */}
            <div className="inline-flex items-center gap-2 bg-[#5C0E1E]/8 border border-[#5C0E1E]/15 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5C0E1E] animate-pulse" />
              <span className="text-[10px] font-black text-[#5C0E1E] uppercase tracking-widest">
                All-in-One Business Operating Platform
              </span>
            </div>

            {/* HEADLINE */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-neutral-950 leading-[1.06] mb-4">
                One platform for<br />
                <span className="text-[#5C0E1E]">every business</span><br />
                you run.
              </h1>
              <p className="text-neutral-500 text-[13px] leading-relaxed max-w-lg">
                HighP is a multi-tenant SaaS platform that lets you deploy and manage restaurants, retail stores, workshops, salons, gyms, and more — all from a single operations hub. No code. No complexity.
              </p>
            </div>

            {/* KEY VALUE PROPS */}
            <div className="space-y-2.5">
              {[
                "One dashboard. Multiple business verticals.",
                "Kitchen display, delivery dispatch & analytics built in.",
                "Role-based access for every staff member.",
                "Live storefront for your customers in minutes.",
              ].map(prop => (
                <div key={prop} className="flex items-start gap-2.5 text-[12px] text-neutral-700 font-medium">
                  <CheckCircle className="w-4 h-4 text-[#5C0E1E] flex-shrink-0 mt-0.5" />
                  {prop}
                </div>
              ))}
            </div>

            {/* SOCIAL PROOF */}
            <div className="pt-4 border-t border-neutral-200">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">Used by growing businesses</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {BRANDS.map(b => (
                  <span key={b} className="text-[11px] font-semibold text-neutral-400">{b}</span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: REGISTRATION FORM */}
          <div className="lg:col-span-6" id="register">
            <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-hidden">

              {/* FORM HEADER STRIP */}
              <div className="bg-[#5C0E1E] px-7 py-5">
                <h2 className="text-white font-black text-base tracking-tight">Create your account</h2>
                <p className="text-white/60 text-[11px] mt-0.5">Start managing your business in under 2 minutes.</p>
              </div>

              <div className="px-7 py-6">
                {errorMsg && (
                  <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 text-red-700 text-[11px] font-semibold rounded-xl mb-5">
                    <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleOnboardSubmit} className="space-y-4">
                  {/* NAME + SLUG */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1.5">Business Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                        <input
                          type="text" name="name" required
                          placeholder="e.g. Taste N Park"
                          className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 pl-9 pr-3 py-2.5 text-[12px] rounded-xl focus:outline-none focus:border-[#5C0E1E]/50 focus:bg-white transition-all"
                          value={formData.name} onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1.5">URL Slug</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                        <input
                          type="text" name="slug" required
                          placeholder="tastenpark"
                          className="w-full bg-neutral-50 border border-neutral-200 text-[#5C0E1E] font-mono pl-9 pr-3 py-2.5 text-[12px] rounded-xl focus:outline-none focus:border-[#5C0E1E]/50 focus:bg-white transition-all"
                          value={formData.slug} onChange={handleInputChange}
                        />
                      </div>
                      {formData.slug && (
                        <p className="text-[9px] text-neutral-400 mt-1 ml-1 font-mono">highp.app/{formData.slug}</p>
                      )}
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="block text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                      <input
                        type="email" name="email" required
                        placeholder="admin@yourbusiness.com"
                        className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 pl-9 pr-3 py-2.5 text-[12px] rounded-xl focus:outline-none focus:border-[#5C0E1E]/50 focus:bg-white transition-all"
                        value={formData.email} onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="block text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                      <input
                        type="password" name="password" required
                        placeholder="Create a secure password"
                        className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 pl-9 pr-3 py-2.5 text-[12px] rounded-xl focus:outline-none focus:border-[#5C0E1E]/50 focus:bg-white transition-all"
                        value={formData.password} onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* TAGLINE */}
                  <div>
                    <label className="block text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1.5">Brand Tagline <span className="normal-case font-medium">(optional)</span></label>
                    <input
                      type="text" name="tagline"
                      placeholder="e.g. Fresh food, fast delivery"
                      className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 px-3.5 py-2.5 text-[12px] rounded-xl focus:outline-none focus:border-[#5C0E1E]/50 focus:bg-white transition-all"
                      value={formData.tagline} onChange={handleInputChange}
                    />
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit" disabled={loading}
                    className="w-full py-3 bg-[#5C0E1E] hover:bg-[#3F0712] active:scale-[0.99] text-white font-black text-[11px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-[#5C0E1E]/15 mt-1 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Setting up your workspace...
                      </>
                    ) : (
                      <>Create Free Account <ArrowRight className="w-3.5 h-3.5" /></>
                    )}
                  </button>

                  <p className="text-center text-[9px] text-neutral-400 leading-relaxed pt-1">
                    No credit card required. Free to start. By signing up you agree to our{" "}
                    <a href="#" className="underline hover:text-neutral-700">Terms</a> and{" "}
                    <a href="#" className="underline hover:text-neutral-700">Privacy Policy</a>.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          BUSINESS VERTICALS GRID
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#FAFAFA] border-y border-neutral-200/60 py-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">

          <div className="text-center mb-10">
            <p className="text-[10px] font-black text-[#5C0E1E] uppercase tracking-widest mb-2">Industry Coverage</p>
            <h2 className="text-3xl font-black tracking-tight text-neutral-950">
              Built for every type of business.
            </h2>
            <p className="text-neutral-500 text-[12px] mt-2 max-w-lg mx-auto leading-relaxed">
              Whether you run a café, a fitness studio, or a home services company — HighP adapts to your operations without any configuration overhead.
            </p>
          </div>

          {/* 7-COLUMN VERTICAL CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {VERTICALS.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="group bg-white border border-neutral-200/80 rounded-xl p-4 flex flex-col items-center text-center gap-3 hover:border-[#5C0E1E]/30 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="w-9 h-9 bg-neutral-100 group-hover:bg-[#5C0E1E]/8 rounded-lg flex items-center justify-center transition-colors">
                  <Icon className="w-4.5 h-4.5 text-neutral-600 group-hover:text-[#5C0E1E] transition-colors" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-neutral-900 leading-snug">{label}</p>
                  <p className="text-[9px] text-neutral-400 mt-1 leading-relaxed hidden sm:block">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CAPABILITIES GRID — 8 modules, 4-col
      ══════════════════════════════════════════════════ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">

          <div className="mb-10">
            <p className="text-[10px] font-black text-[#5C0E1E] uppercase tracking-widest mb-2">Platform Modules</p>
            <h2 className="text-3xl font-black tracking-tight text-neutral-950">
              Everything your team needs.
            </h2>
            <p className="text-neutral-500 text-[12px] mt-2 max-w-lg leading-relaxed">
              HighP ships with a complete set of integrated tools. No third-party plugins required.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CAPABILITIES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group bg-white border border-neutral-200/70 rounded-2xl p-6 hover:border-[#5C0E1E]/25 hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 bg-[#5C0E1E]/8 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#5C0E1E]/15 transition-colors">
                  <Icon className="w-5 h-5 text-[#5C0E1E]" strokeWidth={1.5} />
                </div>
                <h3 className="text-[13px] font-black text-neutral-900 mb-1.5">{title}</h3>
                <p className="text-[11px] text-neutral-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS — 3-STEP FLOW
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#FAFAFA] border-t border-neutral-200/60 py-16">
        <div className="max-w-5xl mx-auto px-5 lg:px-10 text-center">

          <p className="text-[10px] font-black text-[#5C0E1E] uppercase tracking-widest mb-2">Getting Started</p>
          <h2 className="text-3xl font-black tracking-tight text-neutral-950 mb-3">
            Live in three steps.
          </h2>
          <p className="text-neutral-500 text-[12px] mb-12 max-w-md mx-auto leading-relaxed">
            No developer required. Go from sign-up to a live storefront with staff access in under two minutes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Register your workspace",
                desc: "Enter your business name, URL slug, and credentials. Your isolated workspace is provisioned instantly.",
              },
              {
                step: "02",
                title: "Configure your catalog",
                desc: "Add your products, set pricing, upload images, and configure your public-facing storefront theme.",
              },
              {
                step: "03",
                title: "Share and operate",
                desc: "Share your storefront link with customers. Your team uses role-specific dashboards — kitchen, delivery, admin.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-left">
                <div className="text-[11px] font-black text-[#5C0E1E] mb-3 font-mono">{step}</div>
                <div className="w-full h-px bg-[#5C0E1E]/20 mb-5" />
                <h3 className="text-[14px] font-black text-neutral-900 mb-2">{title}</h3>
                <p className="text-[11px] text-neutral-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA BOTTOM BANNER
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#5C0E1E] py-14">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="text-3xl font-black text-white tracking-tight mb-3">
            Ready to run your business smarter?
          </h2>
          <p className="text-white/60 text-[12px] mb-7 leading-relaxed max-w-md mx-auto">
            Join growing businesses that have switched from scattered tools to a single, unified operations platform.
          </p>
          <a
            href="#register"
            className="inline-flex items-center gap-2 bg-white text-[#5C0E1E] font-black text-[11px] uppercase tracking-widest px-7 py-3.5 rounded-xl hover:bg-neutral-100 transition-all shadow-lg"
          >
            Get Started Free <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <p className="text-white/40 text-[9px] mt-4 uppercase tracking-widest font-bold">No credit card · Cancel anytime</p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer className="bg-white border-t border-neutral-200/60 py-8">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 bg-[#5C0E1E] rounded flex items-center justify-center">
              <span className="text-white font-black text-[9px]">HP</span>
            </div>
            <span className="font-black text-[12px] text-neutral-700 tracking-tight">HighP Platform</span>
          </div>
          <div className="flex items-center gap-6 text-[10px] text-neutral-400 font-medium">
            <a href="#" className="hover:text-neutral-700">Privacy</a>
            <a href="#" className="hover:text-neutral-700">Terms</a>
            <a href="#" className="hover:text-neutral-700">Support</a>
          </div>
          <p className="text-[10px] text-neutral-400">© 2026 HighP Technologies</p>
        </div>
      </footer>

    </div>
  );
}