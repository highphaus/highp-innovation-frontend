import { useState, useEffect } from "react";
import { X, User, Phone, MapPin, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";

export default function CustomerProfileDrawer({ isOpen, onClose, storeSlug, theme }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen]);

  const fetchProfile = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    const token = localStorage.getItem(`customerToken_${storeSlug}`);

    try {
      const res = await axios.get("/api/customers/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setName(res.data.name || "");
      setEmail(res.data.email || "");
      setPhone(res.data.phone || "");
      setAddress(res.data.address || "");
    } catch (err) {
      setErrorMsg("Failed to retrieve profile credentials from the database.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");
    const token = localStorage.getItem(`customerToken_${storeSlug}`);

    try {
      const res = await axios.put(
        "/api/customers/profile",
        { name, phone, address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local storage representation
      const storedUser = JSON.parse(localStorage.getItem(`customerUser_${storeSlug}`) || "{}");
      storedUser.name = res.data.name;
      storedUser.phone = res.data.phone;
      localStorage.setItem(`customerUser_${storeSlug}`, JSON.stringify(storedUser));

      // Trigger window update for header
      window.dispatchEvent(new Event("storage"));

      setSuccessMsg("Profile parameters saved successfully!");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update profile parameters.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex justify-end animate-fade-in font-sans">
      <div 
        className="w-full max-w-md bg-white border-l border-[#F0EEEB] h-full flex flex-col justify-between shadow-2xl relative animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-6 border-b border-[#F5F5F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 ${theme.lightBg} rounded-xl flex items-center justify-center`}>
              <User className={`w-4 h-4 ${theme.primary}`} />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">Your Profile</h2>
              <p className="text-[9px] text-[#737373] uppercase tracking-widest font-black mt-0.5">Manage Details & Shipping</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-900 transition-colors p-1.5 hover:bg-neutral-50 rounded-xl"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center py-24 text-neutral-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#D03D56] mb-3" />
              <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Syncing profile...</span>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 text-red-800 text-[11px] font-semibold">
                  <AlertCircle className="w-4.5 h-4.5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2.5 text-emerald-800 text-[11px] font-semibold">
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    required type="text"
                    placeholder="e.g. John Doe"
                    className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-semibold"
                    value={name} onChange={e => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email Address (Read-only) */}
              <div>
                <label className="block text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Email Address (Primary Account ID)</label>
                <input
                  readOnly type="email"
                  className="w-full bg-neutral-50 border border-[#F0EEEB] text-neutral-450 px-4 py-2.5 text-xs rounded-xl cursor-not-allowed font-medium"
                  value={email}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-semibold"
                    value={phone} onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Shipping / Delivery Address */}
              <div>
                <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Delivery Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                  <textarea
                    rows={4}
                    placeholder="Enter your street address, building, floor, flat details..."
                    className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-semibold resize-none"
                    value={address} onChange={e => setAddress(e.target.value)}
                  />
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit" disabled={saving}
                className="w-full py-3.5 bg-[#D03D56] hover:bg-[#3F0712] text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60 cursor-pointer"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>Save Profile Details →</span>
                )}
              </button>

            </form>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-[#F5F5F0] bg-[#FAFAFA] text-center">
          <p className="text-[9px] text-[#737373] uppercase tracking-widest font-black">
            HighP Platform · customer ledger
          </p>
        </div>
      </div>
    </div>
  );
}
