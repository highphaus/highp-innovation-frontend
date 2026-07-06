import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, UtensilsCrossed, Cake, Wrench, Droplets,
  Scissors, ShoppingBag, Leaf, MoreHorizontal, Mail,
  Lock, User, Globe, Quote, ChevronRight, Star, Shield
} from "lucide-react";
import axios from "axios";

/* ─── Business Concept Configurations ─────────────────── */
const CONCEPTS = [
  {
    id: "restaurant",
    label: "Restaurant",
    subtitle: "Dine-in & Delivery",
    icon: UtensilsCrossed,
    bg: "bg-rose-50",
    iconColor: "text-rose-600",
    ring: "ring-rose-200",
    popular: false,
  },
  {
    id: "bakery",
    label: "Bakery",
    subtitle: "Artisan & Pastry",
    icon: Cake,
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    ring: "ring-amber-200",
    popular: false,
  },
  {
    id: "workshop",
    label: "Workshop",
    subtitle: "Skills & Training",
    icon: Wrench,
    bg: "bg-slate-50",
    iconColor: "text-slate-600",
    ring: "ring-slate-200",
    popular: false,
  },
  {
    id: "water",
    label: "Water Solutions",
    subtitle: "Hydration Fleet",
    icon: Droplets,
    bg: "bg-sky-50",
    iconColor: "text-sky-600",
    ring: "ring-sky-200",
    popular: false,
  },
  {
    id: "salon",
    label: "Salon & Spa",
    subtitle: "Lifestyle & Beauty",
    icon: Scissors,
    bg: "bg-pink-50",
    iconColor: "text-pink-600",
    ring: "ring-pink-200",
    popular: false,
  },
  {
    id: "retail",
    label: "Retail Store",
    subtitle: "Commerce & Goods",
    icon: ShoppingBag,
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
    ring: "ring-violet-200",
    popular: false,
  },
  {
    id: "organic",
    label: "Organic & Oils",
    subtitle: "Wellness & Purity",
    icon: Leaf,
    bg: "bg-[#5C0E1E]/5",
    iconColor: "text-[#5C0E1E]",
    ring: "ring-[#5C0E1E]/20",
    popular: true, /* highlighted as new concept */
  },
];

/* ─── Testimonials for social proof ──────────────────── */
const TESTIMONIALS = [
  { text: "Our cold-pressed oil store went live in minutes. The organic storefront converted remarkably well.", brand: "Vana Herbals", star: 5 },
  { text: "Switching between restaurant and bakery modes in the admin panel is seamless.", brand: "The Flour Studio", star: 5 },
  { text: "KDS integration is flawless. Our kitchen team is 40% faster since deploying.", brand: "Quartz Kitchen", star: 5 },
];

