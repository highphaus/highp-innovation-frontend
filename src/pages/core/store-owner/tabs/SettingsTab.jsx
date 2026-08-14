import React, { useRef, useState } from "react";
import { 
  Settings, 
  CreditCard, 
  Wallet, 
  Truck, 
  CheckSquare, 
  Image as ImageIcon, 
  Camera, 
  RefreshCw,
  ExternalLink,
  Trash2,
  Sparkles,
  ShieldCheck,
  FileSpreadsheet,
  Layers,
  Sliders,
  Bell,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Building,
  AlertTriangle,
  CheckCircle,
  Plus
} from "lucide-react";

export default function SettingsTab({
  name,
  setName,
  email,
  setEmail,
  ownerName,
  setOwnerName,
  tagline,
  setTagline,
  softwareType,
  setSoftwareType,
  subscriptionPlan,
  ordersCount,
  logoUrl,
  setLogoUrl,
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
  alertSoundType,
  setAlertSoundType,
  settingsSubTab,
  setSettingsSubTab,
  updating,
  errorMsg,
  successMsg,
  slug,
  
  codEnabled,
  setCodEnabled,
  selfPickup,
  setSelfPickup,
  dineInEnabled,
  setDineInEnabled,
  upiId,
  setUpiId,
  upiEnabled,
  setUpiEnabled,
  deliveryFee,
  setDeliveryFee,
  gstTaxRate,
  setGstTaxRate,
  otherChargesAmount,
  setOtherChargesAmount,
  otherChargesLabel,
  setOtherChargesLabel,
  checkoutMode,
  setCheckoutMode,
  storeIsOpen,
  setStoreIsOpen,
  handleToggleStoreOpen,
  busyModeActive,
  setBusyModeActive,
  busyModeMessage,
  setBusyModeMessage,
  minOrderAmount,
  setMinOrderAmount,
  freeDeliveryAbove,
  setFreeDeliveryAbove,
  estimatedDeliveryTime,
  setEstimatedDeliveryTime,
  bankAccountHolder,
  setBankAccountHolder,
  bankName,
  setBankName,
  bankAccountNumber,
  setBankAccountNumber,
  bankIfsc,
  setBankIfsc,

  handleUpdateProfile,
  handleLogoFileChange,
  handleTransferOwnership,
  handleTestAlert,
  handleDeleteStore
}) {
  const logoInputRef = useRef(null);

  const [busyPresets, setBusyPresets] = useState(() => {
    try {
      const stored = localStorage.getItem(`busy_presets_${slug || "store"}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return [
      "Deliver Agents are busy so it takes 1 hour delay to reach",
      "High order volume! Deliveries may take 15-20 mins longer.",
      "Heavy rain in area! Order fulfillment may be delayed by 30 mins."
    ];
  });

  const handleAddBusyPreset = () => {
    if (!busyModeMessage || !busyModeMessage.trim()) return;
    const cleanMsg = busyModeMessage.trim();
    const currentList = Array.isArray(busyPresets) ? busyPresets : [];
    if (currentList.includes(cleanMsg)) return;
    const next = [cleanMsg, ...currentList];
    setBusyPresets(next);
    try { localStorage.setItem(`busy_presets_${slug || "store"}`, JSON.stringify(next)); } catch (_) {}
  };

  const handleDeleteBusyPreset = (presetToDelete) => {
    const currentList = Array.isArray(busyPresets) ? busyPresets : [];
    const next = currentList.filter(p => p !== presetToDelete);
    setBusyPresets(next);
    try { localStorage.setItem(`busy_presets_${slug || "store"}`, JSON.stringify(next)); } catch (_) {}
    if (busyModeMessage === presetToDelete) {
      setBusyModeMessage(next[0] || "");
    }
  };

  const [internalSubTab, setInternalSubTab] = useState("general");
  const currentTab = settingsSubTab || internalSubTab;

  const handleSelectSubTab = (tabId) => {
    setInternalSubTab(tabId);
    if (typeof setSettingsSubTab === "function") {
      setSettingsSubTab(tabId);
    }
  };

  const normTab = (currentTab || "").toLowerCase().trim();
  let activeSubTab = "general";
  if (normTab === "operations" || normTab === "status" || normTab === "store-status" || normTab === "operating") {
    activeSubTab = "operations";
  } else if (
    normTab === "shipping" || 
    normTab.includes("delivery") || 
    normTab.includes("rule") || 
    normTab === "checkout"
  ) {
    activeSubTab = "shipping";
  } else if (normTab === "payments" || normTab === "bank" || normTab === "banking") {
    activeSubTab = "payments";
  } else if (normTab === "alerts" || normTab === "notifications" || normTab === "sound") {
    activeSubTab = "alerts";
  } else if (normTab === "banners" || normTab === "promo") {
    activeSubTab = "banners";
  } else {
    activeSubTab = "general";
  }

  const subTabsList = [
    { id: "general", label: "General", icon: Settings },
    { id: "operations", label: "Store Status", icon: Clock },
    { id: "shipping", label: "Delivery & Rules", icon: Truck },
    { id: "payments", label: "Payments & Bank", icon: Wallet },
    { id: "alerts", label: "Sound & Alerts", icon: Bell },
    { id: "banners", label: "Banners", icon: ImageIcon },
  ];

  return (
    <div className="w-full font-sans text-[#2d3748] max-w-6xl mx-auto pb-16 px-1">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#e2e8f0]">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Store Settings</h1>
          <p className="text-xs text-[#64748b]">Manage store profile, operating hours, delivery rules, and payment options.</p>
        </div>
        <span className="text-xs font-bold bg-[#f1f5f9] text-[#334155] px-3 py-1 rounded-full border border-neutral-200 uppercase tracking-wide">
          Slug: {slug}
        </span>
      </div>

      {/* PERSISTENT UPDATE CONFIRMATION BANNER */}
      {successMsg && (
        <div className="mb-6 bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3.5 rounded-2xl flex items-center gap-3 shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900">Changes Saved &amp; Updated!</h4>
            <p className="text-xs font-medium text-emerald-800 mt-0.5">{successMsg}</p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 bg-red-50 border border-red-300 text-red-900 px-4 py-3.5 rounded-2xl flex items-center gap-3 shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-red-900">Update Error</h4>
            <p className="text-xs font-medium text-red-800 mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* LEFT TAB NAVIGATION */}
        <aside className="w-full md:w-56 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 gap-1 border-b md:border-b-0 md:border-r border-[#e2e8f0] flex-shrink-0 scrollbar-none">
          {subTabsList.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectSubTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#F7EBEF] text-[#D03D56] border-l-3 border-[#D03D56] font-extrabold shadow-2xs"
                    : "text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#D03D56]" : "text-[#64748b]"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 w-full bg-transparent space-y-8">
          
          {/* SUB-TAB 1: GENERAL STORE IDENTITY & CONTACT PARAMETERS */}
          {activeSubTab === "general" && (
            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-3xl">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-[#0f172a]">General Profile</h2>
                <p className="text-xs text-[#64748b]">Configure your store branding and contact details.</p>
              </div>

              {/* STORE IDENTITY BOX */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold text-[#334155] uppercase tracking-wider">Store Identity</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">Shop / Store Name (Shown to Customers) *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Ramu Foods & Mandi"
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="w-full border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D03D56] font-semibold" 
                      required 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">Tagline / Slogan</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Authentic Wood-fired Delicacies"
                      value={tagline} 
                      onChange={(e) => setTagline(e.target.value)} 
                      className="w-full border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D03D56]" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">Shop Owner / Manager Personal Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Ramu (Owner Name)"
                      value={ownerName} 
                      onChange={(e) => setOwnerName(e.target.value)} 
                      className="w-full border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D03D56]" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">Store Type / Software Vertical</label>
                    <select 
                      value={softwareType} 
                      onChange={(e) => setSoftwareType(e.target.value)} 
                      className="w-full border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D03D56] bg-white font-medium"
                    >
                      <option value="restaurant">Restaurant &amp; Dining</option>
                      <option value="bakery">Bakery &amp; Confectionery</option>
                      <option value="grocery">Grocery &amp; Supermarket</option>
                      <option value="retail">Retail &amp; Fashion</option>
                    </select>
                  </div>
                </div>

                {/* LOGO UPLOADER */}
                <div className="space-y-2 pt-2 border-t border-[#f1f5f9]">
                  <span className="text-xs font-bold text-[#334155] block">Store Brand Logo</span>
                  <div className="flex items-center gap-4">
                    <div onClick={() => logoInputRef.current?.click()} className="w-16 h-16 border-2 border-dashed border-[#cbd5e1] rounded-xl bg-[#f8fafc] flex items-center justify-center cursor-pointer overflow-hidden relative group">
                      <input type="file" ref={logoInputRef} onChange={handleLogoFileChange} accept="image/*" className="hidden" />
                      {logoUrl ? (
                        <img src={logoUrl} alt="Store logo" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-6 h-6 text-[#64748b]" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => logoInputRef.current?.click()} className="px-4 py-2 border border-[#cbd5e1] text-xs font-bold rounded-lg bg-white text-[#2d3748] shadow-2xs cursor-pointer hover:bg-neutral-50">
                          Upload New Logo
                        </button>

                        {logoUrl && (
                          <button 
                            type="button" 
                            onClick={() => setLogoUrl?.("")} 
                            className="px-3 py-2 border border-red-200 text-xs font-bold rounded-lg bg-red-50 text-red-600 shadow-2xs cursor-pointer hover:bg-red-100 flex items-center gap-1.5 transition-all"
                            title="Delete store logo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Logo</span>
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-[#64748b]">Recommended size: 500x500 px PNG or JPG</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CONTACT & LOCATION CARD */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold text-[#334155] uppercase tracking-wider">Contact &amp; Location Parameters</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">Contact Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+91 98765 43210"
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      className="w-full border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D03D56]" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">WhatsApp Ordering Number</label>
                    <input 
                      type="tel" 
                      placeholder="+91 98765 43210"
                      value={whatsappNumber} 
                      onChange={(e) => setWhatsappNumber(e.target.value)} 
                      className="w-full border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D03D56]" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#334155]">Store Full Address</label>
                  <textarea 
                    rows={2}
                    placeholder="Street address, building name, area, city, pincode..."
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    className="w-full border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D03D56] resize-none" 
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit" 
                  disabled={updating} 
                  className="px-6 py-3 bg-[#D03D56] hover:bg-[#a02240] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {updating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Updating Settings...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span>Save General Settings</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* SUB-TAB 2: OPERATING STATUS & RUSH HOUR CONTROL */}
          {activeSubTab === "operations" && (
            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-3xl">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-[#0f172a]">Store Status &amp; Rush Hour Controls</h2>
                <p className="text-xs text-[#64748b]">Manage store open/closed state, busy mode notices, and estimated delivery times.</p>
              </div>

              {/* STORE OPEN STATUS CARD */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#0f172a]">Store Live Status</h3>
                    <p className="text-xs text-[#64748b]">Switch your online storefront between Open Now 🟢 and Temporarily Closed 🔴.</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const newVal = storeIsOpen === false ? true : false;
                      if (handleToggleStoreOpen) {
                        handleToggleStoreOpen(newVal);
                      } else if (setStoreIsOpen) {
                        setStoreIsOpen(newVal);
                      }
                    }}
                    className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors cursor-pointer ${storeIsOpen !== false ? "bg-emerald-600" : "bg-red-600"}`}
                  >
                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transition-transform ${storeIsOpen !== false ? "translate-x-7" : "translate-x-0"}`} />
                  </button>
                </div>
                <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] text-xs font-bold">
                  Currently: <span className={storeIsOpen !== false ? "text-emerald-700" : "text-red-600"}>{storeIsOpen !== false ? "🟢 Open for Orders" : "🔴 Store is Closed"}</span>
                </div>
              </div>

              {/* RUSH HOUR BUSY MODE CARD */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#0f172a]">Busy Mode (Rush Hour Notice)</h3>
                    <p className="text-xs text-[#64748b]">Enable during heavy order volumes to warn customers of potential delays.</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setBusyModeActive?.(!busyModeActive)}
                    className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors cursor-pointer ${busyModeActive ? "bg-amber-600" : "bg-neutral-300"}`}
                  >
                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transition-transform ${busyModeActive ? "translate-x-7" : "translate-x-0"}`} />
                  </button>
                </div>

                {busyModeActive && (
                  <div className="space-y-4 pt-3 border-t border-[#f1f5f9]">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#334155]">Active Custom Announcement Banner Text</label>
                      <input
                        type="text"
                        placeholder="e.g. Deliver Agents are busy so it takes 1 hour delay to reach..."
                        value={busyModeMessage}
                        onChange={(e) => setBusyModeMessage(e.target.value)}
                        className="w-full border border-[#cbd5e1] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D03D56] font-medium"
                      />
                    </div>

                    {/* MULTIPLE PRESET ANNOUNCEMENTS MANAGER */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#334155]">Saved Custom Announcement Templates</span>
                        {busyModeMessage && busyModeMessage.trim() && !busyPresets.includes(busyModeMessage.trim()) && (
                          <button
                            type="button"
                            onClick={handleAddBusyPreset}
                            className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 px-2.5 py-1 rounded-md hover:bg-emerald-100 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Save Current as Preset</span>
                          </button>
                        )}
                      </div>

                      <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                        {busyPresets.map((preset, idx) => {
                          const isSelected = busyModeMessage === preset;
                          return (
                            <div 
                              key={idx}
                              className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                                isSelected ? "bg-[#F7EBEF] border-[#D03D56] text-[#0f172a] shadow-xs" : "bg-[#f8fafc] border-[#e2e8f0] text-neutral-700 hover:bg-neutral-100"
                              }`}
                            >
                              <div 
                                onClick={() => setBusyModeMessage(preset)}
                                className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                              >
                                <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? "bg-[#D03D56]" : "bg-neutral-400"}`} />
                                <span className={`font-semibold truncate ${isSelected ? "text-[#D03D56] font-bold" : ""}`}>{preset}</span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setBusyModeMessage(preset)}
                                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
                                    isSelected ? "bg-[#D03D56] text-white" : "bg-white border border-neutral-300 text-neutral-800 hover:bg-neutral-200"
                                  }`}
                                >
                                  {isSelected ? "Active ✓" : "Use This"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteBusyPreset(preset)}
                                  className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete announcement template"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ESTIMATED DELIVERY TIME */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-[#0f172a]">Estimated Delivery Time Badge</h3>
                <div className="space-y-1.5 max-w-sm">
                  <label className="text-xs font-bold text-[#334155]">Delivery Time Label</label>
                  <input
                    type="text"
                    placeholder="e.g. 30-45 mins"
                    value={estimatedDeliveryTime}
                    onChange={(e) => setEstimatedDeliveryTime(e.target.value)}
                    className="w-full border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D03D56] font-semibold"
                  />
                  <p className="text-[10px] text-[#64748b]">This badge is shown in the storefront header for all customers.</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit" 
                  disabled={updating} 
                  className="px-6 py-3 bg-[#D03D56] hover:bg-[#a02240] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {updating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Updating Settings...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span>Save Status Settings</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* SUB-TAB 3: DELIVERY & CHECKOUT RULES */}
          {activeSubTab === "shipping" && (
            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-3xl">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-[#0f172a]">Delivery &amp; Checkout Rules</h2>
                <p className="text-xs text-[#64748b]">Configure delivery charges, minimum order limits, and checkout mode.</p>
              </div>

              {/* PRICING & THRESHOLDS CARD */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold text-[#334155] uppercase tracking-wider">Delivery &amp; Order Thresholds</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">Standard Delivery Fee (₹)</label>
                    <input 
                      type="number" 
                      value={deliveryFee !== undefined && deliveryFee !== null ? deliveryFee : ""} 
                      onChange={(e) => setDeliveryFee?.(e.target.value === "" ? "" : Number(e.target.value))} 
                      className="w-full border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D03D56] font-mono font-bold" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">Minimum Order Amount (₹)</label>
                    <input 
                      type="number" 
                      value={minOrderAmount !== undefined && minOrderAmount !== null ? minOrderAmount : ""} 
                      onChange={(e) => setMinOrderAmount?.(e.target.value === "" ? "" : Number(e.target.value))} 
                      className="w-full border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D03D56] font-mono font-bold" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">Free Delivery Above (₹)</label>
                    <input 
                      type="number" 
                      value={freeDeliveryAbove !== undefined && freeDeliveryAbove !== null ? freeDeliveryAbove : ""} 
                      onChange={(e) => setFreeDeliveryAbove?.(e.target.value === "" ? "" : Number(e.target.value))} 
                      className="w-full border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D03D56] font-mono font-bold" 
                    />
                  </div>
                </div>
              </div>

              {/* TAXES & OTHER CHARGES CONFIGURATION CARD */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-2xs space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-[#334155] uppercase tracking-wider">GST Tax &amp; Additional Fees Customization</h3>
                  <p className="text-xs text-[#64748b]">Configure GST tax rate % and custom service/packaging fees applied dynamically on checkout &amp; order receipts.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">GST Tax Rate (%)</label>
                    <input 
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={gstTaxRate !== undefined && gstTaxRate !== null ? gstTaxRate : 0} 
                      onChange={(e) => setGstTaxRate(e.target.value === "" ? "" : Number(e.target.value))} 
                      className="w-full border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D03D56] font-mono font-bold" 
                    />
                    <span className="text-[9px] text-[#64748b] block">Set to 0 for no tax.</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">Other Fee Amount (₹)</label>
                    <input 
                      type="number"
                      min="0"
                      placeholder="0"
                      value={otherChargesAmount !== undefined && otherChargesAmount !== null ? otherChargesAmount : ""} 
                      onChange={(e) => setOtherChargesAmount?.(e.target.value === "" ? "" : Number(e.target.value))} 
                      className="w-full border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D03D56] font-mono font-bold" 
                    />
                    <span className="text-[9px] text-[#64748b] block">Optional packaging/service fee.</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">Fee Label Description</label>
                    <input 
                      type="text"
                      placeholder="Packaging & Service Fee"
                      value={otherChargesLabel || ""} 
                      onChange={(e) => setOtherChargesLabel?.(e.target.value)} 
                      className="w-full border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D03D56] font-medium" 
                    />
                    <span className="text-[9px] text-[#64748b] block">Label shown on order receipts.</span>
                  </div>
                </div>
              </div>

              {/* FULFILLMENT TOGGLES */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-2xs space-y-4 divide-y divide-[#f1f5f9]">
                <div className="flex items-center justify-between pb-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#0f172a]">Cash on Delivery (COD)</h4>
                    <p className="text-[11px] text-[#64748b]">Allow customers to pay via cash upon delivery.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCodEnabled?.(!codEnabled)}
                    className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${codEnabled !== false ? "bg-[#D03D56]" : "bg-neutral-200"}`}
                  >
                    <div className={`bg-white w-5 h-5 rounded-full shadow transition-transform ${codEnabled !== false ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#0f172a]">UPI &amp; Online Payment</h4>
                    <p className="text-[11px] text-[#64748b]">Allow customers to pay via UPI QR code or Online Payment apps at checkout.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUpiEnabled?.(!upiEnabled)}
                    className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${upiEnabled !== false ? "bg-[#D03D56]" : "bg-neutral-200"}`}
                  >
                    <div className={`bg-white w-5 h-5 rounded-full shadow transition-transform ${upiEnabled !== false ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#0f172a]">Self-Pickup / Takeaway</h4>
                    <p className="text-[11px] text-[#64748b]">Allow customers to pick up orders directly from the store.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelfPickup?.(!selfPickup)}
                    className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${selfPickup ? "bg-[#D03D56]" : "bg-neutral-200"}`}
                  >
                    <div className={`bg-white w-5 h-5 rounded-full shadow transition-transform ${selfPickup ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#0f172a]">Dine-In / Eat in Shop</h4>
                    <p className="text-[11px] text-[#64748b]">Allow customers to place orders to eat directly inside the shop/restaurant.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDineInEnabled?.(!dineInEnabled)}
                    className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${dineInEnabled !== false ? "bg-[#D03D56]" : "bg-neutral-200"}`}
                  >
                    <div className={`bg-white w-5 h-5 rounded-full shadow transition-transform ${dineInEnabled !== false ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>
              </div>

              {/* CHECKOUT DISPATCH MODE */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold text-[#0f172a]">Order Submission Mode</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div 
                    onClick={() => setCheckoutMode?.("website")}
                    className={`border p-4 rounded-xl cursor-pointer transition-all ${checkoutMode === "website" ? "border-[#D03D56] bg-[#F7EBEF]" : "border-[#cbd5e1] bg-white"}`}
                  >
                    <h5 className="text-xs font-bold text-[#0f172a]">🌐 Website Checkout</h5>
                    <p className="text-[11px] text-[#64748b] mt-1">Order is recorded in store database and customer is directed to order tracking page.</p>
                  </div>

                  <div 
                    onClick={() => setCheckoutMode?.("whatsapp")}
                    className={`border p-4 rounded-xl cursor-pointer transition-all ${checkoutMode === "whatsapp" ? "border-[#D03D56] bg-[#F7EBEF]" : "border-[#cbd5e1] bg-white"}`}
                  >
                    <h5 className="text-xs font-bold text-[#0f172a]">💬 Direct WhatsApp Checkout</h5>
                    <p className="text-[11px] text-[#64748b] mt-1">Order details and address are pre-formatted and sent directly to merchant's WhatsApp.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit" 
                  disabled={updating} 
                  className="px-6 py-3 bg-[#D03D56] hover:bg-[#a02240] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {updating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Updating Settings...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span>Save Delivery Rules</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* SUB-TAB 4: PAYMENTS & BANKING DETAILS */}
          {activeSubTab === "payments" && (
            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-3xl">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-[#0f172a]">Payments &amp; Bank Details</h2>
                <p className="text-xs text-[#64748b]">Configure your UPI VPA ID and bank account payout information.</p>
              </div>

              {/* UPI PAYMENTS CARD */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
                  <div>
                    <h3 className="text-xs font-bold text-[#334155] uppercase tracking-wider">UPI Online Payment Option</h3>
                    <p className="text-[11px] text-[#64748b] mt-0.5">Enable or disable UPI QR &amp; online payment option for customers on the checkout cart page.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      checked={upiEnabled} 
                      onChange={(e) => setUpiEnabled(e.target.checked)} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-[#cbd5e1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#cbd5e1] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D03D56]"></div>
                  </label>
                </div>

                <div className="space-y-1.5 max-w-md pt-1">
                  <label className="text-xs font-bold text-[#334155]">Merchant UPI VPA ID</label>
                  <input
                    type="text"
                    placeholder="e.g. merchantname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D03D56] font-mono font-bold"
                  />
                  <p className="text-[10px] text-[#64748b]">
                    {upiEnabled 
                      ? "✓ UPI option will be enabled and visible on the customer checkout cart page." 
                      : "✕ UPI option is currently disabled and hidden from customers at checkout."}
                  </p>
                </div>
              </div>

              {/* BANK PAYOUT ACCOUNT CARD */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold text-[#334155] uppercase tracking-wider">Bank Account Payout Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">Account Holder Name</label>
                    <input 
                      type="text" 
                      value={bankAccountHolder} 
                      onChange={(e) => setBankAccountHolder(e.target.value)} 
                      className="w-full border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D03D56]" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">Bank Name</label>
                    <input 
                      type="text" 
                      value={bankName} 
                      onChange={(e) => setBankName(e.target.value)} 
                      className="w-full border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D03D56]" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">Bank Account Number</label>
                    <input 
                      type="text" 
                      value={bankAccountNumber} 
                      onChange={(e) => setBankAccountNumber(e.target.value)} 
                      className="w-full border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D03D56] font-mono font-bold" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">IFSC Code</label>
                    <input 
                      type="text" 
                      value={bankIfsc} 
                      onChange={(e) => setBankIfsc(e.target.value)} 
                      className="w-full border border-[#cbd5e1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D03D56] font-mono font-bold uppercase" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit" 
                  disabled={updating} 
                  className="px-6 py-3 bg-[#D03D56] hover:bg-[#a02240] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {updating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Updating Settings...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span>Save Payment Details</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* SUB-TAB 5: SOUND & NOTIFICATION ALERTS */}
          {activeSubTab === "alerts" && (
            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-3xl">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-[#0f172a]">Sound &amp; Audio Notifications</h2>
                <p className="text-xs text-[#64748b]">Configure real-time audio chime and device vibration alerts for new incoming orders.</p>
              </div>

              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-2xs space-y-4 divide-y divide-[#f1f5f9]">
                <div className="flex items-center justify-between pb-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#0f172a]">Audio Ringtone Alert</h4>
                    <p className="text-[11px] text-[#64748b]">Play loud alert chime when a new customer order arrives.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSoundAlertsEnabled?.(!soundAlertsEnabled)}
                    className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${soundAlertsEnabled !== false ? "bg-[#D03D56]" : "bg-neutral-200"}`}
                  >
                    <div className={`bg-white w-5 h-5 rounded-full shadow transition-transform ${soundAlertsEnabled !== false ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#0f172a]">Device Vibration Alert</h4>
                    <p className="text-[11px] text-[#64748b]">Vibrate merchant mobile device on order dispatch events.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVibrationAlertsEnabled?.(!vibrationAlertsEnabled)}
                    className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${vibrationAlertsEnabled !== false ? "bg-[#D03D56]" : "bg-neutral-200"}`}
                  >
                    <div className={`bg-white w-5 h-5 rounded-full shadow transition-transform ${vibrationAlertsEnabled !== false ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>
              </div>

              {/* ALERT TONE SELECTION CARD */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold text-[#0f172a]">Select 100% Volume Alert Sound Ringtone</h4>
                <p className="text-[11px] text-[#64748b]">Ringtone sounds play continuously for 5 to 7 seconds at 100% full volume when a new order arrives.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                  <div
                    onClick={() => setAlertSoundType?.("new_order_voice")}
                    className={`border p-3.5 rounded-xl cursor-pointer transition-all ${
                      alertSoundType === "new_order_voice" || !alertSoundType 
                        ? "border-[#D03D56] bg-[#F7EBEF] text-[#0f172a]" 
                        : "border-[#cbd5e1] bg-white text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">👩‍💼 Female Voice</span>
                      <span className="text-[9px] font-black bg-white px-1.5 py-0.5 rounded border border-[#cbd5e1]">Speech</span>
                    </div>
                    <p className="text-[10px] text-neutral-500 font-medium">Plays chime + speaks "You have a new order!" in clear female voice (100% Vol).</p>
                  </div>

                  <div
                    onClick={() => setAlertSoundType?.("loud_alarm")}
                    className={`border p-3.5 rounded-xl cursor-pointer transition-all ${
                      alertSoundType === "loud_alarm" 
                        ? "border-[#D03D56] bg-[#F7EBEF] text-[#0f172a]" 
                        : "border-[#cbd5e1] bg-white text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">📢 Loud Order Alarm</span>
                      <span className="text-[9px] font-black bg-white px-1.5 py-0.5 rounded border border-[#cbd5e1]">6.5 Sec</span>
                    </div>
                    <p className="text-[10px] text-neutral-500 font-medium">Repeating 4-burst dual-tone order alarm (100% Vol).</p>
                  </div>

                  <div
                    onClick={() => setAlertSoundType?.("digital_chime")}
                    className={`border p-3.5 rounded-xl cursor-pointer transition-all ${
                      alertSoundType === "digital_chime" 
                        ? "border-[#D03D56] bg-[#F7EBEF] text-[#0f172a]" 
                        : "border-[#cbd5e1] bg-white text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">🔔 Digital Store Chime</span>
                      <span className="text-[9px] font-black bg-white px-1.5 py-0.5 rounded border border-[#cbd5e1]">5.5 Sec</span>
                    </div>
                    <p className="text-[10px] text-neutral-500 font-medium">3-pattern electronic melodic store chime (100% Vol).</p>
                  </div>

                  <div
                    onClick={() => setAlertSoundType?.("high_pitch")}
                    className={`border p-3.5 rounded-xl cursor-pointer transition-all ${
                      alertSoundType === "high_pitch" 
                        ? "border-[#D03D56] bg-[#F7EBEF] text-[#0f172a]" 
                        : "border-[#cbd5e1] bg-white text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">🚨 High-Pitch Ringer</span>
                      <span className="text-[9px] font-black bg-white px-1.5 py-0.5 rounded border border-[#cbd5e1]">7.0 Sec</span>
                    </div>
                    <p className="text-[10px] text-neutral-500 font-medium">Piercing high-frequency emergency bell (100% Vol).</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleTestAlert}
                  className="px-4 py-2 bg-neutral-100 text-neutral-800 text-xs font-bold rounded-xl border border-neutral-200 hover:bg-neutral-200 cursor-pointer"
                >
                  🔔 Test Sound Alert Chime
                </button>

                <button 
                  type="submit" 
                  disabled={updating} 
                  className="px-6 py-3 bg-[#D03D56] hover:bg-[#a02240] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {updating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Updating Settings...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span>Save Alert Settings</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* SUB-TAB 6: PROMOTIONAL BANNERS */}
          {activeSubTab === "banners" && (
            <div className="space-y-6 max-w-4xl">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-[#0f172a]">Promotional Storefront Banners</h2>
                <p className="text-sm text-[#64748b]">Manage hero banners and discount announcements on your storefront.</p>
              </div>

              <div className="bg-[#f8fafc] border border-dashed border-[#cbd5e1] rounded-2xl p-12 text-center text-sm text-[#64748b] font-medium space-y-4 shadow-2xs">
                <p>No active banners configured yet. Add promotional images to highlight offers.</p>
                <button type="button" className="text-xs font-bold bg-[#D03D56] text-white px-4 py-2.5 rounded-xl shadow-2xs hover:bg-[#3F0712] transition-opacity inline-flex items-center gap-1.5 cursor-pointer">
                  <Plus className="w-4 h-4" />
                  <span>Create New Banner</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}