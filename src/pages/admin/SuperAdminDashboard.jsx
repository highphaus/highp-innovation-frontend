import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, Loader2, AlertCircle, Trash2, 
  CheckCircle, XCircle, ArrowLeft, Mail, Lock, 
  ExternalLink, Layers, CreditCard, Calendar
} from "lucide-react";
import axios from "axios";

export default function SuperAdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isSuperAdmin") === "true";
  });
  
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [stores, setStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    setLoginSuccess("");

    const existingAdmins = JSON.parse(localStorage.getItem("superAdmins") || "[]");
    const isMatched = (loginEmail === "superadmin@highp.com" && loginPassword === "highpsupersecret") ||
                      existingAdmins.some(a => a.email === loginEmail && a.password === loginPassword);

    if (isMatched) {
      localStorage.setItem("isSuperAdmin", "true");
      setIsAuthenticated(true);
      setLoginLoading(false);
    } else {
      setLoginError("Invalid platform operator credentials.");
      setLoginLoading(false);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    setLoginSuccess("");

    if (loginPassword !== confirmPassword) {
      setLoginError("Passwords do not match.");
      setLoginLoading(false);
      return;
    }

    const existingAdmins = JSON.parse(localStorage.getItem("superAdmins") || "[]");
    if (existingAdmins.some(a => a.email === loginEmail) || loginEmail === "superadmin@highp.com") {
      setLoginError("This operator email is already registered.");
      setLoginLoading(false);
      return;
    }

    const newAdmin = { email: loginEmail, password: loginPassword };
    localStorage.setItem("superAdmins", JSON.stringify([...existingAdmins, newAdmin]));
    
    setLoginSuccess("Operator registered successfully! Toggle Sign In to access.");
    setLoginLoading(false);
    setLoginEmail("");
    setLoginPassword("");
    setConfirmPassword("");
  };

  const handleSignOut = () => {
    localStorage.removeItem("isSuperAdmin");
    setIsAuthenticated(false);
  };

  const fetchStores = async () => {
    setLoadingStores(true);
    setErrorMsg("");
    try {
      const res = await axios.get("/api/stores");
      setStores(res.data);
    } catch (err) {
      setErrorMsg("Failed to query platform store listings.");
    } finally {
      setLoadingStores(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStores();
    }
  }, [isAuthenticated]);

  const handleToggleApproval = async (storeId, currentStatus) => {
    setActionLoading(storeId);
    setErrorMsg("");
    try {
      const res = await axios.patch(`/api/stores/${storeId}/approve`, {
        isApproved: !currentStatus
      });
      setStores(stores.map(s => s._id === storeId ? res.data : s));
    } catch (err) {
      setErrorMsg("Failed to modify store approval status.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (!window.confirm("Are you sure you want to permanently delete this store and all its data? This cannot be undone.")) return;
    setActionLoading(storeId);
    setErrorMsg("");
    try {
      await axios.delete(`/api/stores/${storeId}`);
      setStores(stores.filter(s => s._id !== storeId));
    } catch (err) {
      setErrorMsg("Failed to delete store cluster.");
    } finally {
      setActionLoading(null);
    }
  };

  // 🔐 LOGIN / SIGNUP SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 selection:bg-neutral-800 selection:text-white font-sans antialiased">
        <div className="bg-white border border-[#F0EEEB] rounded-3xl p-8 max-w-sm w-full shadow-lg space-y-6 relative animate-fade-up">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 bg-[#F7EBEF] rounded-2xl flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-5 h-5 text-[#D03D56]" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-neutral-955 uppercase font-manrope">
              HP Super Admin
            </h2>
            <p className="text-[9px] text-[#737373] leading-relaxed uppercase tracking-wider font-bold">
              Operator Workspace Portal
            </p>
          </div>

          {/* TABS */}
          <div className="bg-[#FAFAFA] border border-[#F5F5F0] p-1 rounded-xl flex gap-1">
            <button
              type="button"
              onClick={() => { setIsSignUpMode(false); setLoginError(""); setLoginSuccess(""); }}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                !isSignUpMode 
                  ? "bg-[#D03D56] text-white shadow-sm" 
                  : "text-neutral-500 hover:text-neutral-850"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUpMode(true); setLoginError(""); setLoginSuccess(""); }}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                isSignUpMode 
                  ? "bg-[#D03D56] text-white shadow-sm" 
                  : "text-neutral-500 hover:text-neutral-850"
              }`}
            >
              Sign Up
            </button>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-705 text-[11px] font-semibold rounded-xl flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {loginSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-705 text-[11px] font-semibold rounded-xl flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{loginSuccess}</span>
            </div>
          )}

          <form onSubmit={isSignUpMode ? handleRegister : handleLogin} className="space-y-4">
            <div>
              <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Operator Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  required type="email"
                  placeholder="e.g. superadmin@highp.com"
                  className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-medium"
                  value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Operator Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  required type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-medium"
                  value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                />
              </div>
            </div>

            {isSignUpMode && (
              <div>
                <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    required type="password"
                    placeholder="••••••••"
                    className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-medium"
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button
              type="submit" disabled={loginLoading}
              className="w-full py-3 bg-[#D03D56] hover:bg-[#3F0712] active:scale-[0.98] text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60 cursor-pointer"
            >
              {loginLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <span>{isSignUpMode ? "Register Operator" : "Open Console Gateway"}</span>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link to="/" className="text-[10px] text-neutral-450 hover:text-neutral-900 transition-colors font-bold">
              ← Return to Platform Hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 📈 PLATFORM CONTROL PANEL
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans selection:bg-[#D03D56] selection:text-white pb-24">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 bg-white border-b border-[#F0EEEB] h-16 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#D03D56] rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-neutral-950 block">HighP Super Console</span>
              <span className="text-[9px] text-[#737373] font-bold uppercase tracking-widest block mt-0.5">Platform Controller</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleSignOut}
              className="text-[10px] font-black uppercase tracking-widest px-4.5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Dashboard */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 space-y-8 animate-fade-up">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: "Platform Nodes", val: stores.length, color: "text-neutral-900 bg-white" },
            { label: "Active Nodes", val: stores.filter(s => s.isApproved).length, color: "text-emerald-700 bg-white border-emerald-100" },
            { label: "Approval Queue", val: stores.filter(s => !s.isApproved).length, color: "text-amber-700 bg-white border-amber-100" }
          ].map((s, idx) => (
            <div key={idx} className="bg-white border border-[#F0EEEB] p-6 rounded-3xl space-y-1.5 shadow-sm">
              <span className="text-[9px] text-[#737373] uppercase tracking-widest font-black block">{s.label}</span>
              <span className="text-3xl font-black block text-neutral-950">{s.val}</span>
            </div>
          ))}
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-250 text-red-800 text-xs rounded-2xl flex items-start gap-3.5">
            <AlertCircle className="w-4.5 h-4.5 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Stores Table Listing */}
        <div className="bg-white border border-[#F0EEEB] rounded-3xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-[#F5F5F0] bg-[#FAFAFA] flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">Provisioned Tenants</h3>
              <p className="text-[9px] text-[#737373] uppercase tracking-widest font-black mt-0.5">Global Cluster Roster</p>
            </div>
            <button 
              onClick={fetchStores}
              className="text-[9px] font-black uppercase text-[#D03D56] hover:underline"
            >
              Refresh Ledgers
            </button>
          </div>

          {loadingStores ? (
            <div className="text-center py-24 text-neutral-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#D03D56] mx-auto mb-3" />
              <p className="text-[10px] font-black uppercase tracking-widest">Querying database ledgers...</p>
            </div>
          ) : stores.length === 0 ? (
            <div className="text-center py-20 text-neutral-450 text-xs font-bold">
              No store instances have been deployed on this platform node yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#F5F5F0] text-[9px] font-black text-[#737373] uppercase tracking-wider bg-[#FAFAFA]/50">
                    <th className="px-6 py-4">Workspace / Slug</th>
                    <th className="px-6 py-4">Software Type</th>
                    <th className="px-6 py-4">Subscription Plan</th>
                    <th className="px-6 py-4">Registered Email</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Console Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F5F0]">
                  {stores.map((store) => (
                    <tr key={store._id} className="hover:bg-neutral-50/55 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <span className="font-black text-neutral-900 block">{store.name}</span>
                          <a 
                            href={`/${store.slug}`} target="_blank" rel="noreferrer"
                            className="text-[10px] font-mono text-[#D03D56] hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <span>/{store.slug}</span> <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-neutral-600 flex items-center gap-1.5 capitalize">
                          <Layers className="w-3.5 h-3.5 text-neutral-400" /> {store.softwareType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-neutral-600 flex items-center gap-1.5 capitalize">
                          <CreditCard className="w-3.5 h-3.5 text-neutral-400" /> {store.subscriptionPlan}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-neutral-600 font-bold">{store.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                          store.isApproved 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {store.isApproved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          {/* Toggle Approval Button */}
                          <button
                            disabled={actionLoading === store._id}
                            onClick={() => handleToggleApproval(store._id, store.isApproved)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                              store.isApproved
                                ? "bg-white text-amber-700 border-amber-200 hover:bg-amber-50"
                                : "bg-[#D03D56] text-white border-transparent hover:bg-[#3F0712]"
                            }`}
                          >
                            {actionLoading === store._id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : store.isApproved ? (
                              "Deactivate"
                            ) : (
                              "Approve"
                            )}
                          </button>

                          {/* Delete Store Button */}
                          <button
                            disabled={actionLoading === store._id}
                            onClick={() => handleDeleteStore(store._id)}
                            className="p-2 text-neutral-400 hover:text-red-600 bg-neutral-100 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
