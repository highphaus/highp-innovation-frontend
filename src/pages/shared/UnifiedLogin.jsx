import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Mail, Lock, ShieldCheck, AlertCircle, CheckCircle,
  ArrowRight, LayoutDashboard, ChefHat, Bike, User, Shield, MessageSquare
} from "lucide-react";
import axios from "axios";
import { getTheme, getVerticalDetails } from "../storefront/StorefrontHome";

export default function UnifiedLogin() {
  const { storeSlug } = useParams();
  const navigate = useNavigate();

  const [storeData, setStoreData] = useState(null);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState("admin"); // admin, kitchen, delivery
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`/api/stores/${storeSlug}`)
      .then(r => setStoreData(r.data))
      .catch(() => {});
  }, [storeSlug]);

  const theme = getTheme(storeData);

  const handleProcessLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await axios.post("/api/stores/login", {
        storeSlug, email, password, loginRole: selectedRole
      });
      localStorage.setItem(`token_${storeSlug}`, res.data.token);
      localStorage.setItem(`role_${storeSlug}`, res.data.role);

      if (res.data.role === "admin") navigate(`/${storeSlug}/admin`);
      else if (res.data.role === "kitchen") navigate(`/${storeSlug}/kitchen`);
      else if (res.data.role === "delivery") navigate(`/${storeSlug}/delivery`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.response?.data?.error || "Authentication failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleProcessRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      // 1. Submit registration payload to backend
      const res = await axios.post(`/api/stores/${storeSlug}/staff`, {
        name, role: selectedRole, email, phone
      });
      
      setSuccessMsg("Account registered successfully! Switch to Login tab to access.");
      setName("");
      setEmail("");
      setPhone("");
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.response?.data?.message || "Registration failed. Check parameters.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 selection:bg-neutral-800 selection:text-white font-sans antialiased">
      <div className="w-full max-w-md bg-white border border-[#F0EEEB] rounded-3xl p-8 shadow-lg space-y-6 animate-fade-up">
        
        {/* LOGO HEADER */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#D03D56] rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-sm">
            <StoreIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-neutral-955 uppercase font-manrope">
            {storeData?.name || storeSlug}
          </h2>
          <p className="text-[9px] text-[#737373] leading-relaxed uppercase tracking-wider font-bold">
            Sign in or create your account
          </p>
        </div>

        {/* SEGMENTED TAB BUTTONS */}
        <div className="bg-[#FAFAFA] border border-[#F5F5F0] p-1 rounded-xl flex gap-1">
          <button
            type="button"
            onClick={() => { setIsSignUpMode(false); setErrorMsg(""); setSuccessMsg(""); }}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              !isSignUpMode 
                ? "bg-[#D03D56] text-white shadow-sm" 
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUpMode(true); setErrorMsg(""); setSuccessMsg(""); }}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              isSignUpMode 
                ? "bg-[#D03D56] text-white shadow-sm" 
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Register
          </button>
        </div>

        {/* FEEDBACK STATUS */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-[11px] font-semibold rounded-xl flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-semibold rounded-xl flex items-start gap-2">
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* AUTH FORM */}
        <form onSubmit={isSignUpMode ? handleProcessRegister : handleProcessLogin} className="space-y-4">
          
          {/* FULL NAME (SIGNUP ONLY) */}
          {isSignUpMode && (
            <div>
              <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  required type="text"
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-medium"
                  value={name} onChange={e => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ROLE SELECT ENGINE */}
          <div>
            <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Workspace Role</label>
            <div className="relative">
              <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              <select 
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-10 pr-10 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/50 focus:bg-white transition-all font-bold appearance-none cursor-pointer"
              >
                {!isSignUpMode && <option value="admin">Store Owner / Manager</option>}
                <option value="kitchen">Operations / Production Team</option>
                <option value="delivery">Delivery Dispatch / Riders</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] font-bold text-neutral-400">
                ▼
              </div>
            </div>
          </div>

          {/* EMAIL ADDRESS */}
          <div>
            <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                required type="email"
                placeholder="you@example.com"
                className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-medium"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD (LOGIN & ADMIN ROLE ONLY) */}
          {!isSignUpMode && selectedRole === "admin" && (
            <div>
              <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Security Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  required type="password"
                  placeholder="••••••••••••"
                  className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-medium"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* PHONE NUMBER (SIGNUP ONLY) */}
          {isSignUpMode && (
            <div>
              <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Phone Number (Optional)</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-medium"
                  value={phone} onChange={e => setPhone(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit" disabled={loading}
            className="w-full py-3.5 bg-[#D03D56] hover:bg-[#3F0712] active:scale-[0.98] text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <span>{isSignUpMode ? "Create Account →" : "Access Workspace →"}</span>
            )}
          </button>
        </form>

        {/* BOTTOM HELP LINKS */}
        <div className="flex items-center justify-between text-[10px] text-neutral-450 border-t border-[#F5F5F0] pt-4.5 font-bold">
          <Link to={`/${storeSlug}`} className="hover:text-neutral-900 transition-colors">
            ← View Storefront
          </Link>
          <Link to="/" className="hover:text-neutral-900 transition-colors">
            Platform Hub →
          </Link>
        </div>

        {/* POWERED BY FOOTNOTE */}
        <div className="flex items-center justify-center gap-1 text-[9px] text-neutral-400 font-bold pt-2">
          <MessageSquare className="w-3 h-3 text-[#D03D56]/70" />
          <span>Powered by HighP Enterprise integration</span>
        </div>

      </div>
    </div>
  );
}

// 🏢 Simple Store Icon for logo box
function StoreIcon({ className }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
    </svg>
  );
}

// 🔄 Simple Loader placeholder
function Loader2({ className }) {
  return (
    <span className={`${className} border-2 border-white/30 border-t-white rounded-full`} />
  );
}