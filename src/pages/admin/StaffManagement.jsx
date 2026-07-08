import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Users2, Plus, Trash2, ShieldCheck, ArrowLeft, Loader2, Mail, Phone, Briefcase } from "lucide-react";
import axios from "axios";
import { getTheme, getVerticalDetails } from "../storefront/StorefrontHome";

function getSuggestedRoles(softwareType) {
  const map = {
    restaurant: ["Executive Chef", "Sous Chef", "Line Cook", "Cashier", "Delivery Driver", "Wait Staff"],
    retail: ["Store Manager", "Retail Associate", "Stock Clerk", "Cashier", "Customer Service"],
    workshop: ["Head Instructor", "Lead Presenter", "Coordinator", "Registrar", "Assistant Instructor"],
    salon: ["Senior Stylist", "Hair Color Specialist", "Nail Technician", "Esthetician", "Receptionist"],
    water: ["Logistics Dispatcher", "Fleet Driver", "Billing Administrator", "Route Manager"],
    gym: ["Personal Trainer", "Fitness Instructor", "Front Desk Representative", "Membership Coordinator"],
    repair: ["Lead Technician", "Appliance Technician", "Electronics Technician", "Service Dispatcher"]
  };
  return map[softwareType || "restaurant"] || map.restaurant;
}

export default function StaffManagement() {
  const { storeSlug } = useParams();
  const [staff, setStaff] = useState([]);
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", email: "", phone: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchStaff = () => {
    axios.get(`http://localhost:5000/api/stores/${storeSlug}/staff`)
      .then(res => { setStaff(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (storeSlug) {
      fetchStaff();
      axios.get(`http://localhost:5000/api/stores/${storeSlug}`).then(r => setStoreData(r.data)).catch(() => {});
    }
  }, [storeSlug]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await axios.post(`http://localhost:5000/api/stores/${storeSlug}/staff`, {
        name: form.name,
        role: form.role,
        email: form.email,
        phone: form.phone
      });
      setSuccess("Staff member added successfully.");
      setForm({ name: "", role: "", email: "", phone: "" });
      fetchStaff();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add staff member.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this staff member?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/stores/${storeSlug}/staff/${id}`);
      setStaff(staff.filter(s => s._id !== id));
    } catch {
      alert("Failed to delete staff member.");
    }
  };

  const softwareType = storeData?.softwareType || "restaurant";
  const details = getVerticalDetails(softwareType);
  const theme = getTheme(storeData);
  const roles = getSuggestedRoles(softwareType);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-20 selection:bg-neutral-800 selection:text-white">
      
      {/* HEADER */}
      <div className="bg-neutral-900 text-white px-4 sm:px-6 py-4 flex items-center justify-between shadow-md gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center border border-white/5 flex-shrink-0">
            <Users2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-[10px] sm:text-xs uppercase tracking-wider truncate">{storeSlug} — Staff Workspace</span>
        </div>
        <Link to={`/${storeSlug}/admin`} className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-neutral-400 hover:text-white transition-colors bg-neutral-800 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl flex-shrink-0">
          <ArrowLeft className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Dashboard</span><span className="xs:hidden">Back</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ADD STAFF FORM PANEL */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#F5F5F0] rounded-2xl p-6 shadow-sm sticky top-6 space-y-5">
            <div>
              <h2 className={`font-black text-sm uppercase tracking-widest ${theme.primary} flex items-center gap-2`}>
                <Plus className="w-4.5 h-4.5" /> Register Staff / User
              </h2>
              <div className={`h-0.5 w-8 ${theme.bg} mt-2 rounded-full`} />
            </div>
            
            {error && <div className="p-3 bg-red-50 border border-red-200/60 text-red-700 text-xs rounded-xl font-medium">{error}</div>}
            {success && <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-700 text-xs rounded-xl font-medium">{success}</div>}
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Staff Full Name</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. John Doe" 
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-neutral-300 focus:bg-white transition-all text-neutral-900" 
                />
              </div>
              
              <div>
                <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Assigned Role</label>
                <select 
                  required
                  value={form.role}
                  onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                  className="w-full bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-neutral-300 focus:bg-white transition-all text-neutral-900"
                >
                  <option value="">-- Choose Role --</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                  <option value="Custom Agent">Custom Agent</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Work Email</label>
                <input 
                  required 
                  type="email" 
                  placeholder="staff@company.com" 
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-neutral-300 focus:bg-white transition-all text-neutral-900" 
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">Contact Phone</label>
                <input 
                  type="tel" 
                  placeholder="+91 XXXXX XXXXX" 
                  value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full bg-[#FAFAFA] border border-[#F5F5F0] rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-neutral-300 focus:bg-white transition-all text-neutral-900" 
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className={`w-full py-3.5 ${theme.bg} ${theme.hover} text-white font-black text-[11px] uppercase tracking-wider rounded-xl transition-all mt-2 flex items-center justify-center gap-2 shadow-md disabled:opacity-50`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <span>Register Staff Member</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* STAFF LIST GRID */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5 ml-1">
            <h2 className="font-black text-[10px] uppercase tracking-widest text-[#737373]">
              Staff Directory & Roster ({staff.length})
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-20 text-[#737373] text-sm animate-pulse">Syncing staff directory...</div>
          ) : staff.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white border border-[#F5F5F0] rounded-2xl text-[#737373] shadow-sm">
              <Users2 className="w-12 h-12 mb-3 stroke-[1.2]" />
              <p className="text-sm font-semibold">No registered staff members found.</p>
              <p className="text-xs mt-1">Add users or staff inside the registration panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {staff.map(member => (
                <div key={member._id} className="bg-white border border-[#F5F5F0] rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow animate-fade-in group">
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 ${theme.lightBg} rounded-xl flex items-center justify-center`}>
                        <Briefcase className={`w-4.5 h-4.5 ${theme.primary}`} />
                      </div>
                      <div>
                        <h3 className="font-black text-sm text-neutral-900 leading-snug">{member.name}</h3>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-black border uppercase tracking-wider ${theme.lightBg} ${theme.primary} ${theme.border}`}>
                          {member.role}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-[#737373] pt-2 border-t border-[#F5F5F0]">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <div className="flex items-center justify-between pt-3 border-t border-[#F5F5F0]">
                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase">
                        {member.status}
                      </span>
                      <button 
                        onClick={() => handleDelete(member._id)}
                        className="p-2 text-[#737373] hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete staff member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
