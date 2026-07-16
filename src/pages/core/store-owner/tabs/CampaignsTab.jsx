import React from "react";
import { Search, Plus, Megaphone, Share2, Ticket, BarChart3, Sparkles } from "lucide-react";

export default function CampaignsTab({
  campaignsList = [],
  campaignsSearchQuery,
  setCampaignsSearchQuery,
  campaignsSubTab = "campaigns",
  setCampaignsSubTab,
  handleCreateCampaignClick,
  sharesCount = 0,
  activeCouponsCount = 0,
  redemptionsCount = 0
}) {
  const currentSubTab = campaignsSubTab || "campaigns";

  return (
    <div className="w-full font-sans text-[#2d3748] max-w-6xl mx-auto pb-16 px-1 animate-fade-in space-y-6">
      
      {/* 1. TOP STATS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Shares Card */}
        <div className="bg-white border border-[#e2e8f0] rounded p-4 shadow-sm space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#64748b]">
            <Share2 className="w-3.5 h-3.5" />
            <span>Shares</span>
          </div>
          <div className="text-xl font-bold text-[#0f172a]">{sharesCount}</div>
        </div>

        {/* Active Coupons Card */}
        <div className="bg-white border border-[#e2e8f0] rounded p-4 shadow-sm space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#64748b]">
            <Ticket className="w-3.5 h-3.5" />
            <span>Active coupons</span>
          </div>
          <div className="text-xl font-bold text-[#0f172a]">{activeCouponsCount}</div>
        </div>

        {/* Redemptions Card */}
        <div className="bg-white border border-[#e2e8f0] rounded p-4 shadow-sm space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#64748b]">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Redemptions</span>
          </div>
          <div className="text-xl font-bold text-[#0f172a]">{redemptionsCount}</div>
        </div>
      </div>

      {/* 2. SUB-MENU TABS TOGGLE ROW */}
      <div className="bg-[#f1f5f9]/60 border border-[#e2e8f0] rounded p-1 flex items-center">
        <button
          type="button"
          onClick={() => setCampaignsSubTab?.("campaigns")}
          className={`flex-1 text-center py-2 text-sm font-semibold rounded transition-all cursor-pointer ${
            currentSubTab === "campaigns"
              ? "bg-white text-[#0f172a] shadow-sm"
              : "text-[#64748b] hover:text-[#0f172a]"
          }`}
        >
          Campaigns
        </button>
        <button
          type="button"
          onClick={() => setCampaignsSubTab?.("promo")}
          className={`flex-1 text-center py-2 text-sm font-semibold rounded transition-all cursor-pointer ${
            currentSubTab === "promo"
              ? "bg-white text-[#0f172a] shadow-sm"
              : "text-[#64748b] hover:text-[#0f172a]"
          }`}
        >
          Promo
        </button>
      </div>

      {/* 3. TOOLBAR CONTROLS FILTER BAR */}
      <div className="flex items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1 border border-[#cbd5e1] rounded bg-[#f8fafc] focus-within:border-neutral-400 focus-within:bg-white transition-all max-w-3xl flex items-center">
          <Search className="w-4 h-4 text-[#64748b] absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={campaignsSearchQuery || ""}
            onChange={(e) => setCampaignsSearchQuery?.(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-[#0f172a]"
          />
        </div>

        {/* Create Campaign Add Button */}
        <button
          type="button"
          onClick={handleCreateCampaignClick}
          className="bg-[#10b981] text-white text-sm font-bold px-4 py-2 rounded shadow-sm hover:opacity-95 transition-opacity flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New</span>
        </button>
      </div>

      {/* Item Counter Label */}
      <p className="text-xs text-[#64748b] px-0.5">
        {campaignsList.length} of {campaignsList.length} campaigns
      </p>

      {/* 4. DYNAMIC SECTION VIEWS */}
      {campaignsList.length === 0 ? (
        
        /* SHOWN CONDITION: ZERO CAMPAIGNS CREATED YET */
        <div className="space-y-8 pt-6">
          
          {/* Main Empty Core Banner Indicator */}
          <div className="flex flex-col items-center justify-center text-center space-y-3 py-6">
            <div className="p-4 bg-[#e8f5e9] text-[#10b981] rounded-2xl shadow-inner">
              <Megaphone className="w-8 h-8 transform -rotate-12 fill-current" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#0f172a]">No campaigns yet</h3>
              <p className="text-xs sm:text-sm text-[#64748b]">Start from a template or build your own</p>
            </div>
          </div>

          {/* Preset Templates Options Deck */}
          <div className="max-w-2xl mx-auto space-y-3">
            
            {/* Template Card 1: Weekend Sale */}
            <div 
              onClick={handleCreateCampaignClick}
              className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-sm hover:border-neutral-300 transition-all cursor-pointer space-y-1 group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#10b981]">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Weekend Sale</span>
              </div>
              <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed group-hover:text-[#0f172a] transition-colors">
                Hey! ￼ Our weekend sale is LIVE. Grab your favourites at the best prices — only till Sunday!
              </p>
            </div>

            {/* Template Card 2: New Arrivals */}
            <div 
              onClick={handleCreateCampaignClick}
              className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-sm hover:border-neutral-300 transition-all cursor-pointer space-y-1 group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#10b981]">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>New Arrivals</span>
              </div>
              <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed group-hover:text-[#0f172a] transition-colors">
                Fresh stock just landed! ￼ Take a look at what's new this week. Tap the link to order on WhatsApp.
              </p>
            </div>

          </div>
        </div>
      ) : (
        
        /* SHOWN CONDITION: DYNAMIC CAMPAIGNS GRID RENDER VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaignsList
            .filter(c => 
              !campaignsSearchQuery || 
              c.title.toLowerCase().includes(campaignsSearchQuery.toLowerCase())
            )
            .map((campaign) => (
              <div key={campaign._id} className="bg-white border border-[#e2e8f0] rounded-lg p-5 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-base text-[#0f172a]">{campaign.title}</h4>
                    <span className="text-[10px] bg-slate-100 border px-2 py-0.5 rounded text-[#475569] uppercase font-bold tracking-wider">
                      {campaign.type || "Broadcast"}
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    campaign.status === "active" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-neutral-50 text-neutral-500 border-neutral-200"
                  }`}>
                    {campaign.status}
                  </span>
                </div>
                <p className="text-sm text-[#64748b] line-clamp-2">{campaign.message}</p>
                <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9] text-xs text-neutral-400 font-medium">
                  <span>Created: {new Date(campaign.createdAt).toLocaleDateString("en-IN")}</span>
                  <span className="text-[#0f172a] font-bold">Clicks: {campaign.clicksCount || 0}</span>
                </div>
              </div>
            ))}
        </div>
      )}

    </div>
  );
}