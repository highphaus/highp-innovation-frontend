import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, Loader2, AlertCircle, Trash2, 
  CheckCircle, XCircle, ArrowLeft, Mail, Lock, 
  ExternalLink, Layers, CreditCard, Calendar, UserCheck, UserX, Crown, ShieldAlert, Eye, EyeOff
} from "lucide-react";
import axios from "axios";

export default function SuperAdminDashboard() {
  const MASTER_ADMIN_EMAIL = "shamsaifudheen@gmail.com";

  // Helper to load and seed super admin accounts
  const getStoredAdmins = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("superAdmins") || "[]");
      const hasMaster = stored.some(a => a.email.toLowerCase() === MASTER_ADMIN_EMAIL);
      if (!hasMaster) {
        const masterAcc = {
          email: MASTER_ADMIN_EMAIL,
          password: "highpsupersecret",
          isApproved: true,
          role: "Master Super Admin",
          registeredAt: new Date().toISOString()
        };
        const updated = [masterAcc, ...stored];
        localStorage.setItem("superAdmins", JSON.stringify(updated));
        return updated;
      }
      return stored;
    } catch {
      return [{
        email: MASTER_ADMIN_EMAIL,
        password: "highpsupersecret",
        isApproved: true,
        role: "Master Super Admin",
        registeredAt: new Date().toISOString()
      }];
    }
  };

  const [adminList, setAdminList] = useState(getStoredAdmins);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isSuperAdmin") === "true";
  });
  const [currentAdminEmail, setCurrentAdminEmail] = useState(() => {
    return localStorage.getItem("superAdminEmail") || MASTER_ADMIN_EMAIL;
  });
  
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [stores, setStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [adminActionMsg, setAdminActionMsg] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    setLoginSuccess("");

    const cleanEmail = loginEmail.toLowerCase().trim();
    const cleanPassword = loginPassword.trim();

    const admins = getStoredAdmins();
    const isMasterCredential = (cleanEmail === MASTER_ADMIN_EMAIL || cleanEmail === "superadmin@highp.com") && cleanPassword === "highpsupersecret";
    const foundAdmin = admins.find(a => a.email.toLowerCase() === cleanEmail);

    if (isMasterCredential) {
      localStorage.setItem("isSuperAdmin", "true");
      localStorage.setItem("superAdminEmail", cleanEmail);
      setCurrentAdminEmail(cleanEmail);
      setIsAuthenticated(true);
      setLoginLoading(false);
      return;
    }

    if (foundAdmin) {
      if (foundAdmin.password !== cleanPassword) {
        setLoginError("Invalid platform operator credentials. Incorrect password.");
        setLoginLoading(false);
        return;
      }

      // Check approval requirement: Only approved admins (or master) can log in!
      const isMasterEmail = cleanEmail === MASTER_ADMIN_EMAIL || cleanEmail === "superadmin@highp.com";
      if (!isMasterEmail && !foundAdmin.isApproved) {
        setLoginError(`Account Pending Approval: Your super admin account requires approval from master administrator ${MASTER_ADMIN_EMAIL} before login is permitted.`);
        setLoginLoading(false);
        return;
      }

      localStorage.setItem("isSuperAdmin", "true");
      localStorage.setItem("superAdminEmail", cleanEmail);
      setCurrentAdminEmail(cleanEmail);
      setIsAuthenticated(true);
      setLoginLoading(false);
    } else {
      setLoginError("No super admin operator account found with this email. Please Sign Up first.");
      setLoginLoading(false);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    setLoginSuccess("");

    const cleanEmail = loginEmail.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setLoginError("Please enter a valid email address.");
      setLoginLoading(false);
      return;
    }

    if (loginPassword.length < 6) {
      setLoginError("Password must be at least 6 characters long.");
      setLoginLoading(false);
      return;
    }

    if (loginPassword !== confirmPassword) {
      setLoginError("Passwords do not match.");
      setLoginLoading(false);
      return;
    }

    const admins = getStoredAdmins();
    if (admins.some(a => a.email.toLowerCase() === cleanEmail)) {
      setLoginError("This operator email is already registered.");
      setLoginLoading(false);
      return;
    }

    const isMaster = cleanEmail === MASTER_ADMIN_EMAIL;
    const newAdmin = { 
      email: cleanEmail, 
      password: loginPassword,
      isApproved: isMaster ? true : false, // Requires approval from shamsaifudheen@gmail.com unless master
      role: isMaster ? "Master Super Admin" : "Platform Operator",
      registeredAt: new Date().toISOString()
    };

    const updatedAdmins = [...admins, newAdmin];
    localStorage.setItem("superAdmins", JSON.stringify(updatedAdmins));
    setAdminList(updatedAdmins);
    
    if (isMaster) {
      setLoginSuccess("Master Super Admin registered & pre-approved! You can now log in.");
    } else {
      setLoginSuccess(`Operator registered! Your account is pending approval by master administrator ${MASTER_ADMIN_EMAIL}.`);
    }

    setLoginLoading(false);
    setLoginEmail("");
    setLoginPassword("");
    setConfirmPassword("");
  };

  const handleSignOut = () => {
    localStorage.removeItem("isSuperAdmin");
    localStorage.removeItem("superAdminEmail");
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

  // 👑 MASTER OPERATOR APPROVAL HANDLERS
  const handleToggleOperatorApproval = (targetEmail, currentApprovalStatus) => {
    setAdminActionMsg("");
    const updated = adminList.map(admin => {
      if (admin.email.toLowerCase() === targetEmail.toLowerCase()) {
        return { ...admin, isApproved: !currentApprovalStatus };
      }
      return admin;
    });
    setAdminList(updated);
    localStorage.setItem("superAdmins", JSON.stringify(updated));
    setAdminActionMsg(`Operator status for ${targetEmail} updated to ${!currentApprovalStatus ? "Approved" : "Pending"}.`);
    setTimeout(() => setAdminActionMsg(""), 4000);
  };

  const handleDeleteOperator = (targetEmail) => {
    if (targetEmail.toLowerCase() === MASTER_ADMIN_EMAIL) {
      alert("Master Super Admin account (shamsaifudheen@gmail.com) cannot be deleted.");
      return;
    }
    if (!window.confirm(`Are you sure you want to remove operator ${targetEmail}?`)) return;
    
    const updated = adminList.filter(admin => admin.email.toLowerCase() !== targetEmail.toLowerCase());
    setAdminList(updated);
    localStorage.setItem("superAdmins", JSON.stringify(updated));
    setAdminActionMsg(`Operator account ${targetEmail} removed.`);
    setTimeout(() => setAdminActionMsg(""), 4000);
  };

  // 🔐 LOGIN / SIGNUP SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 sm:p-6 selection:bg-neutral-800 selection:text-white font-sans antialiased">
        <div className="bg-white border border-[#F0EEEB] rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-lg space-y-6 relative animate-fade-up max-h-[92vh] overflow-y-auto">
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
            <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-[11px] font-semibold rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {loginSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-semibold rounded-xl flex items-start gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
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
                  placeholder="e.g. shamsaifudheen@gmail.com"
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
                  required type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-10 pr-10 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-medium"
                  value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isSignUpMode && (
              <div>
                <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    required type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-10 pr-10 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-medium"
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
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
                <span>{isSignUpMode ? "Submit Operator Registration" : "Open Console Gateway"}</span>
              )}
            </button>
          </form>

          <div className="text-center pt-1 border-t border-[#F5F5F0]">
            <p className="text-[9px] text-[#737373] font-semibold mb-2">
              Note: Non-master super admin logins require approval from <span className="font-black text-neutral-900">shamsaifudheen@gmail.com</span>
            </p>
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
              <span className="text-[9px] text-[#737373] font-bold uppercase tracking-widest block mt-0.5">
                Logged in as: <span className="text-[#D03D56] font-black">{currentAdminEmail}</span>
              </span>
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[
            { label: "Platform Nodes", val: stores.length },
            { label: "Active Stores", val: stores.filter(s => s.isApproved).length },
            { label: "Store Queue", val: stores.filter(s => !s.isApproved).length },
            { label: "Admin Approvals", val: adminList.filter(a => !a.isApproved).length }
          ].map((s, idx) => (
            <div key={idx} className="bg-white border border-[#F0EEEB] p-6 rounded-3xl space-y-1.5 shadow-sm">
              <span className="text-[9px] text-[#737373] uppercase tracking-widest font-black block">{s.label}</span>
              <span className="text-3xl font-black block text-neutral-950">{s.val}</span>
            </div>
          ))}
        </div>

        {/* Global Action Messages */}
        {adminActionMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{adminActionMsg}</span>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-250 text-red-800 text-xs rounded-2xl flex items-start gap-3.5">
            <AlertCircle className="w-4.5 h-4.5 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 👑 MASTER OPERATORS APPROVAL MANAGEMENT CARD */}
        <div className="bg-white border border-[#F0EEEB] rounded-3xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-[#F5F5F0] bg-[#FAFAFA] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">Super Admin Access & Approvals</h3>
              </div>
              <p className="text-[9px] text-[#737373] uppercase tracking-widest font-black mt-0.5">
                Master Admin: <span className="text-neutral-900 font-bold">{MASTER_ADMIN_EMAIL}</span>
              </p>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
              {adminList.filter(a => !a.isApproved).length} Pending Approval
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#F5F5F0] text-[9px] font-black text-[#737373] uppercase tracking-wider bg-[#FAFAFA]/50">
                  <th className="px-6 py-4">Operator Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Approval Status</th>
                  <th className="px-6 py-4 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F0]">
                {adminList.map((admin, idx) => {
                  const isMaster = admin.email.toLowerCase() === MASTER_ADMIN_EMAIL;
                  return (
                    <tr key={idx} className="hover:bg-neutral-50/55 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-neutral-900">
                        <div className="flex items-center gap-2">
                          {isMaster && <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                          <span>{admin.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-neutral-600 capitalize">
                        {admin.role || (isMaster ? "Master Super Admin" : "Platform Operator")}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                          admin.isApproved || isMaster
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {admin.isApproved || isMaster ? "🟢 Approved Access" : `🟡 Pending ${MASTER_ADMIN_EMAIL} Approval`}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isMaster ? (
                          <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">
                            Master Admin (Pre-Approved)
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleOperatorApproval(admin.email, admin.isApproved)}
                              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                                admin.isApproved
                                  ? "bg-white text-amber-700 border-amber-200 hover:bg-amber-50"
                                  : "bg-emerald-600 text-white border-transparent hover:bg-emerald-700"
                              }`}
                            >
                              {admin.isApproved ? "Revoke Access" : "Approve Operator"}
                            </button>

                            <button
                              onClick={() => handleDeleteOperator(admin.email)}
                              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Operator"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

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
