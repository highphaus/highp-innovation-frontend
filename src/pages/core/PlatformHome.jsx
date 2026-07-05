import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, Store, Mail, Lock, Sparkles, AlertCircle, ArrowRight, Paintbrush } from "lucide-react";
import axios from "axios";

export default function PlatformHome() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    email: "",
    password: "",
    tagline: "",
    themeColor: "red"
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "slug") {
      const formattedSlug = value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      setFormData(prev => ({ ...prev, [name]: formattedSlug }));
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
      const exactServerError = err.response?.data?.message || err.response?.data?.error || err.message;
      setErrorMsg(exactServerError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFEB] text-[#1A0508] font-sans flex flex-col lg:flex-row overflow-x-hidden selection:bg-[#6B1A24] selection:text-white">
      
      {/* LEFT MARKETING SIDEBAR (Maroon & Black theme) */}
      <div className="lg:w-1/2 flex flex-col justify-between p-8 lg:p-16 border-b lg:border-b-0 lg:border-r border-[#E5DCD5] bg-gradient-to-br from-[#2D0B10] via-[#1A0508] to-[#000000] relative overflow-hidden text-[#E6DFD3]">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#800020]/15 blur-[120px] pointer-events-none" />

        {/* LOGO */}
        <div className="flex items-center gap-3 z-10 animate-fade-in">
          <div className="w-9 h-9 bg-[#E6DFD3] text-[#1A0508] rounded-xl flex items-center justify-center font-black text-base shadow-md">
            Ω
          </div>
          <div>
            <span className="font-black text-xs uppercase tracking-widest text-[#E6DFD3] block">OmniChannel</span>
            <span className="text-[9px] text-[#A89F91] font-bold uppercase tracking-wider block">Enterprise Platform</span>
          </div>
        </div>

        {/* HERO CONTENT */}
        <div className="my-16 lg:my-0 max-w-lg z-10 animate-fade-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-[#800020]/30 text-[10px] font-bold text-[#E6DFD3] mb-6 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#E6DFD3] animate-pulse" /> Global Fleet Deployer
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-6 text-white">
            Deploy Your Gourmet Network.
          </h1>
          
          <p className="text-[#C5BDB1] text-xs sm:text-sm leading-relaxed mb-8">
            Instantiate customizable, multi-tenant digital menus complete with live KDS order routing, driver allocation desk control, and executive business logs.
          </p>
          
          <div className="flex items-center gap-6 text-[10px] text-[#A89F91] font-bold uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#800020] animate-ping" /> Node Active
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#800020]/50" />
            <div>Atlas Tenant Cluster</div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-[9px] text-[#8C8274] font-bold tracking-widest z-10">
          © 2026 Core Gateway Technologies. Suite v4.0
        </div>
      </div>

      {/* RIGHT REGISTRATION FORM PANEL (Beige & White theme with Maroon details) */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative">
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#800020]/5 blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-md bg-white border border-[#E5DCD5] p-8 rounded-[32px] shadow-[0_12px_40px_rgba(26,5,8,0.06)] relative z-10 animate-fade-up">
          
          <div className="mb-6">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2 text-[#1A0508]">
              <Rocket className="w-5.5 h-5.5 text-[#800020]" /> Onboard Merchant Node
            </h2>
            <p className="text-xs text-neutral-500 mt-1">Configure your parameters to spawn an isolated storefront branch.</p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200/60 text-red-750 text-xs font-semibold rounded-2xl mb-5 flex items-center gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-650 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleOnboardSubmit} className="space-y-4">
            <div>
              <label className="block text-[9px] font-black text-neutral-550 uppercase tracking-widest mb-1.5 ml-1">Store / Brand Name</label>
              <div className="relative">
                <Store className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                <input 
                  type="text" 
                  name="name" 
                  required 
                  placeholder="e.g. Taste N Park" 
                  className="w-full h-11 bg-[#FAF7F4] border border-[#E5DCD5] hover:border-neutral-350 text-[#1A0508] pl-10 pr-4 text-xs rounded-xl focus:outline-none focus:border-[#800020] focus:bg-white transition-all font-semibold" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-black text-neutral-550 uppercase tracking-widest mb-1.5 ml-1">Subdomain Slug</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-xs text-neutral-450 font-bold font-mono">/</span>
                <input 
                  type="text" 
                  name="slug" 
                  required 
                  placeholder="tastenpark" 
                  className="w-full h-11 bg-[#FAF7F4] border border-[#E5DCD5] hover:border-neutral-350 text-[#1A0508] pl-8 pr-4 text-xs rounded-xl font-mono focus:outline-none focus:border-[#800020] focus:bg-white transition-all font-bold tracking-wider" 
                  value={formData.slug} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-black text-neutral-550 uppercase tracking-widest mb-1.5 ml-1">Administrator Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                <input 
                  type="email" 
                  name="email" 
                  required 
                  placeholder="admin@brand.com" 
                  className="w-full h-11 bg-[#FAF7F4] border border-[#E5DCD5] hover:border-neutral-350 text-[#1A0508] pl-10 pr-4 text-xs rounded-xl focus:outline-none focus:border-[#800020] focus:bg-white transition-all font-semibold" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-black text-neutral-550 uppercase tracking-widest mb-1.5 ml-1">Security Vault Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                <input 
                  type="password" 
                  name="password" 
                  required 
                  placeholder="••••••••" 
                  className="w-full h-11 bg-[#FAF7F4] border border-[#E5DCD5] hover:border-neutral-350 text-[#1A0508] pl-10 pr-4 text-xs rounded-xl focus:outline-none focus:border-[#800020] focus:bg-white transition-all font-medium" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-black text-neutral-550 uppercase tracking-widest mb-1.5 ml-1">Company Tagline</label>
              <input 
                type="text" 
                name="tagline" 
                placeholder="Handcrafted Premium Cuisine" 
                className="w-full h-11 bg-[#FAF7F4] border border-[#E5DCD5] hover:border-neutral-350 text-[#1A0508] px-4 text-xs rounded-xl focus:outline-none focus:border-[#800020] focus:bg-white transition-all font-semibold" 
                value={formData.tagline} 
                onChange={handleInputChange} 
              />
            </div>

            <div>
              <label className="block text-[9px] font-black text-neutral-550 uppercase tracking-widest mb-1.5 ml-1">Primary Brand Palette</label>
              <div className="relative">
                <Paintbrush className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
                <select 
                  name="themeColor" 
                  className="w-full h-11 bg-[#FAF7F4] border border-[#E5DCD5] hover:border-neutral-350 text-[#1A0508] pl-10 pr-4 text-xs rounded-xl focus:outline-none focus:border-[#800020] focus:bg-white transition-all font-bold appearance-none cursor-pointer" 
                  value={formData.themeColor} 
                  onChange={handleInputChange}
                >
                  <option value="red">🔴 Ruby Red (Bistro & Cafe)</option>
                  <option value="blue">🔵 Sapphire Blue (Fleet Logistics)</option>
                  <option value="emerald">🟢 Emerald Green (Bakery & Fine Dine)</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full h-12 bg-[#800020] hover:bg-[#6B1A24] active:scale-[0.98] text-[#FAF7F2] font-black text-xs uppercase tracking-wider rounded-xl transition-all mt-4 flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {loading ? (
                <span>Provisioning Node...</span>
              ) : (
                <>
                  <span>Instantiate Merchant Node</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}