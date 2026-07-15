import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Megaphone, Loader2 } from "lucide-react";
import axios from "axios";
import { getTheme } from "../storefront/StorefrontHome";

export default function CampaignsManagement() {
  const { storeSlug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(`token_${storeSlug}`);
    const role = localStorage.getItem(`role_${storeSlug}`);
    if (!token || role !== "admin") {
      navigate(`/${storeSlug}/login`);
    }
  }, [storeSlug, navigate]);

  const [storeData, setStoreData] = useState(null);
  const [campaignSearchQuery, setCampaignSearchQuery] = useState("");
  const [campaignType, setCampaignType] = useState("campaigns"); // campaigns, promo

  useEffect(() => {
    if (storeSlug) {
      axios.get(`/api/stores/${storeSlug}`).then(r => setStoreData(r.data)).catch(() => {});
    }
  }, [storeSlug]);

  const theme = getTheme(storeData);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-20 selection:bg-neutral-800 selection:text-white">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#F0EEEB] px-6 lg:px-10 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-7 h-7 ${theme.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <Megaphone className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-black text-xs uppercase tracking-widest text-neutral-900 block truncate">
                {storeData?.name || storeSlug}
              </span>
              <span className="text-[9px] text-[#737373] font-mono block">Campaigns Workspace · /{storeSlug}</span>
            </div>
          </div>
          <Link 
            to={`/${storeSlug}/admin`} 
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition-colors border border-[#F0EEEB] bg-[#FAFAFA] hover:bg-neutral-50 px-3.5 py-2 rounded-xl flex-shrink-0 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> <span>Dashboard</span>
          </Link>
        </div>
      </header>

      {/* VIEW BODY */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-8 space-y-6">
        
        {/* Top metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: "Shares", val: 0 },
            { label: "Active coupons", val: 0 },
            { label: "Redemptions", val: 0 }
          ].map((s, idx) => (
            <div key={idx} className="bg-white border border-[#F0EEEB] p-6 rounded-3xl shadow-sm">
              <span className="text-[9px] text-[#737373] uppercase tracking-widest font-black block">{s.label}</span>
              <span className="text-2xl font-black block text-neutral-955 mt-1.5">{s.val}</span>
            </div>
          ))}
        </div>

        {/* Toggles bar */}
        <div className="bg-white border border-[#F0EEEB] p-1.5 rounded-2xl flex gap-1 max-w-sm shadow-sm">
          <button 
            onClick={() => setCampaignType("campaigns")}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              campaignType === "campaigns" ? "bg-[#D03D56] text-white" : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Campaigns
          </button>
          <button 
            onClick={() => setCampaignType("promo")}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              campaignType === "promo" ? "bg-[#D03D56] text-white" : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Promo Codes
          </button>
        </div>

        {/* Search Bar + Create Button */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search campaigns..."
              value={campaignSearchQuery}
              onChange={e => setCampaignSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#F0EEEB] pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 transition-all font-semibold"
            />
          </div>
          <button 
            onClick={() => alert("Creating a new coupon or campaign template...")}
            className="px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-sm transition-all cursor-pointer flex items-center gap-1"
          >
            + New
          </button>
        </div>

        {/* Empty state & templates */}
        <div className="space-y-6">
          
          {/* Empty State Card */}
          <div className="bg-white border border-[#F0EEEB] rounded-3xl py-14 px-6 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
              <Megaphone className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wide">No campaigns yet</h4>
              <p className="text-[#737373] text-[9px] font-bold uppercase tracking-widest">Start from a template or build your own</p>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#737373]">Recommended Templates</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Weekend Sale", body: "Hey! 🌟 Our weekend sale is LIVE. Grab your favourites at the best prices — only till Sunday! Tap to view catalog." },
                { title: "New Arrivals", body: "Fresh stock just landed! ✨ Take a look at what's new this week. Tap the link to order on WhatsApp." }
              ].map((t, idx) => (
                <div key={idx} className="bg-white border border-[#F0EEEB] p-5 rounded-2xl space-y-3 hover:border-[#D03D56]/30 transition-all shadow-sm">
                  <h5 className="text-xs font-black text-neutral-900 uppercase tracking-wide flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {t.title}
                  </h5>
                  <p className="text-[10px] text-neutral-500 font-bold leading-relaxed">{t.body}</p>
                  <button 
                    onClick={() => alert(`Activated template: ${t.title}`)}
                    className="text-[9px] font-black text-[#D03D56] hover:underline uppercase tracking-widest block"
                  >
                    Use Template →
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
