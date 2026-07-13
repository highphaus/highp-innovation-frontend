import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight, Mail, Lock, User, Globe, Shield,
  ChevronRight, CheckCircle, Star, Sparkles,
  Utensils, BookOpen, Scissors, Droplets, ShoppingBag, Dumbbell, Wrench,
  BarChart2, Users, Bell, Truck, CreditCard, Zap, Package, PieChart,
  HelpCircle, Settings, Layers, ShoppingCart, MessageSquare, ShieldAlert
} from "lucide-react";

export default function PlatformHome() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  const FAQS = [
    { q: "How does the multi-tenant architecture work?", a: "Each business registered on HighP receives an isolated subdomain slug and database namespace. Your data, products, orders, and staff credentials remain entirely separate from other tenants." },
    { q: "Can I manage multiple business locations?", a: "Yes. The HighP operations workspace is designed to let you control multiple storefronts, catalogs, and staff roles from a single administrator login." },
    { q: "What hardware is required for the KDS?", a: "HighP works on any standard web browser. You can mount any tablet, iPad, or smart TV screen in your kitchen or dispatch desk to run the live feeds." },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans antialiased selection:bg-[#D03D56] selection:text-white relative">

      {/* 1. STICKY HEADER NAVIGATION (TOWNCART STYLE) */}
      <nav className="sticky top-0 z-40 bg-white/95 border-b border-[#F0EEEB] h-16 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-full flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 bg-[#D03D56] rounded-xl flex items-center justify-center shrink-0">
              <span className="font-black text-white text-xs">HP</span>
            </div>
            <div className="min-w-0">
              <span className="font-black text-[11px] sm:text-sm tracking-tight text-neutral-955 block truncate">HighP Platform</span>
              <span className="text-[8px] sm:text-[9px] text-[#737373] font-bold uppercase tracking-widest block mt-0.5">Enterprise Cloud</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-[#737373]">
            <a href="#features" className="hover:text-[#D03D56] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#D03D56] transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-[#D03D56] transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/admin" className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-widest text-neutral-600 hover:text-neutral-950 transition-colors">
              Platform Admin
            </Link>
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center text-[10px] font-black uppercase tracking-widest px-3 py-2 sm:px-4.5 sm:py-2.5 bg-[#D03D56] hover:bg-[#3F0712] text-white rounded-xl transition-all shadow-sm active:scale-95"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION (TOWNCART STYLE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-20 pb-16 sm:pb-24 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7EBEF] text-[#D03D56] border border-[#D03D56]/10 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D03D56] animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest">No coding required · 100% free to start</span>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-950 leading-[1.05] uppercase">
            Create Your Online Store
            <br />
            <span className="italic font-light text-[#D03D56]" style={{ fontFamily: "'Playfair Display', serif" }}>
              In Seconds
            </span>
          </h1>
          <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-medium">
            Start selling online without any technical skills. Share your store link and receive customer orders directly on WhatsApp or KDS consoles — zero commission.
          </p>
        </div>

        <div className="pt-4 space-y-4">
          <Link 
            to="/login" 
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-[#D03D56] hover:bg-[#3F0712] text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-md active:scale-95 hover:translate-y-[-1px] cursor-pointer"
          >
            Create a Free Store <ArrowRight className="w-4 h-4" />
          </Link>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-[9px] text-[#737373] font-black uppercase tracking-widest pt-2">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#D03D56]" /> Free Forever</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#D03D56]" /> Orders via WhatsApp</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#D03D56]" /> Instant Setup</span>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES SECTION - ALTERNATING (TOWNCART STYLE) */}
      <section className="bg-white border-y border-[#F0EEEB] py-16 sm:py-20 lg:py-24" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-16 sm:space-y-24 lg:space-y-28">
          
          {/* Alternating Block 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#D03D56] bg-[#F7EBEF] px-3.5 py-1.5 rounded-full">
                Sleek Storefronts
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-955 uppercase leading-tight">
                Turn Your Business Into an Online Store in Minutes
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed font-bold">
                Stop wasting time on complicated setup tools. Just tell us what you sell, and your storefront is instantly provisioned—ready to accept customers from day one.
              </p>
              <div className="pt-2">
                <span className="text-[10px] font-black text-[#D03D56] block">👉 No coding. No complex setup. No confusion.</span>
              </div>
            </div>
            
            {/* Visual Mockup 1 */}
            <div className="lg:col-span-7 bg-[#FAFAFA] border border-[#F0EEEB] rounded-3xl p-6 shadow-sm">
              <div className="bg-white border border-[#F0EEEB] rounded-2xl p-4.5 flex gap-5 items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100/50">Fresh</span>
                    <span className="text-[8px] font-black text-neutral-800">4.9 ★</span>
                  </div>
                  <h4 className="text-xs font-black text-neutral-900 truncate uppercase tracking-tight">Double Smash Burger</h4>
                  <p className="text-neutral-400 text-[10px] mt-1 line-clamp-2">Two flame-grilled beef patties, cheese, toasted brioche bun, and signature sauce.</p>
                  <div className="text-xs font-black text-neutral-955 mt-2.5">₹340</div>
                </div>
                <div className="relative w-24 h-24 flex-shrink-0 bg-neutral-100 rounded-xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" alt="burger" className="w-full h-full object-cover" />
                  <button className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-white border border-[#F0EEEB] text-[#D03D56] font-black text-[8px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow-sm">ADD +</button>
                </div>
              </div>
            </div>
          </div>

          {/* Alternating Block 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Mockup 2 (Reversed Order on large screens) */}
            <div className="lg:col-span-7 lg:order-2 space-y-4">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#D03D56] bg-[#F7EBEF] px-3.5 py-1.5 rounded-full">
                Simple Catalogs
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-955 uppercase leading-tight">
                Add Products in Seconds, Not Hours
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed font-bold">
                Forget manual uploads. Simply add your products, descriptions, prices, and high-resolution images in a clean dashboard interface, and your store updates automatically.
              </p>
              <div className="pt-2">
                <span className="text-[10px] font-black text-[#D03D56] block">👉 Build your full catalog faster than ever before.</span>
              </div>
            </div>

            <div className="lg:col-span-5 lg:order-1 bg-[#FAFAFA] border border-[#F0EEEB] rounded-3xl p-6 shadow-sm space-y-4">
              <span className="text-[9px] font-black text-[#737373] uppercase tracking-widest block">Dashboard Inventory</span>
              {[
                { name: "Gourmet Smash Burger", category: "Food & Beverage", price: "₹340", status: "In Stock" },
                { name: "Cold Brew Latte", category: "Food & Beverage", price: "₹180", status: "In Stock" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-[#F0EEEB] p-3 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-neutral-900 block">{item.name}</span>
                    <span className="text-[9px] text-[#737373] font-bold block">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-neutral-950 block">{item.price}</span>
                    <span className="text-[8px] font-black text-emerald-600 block">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alternating Block 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#D03D56] bg-[#F7EBEF] px-3.5 py-1.5 rounded-full">
                Order Delivery
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-955 uppercase leading-tight">
                Receive Orders Directly on WhatsApp
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed font-bold">
                The moment your store is live, customer baskets are channeled instantly. Each order lands straight in your WhatsApp or live operations desk with full customer details — ready to reply and confirm.
              </p>
              <div className="pt-2">
                <span className="text-[10px] font-black text-[#D03D56] block">👉 No dashboard clutter. Just chat and sell.</span>
              </div>
            </div>
            
            {/* Visual Mockup 3 */}
            <div className="lg:col-span-7 bg-[#FAFAFA] border border-[#F0EEEB] rounded-3xl p-6 shadow-sm space-y-3">
              <span className="text-[9px] font-black text-[#737373] uppercase tracking-widest block">Incoming WhatsApp Message</span>
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-150 pb-2">
                  <span className="text-[9px] font-black text-emerald-800 uppercase tracking-wider">New Order Received!</span>
                  <span className="text-[9px] text-[#737373] font-mono">10:48 PM</span>
                </div>
                <div className="font-mono text-[10px] text-neutral-800 space-y-1">
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
                <div key={i} className="bg-white border border-[#F0EEEB] p-6 rounded-2xl shadow-sm space-y-4 hover:border-[#D03D56]/20 hover:shadow-md transition-all">
                  <div className="w-10 h-10 bg-[#F7EBEF] rounded-xl flex items-center justify-center text-[#D03D56]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-black text-neutral-900 uppercase tracking-wide">{f.title}</h3>
                  <p className="text-[10px] text-neutral-500 leading-relaxed font-bold">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION (TOWNCART STYLE) */}
      <section className="bg-white border-y border-[#F0EEEB] py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-12 sm:space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <p className="text-[10px] font-black text-[#D03D56] uppercase tracking-widest">Testimonials</p>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 uppercase">Loved by Sellers Everywhere</h2>
            <p className="text-neutral-500 text-xs leading-relaxed font-bold">Real stores. Real orders. Real success stories.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "Set up my bakery store in 5 minutes. Orders now land directly on WhatsApp — no more lost messages.", initials: "PS", name: "Priya S.", shop: "Priya's Home Bakery" },
              { quote: "I share one link on my status and customers order all day. Best part: zero commission on any tier.", initials: "RK", name: "Rahul K.", shop: "Fresh Mart Grocery" },
              { quote: "Adding products from the dashboard is extremely smooth. My whole catalog was live before lunch.", initials: "AM", name: "Aisha M.", shop: "Aisha Boutique" }
            ].map((t, i) => (
              <div key={i} className="bg-[#FAFAFA] border border-[#F0EEEB] p-6 rounded-3xl flex flex-col justify-between shadow-sm space-y-6">
                <p className="text-neutral-600 text-xs italic leading-relaxed font-medium">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#F7EBEF] text-[#D03D56] rounded-full flex items-center justify-center font-black text-xs">
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-neutral-905">{t.name}</h4>
                    <span className="text-[9px] text-[#737373] font-bold block">{t.shop}</span>
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
          <div className="text-center max-w-xl mx-auto space-y-2">
            <p className="text-[10px] font-black text-[#D03D56] uppercase tracking-widest">Pricing Plan</p>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-955 uppercase">Simple, Transparent Pricing</h2>
            <p className="text-neutral-500 text-xs leading-relaxed font-bold">0% commission on all plans. Pick what fits your business volume.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { plan: "Free", price: "₹0", orders: "50 monthly orders", action: "Get Started", recommended: false },
              { plan: "Lite", price: "₹2,499", orders: "250 monthly orders", action: "Get Started", recommended: false },
              { plan: "Standard", price: "₹4,999", orders: "1,000 monthly orders", action: "Get Started", recommended: true },
              { plan: "Enterprise", price: "₹12,499", orders: "Unlimited monthly orders", action: "Get Started", recommended: false }
            ].map((p, i) => (
              <div 
                key={i} 
                className={`border rounded-3xl p-6 flex flex-col justify-between space-y-8 relative ${
                  p.recommended 
                    ? "bg-white border-[#D03D56] shadow-lg scale-105 z-10" 
                    : "bg-[#FAFAFA] border-[#F0EEEB]"
                }`}
              >
                {p.recommended && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D03D56] text-white text-[8px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full">
                    Recommended Plan
                  </span>
                )}
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#737373]">{p.plan}</h3>
                    <div className="flex items-baseline gap-1 mt-1.5">
                      <span className="text-3xl font-black text-neutral-950">{p.price}</span>
                      <span className="text-[9px] text-[#737373] font-bold uppercase tracking-wider">/ month</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-[10px] text-neutral-500 font-bold">
                    <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-[#D03D56]" /> {p.orders}</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-[#D03D56]" /> 0% commission</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-[#D03D56]" /> Unlimited Products</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-[#D03D56]" /> Instant updates</li>
                  </ul>
                </div>

                <Link 
                  to="/login"
                  className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-center transition-all block ${
                    p.recommended
                      ? "bg-[#D03D56] hover:bg-[#3F0712] text-white shadow-sm"
                      : "bg-white border border-[#F0EEEB] hover:border-[#D03D56]/50 text-neutral-700 hover:text-neutral-950"
                  }`}
                >
                  {p.action}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CALL TO ACTION */}
      <section className="bg-[#FAFAFA] py-16 sm:py-20 lg:py-24 text-center space-y-6">
        <div className="space-y-3 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 uppercase leading-none">Start Your Free Store Today</h2>
          <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed font-bold">Get your storefront live and start receiving orders immediately.</p>
        </div>
        <Link 
          to="/login" 
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-[#D03D56] hover:bg-[#3F0712] text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Create Your Store Now <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* 8. FOOTER (TOWNCART STYLE) */}
      <footer className="bg-white border-t border-[#F0EEEB] py-16 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-[#D03D56] rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-[9px]">HP</span>
              </div>
              <span className="font-black text-xs uppercase tracking-widest text-neutral-700">HighP Platform</span>
            </div>
            <p className="text-[10px] text-neutral-400 font-bold leading-relaxed">
              The fastest way for local shops to start selling online with absolute control.
            </p>
          </div>
          <div>
            <h4 className="text-[9px] font-black uppercase tracking-widest text-neutral-900 mb-4">Product</h4>
            <ul className="space-y-2 text-[10px] text-neutral-500 font-bold">
              <li><a href="#features" className="hover:text-[#D03D56]">Features</a></li>
              <li><a href="#pricing" className="hover:text-[#D03D56]">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[9px] font-black uppercase tracking-widest text-neutral-900 mb-4">Company</h4>
            <ul className="space-y-2 text-[10px] text-neutral-500 font-bold">
              <li><a href="#" className="hover:text-[#D03D56]">About Us</a></li>
              <li><a href="#" className="hover:text-[#D03D56]">Contact Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[9px] font-black uppercase tracking-widest text-neutral-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-[10px] text-neutral-500 font-bold">
              <li><a href="#" className="hover:text-[#D03D56]">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#D03D56]">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-[#F0EEEB] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#737373] font-bold">
          <p>© 2026 HighP Cloud Inc. All rights reserved.</p>
          <p>Made with ♥ for local businesses.</p>
        </div>
      </footer>

    </div>
  );
}