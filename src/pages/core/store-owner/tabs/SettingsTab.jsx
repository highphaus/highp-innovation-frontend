import React, { useRef } from "react";
import { 
  Settings, 
  CreditCard, 
  Wallet, 
  Truck, 
  CheckSquare, 
  Image, 
  Camera, 
  RefreshCw,
  ExternalLink,
  Trash2,
  Sparkles,
  ShieldCheck,
  FileSpreadsheet,
  Layers,
  Sliders
} from "lucide-react";

export default function SettingsTab({
  name,
  setName,
  email,
  setEmail,
  ownerName,
  setOwnerName,
  softwareType,
  setSoftwareType,
  subscriptionPlan,
  ordersCount,
  logoUrl,
  faviconUrl,
  setFaviconUrl,
  phone,
  setPhone,
  whatsappNumber,
  setWhatsappNumber,
  address,
  setAddress,
  currency,
  setCurrency,
  timezone,
  setTimezone,
  language,
  setLanguage,
  isLive,
  setIsLive,
  isTestingMode,
  setIsTestingMode,
  soundAlertsEnabled,
  setSoundAlertsEnabled,
  vibrationAlertsEnabled,
  setVibrationAlertsEnabled,
  settingsSubTab,
  setSettingsSubTab,
  updating,
  slug,
  
  // State variables for newly integrated sub-tabs
  codEnabled,
  setCodEnabled,
  selfPickup,
  setSelfPickup,
  upiId,
  setUpiId,
  
  handleUpdateProfile,
  handleLogoFileChange,
  handleTransferOwnership,
  handleTestAlert,
  handleDeleteStore
}) {
  const logoInputRef = useRef(null);
  const currentStoreUrl = `towncart-co-in.lovable.app/store/${slug || "trying-to-do"}`;

  const subTabsList = [
    { id: "general", label: "General", icon: Settings },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "payments", label: "Payments", icon: Wallet },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "checkout", label: "Checkout", icon: CheckSquare },
    { id: "banners", label: "Banners", icon: Image },
  ];

  return (
    <div className="w-full font-sans text-[#2d3748] max-w-6xl mx-auto pb-16 px-1">
      <h1 className="text-2xl font-bold text-[#0f172a] mb-6">Settings</h1>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* LEFT TAB MENU NAVIGATION */}
        <aside className="w-full md:w-56 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 gap-1 border-b md:border-b-0 md:border-r border-[#e2e8f0] flex-shrink-0 scrollbar-none">
          {subTabsList.map((tab) => {
            const Icon = tab.icon;
            const isActive = settingsSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSettingsSubTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#e8f5e9] text-[#10b981] border-l-2 border-[#10b981] font-semibold"
                    : "text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#10b981]" : "text-[#64748b]"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* RIGHT CORE CONTENT AREA CODES */}
        <div className="flex-1 w-full bg-transparent space-y-8">
          
          {/* SUB-TAB 1: GENERAL STORE SETTINGS */}
          {settingsSubTab === "general" && (
            <form onSubmit={handleUpdateProfile} className="space-y-8 max-w-3xl">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-[#0f172a]">General</h2>
                <p className="text-xs text-[#64748b]">Core store configuration.</p>
              </div>

              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-[#334155] uppercase tracking-wider text-[11px]">Store identity</h3>
                <div className="relative border border-[#cbd5e1] rounded px-3 pt-3 pb-2 bg-white">
                  <label className="absolute top-[-9px] left-3 bg-white px-1 text-[10px] font-bold text-[#64748b]">Store name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent border-none p-0 text-sm focus:outline-none text-[#0f172a]" required />
                </div>
                <p className="text-[11px] text-[#64748b] mt-[-10px] px-1">Your store URL stays the same even if you rename your store, so customer links keep working.</p>

                <div className="relative border border-[#cbd5e1] rounded px-3 pt-3 pb-2 bg-white">
                  <label className="absolute top-[-9px] left-3 bg-white px-1 text-[10px] font-bold text-[#64748b]">Owner name</label>
                  <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="w-full bg-transparent border-none p-0 text-sm focus:outline-none text-[#0f172a]" />
                </div>

                <div className="relative border border-[#cbd5e1] rounded px-3 pt-2.5 pb-2 bg-white">
                  <label className="absolute top-[-9px] left-3 bg-white px-1 text-[10px] font-bold text-[#64748b]">Store category</label>
                  <select value={softwareType} onChange={(e) => setSoftwareType(e.target.value)} className="w-full bg-transparent border-none p-0 text-sm focus:outline-none text-[#0f172a] appearance-none">
                    <option value="grocery">Grocery & Kirana</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="bakery">Bakery</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#64748b] block">Store Logo</span>
                  <div className="flex items-center gap-3">
                    <div onClick={() => logoInputRef.current?.click()} className="w-14 h-14 border border-[#cbd5e1] rounded bg-[#f8fafc] flex items-center justify-center cursor-pointer overflow-hidden">
                      <input type="file" ref={logoInputRef} onChange={handleLogoFileChange} accept="image/*" className="hidden" />
                      {logoUrl ? <img src={logoUrl} alt="Store logo" className="w-full h-full object-cover" /> : <Camera className="w-5 h-5 text-[#64748b]" />}
                    </div>
                    <button type="button" onClick={() => logoInputRef.current?.click()} className="px-4 py-2 border border-[#cbd5e1] text-xs font-semibold rounded bg-white text-[#2d3748] shadow-sm cursor-pointer">Upload</button>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={updating} className="px-6 py-2.5 bg-[#10b981] text-white text-xs font-bold uppercase tracking-wider rounded shadow hover:opacity-95 cursor-pointer">Save Settings</button>
              </div>
            </form>
          )}

          {/* SUB-TAB 2: BILLING & SUBSCRIPTION */}
          {settingsSubTab === "billing" && (
            <div className="space-y-6 max-w-4xl">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-[#0f172a]">Billing & Subscription</h2>
                <p className="text-sm text-[#64748b]">Manage your plan, usage, and billing history.</p>
              </div>

              <div className="bg-white border border-[#e2e8f0] rounded p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2"><span className="text-base font-bold text-[#0f172a]">Free plan</span><span className="text-[10px] font-bold uppercase bg-slate-100 border text-[#475569] px-2 py-0.5 rounded">Free trial</span></div>
                  <p className="text-sm text-[#64748b]">Free — 1-month trial, up to 50 orders</p>
                  <p className="text-xs text-neutral-400 font-medium">Trial ends on Aug 7, 2026 · 30 days left</p>
                </div>
                <button type="button" className="bg-[#10b981] text-white text-xs font-bold px-4 py-2.5 rounded hover:opacity-95 cursor-pointer">Upgrade plan</button>
              </div>

              <div className="bg-white border border-[#e2e8f0] rounded p-4 sm:p-5 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-[#0f172a]">Usage this period</h3>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm text-[#334155] font-semibold"><span>Orders</span><span>{ordersCount || 0} / 50</span></div>
                  <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                    <div className="bg-neutral-800 h-full transition-all" style={{ width: `${Math.min(((ordersCount || 0) / 50) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 3: PAYMENTS INTERFACE (Screenshot 1) */}
          {settingsSubTab === "payments" && (
            <div className="space-y-6 max-w-4xl">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-[#0f172a]">Payments</h2>
                <p className="text-sm text-[#64748b]">Enable & manage payments for your store.</p>
              </div>

              <div className="space-y-3 bg-white border border-[#e2e8f0] rounded-lg p-2 sm:p-4 shadow-sm divide-y divide-[#f1f5f9]">
                {/* Cash on Delivery Selection Row */}
                <div className="flex items-center justify-between py-4 px-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#e8f5e9] text-[#10b981] rounded flex items-center justify-center font-bold text-sm">💵</div>
                    <span className="text-sm font-semibold text-[#0f172a]">Cash on Delivery</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Sliders className="w-4 h-4 text-neutral-400 cursor-pointer hover:text-black" />
                    <button 
                      type="button" 
                      onClick={() => setCodEnabled?.(!codEnabled)}
                      className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${codEnabled !== false ? "bg-[#10b981]" : "bg-neutral-200"}`}
                    >
                      <div className={`bg-white w-5 h-5 rounded-full shadow transition-transform ${codEnabled !== false ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>

                {/* UPI Selection Row */}
                <div className="flex items-center justify-between py-4 px-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#f3e5f5] text-[#a855f7] rounded flex items-center justify-center font-bold text-sm">📱</div>
                    <span className="text-sm font-semibold text-[#0f172a]">UPI</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Sliders className="w-4 h-4 text-neutral-400 cursor-pointer hover:text-black" />
                    <button 
                      type="button" 
                      onClick={() => setSelfPickup?.(!selfPickup)}
                      className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${selfPickup ? "bg-[#10b981]" : "bg-neutral-200"}`}
                    >
                      <div className={`bg-white w-5 h-5 rounded-full shadow transition-transform ${selfPickup ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>
              </div>

              <button type="button" className="text-sm text-[#10b981] font-bold hover:underline flex items-center gap-1 cursor-pointer">
                + Add Payment Method
              </button>
            </div>
          )}

          {/* SUB-TAB 4: SHIPPING & THIRD-PARTY DELIVERY PARTNERS (Screenshots 2, 3, 4) */}
          {settingsSubTab === "shipping" && (
            <div className="space-y-6 max-w-4xl">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-[#0f172a]">Shipping</h2>
                <p className="text-sm text-[#64748b]">Manage your store shipping methods.</p>
              </div>

              {/* Core Pickup Toggle Block */}
              <div className="bg-white border border-[#e2e8f0] rounded-lg p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded flex items-center justify-center"><Truck className="w-4 h-4" /></div>
                  <span className="text-sm font-semibold text-[#0f172a]">Pickup</span>
                </div>
                <div className="flex items-center gap-4">
                  <Sliders className="w-4 h-4 text-neutral-400" />
                  <div className="w-11 h-6 bg-[#10b981] rounded-full p-0.5 flex items-center"><div className="bg-white w-5 h-5 rounded-full shadow translate-x-5" /></div>
                </div>
              </div>

              <button type="button" className="text-sm text-[#10b981] font-bold block cursor-pointer">+ Add Shipping</button>

              {/* Logistics Partners Extensions Block */}
              <div className="space-y-4 pt-2">
                <div>
                  <h3 className="text-base font-bold text-[#0f172a]">Shipping partners</h3>
                  <p className="text-xs text-[#64748b]">Connect a courier aggregator to fulfil orders automatically.</p>
                </div>

                {/* Integration Module 1: Shiprocket Form Card */}
                <div className="bg-white border border-[#e2e8f0] rounded-lg p-4 sm:p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded flex items-center justify-center"><Truck className="w-4 h-4" /></div>
                    <div>
                      <div className="flex items-center gap-2"><span className="text-sm font-bold text-[#0f172a]">Shiprocket</span><span className="text-[10px] font-bold bg-slate-100 text-[#64748b] px-2 py-0.5 rounded">Not connected</span></div>
                      <p className="text-xs text-neutral-400 font-medium">Auto-push confirmed orders to your Shiprocket panel for fulfilment.</p>
                    </div>
                  </div>
                  <div className="space-y-3 pt-2">
                    <input type="email" placeholder="Shiprocket email" className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none" />
                    <input type="password" placeholder="Shiprocket password" className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none" />
                    <button type="button" className="w-full bg-[#10b981] text-white text-xs font-bold py-2.5 rounded shadow-sm uppercase cursor-pointer">Connect Shiprocket</button>
                    <p className="text-[11px] text-[#64748b] text-center">Use your Shiprocket login. Credentials are encrypted and stored only on our backend.</p>
                  </div>
                </div>

                {/* Integration Module 2: Porter Form Card */}
                <div className="bg-white border border-[#e2e8f0] rounded-lg p-4 sm:p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-orange-50 text-orange-600 rounded flex items-center justify-center font-bold text-sm">🛵</div>
                    <div>
                      <div className="flex items-center gap-2"><span className="text-sm font-bold text-[#0f172a]">Porter</span><span className="text-[10px] font-bold bg-slate-100 text-[#64748b] px-2 py-0.5 rounded">Not connected</span></div>
                      <p className="text-xs text-neutral-400 font-medium">On-demand local delivery (bike / truck). Book riders directly from each order.</p>
                    </div>
                  </div>
                  <div className="space-y-3 pt-2">
                    <input type="text" placeholder="Porter API key (X-API-KEY)" className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none" />
                    <input type="text" placeholder="Account ID (optional)" className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none" />
                    <select className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm bg-white focus:outline-none text-[#0f172a] font-medium"><option>Sandbox (UAT)</option><option>Production</option></select>
                    
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-[#334155] block">Pickup location</span>
                      <input type="text" placeholder="Contact name" className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none" />
                      <input type="text" placeholder="Contact phone (10 digits)" className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none" />
                      <input type="text" placeholder="Pickup address" className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none" />
                      <div className="grid grid-cols-2 gap-2"><input type="text" placeholder="City" className="border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none" /><input type="text" placeholder="Pincode" className="border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none" /></div>
                    </div>
                    <button type="button" className="w-full bg-[#10b981] text-white text-xs font-bold py-2.5 rounded shadow-sm uppercase cursor-pointer">Connect Porter</button>
                    <p className="text-[11px] text-[#64748b] text-center">Get your API key from porter.in/business → Partner API. Stored encrypted on our backend.</p>
                  </div>
                </div>

                {/* Integration Module 3: Google Sheets Sync Form Card */}
                <div className="space-y-3 pt-4">
                  <div>
                    <h3 className="text-base font-bold text-[#0f172a]">Data sync</h3>
                    <p className="text-xs text-[#64748b]">Manage your catalog from TownCart or directly from a Google Spreadsheet.</p>
                  </div>
                  <div className="bg-white border border-[#e2e8f0] rounded-lg p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><FileSpreadsheet className="w-5 h-5" /></div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0f172a]">Google Sheets</h4>
                        <p className="text-xs text-[#64748b] font-medium">Connect your Google account to auto-create a TownCart spreadsheet.</p>
                      </div>
                    </div>
                    <button type="button" className="bg-[#10b981] text-white text-xs font-bold px-4 py-2 rounded shadow-sm hover:opacity-95 cursor-pointer self-start sm:self-auto">Connect Google</button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SUB-TAB 5: CHECKOUT SETTINGS CONFIGURATION (Screenshot 5) */}
          {settingsSubTab === "checkout" && (
            <div className="space-y-6 max-w-4xl">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-[#0f172a]">Checkout Settings</h2>
                <p className="text-sm text-[#64748b]">Control what shoppers can add during checkout.</p>
              </div>

              <div className="bg-white border border-[#e2e8f0] rounded-lg p-4 sm:p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#0f172a]">Customer Remarks</h3>
                  <p className="text-xs text-[#64748b]">Let shoppers add notes per item and/or an overall order note.</p>
                </div>

                <div className="space-y-6 divide-y divide-[#f1f5f9]">
                  {/* Product Remarks Option Row */}
                  <div className="flex items-center justify-between pt-2 gap-4">
                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-[#0f172a] block">Enable Product Remarks</span>
                      <span className="text-xs text-[#64748b] block">Shoppers can add a note on each cart item (e.g. "less spicy").</span>
                    </div>
                    <button type="button" className="w-11 h-6 bg-neutral-200 rounded-full p-0.5 flex items-center cursor-pointer"><div className="bg-white w-5 h-5 rounded-full shadow translate-x-0" /></button>
                  </div>

                  {/* Required Toggle Hidden Nest Box */}
                  <div className="flex items-center justify-between pt-4 gap-4 opacity-40">
                    <div className="space-y-0.5 pl-4">
                      <span className="text-sm font-semibold text-neutral-400 block">Product Remarks Required</span>
                      <span className="text-xs text-neutral-400 block">Block checkout unless every item has a note.</span>
                    </div>
                    <button type="button" disabled className="w-11 h-6 bg-neutral-100 rounded-full p-0.5 flex items-center cursor-not-allowed"><div className="bg-white/80 w-5 h-5 rounded-full shadow" /></button>
                  </div>

                  {/* Order Remarks Option Row */}
                  <div className="flex items-center justify-between pt-4 gap-4">
                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-[#0f172a] block">Enable Order Remarks</span>
                      <span className="text-xs text-[#64748b] block">Shoppers can add a single note for the whole order.</span>
                    </div>
                    <button type="button" className="w-11 h-6 bg-neutral-200 rounded-full p-0.5 flex items-center cursor-pointer"><div className="bg-white w-5 h-5 rounded-full shadow translate-x-0" /></button>
                  </div>

                  {/* Order Required Toggle Hidden Nest Box */}
                  <div className="flex items-center justify-between pt-4 gap-4 opacity-40">
                    <div className="space-y-0.5 pl-4">
                      <span className="text-sm font-semibold text-neutral-400 block">Order Remarks Required</span>
                      <span className="text-xs text-neutral-400 block">Block checkout unless the order note is filled.</span>
                    </div>
                    <button type="button" disabled className="w-11 h-6 bg-neutral-100 rounded-full p-0.5 flex items-center cursor-not-allowed"><div className="bg-white/80 w-5 h-5 rounded-full shadow" /></button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 6: PROMOTIONAL STOREFRONT BANNERS (Screenshot 6) */}
          {settingsSubTab === "banners" && (
            <div className="space-y-6 max-w-4xl">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-[#0f172a]">Banners</h2>
                <p className="text-sm text-[#64748b]">Manage promotional banners on your storefront.</p>
              </div>

              <div className="bg-[#f8fafc] border border-dashed border-[#cbd5e1] rounded-lg p-12 text-center text-sm text-[#64748b] font-medium space-y-4 shadow-sm">
                <p>No banners yet. Add one to promote offers on your storefront.</p>
                <button type="button" className="text-xs font-bold bg-[#10b981] text-white px-4 py-2 rounded shadow-sm hover:opacity-95 transition-opacity inline-flex items-center gap-1 cursor-pointer">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Banner</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Simple fallback Plus wrapper definition
function Plus({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}