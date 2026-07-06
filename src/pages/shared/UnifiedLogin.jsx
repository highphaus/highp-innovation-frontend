import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Mail, Lock, ShieldCheck, AlertCircle,
  ArrowRight, Leaf, LayoutDashboard, ChefHat, Bike
} from "lucide-react";
import axios from "axios";

/* ─── Floating geometric shape for maroon panel ───── */
function FloatingShape({ className }) {
  return (
    <div
      className={`absolute rounded-full border opacity-10 ${className}`}
    />
  );
}

export default function UnifiedLogin() {
  const { storeSlug } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProcessLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await axios.post("http://localhost:5000/api/stores/login", {
        storeSlug, email, password
      });
      localStorage.setItem(`token_${storeSlug}`, res.data.token);
      localStorage.setItem(`role_${storeSlug}`, res.data.role);

      if (res.data.role === "admin") navigate(`/${storeSlug}/admin`);
      else if (res.data.role === "kitchen") navigate(`/${storeSlug}/kitchen`);
      else if (res.data.role === "delivery") navigate(`/${storeSlug}/delivery`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Authentication failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex selection:bg-[#5C0E1E] selection:text-white font-sans antialiased">

      {/* ─── LEFT PANEL: Deep Maroon with Geometric Art ──── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#3F0712] flex-col justify-between p-12 overflow-hidden">

        {/* FLOATING GEOMETRIC SHAPES — subtle ambient artwork */}
        <FloatingShape className="w-96 h-96 border-white/20 border-2 -top-20 -left-20 rotate-12" />
        <FloatingShape className="w-64 h-64 border-white/10 border -bottom-16 -right-16 rotate-45" />
        <FloatingShape className="w-40 h-40 border-white/15 border-2 top-1/3 right-8 -rotate-12" />
        <FloatingShape className="w-24 h-24 border-[#8B1A2E]/40 border-2 bottom-32 left-12 rotate-30" />

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5C0E1E]/20 via-transparent to-black/30 pointer-events-none" />

        {/* TOP: BRAND LOGO BLOCK */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center">
              <span className="font-black text-white text-sm">H</span>
            </div>
            <div>
              <span className="font-black text-white text-xs uppercase tracking-widest block">High P Platform</span>
              <span className="text-[9px] text-white/40 font-medium uppercase tracking-wider">Enterprise Suite</span>
            </div>
          </div>

          {/* SECURE STATUS INDICATOR */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 border border-white/10 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">Secure Gatekeeper Node Active</span>
          </div>
        </div>

        {/* MIDDLE: EDITORIAL CONTENT */}
        <div className="relative z-10 space-y-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight leading-[1.1]">
              Staff Access
              <br />
              <span
                className="italic font-light text-white/70"
                style={{ fontFamily: "'Georgia', serif", fontSize: "0.9em" }}
              >
                Management Portal.
              </span>
            </h1>
            <p className="text-white/50 text-xs mt-4 leading-relaxed max-w-xs">
              Authenticate with your assigned role credentials to access your designated operational workspace within the {storeSlug} tenant cluster.
            </p>
          </div>

          {/* ROLE ICONS BLOCK */}
          <div className="space-y-3">
            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Available Workspaces</p>
            {[
              { role: "Administrator", icon: LayoutDashboard, desc: "Full dashboard & inventory" },
              { role: "Kitchen Staff", icon: ChefHat, desc: "Live KDS production board" },
              { role: "Delivery Fleet", icon: Bike, desc: "Dispatch logistics desk" },
            ].map(({ role, icon: Icon, desc }) => (
              <div key={role} className="flex items-center gap-3 p-3 bg-white/5 border border-white/8 rounded-xl">
                <div className="w-7 h-7 bg-white/8 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-white/60" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/80">{role}</p>
                  <p className="text-[9px] text-white/40 font-medium">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM: FOOTER */}
        <div className="relative z-10">
          <div className="border-t border-white/10 pt-5 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-white/30" />
            <p className="text-[9px] text-white/30 font-medium uppercase tracking-wider">
              256-bit encrypted authentication gateway
            </p>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL: Clean White Login Form ──────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 sm:p-14">
        <div className="w-full max-w-sm space-y-8">

          {/* HEADER */}
          <div className="space-y-2">
            {/* Mobile-only logo */}
            <div className="flex lg:hidden items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-[#5C0E1E] rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-[10px]">H</span>
              </div>
              <span className="font-black text-sm uppercase tracking-widest text-neutral-900">High P</span>
            </div>

            <p className="text-[10px] font-black text-[#5C0E1E] uppercase tracking-widest">
              {storeSlug} workspace
            </p>
            <h2 className="text-2xl font-black tracking-tight text-neutral-950">Welcome back.</h2>
            <p className="text-[11px] text-[#737373] leading-relaxed">
              Enter your credentials to access your designated role workspace.
            </p>
          </div>

          {/* ERROR STATE */}
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200/60 text-red-700 text-[11px] font-semibold rounded-2xl flex items-start gap-2.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleProcessLogin} className="space-y-4">
            {/* EMAIL FIELD */}
            <div>
              <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                <input
                  type="email" required
                  placeholder="staff@brand.com"
                  className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-10 pr-4 py-3 text-xs rounded-xl focus:outline-none focus:border-[#5C0E1E]/40 focus:bg-white transition-all font-medium"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest">
                  Password
                </label>
                <span className="text-[9px] text-[#5C0E1E] font-bold cursor-pointer hover:underline">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                <input
                  type="password" required
                  placeholder="••••••••••"
                  className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-10 pr-4 py-3 text-xs rounded-xl focus:outline-none focus:border-[#5C0E1E]/40 focus:bg-white transition-all font-medium"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* DIVIDER LINE INDICATOR */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#F0EEEB]" />
              <span className="text-[9px] font-bold text-[#737373] uppercase tracking-widest">Secure Login</span>
              <div className="flex-1 h-px bg-[#F0EEEB]" />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 bg-[#5C0E1E] hover:bg-[#3F0712] active:scale-[0.99] text-white font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md shadow-[#5C0E1E]/20 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>Authenticate Session <ArrowRight className="w-3.5 h-3.5" /></>
              )}
            </button>
          </form>

          {/* BOTTOM NAV LINKS */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#F5F5F0]" />
              <div className="flex-1 h-px bg-[#F5F5F0]" />
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#737373] font-semibold">
              <Link to={`/${storeSlug}`} className="hover:text-neutral-900 transition-colors">
                ← View Storefront
              </Link>
              <Link to="/" className="hover:text-neutral-900 transition-colors">
                HighP Platform →
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}