import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Mail, Lock, ArrowRight, Home, AlertCircle } from "lucide-react";
import axios from "axios";

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
      const res = await axios.post("http://localhost:5000/api/stores/login", { storeSlug, email, password });
      
      localStorage.setItem(`token_${storeSlug}`, res.data.token);
      localStorage.setItem(`role_${storeSlug}`, res.data.role);

      if (res.data.role === 'admin') navigate(`/${storeSlug}/admin`);
      else if (res.data.role === 'kitchen') navigate(`/${storeSlug}/kitchen`);
      else if (res.data.role === 'delivery') navigate(`/${storeSlug}/delivery`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Verification failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 font-sans relative overflow-hidden selection:bg-neutral-800 selection:text-white">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-600/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-neutral-900/30 border border-neutral-800/80 p-8 rounded-[28px] shadow-2xl backdrop-blur-md relative z-10 animate-fade-up">
        
        {/* LOGO AREA */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ShieldCheck className="w-6 h-6 text-neutral-400" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">{storeSlug} Suite</h2>
          <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Unified Security Gatekeeper</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/20 border border-red-900/30 text-red-400 text-xs font-semibold rounded-xl mb-5 flex items-center gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleProcessLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Account Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-600" />
              <input 
                type="email" 
                required 
                placeholder="name@company.com" 
                className="w-full h-11 bg-neutral-950 border border-neutral-850 hover:border-neutral-850 focus:border-white text-white pl-10 pr-4 text-xs rounded-xl focus:outline-none transition-all font-medium" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Security Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-600" />
              <input 
                type="password" 
                required 
                placeholder="••••••••" 
                className="w-full h-11 bg-neutral-950 border border-neutral-850 hover:border-neutral-850 focus:border-white text-white pl-10 pr-4 text-xs rounded-xl focus:outline-none transition-all font-medium" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full h-12 bg-white hover:bg-neutral-100 active:scale-[0.98] text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all mt-4 flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying Sessions...</span>
            ) : (
              <>
                <span>Authenticate Session</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="divider my-6" />

        <Link 
          to={`/${storeSlug}`} 
          className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase text-neutral-500 hover:text-white transition-colors tracking-widest"
        >
          <Home className="w-3.5 h-3.5" /> Return to Storefront
        </Link>
      </div>
    </div>
  );
}