export default function PlatformHome() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", slug: "", email: "", password: "", tagline: "", themeColor: "red"
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedConcept, setSelectedConcept] = useState("organic");

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
      const response = await axios.post("http://localhost:5000/api/stores/register", formData);
      const { token, slug } = response.data;
      localStorage.setItem(`token_${slug}`, token);
      localStorage.setItem(`role_${slug}`, "admin");
      navigate(`/${slug}/admin`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.response?.data?.error || "Deployment cluster initialization timeout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans antialiased selection:bg-[#5C0E1E] selection:text-white">

      {/* ─── NAVIGATION HEADER ─────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#F5F5F0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#5C0E1E] rounded-lg flex items-center justify-center">
              <span className="font-black text-white text-xs">H</span>
            </div>
            <span className="font-black text-sm uppercase tracking-widest text-neutral-900">High P</span>
            <span className="hidden md:block text-[9px] font-bold text-[#737373] uppercase tracking-widest px-2 py-0.5 bg-[#F5F5F0] rounded-full">Platform</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[11px] font-semibold text-[#737373]">
            {["Platform", "Solutions", "Pricing", "Resources"].map(l => (
              <span key={l} className="hover:text-neutral-900 cursor-pointer transition-colors tracking-wide">{l}</span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-[11px] font-semibold text-[#737373] cursor-pointer hover:text-neutral-900 transition-colors">Sign In</span>
            <button className="text-[11px] font-bold px-4 py-2 bg-[#5C0E1E] text-white rounded-xl hover:bg-[#3F0712] transition-all shadow-sm">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

        {/* LEFT EDITORIAL COLUMN */}
        <div className="lg:col-span-6 space-y-8">

          {/* PILL BADGE */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5C0E1E]/8 border border-[#5C0E1E]/15">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5C0E1E] animate-pulse" />
            <span className="text-[10px] font-black text-[#5C0E1E] uppercase tracking-widest">
              Multi-Concept Operating Platform
            </span>
          </div>

          {/* HEADLINE — clean sans + italic serif accent */}
          <div className="space-y-3">
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-neutral-950 leading-[1.05]">
              Run Every Business.
              <br />
              <span className="italic font-light text-[#5C0E1E]" style={{ fontFamily: "'Georgia', serif" }}>
                One Platform.
              </span>
            </h1>
            <p className="text-[#737373] text-sm leading-relaxed max-w-md">
              From restaurant dining to cold-pressed organic oils — provision fully isolated storefront clusters, live kitchen displays, and enterprise analytics in under 90 seconds.
            </p>
          </div>

          {/* VALUE PROPOSITIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              "Multi-Tenant Node Isolation",
              "Live Kitchen KDS Routing",
              "Organic & Wellness Vertical",
              "Enterprise Analytics Suite",
            ].map(prop => (
              <div key={prop} className="flex items-center gap-2.5 text-[11px] font-semibold text-neutral-700">
                <div className="w-4 h-4 rounded bg-[#5C0E1E]/10 flex items-center justify-center flex-shrink-0">
                  <ChevronRight className="w-2.5 h-2.5 text-[#5C0E1E]" />
                </div>
                {prop}
              </div>
            ))}
          </div>

          {/* TESTIMONIALS ROTATOR */}
          <div className="border-t border-[#F5F5F0] pt-6">
            <p className="text-[10px] font-black text-[#737373] uppercase tracking-widest mb-3">Trusted by industry leaders</p>
            <div className="flex items-start gap-3 p-4 bg-[#FAFAFA] rounded-2xl border border-[#F5F5F0]">
              <Quote className="w-4 h-4 text-[#5C0E1E] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] text-neutral-700 leading-relaxed italic">{TESTIMONIALS[0].text}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-0.5">
                    {Array(TESTIMONIALS[0].star).fill(0).map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-[#737373]">{TESTIMONIALS[0].brand}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT REGISTRATION PANEL */}
        <div className="lg:col-span-6">
          <div className="bg-white border border-[#F0EEEB] rounded-3xl shadow-[0_20px_60px_rgba(92,14,30,0.08)] overflow-hidden">

            {/* CARD TOP TINT BAR */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#5C0E1E] via-[#8B1A2E] to-[#5C0E1E]" />

            <div className="p-8">
              <div className="mb-7">
                <h2 className="text-xl font-black tracking-tight text-neutral-950">Create your account</h2>
                <p className="text-[11px] text-[#737373] mt-1">Initialize your isolated merchant workspace cluster</p>
              </div>

              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200/60 text-red-700 text-[11px] font-semibold rounded-2xl mb-5 flex items-start gap-2.5">
                  <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleOnboardSubmit} className="space-y-4">
                {/* NAME + SLUG GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">
                      Company / Store Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#737373]" />
                      <input
                        type="text" name="name" required
                        placeholder="e.g. Vana Herbals"
                        className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-9 pr-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#5C0E1E]/40 focus:bg-white transition-all font-medium"
                        value={formData.name} onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">
                      URL Slug
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#737373]" />
                      <input
                        type="text" name="slug" required
                        placeholder="vana-herbals"
                        className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-[#5C0E1E] font-mono pl-9 pr-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#5C0E1E]/40 focus:bg-white transition-all font-bold tracking-wider"
                        value={formData.slug} onChange={handleInputChange}
                      />
                    </div>
                    {formData.slug && (
                      <p className="text-[9px] text-[#737373] mt-1 ml-1 font-mono">/{formData.slug}</p>
                    )}
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">
                    Administrator Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#737373]" />
                    <input
                      type="email" name="email" required
                      placeholder="admin@brand.com"
                      className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-9 pr-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#5C0E1E]/40 focus:bg-white transition-all font-medium"
                      value={formData.email} onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">
                    Security Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#737373]" />
                    <input
                      type="password" name="password" required
                      placeholder="•••••••••••"
                      className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-9 pr-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#5C0E1E]/40 focus:bg-white transition-all font-medium"
                      value={formData.password} onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* TAGLINE */}
                <div>
                  <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">
                    Brand Tagline (optional)
                  </label>
                  <input
                    type="text" name="tagline"
                    placeholder="Purity in every drop."
                    className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-3.5 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#5C0E1E]/40 focus:bg-white transition-all font-medium italic"
                    value={formData.tagline} onChange={handleInputChange}
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="submit" disabled={loading}
                  className="w-full py-3.5 bg-[#5C0E1E] hover:bg-[#3F0712] active:scale-[0.99] text-white font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md shadow-[#5C0E1E]/20 mt-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Provisioning Cluster...
                    </>
                  ) : (
                    <>Sign Up Free <ArrowRight className="w-3.5 h-3.5" /></>
                  )}
                </button>

                <p className="text-center text-[9px] text-[#737373] pt-1">
                  By signing up, you agree to our Terms & Privacy Policy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONCEPT GRID SECTION ──────────────────────── */}
      <section className="bg-[#F5F5F0] border-t border-neutral-200/60 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          {/* SECTION HEADER */}
          <div className="text-center mb-12 space-y-3">
            <p className="text-[10px] font-black text-[#5C0E1E] uppercase tracking-widest">Business Verticals</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-950">
              One Platform.{" "}
              <span className="italic font-light text-[#737373]" style={{ fontFamily: "'Georgia', serif" }}>
                Every Business Concept.
              </span>
            </h2>
            <p className="text-[#737373] text-xs max-w-md mx-auto leading-relaxed">
              Deploy any layout configuration engine with a single provisioning action. Each vertical ships with its own KDS, analytics, and storefront themes.
            </p>
          </div>

          {/* 7-CONCEPT GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {CONCEPTS.map((concept) => {
              const Icon = concept.icon;
              const isActive = selectedConcept === concept.id;
              return (
                <button
                  key={concept.id}
                  onClick={() => setSelectedConcept(concept.id)}
                  className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all text-center group ${
                    isActive
                      ? "bg-white border-[#5C0E1E]/30 shadow-lg shadow-[#5C0E1E]/10 scale-[1.02]"
                      : "bg-white border-transparent hover:border-neutral-200 hover:shadow-md"
                  }`}
                >
                  {/* NEW BADGE for Organic */}
                  {concept.popular && (
                    <span className="absolute -top-2 -right-2 bg-[#5C0E1E] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      New
                    </span>
                  )}

                  <div className={`w-10 h-10 ${concept.bg} rounded-xl flex items-center justify-center ring-1 ${concept.ring} transition-all group-hover:scale-110`}>
                    <Icon className={`w-5 h-5 ${concept.iconColor}`} />
                  </div>

                  <div>
                    <p className="text-[11px] font-black text-neutral-900 leading-tight">{concept.label}</p>
                    <p className="text-[9px] text-[#737373] font-medium mt-0.5">{concept.subtitle}</p>
                  </div>

                  {isActive && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#5C0E1E] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* ORGANIC WELLNESS SPOTLIGHT (activates when "Organic & Oils" selected) */}
          {selectedConcept === "organic" && (
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-3xl border border-[#F0EEEB] p-8 shadow-sm animate-fade-in">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 bg-[#5C0E1E]/8 px-3 py-1.5 rounded-full border border-[#5C0E1E]/15">
                  <Leaf className="w-3 h-3 text-[#5C0E1E]" />
                  <span className="text-[9px] font-black text-[#5C0E1E] uppercase tracking-widest">Organic & Wellness Vertical</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-neutral-950">
                  Cold-Pressed. Pure. <br />
                  <span className="italic font-light text-[#5C0E1E]" style={{ fontFamily: "'Georgia', serif" }}>
                    High-Converting.
                  </span>
                </h3>
                <p className="text-[#737373] text-xs leading-relaxed">
                  Launch a premium wellness storefront built for single-product landing mechanics. Integrates directly with order management, KDS dispatch, and real-time analytics. Designed to convert organic buyers with editorial-style product photography, rich descriptions, and trust anchors.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Single-product landing page",
                    "Trust seal component",
                    "Subscription order support",
                    "Premium editorial themes",
                  ].map(f => (
                    <div key={f} className="flex items-center gap-2 text-[10px] font-semibold text-neutral-700">
                      <div className="w-3 h-3 rounded bg-[#5C0E1E]/10 flex items-center justify-center flex-shrink-0">
                        <ChevronRight className="w-2 h-2 text-[#5C0E1E]" />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* WELLNESS PRODUCT PREVIEW CARD */}
              <div className="relative">
                <div className="bg-[#F5F5F0] rounded-2xl p-6 h-full flex flex-col justify-between border border-[#EBEBEB]">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-[9px] font-black text-[#737373] uppercase tracking-widest">Storefront Preview</p>
                      <h4 className="text-lg font-black text-neutral-900 mt-1">Organic Cold-Press<br />Sesame Oil</h4>
                    </div>
                    <div className="bg-[#5C0E1E] text-white px-3 py-1 rounded-full text-[10px] font-black">
                      ₹450
                    </div>
                  </div>

                  {/* MOCK PRODUCT IMAGE PLACEHOLDER */}
                  <div className="flex-1 bg-gradient-to-br from-[#5C0E1E]/5 to-amber-50 rounded-xl flex items-center justify-center border border-[#EBEBEB] mb-4 min-h-[100px]">
                    <div className="text-center space-y-1">
                      <Leaf className="w-8 h-8 text-[#5C0E1E]/30 mx-auto" />
                      <p className="text-[9px] text-[#737373] font-medium">100% Cold-Pressed</p>
                    </div>
                  </div>

                  <button className="w-full py-2.5 bg-[#5C0E1E] text-white text-[10px] font-black rounded-xl uppercase tracking-wider">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────── */}
      <footer className="border-t border-[#F0EEEB] bg-white py-8 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 bg-[#5C0E1E] rounded flex items-center justify-center">
              <span className="text-white font-black text-[9px]">H</span>
            </div>
            <span className="font-black text-xs uppercase tracking-widest text-neutral-700">High P Platform</span>
          </div>
          <p className="text-[10px] text-[#737373] font-medium">© 2026 HighP Technologies. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}