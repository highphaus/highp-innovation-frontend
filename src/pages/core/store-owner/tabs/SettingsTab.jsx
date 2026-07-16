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
  Trash2
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
    <div className="w-full font-sans text-[#2d3748] max-w-6xl mx-auto pb-16">
      <h1 className="text-2xl font-bold text-[#0f172a] mb-6 px-1">Settings</h1>

      {/* 2-COLUMN STRUCTURE: LEFT NAVIGATION MENU & RIGHT CONTENT AREA */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* LEFT NAV PANEL - Horizontal scroll on mobile, side stack on desktop */}
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

        {/* RIGHT CORE DYNAMIC CONTENT PANEL */}
        <div className="flex-1 w-full bg-transparent space-y-8">
          
          {settingsSubTab === "general" && (
            <form onSubmit={handleUpdateProfile} className="space-y-8 max-w-3xl">
              
              {/* SUB-HEADER DESCRIPTION */}
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-[#0f172a]">General</h2>
                <p className="text-xs text-[#64748b]">Core store configuration.</p>
              </div>

              {/* SECTION A: STORE IDENTITY */}
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-[#334155] uppercase tracking-wider text-[11px]">
                  Store identity
                </h3>

                {/* Store Name Input Box */}
                <div className="relative border border-[#cbd5e1] rounded px-3 pt-3 pb-2 focus-within:border-neutral-400 bg-white">
                  <label className="absolute top-[-9px] left-3 bg-white px-1 text-[10px] font-bold text-[#64748b]">
                    Store name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. trying to do"
                    className="w-full bg-transparent border-none p-0 text-sm focus:outline-none focus:ring-0 text-[#0f172a]"
                    required
                  />
                </div>
                <p className="text-[11px] text-[#64748b] mt-[-10px] px-1">
                  Your store URL stays the same even if you rename your store, so customer links keep working.
                </p>

                {/* Owner Name Input Box */}
                <div className="relative border border-[#cbd5e1] rounded px-3 pt-3 pb-2 focus-within:border-neutral-400 bg-white">
                  <label className="absolute top-[-9px] left-3 bg-white px-1 text-[10px] font-bold text-[#64748b]">
                    Owner name
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="syam"
                    className="w-full bg-transparent border-none p-0 text-sm focus:outline-none focus:ring-0 text-[#0f172a]"
                  />
                </div>

                {/* Store Category Select Box */}
                <div className="relative border border-[#cbd5e1] rounded px-3 pt-2.5 pb-2 bg-white">
                  <label className="absolute top-[-9px] left-3 bg-white px-1 text-[10px] font-bold text-[#64748b]">
                    Store category
                  </label>
                  <select
                    value={softwareType}
                    onChange={(e) => setSoftwareType(e.target.value)}
                    className="w-full bg-transparent border-none p-0 text-sm focus:outline-none focus:ring-0 text-[#0f172a] appearance-none"
                  >
                    <option value="grocery">Grocery & Kirana</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="bakery">Bakery</option>
                    <option value="clothing">Clothing & Apparel</option>
                    <option value="other">Other Store</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400">
                    ▼
                  </div>
                </div>

                {/* Store Logo Row Upload */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#64748b] block">Store Logo</span>
                  <div className="flex items-center gap-3">
                    <div 
                      onClick={() => logoInputRef.current?.click()}
                      className="w-14 h-14 border border-[#cbd5e1] rounded bg-[#f8fafc] flex items-center justify-center cursor-pointer hover:bg-neutral-50 transition-colors overflow-hidden"
                    >
                      <input 
                        type="file" 
                        ref={logoInputRef}
                        onChange={handleLogoFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      {logoUrl ? (
                        <img src={logoUrl} alt="Store logo" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-5 h-5 text-[#64748b]" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-4 py-2 border border-[#cbd5e1] text-xs font-semibold rounded bg-white text-[#2d3748] hover:bg-neutral-50 shadow-sm cursor-pointer"
                    >
                      Upload
                    </button>
                  </div>
                </div>

                {/* Favicon URL Input Box */}
                <div className="relative border border-[#cbd5e1] rounded px-3 pt-3 pb-2 focus-within:border-neutral-400 bg-white">
                  <label className="absolute top-[-9px] left-3 bg-white px-1 text-[10px] font-bold text-[#64748b]">
                    Favicon URL
                  </label>
                  <input
                    type="text"
                    value={faviconUrl}
                    onChange={(e) => setFaviconUrl(e.target.value)}
                    placeholder="https://example.com/favicon.ico"
                    className="w-full bg-transparent border-none p-0 text-sm focus:outline-none focus:ring-0 text-[#0f172a]"
                  />
                </div>
              </div>

              <hr className="border-[#cbd5e1]" />

              {/* SECTION B: STORE STATUS CONFIGURATION BUTTONS */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#64748b] block">Store status</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => { setIsLive(true); setIsTestingMode(false); }}
                    className={`px-5 py-2 rounded text-sm font-medium border transition-all cursor-pointer ${
                      isLive && !isTestingMode
                        ? "bg-[#10b981] border-[#10b981] text-white font-semibold"
                        : "bg-white border-[#cbd5e1] text-[#2d3748] hover:bg-neutral-50"
                    }`}
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsLive(false); setIsTestingMode(false); }}
                    className={`px-5 py-2 rounded text-sm font-medium border transition-all cursor-pointer ${
                      !isLive && !isTestingMode
                        ? "bg-[#10b981] border-[#10b981] text-white font-semibold"
                        : "bg-white border-[#cbd5e1] text-[#2d3748] hover:bg-neutral-50"
                    }`}
                  >
                    Closed
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsLive(true); setIsTestingMode(true); }}
                    className={`px-5 py-2 rounded text-sm font-medium border transition-all cursor-pointer ${
                      isTestingMode
                        ? "bg-[#10b981] border-[#10b981] text-white font-semibold"
                        : "bg-white border-[#cbd5e1] text-[#2d3748] hover:bg-neutral-50"
                    }`}
                  >
                    Testing
                  </button>
                </div>
              </div>

              <hr className="border-[#cbd5e1]" />

              {/* SECTION C: CONTACT INFORMATION */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#334155] uppercase tracking-wider text-[11px]">
                  Contact info
                </h3>

                {/* Store Email Box */}
                <div className="relative border border-[#cbd5e1] rounded px-3 pt-3 pb-2 focus-within:border-neutral-400 bg-white">
                  <label className="absolute top-[-9px] left-3 bg-white px-1 text-[10px] font-bold text-[#64748b]">
                    Store email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="shamsaifudheen@gmail.com"
                    className="w-full bg-transparent border-none p-0 text-sm focus:outline-none focus:ring-0 text-[#0f172a]"
                    required
                  />
                </div>

                {/* Optional Store Phone Line Opener Toggle */}
                <button
                  type="button"
                  onClick={() => setPhone(phone ? "" : "+91")}
                  className="text-xs text-[#64748b] hover:text-black font-semibold flex items-center gap-1 cursor-pointer"
                >
                  + Add store phone
                </button>

                {/* WhatsApp Connection Line */}
                <div className="relative border border-[#cbd5e1] rounded px-3 pt-3 pb-2 focus-within:border-neutral-400 bg-white">
                  <label className="absolute top-[-9px] left-3 bg-white px-1 text-[10px] font-bold text-[#64748b]">
                    WhatsApp number
                  </label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+917736815424"
                    className="w-full bg-transparent border-none p-0 text-sm focus:outline-none focus:ring-0 text-[#0f172a]"
                  />
                </div>
              </div>

              <hr className="border-[#cbd5e1]" />

              {/* SECTION D: STORE PHYSICAL ADDRESS */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#334155] uppercase tracking-wider text-[11px]">
                  Store address
                </h3>

                <div className="relative border border-[#cbd5e1] rounded px-3 pt-3 pb-2 focus-within:border-neutral-400 bg-white">
                  <label className="absolute top-[-9px] left-3 bg-white px-1 text-[10px] font-bold text-[#64748b]">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main St, City, State, PIN"
                    className="w-full bg-transparent border-none p-0 text-sm focus:outline-none focus:ring-0 text-[#0f172a]"
                  />
                </div>
              </div>

              <hr className="border-[#cbd5e1]" />

              {/* SECTION E: LOCALIZATION CRITERIA SETTINGS */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#334155] uppercase tracking-wider text-[11px]">
                  Localization
                </h3>

                {/* Currency Selection Dropdown */}
                <div className="relative border border-[#cbd5e1] rounded px-3 pt-2.5 pb-2 bg-white">
                  <label className="absolute top-[-9px] left-3 bg-white px-1 text-[10px] font-bold text-[#64748b]">
                    Select currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-transparent border-none p-0 text-sm focus:outline-none appearance-none text-[#0f172a]"
                  >
                    <option value="India — ₹ INR">India — ₹ INR</option>
                    <option value="US — $ USD">US — $ USD</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400">
                    ▼
                  </div>
                </div>

                {/* Timezone Selection Dropdown */}
                <div className="relative border border-[#cbd5e1] rounded px-3 pt-2.5 pb-2 bg-white">
                  <label className="absolute top-[-9px] left-3 bg-white px-1 text-[10px] font-bold text-[#64748b]">
                    Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-transparent border-none p-0 text-sm focus:outline-none appearance-none text-[#0f172a]"
                  >
                    <option value="India (IST)">India (IST)</option>
                    <option value="GMT">GMT (0:00)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400">
                    ▼
                  </div>
                </div>

                {/* Language Selection Dropdown */}
                <div className="relative border border-[#cbd5e1] rounded px-3 pt-2.5 pb-2 bg-white">
                  <label className="absolute top-[-9px] left-3 bg-white px-1 text-[10px] font-bold text-[#64748b]">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-transparent border-none p-0 text-sm focus:outline-none appearance-none text-[#0f172a]"
                  >
                    <option value="English">English</option>
                    <option value="Malayalam">Malayalam</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400">
                    ▼
                  </div>
                </div>
              </div>

              <hr className="border-[#cbd5e1]" />

              {/* SECTION F: DOMAIN SUB-BLOCK PLATFORM INFO */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#334155] uppercase tracking-wider text-[11px]">
                  Domain
                </h3>

                <div className="relative border border-[#cbd5e1] rounded px-3 pt-3 pb-2 bg-[#f8fafc] flex items-center justify-between gap-4">
                  <label className="absolute top-[-9px] left-3 bg-white px-1 text-[10px] font-bold text-[#64748b]">
                    Store URL
                  </label>
                  <span className="text-sm font-medium text-[#334155] truncate select-all">
                    {currentStoreUrl}
                  </span>
                  <a 
                    href={`https://${currentStoreUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-black p-0.5 flex-shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <hr className="border-[#cbd5e1]" />

              {/* SECTION G: OWNERSHIP TRANSFER ACTION ROW */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[#334155] uppercase tracking-wider text-[11px]">
                  Ownership
                </h3>
                <p className="text-xs text-[#64748b] mt-[-5px]">
                  Transfer store ownership to another user
                </p>
                <button
                  type="button"
                  onClick={handleTransferOwnership}
                  className="px-4 py-2 border border-[#cbd5e1] text-xs font-semibold rounded bg-white text-neutral-800 hover:bg-neutral-50 shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Change Owner</span>
                </button>
              </div>

              <hr className="border-[#cbd5e1]" />

              {/* SECTION H: REAL-TIME INCOMING ORDER NOTIFICATION ALERTS TOGGLES */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-[#334155] uppercase tracking-wider text-[11px]">
                    New order alerts
                  </h3>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    Instantly notify you when a new order arrives. Alert repeats every 10 seconds until acknowledged.
                  </p>
                </div>

                <div className="border border-[#e2e8f0] rounded bg-white divide-y divide-[#e2e8f0]">
                  {/* Sound Toggle Row */}
                  <div className="flex items-center justify-between p-4 gap-4">
                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-[#0f172a] block">Sound (siren)</span>
                      <span className="text-xs text-[#64748b] block">Plays a loud siren on every new order.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSoundAlertsEnabled(!soundAlertsEnabled)}
                      className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
                        soundAlertsEnabled ? "bg-[#10b981]" : "bg-neutral-200"
                      }`}
                    >
                      <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                        soundAlertsEnabled ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                  </div>

                  {/* Vibration Toggle Row */}
                  <div className="flex items-center justify-between p-4 gap-4">
                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-[#0f172a] block">Vibration</span>
                      <span className="text-xs text-[#64748b] block">Vibrates your phone on every new order (mobile only).</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVibrationAlertsEnabled(!vibrationAlertsEnabled)}
                      className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
                        vibrationAlertsEnabled ? "bg-[#10b981]" : "bg-neutral-200"
                      }`}
                    >
                      <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                        vibrationAlertsEnabled ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Trigger Alarm Test Function Block */}
                <button
                  type="button"
                  onClick={handleTestAlert}
                  className="px-4 py-2 border border-[#cbd5e1] text-xs font-semibold rounded bg-white text-neutral-800 hover:bg-neutral-50 shadow-sm cursor-pointer"
                >
                  Test alert
                </button>
              </div>

              <hr className="border-[#cbd5e1]" />

              {/* SECTION I: CRITICAL DATA DELETION DESTRUCTIVE PANEL */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wider text-[11px]">
                  Danger zone
                </h3>
                <p className="text-xs text-[#64748b] mt-[-5px]">
                  Permanently delete your store. This action cannot be undone.
                </p>
                <button
                  type="button"
                  onClick={handleDeleteStore}
                  className="px-4 py-2.5 bg-[#ef4444] text-white text-xs font-bold rounded hover:bg-red-600 shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Store</span>
                </button>
              </div>

              {/* GLOBAL SUBMIT STATE ACTION BUTTON FLOATER ROW */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 bg-[#10b981] text-white text-xs font-bold uppercase tracking-wider rounded shadow hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  {updating ? "Saving Parameters..." : "Save Settings"}
                </button>
              </div>

            </form>
          )}

          {/* FALLBACK INFO PLACEHOLDERS FOR ALTERNATIVE SETTINGS SECTION VIEWS */}
          {settingsSubTab !== "general" && (
            <div className="bg-white border border-[#e2e8f0] rounded p-12 text-center text-neutral-400 text-xs font-medium max-w-3xl">
              {settingsSubTab.charAt(0).toUpperCase() + settingsSubTab.slice(1)} panel details are handled within your nested structural tabs layout block.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
