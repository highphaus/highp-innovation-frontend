import React, { useState } from "react";
import { UserPlus, Shield, Bike, Landmark, ChefHat, Trash2, Users } from "lucide-react";

export default function StaffTab({
  staffList = [
    { id: 1, name: "Amit Kumar", role: "Delivery Partner", phone: "+91 98765 43210" },
    { id: 2, name: "Sneha Nair", role: "Sales", phone: "+91 87654 32109" },
    { id: 3, name: "Chef Vikram", role: "Kitchen Cook", phone: "+91 76543 21098" }
  ],
  handleAddNewStaff,
  handleDeleteStaff
}) {
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("Delivery Partner");

  // Helper function to return beautiful contextual icons based on duty assignment
  const getRoleIcon = (role) => {
    switch (role) {
      case "Delivery Partner":
        return <Bike className="w-4 h-4 text-blue-600" />;
      case "Sales":
        return <Landmark className="w-4 h-4 text-emerald-600" />;
      case "Kitchen Cook":
        return <ChefHat className="w-4 h-4 text-orange-600" />;
      default:
        return <Shield className="w-4 h-4 text-purple-600" />;
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;
    
    if (handleAddNewStaff) {
      handleAddNewStaff({
        name: newStaffName,
        phone: newStaffPhone,
        role: newStaffRole
      });
    }

    // Reset simple localized state strings
    setNewStaffName("");
    setNewStaffPhone("");
  };

  return (
    <div className="w-full font-sans text-[#2d3748] max-w-6xl mx-auto pb-16 px-1 animate-fade-in space-y-6">
      
      {/* HEADER ROW */}
      <div className="space-y-1 pb-2 border-b border-[#e2e8f0]">
        <h1 className="text-2xl font-bold text-[#0f172a]">Staff Management</h1>
        <p className="text-sm text-[#64748b]">Assign duties, manage roles, and control active store personnel operations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COMPONENT COLUMN: REGISTER & ASSIGN DUTY FORM */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 sm:p-5 shadow-sm space-y-4 self-start">
          <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-neutral-400" />
            <span>Add New Staff</span>
          </h3>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Staff Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#334155]">Full Name *</label>
              <input
                type="text"
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                placeholder="e.g. Ramesh Dev"
                className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
                required
              />
            </div>

            {/* Contact Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#334155]">Phone Number</label>
              <input
                type="text"
                value={newStaffPhone}
                onChange={(e) => setNewStaffPhone(e.target.value)}
                placeholder="e.g. +91 99009 90099"
                className="w-full border border-[#cbd5e1] rounded px-3 py-2 text-sm focus:outline-none"
              />
            </div>

            {/* Duty Role Select Menu */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#334155]">Assign Duty Role *</label>
              <div className="relative border border-[#cbd5e1] rounded bg-white flex items-center px-3 focus-within:border-neutral-400">
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                  className="w-full bg-transparent border-none py-2 pr-4 text-sm focus:outline-none appearance-none font-medium text-[#0f172a]"
                >
                  <option value="Delivery Partner">Delivery Partner</option>
                  <option value="Sales">Sales Counter / Cashier</option>
                  <option value="Kitchen Cook">Kitchen Cook</option>
                  <option value="Store Manager">Store Manager</option>
                </select>
                <div className="pointer-events-none absolute right-3 text-[10px] text-neutral-400">▼</div>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full bg-[#10b981] text-white text-xs font-bold py-2.5 rounded shadow-sm hover:opacity-95 uppercase tracking-wider transition-all cursor-pointer"
            >
              Add Staff Member
            </button>
          </form>
        </div>

        {/* RIGHT TWO-THIRDS PANEL COLUMN: ACTIVE DUTY ACTIVE LIST FEEDS */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden lg:col-span-2 flex flex-col">
          <div className="p-4 border-b border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider">Active Store Personnel</h3>
              <p className="text-xs text-[#64748b]">Review active staff assignments and active delivery statuses.</p>
            </div>
            <span className="text-xs font-bold bg-neutral-100 text-[#334155] px-2.5 py-1 rounded-full border border-neutral-200 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {staffList.length} Total
            </span>
          </div>

          {staffList.length === 0 ? (
            <div className="p-12 text-center text-sm font-medium text-neutral-400 flex-1 flex flex-col items-center justify-center">
              No staff entries registered yet. Use the registration form to assign new duties.
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                    <th className="p-4">Name</th>
                    <th className="p-4">Assigned Duty</th>
                    <th className="p-4">Contact Info</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] text-[#334155]">
                  {staffList.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-[#0f172a]">{staff.name}</td>
                      <td className="p-4">
                        <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs font-bold text-[#334155]">
                          {getRoleIcon(staff.role)}
                          <span>{staff.role}</span>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-medium text-[#64748b]">{staff.phone || "No phone added"}</td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (handleDeleteStaff) handleDeleteStaff(staff.id);
                          }}
                          className="p-1.5 border border-red-100 rounded text-red-500 hover:text-white hover:bg-red-500 transition-all shadow-sm cursor-pointer"
                          title="Remove Staff"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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