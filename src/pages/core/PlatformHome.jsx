import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight, Mail, Lock, User, Globe, Shield,
  ChevronRight, CheckCircle, Star, Sparkles,
  Utensils, BookOpen, Scissors, Droplets, ShoppingBag, Dumbbell, Wrench,
  BarChart2, Users, Bell, Truck, CreditCard, Zap, Package, PieChart,
  HelpCircle, Settings, Layers, ShoppingCart, MessageSquare, ShieldAlert,
  Menu, X
} from "lucide-react";

export default function PlatformHome() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const FAQS = [
    { q: "How does the multi-tenant architecture work?", a: "Each business registered on HighP receives an isolated subdomain slug and database namespace. Your data, products, orders, and staff credentials remain entirely separate from other tenants." },
    { q: "Can I manage multiple business locations?", a: "Yes. The HighP operations workspace is designed to let you control multiple storefronts, catalogs, and staff roles from a single administrator login." },
    { q: "What hardware is required for the KDS?", a: "HighP works on any standard web browser. You can mount any tablet, iPad, or smart TV screen in your kitchen or dispatch desk to run the live feeds." },
  ];

  return (
    <div className="relative min-h-screen bg-[var(--surface-2)] text-[var(--text-primary)] antialiased selection:bg-[var(--brand)] selection:text-white">
      <nav className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/90 backdrop-blur-xl">
        <div className="section-shell flex h-16 items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand)] shadow-sm">
              <span className="text-xs font-black text-white">HP</span>
            </div>
            <div className="min-w-0">
              <span className="block truncate text-[11px] font-semibold tracking-[0.2em] text-[var(--text-primary)] sm:text-sm">HighP Platform</span>
              <span className="mt-0.5 block text-[8px] font-semibold uppercase tracking-[0.25em] text-[var(--text-3)] sm:text-[9px]">Enterprise Cloud</span>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-3)] md:flex">
            <a href="#features" className="transition-colors hover:text-[var(--brand)]">Features</a>
            <a href="#how-it-works" className="transition-colors hover:text-[var(--brand)]">How it works</a>
            <a href="#pricing" className="transition-colors hover:text-[var(--brand)]">Pricing</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/admin" className="hidden text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-3)] transition-colors hover:text-[var(--text-primary)] sm:inline-flex">
              Platform Admin
            </Link>
            <Link to="/login" className="btn-primary rounded-2xl px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] shadow-sm">
              Sign In
            </Link>

            <button onClick={() => setMobileMenuOpen(true)} className="rounded-2xl p-2 text-[var(--text-3)] transition-all hover:bg-white hover:text-[var(--text-primary)] active:scale-95 md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer Panel */}
          <div className="relative ml-auto w-64 max-w-xs bg-white h-full shadow-2xl flex flex-col p-6 animate-fade-in border-l border-neutral-100">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <span className="font-bold text-xs uppercase tracking-wider text-neutral-400">Navigation</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-4 mt-6 text-xs font-black uppercase tracking-widest text-[#737373]">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#D03D56] transition-colors py-2.5">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#D03D56] transition-colors py-2.5">How it works</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#D03D56] transition-colors py-2.5">Pricing</a>
              <div className="h-px bg-neutral-100 my-2" />
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="hover:text-neutral-950 transition-colors py-2.5 text-neutral-600 block">
                Platform Admin
              </Link>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full inline-flex items-center justify-center py-3.5 bg-[#D03D56] hover:bg-[#3F0712] text-white rounded-xl transition-all shadow-sm active:scale-95 text-center mt-2">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. HERO SECTION (TOWNCART STYLE) */}
      <section className="section-shell px-4 pb-16 pt-12 text-center sm:px-6 sm:pt-20 sm:pb-20 lg:px-8">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/15 bg-[var(--brand-light)] px-3.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--brand)] animate-fade-in">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
          No coding required · 100% free to start
        </div>

        <div className="mx-auto mt-6 max-w-3xl space-y-4">
          <h1 className="text-4xl font-black leading-[0.95] tracking-[-0.03em] text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
            Create your online store
            <br />
            <span className="text-[var(--brand)]">in seconds</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-8 text-[var(--text-3)] sm:text-lg">
            Start selling online without technical friction. Share your store link and receive customer orders directly on WhatsApp or KDS consoles — zero commission.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Link to="/login" className="btn-primary mx-auto w-full rounded-2xl px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] sm:w-auto">
            Create a Free Store <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="flex flex-col items-center justify-center gap-3 pt-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-3)] sm:flex-row sm:gap-6">
            <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-[var(--brand)]" /> Free Forever</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-[var(--brand)]" /> Orders via WhatsApp</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-[var(--brand)]" /> Instant Setup</span>
          </div>
        </div>
      </section>

      {/* Trust Logo Wall */}
      <section className="border-y border-[var(--border)] bg-white/80 py-10">
        <div className="section-shell px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--text-4)]">Empowering modern businesses globally</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-40 grayscale transition-opacity duration-300 hover:opacity-60">
            <svg className="h-5 w-auto text-neutral-800" viewBox="0 0 120 30" fill="currentColor" aria-hidden="true" style={{ maxHeight: '20px' }}>
              <path d="M10 12.5c0-1.8 1.4-2.8 3.5-2.8 1.8 0 3.3.7 4 1.2v-2.3c-.7-.3-2-.6-3.4-.6-4 0-6.8 2.2-6.8 6.1 0 5.4 7.4 4.5 7.4 7.4 0 1.9-1.5 2.9-3.9 2.9-2 0-3.8-.8-4.7-1.5v2.4c.9.4 2.5.7 4.1.7 4.1 0 7.2-2.1 7.2-6.2 0-5.8-7.7-4.7-7.7-7.6zm16 8.3v-9h-2.5v-2.2h2.5v-3.5h2.7v3.5h2.5v2.2h-2.5v9h2.5v2.2h-7.7v-2.2zm11.2 2.2V11.8h2.5v1.6c.7-1.2 2-1.9 3.5-1.9.5 0 .9.1 1.2.2v2.5c-.4-.2-.9-.3-1.5-.3-1.8 0-3 1.2-3 3.3v5.8h-2.7zm11.2 0V11.8h2.7v11.2h-2.7zm1.3-13.8c-.9 0-1.6-.7-1.6-1.6 0-.9.7-1.6 1.6-1.6.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6zm13.1 8c0 2-1.5 3.5-3.5 3.5-1.1 0-2-.5-2.5-1.2v5.7h-2.7V11.8h2.5v1.4c.5-.7 1.4-1.2 2.5-1.2 2 0 3.7 1.5 3.7 3.6v3.4zm-2.7-1.7c0-1.2-.8-2-1.8-2s-1.8.8-1.8 2 .8 2 1.8 2 1.8-.8 1.8-2zm16.1 1.2c-.4 1.5-1.8 2.5-3.5 2.5-2.2 0-3.7-1.6-3.7-3.6V15c0-2.1 1.5-3.6 3.6-3.6 2.2 0 3.5 1.5 3.5 3.6v1.1h-7.1c0 1.1.8 1.9 1.8 1.9.9 0 1.6-.4 1.9-1.1v2.3zm-3.6-4.5c-.8 0-1.5.5-1.7 1.2h3.3c0-.7-.6-1.2-1.6-1.2z"/>
            </svg>
            <svg className="h-5 w-auto text-neutral-800" viewBox="0 0 120 30" fill="currentColor" aria-hidden="true" style={{ maxHeight: '20px' }}>
              <path d="M13.75 4.375L25 23.75H2.5L13.75 4.375Z" />
              <text x="32" y="21" fontFamily="system-ui" fontWeight="900" fontSize="15" letterSpacing="0.05em">VERCEL</text>
            </svg>
            <svg className="h-5 w-auto text-neutral-800" viewBox="0 0 120 30" fill="currentColor" aria-hidden="true" style={{ maxHeight: '20px' }}>
              <text x="5" y="21" fontFamily="system-ui" fontWeight="800" fontSize="17" letterSpacing="-0.02em">shopify</text>
            </svg>
            <svg className="h-5 w-auto text-neutral-800" viewBox="0 0 120 30" fill="currentColor" aria-hidden="true" style={{ maxHeight: '20px' }}>
              <text x="5" y="21" fontFamily="system-ui" fontWeight="800" fontSize="17" letterSpacing="-0.02em">notion</text>
            </svg>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES SECTION - ALTERNATING (TOWNCART STYLE) */}
      <section className="border-y border-[var(--border)] bg-white py-16 sm:py-20 lg:py-24" id="features">
        <div className="section-shell space-y-16 px-4 sm:px-6 sm:space-y-24 lg:px-8 lg:space-y-28">
          
          {/* Alternating Block 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-flex rounded-full bg-[var(--brand-light)] px-3.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">
                Sleek Storefronts
              </span>
              <h2 className="text-2xl font-black leading-tight tracking-[-0.025em] text-[var(--text-primary)] sm:text-3xl">
                Turn your business into an online store in minutes
              </h2>
              <p className="text-sm leading-8 text-[var(--text-3)] sm:text-base">
                Stop wasting time on complicated setup tools. Just tell us what you sell, and your storefront is instantly provisioned—ready to accept customers from day one.
              </p>
              <div className="pt-1">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">No coding. No complex setup. No confusion.</span>
              </div>
            </div>
            
            {/* Visual Mockup 1 */}
            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-2)] p-6 shadow-sm lg:col-span-7">
              <div className="flex items-center justify-between gap-5 rounded-[24px] border border-[var(--border)] bg-white p-4.5">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-1.5">
                    <span className="rounded-full border border-emerald-100/60 bg-emerald-50 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-emerald-700">Fresh</span>
                    <span className="text-[8px] font-semibold text-[var(--text-3)]">4.9 ★</span>
                  </div>
                  <h4 className="truncate text-sm font-semibold text-[var(--text-primary)]">Double Smash Burger</h4>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-6 text-[var(--text-3)]">Two flame-grilled beef patties, cheese, toasted brioche bun, and signature sauce.</p>
                  <div className="mt-2.5 text-sm font-semibold text-[var(--text-primary)]">₹340</div>
                </div>
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[var(--surface-3)]">
                  <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" alt="burger" className="h-full w-full object-cover" />
                  <button className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 rounded-xl border border-[var(--border)] bg-white px-3.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-[var(--brand)] shadow-sm">Add +</button>
                </div>
              </div>
            </div>
          </div>

          {/* Alternating Block 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Mockup 2 (Reversed Order on large screens) */}
            <div className="lg:col-span-7 lg:order-2 space-y-4">
              <span className="inline-flex rounded-full bg-[var(--brand-light)] px-3.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">
                Simple Catalogs
              </span>
              <h2 className="text-2xl font-black leading-tight tracking-[-0.025em] text-[var(--text-primary)] sm:text-3xl">
                Add products in seconds, not hours
              </h2>
              <p className="text-sm leading-8 text-[var(--text-3)] sm:text-base">
                Forget manual uploads. Simply add your products, descriptions, prices, and high-resolution images in a clean dashboard interface, and your store updates automatically.
              </p>
              <div className="pt-1">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">Build your full catalog faster than ever before.</span>
              </div>
            </div>

            <div className="space-y-4 rounded-[28px] border border-[var(--border)] bg-[var(--surface-2)] p-6 shadow-sm lg:col-span-5 lg:order-1">
              <span className="block text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--text-3)]">Dashboard Inventory</span>
              {[
                { name: "Gourmet Smash Burger", category: "Food & Beverage", price: "₹340", status: "In Stock" },
                { name: "Cold Brew Latte", category: "Food & Beverage", price: "₹180", status: "In Stock" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white p-3">
                  <div>
                    <span className="block text-sm font-semibold text-[var(--text-primary)]">{item.name}</span>
                    <span className="mt-1 block text-[10px] font-medium text-[var(--text-3)]">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-semibold text-[var(--text-primary)]">{item.price}</span>
                    <span className="mt-1 block text-[9px] font-semibold text-emerald-600">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alternating Block 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-flex rounded-full bg-[var(--brand-light)] px-3.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">
                Order Delivery
              </span>
              <h2 className="text-2xl font-black leading-tight tracking-[-0.025em] text-[var(--text-primary)] sm:text-3xl">
                Receive orders directly on WhatsApp
              </h2>
              <p className="text-sm leading-8 text-[var(--text-3)] sm:text-base">
                The moment your store is live, customer baskets are channeled instantly. Each order lands straight in your WhatsApp or live operations desk with full customer details — ready to reply and confirm.
              </p>
              <div className="pt-1">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">No dashboard clutter. Just chat and sell.</span>
              </div>
            </div>
            
            {/* Visual Mockup 3 */}
            <div className="space-y-3 rounded-[28px] border border-[var(--border)] bg-[var(--surface-2)] p-6 shadow-sm lg:col-span-7">
              <span className="block text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--text-3)]">Incoming WhatsApp Message</span>
              <div className="space-y-3 rounded-[24px] border border-emerald-100 bg-emerald-50 p-4.5">
                <div className="flex items-center justify-between border-b border-emerald-100/80 pb-2">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-emerald-800">New Order Received!</span>
                  <span className="font-mono text-[9px] text-[var(--text-3)]">10:48 PM</span>
                </div>
                <div className="space-y-1 font-mono text-[10px] text-[var(--text-2)]">
                  <p><strong>Store:</strong> tastenpark.highp.in</p>
                  <p><strong>Customer:</strong> John Doe (+91 98765 43210)</p>
                  <p><strong>Items:</strong></p>
                  <p className="pl-4">- 2x Double Smash Burger (₹680)</p>
                  <p className="pl-4">- 1x Cold Brew Latte (₹180)</p>
                  <p><strong>Total:</strong> ₹860</p>
                  <p><strong>Delivery to:</strong> Flat 402, HighP Towers</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. WHY SELLERS LOVE THIS (TOWNCART STYLE) */}
      <section className="bg-[#FAFAFA] py-16 sm:py-20 lg:py-24" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-12 sm:space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <p className="text-[10px] font-black text-[#D03D56] uppercase tracking-widest">Sellers First</p>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 uppercase">Why Sellers Choose HighP</h2>
            <p className="text-neutral-500 text-xs leading-relaxed font-bold">Everything you need to launch and grow your online commerce presence in minutes.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: "Start in 5 mins", desc: "No databases to configure or deployment hurdles to clear. Just fill in your details and start." },
              { icon: ShoppingCart, title: "No app downloads", desc: "Your customers browse your catalog and checkout directly on their web browsers." },
              { icon: MessageSquare, title: "WhatsApp integrated", desc: "Receive formatted checkout details directly on your chat screen." },
              { icon: CheckCircle, title: "Perfect for local shops", desc: "Custom features for local deliveries, pickup, and cash collections." }
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="space-y-4 rounded-[24px] border border-[var(--border)] bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[var(--brand)]/20 hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--brand-light)] text-[var(--brand)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{f.title}</h3>
                  <p className="text-sm leading-7 text-[var(--text-3)]">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION (TOWNCART STYLE) */}
      <section className="bg-white border-y border-[#F0EEEB] py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-12 sm:space-y-16">
          <div className="mx-auto max-w-xl text-center space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">Testimonials</p>
            <h2 className="text-2xl font-black tracking-[-0.025em] text-[var(--text-primary)] sm:text-3xl">Loved by sellers everywhere</h2>
            <p className="text-sm leading-8 text-[var(--text-3)]">Real stores. Real orders. Real success stories.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { quote: "Set up my bakery store in 5 minutes. Orders now land directly on WhatsApp — no more lost messages.", initials: "PS", name: "Priya S.", shop: "Priya's Home Bakery" },
              { quote: "I share one link on my status and customers order all day. Best part: zero commission on any tier.", initials: "RK", name: "Rahul K.", shop: "Fresh Mart Grocery" },
              { quote: "Adding products from the dashboard is extremely smooth. My whole catalog was live before lunch.", initials: "AM", name: "Aisha M.", shop: "Aisha Boutique" }
            ].map((t, i) => (
              <div key={i} className="flex flex-col justify-between space-y-6 rounded-[24px] border border-[var(--border)] bg-[var(--surface-2)] p-6 shadow-sm">
                <p className="text-sm leading-8 text-[var(--text-3)]">“{t.quote}”</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-light)] text-xs font-black text-[var(--brand)]">
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--text-primary)]">{t.name}</h4>
                    <span className="mt-0.5 block text-[10px] font-medium text-[var(--text-3)]">{t.shop}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PRICING SECTION (TOWNCART STYLE) */}
      <section className="bg-white border-b border-[#F0EEEB] py-16 sm:py-20 lg:py-24" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-12 sm:space-y-16">
          <div className="mx-auto max-w-xl text-center space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">Pricing Plan</p>
            <h2 className="text-2xl font-black tracking-[-0.025em] text-[var(--text-primary)] sm:text-3xl">Simple, transparent pricing</h2>
            <p className="text-sm leading-8 text-[var(--text-3)]">0% commission on all plans. Pick what fits your business volume.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { plan: "Free", price: "₹0", orders: "50 monthly orders", action: "Get Started", recommended: false },
              { plan: "Lite", price: "₹2,499", orders: "250 monthly orders", action: "Get Started", recommended: false },
              { plan: "Standard", price: "₹4,999", orders: "1,000 monthly orders", action: "Get Started", recommended: true },
              { plan: "Enterprise", price: "₹12,499", orders: "Unlimited monthly orders", action: "Get Started", recommended: false }
            ].map((p, i) => (
              <div key={i} className={`relative flex flex-col justify-between space-y-8 rounded-[24px] border p-6 ${p.recommended ? "scale-[1.01] border-[var(--brand)] bg-white shadow-lg" : "border-[var(--border)] bg-[var(--surface-2)]"}`}>
                {p.recommended && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--brand)] px-3.5 py-1 text-[8px] font-semibold uppercase tracking-[0.24em] text-white">
                    Recommended Plan
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--text-3)]">{p.plan}</h3>
                    <div className="mt-1.5 flex items-baseline gap-1">
                      <span className="text-3xl font-black tracking-[-0.03em] text-[var(--text-primary)]">{p.price}</span>
                      <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--text-3)]">/ month</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-sm text-[var(--text-3)]">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-[var(--brand)]" /> {p.orders}</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-[var(--brand)]" /> 0% commission</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-[var(--brand)]" /> Unlimited Products</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-[var(--brand)]" /> Instant updates</li>
                  </ul>
                </div>

                <Link to="/login" className={`block w-full rounded-2xl py-3 text-center text-[10px] font-semibold uppercase tracking-[0.24em] transition-all ${p.recommended ? "bg-[var(--brand)] text-white shadow-sm hover:bg-[var(--brand-dark)]" : "border border-[var(--border)] bg-white text-[var(--text-primary)] hover:border-[var(--brand)]/40 hover:text-[var(--brand)]"}`}>
                  {p.action}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CALL TO ACTION */}
      <section className="bg-[var(--surface-2)] py-16 text-center sm:py-20 lg:py-24">
        <div className="section-shell space-y-6 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl space-y-3">
            <h2 className="text-2xl font-black tracking-[-0.025em] text-[var(--text-primary)] sm:text-3xl">Start your free store today</h2>
            <p className="text-sm leading-8 text-[var(--text-3)] sm:text-base">Get your storefront live and start receiving orders immediately.</p>
          </div>
          <Link to="/login" className="btn-primary mx-auto rounded-2xl px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.24em]">
            Create Your Store Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="section-shell grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[var(--brand)]">
                <span className="text-[9px] font-black text-white">HP</span>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-primary)]">HighP Platform</span>
            </div>
            <p className="text-sm leading-7 text-[var(--text-3)]">The fastest way for local shops to start selling online with absolute control.</p>
          </div>
          <div>
            <h4 className="mb-4 text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--text-primary)]">Product</h4>
            <ul className="space-y-2 text-sm text-[var(--text-3)]">
              <li><a href="#features" className="transition-colors hover:text-[var(--brand)]">Features</a></li>
              <li><a href="#pricing" className="transition-colors hover:text-[var(--brand)]">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--text-primary)]">Company</h4>
            <ul className="space-y-2 text-sm text-[var(--text-3)]">
              <li><a href="#" className="transition-colors hover:text-[var(--brand)]">About Us</a></li>
              <li><a href="#" className="transition-colors hover:text-[var(--brand)]">Contact Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--text-primary)]">Legal</h4>
            <ul className="space-y-2 text-sm text-[var(--text-3)]">
              <li><a href="#" className="transition-colors hover:text-[var(--brand)]">Privacy Policy</a></li>
              <li><a href="#" className="transition-colors hover:text-[var(--brand)]">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="section-shell mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-6 text-sm text-[var(--text-3)] sm:flex-row">
          <p>© 2026 HighP Cloud Inc. All rights reserved.</p>
          <p>Made with ♥ for local businesses.</p>
        </div>
      </footer>

    </div>
  );
}