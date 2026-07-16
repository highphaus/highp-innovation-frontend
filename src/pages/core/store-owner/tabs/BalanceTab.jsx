import { useState } from "react";
import {
  Wallet, TrendingUp, CreditCard, ArrowDownToLine,
  CheckCircle, Clock, XCircle, AlertTriangle, Loader2,
  Building2, Hash, User, Landmark, Info, Download, RefreshCw,
  BadgeIndianRupee, ShieldCheck, ChevronRight
} from "lucide-react";

export default function BalanceTab({
  salesTotal = 0,
  ordersList = [],
  withdrawalRequests = [],
  bankAccountHolder, setBankAccountHolder,
  bankName, setBankName,
  bankAccountNumber, setBankAccountNumber,
  bankIfsc, setBankIfsc,
  upiId, setUpiId,
  showWithdrawModal, setShowWithdrawModal,
  updating = false,
  handleExportOrders,
  handleSaveBankDetails,
  handleRequestWithdrawal,
}) {
  const [bankTab, setBankTab] = useState("bank"); // "bank" | "upi"

  // ── Computed values ────────────────────────────────────────────────────────
  const platformFee = 0.18;           // 18 % platform commission
  const taxRate    = 0.00;            // 0% GST passed through
  const available  = Number((salesTotal * (1 - platformFee - taxRate)).toFixed(2));
  const pending    = withdrawalRequests
    .filter(r => r.status === "pending")
    .reduce((s, r) => s + (r.amount || 0), 0);
  const paid       = withdrawalRequests
    .filter(r => r.status === "approved" || r.status === "paid")
    .reduce((s, r) => s + (r.amount || 0), 0);

  const completedOrders = ordersList.filter(
    o => o.status === "completed" || o.status === "delivered"
  );
  const avgOrderValue = completedOrders.length
    ? Math.round(completedOrders.reduce((s, o) => s + (o.totalAmount || 0), 0) / completedOrders.length)
    : 0;

  const hasBankDetails =
    bankAccountHolder?.trim() &&
    bankAccountNumber?.trim() &&
    bankIfsc?.trim();

  // ── Status badge helper ────────────────────────────────────────────────────
  const StatusBadge = ({ status }) => {
    const map = {
      pending:  { label: "Pending",  cls: "bg-amber-50 text-amber-700 border-amber-200",   icon: <Clock className="w-3 h-3" /> },
      approved: { label: "Approved", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle className="w-3 h-3" /> },
      paid:     { label: "Paid",     cls: "bg-blue-50 text-blue-700 border-blue-200",       icon: <CheckCircle className="w-3 h-3" /> },
      rejected: { label: "Rejected", cls: "bg-red-50 text-red-700 border-red-200",          icon: <XCircle className="w-3 h-3" /> },
    };
    const m = map[status] || map.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${m.cls}`}>
        {m.icon} {m.label}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-up pb-10">

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-black text-neutral-950 uppercase tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          Balance &amp; Payouts
        </h1>
        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">
          Manage earnings, request withdrawals, and track payout history
        </p>
      </div>

      {/* ── Summary cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: `₹${salesTotal.toLocaleString("en-IN")}`,
            sub: `${completedOrders.length} completed orders`,
            icon: TrendingUp,
            color: "text-[#D03D56] bg-[#F7EBEF]",
          },
          {
            label: "Available to Withdraw",
            value: `₹${available.toLocaleString("en-IN")}`,
            sub: `After ${Math.round(platformFee * 100)}% platform fee`,
            icon: Wallet,
            color: "text-emerald-700 bg-emerald-50",
          },
          {
            label: "Pending Payouts",
            value: `₹${pending.toLocaleString("en-IN")}`,
            sub: `${withdrawalRequests.filter(r => r.status === "pending").length} request(s)`,
            icon: Clock,
            color: "text-amber-600 bg-amber-50",
          },
          {
            label: "Total Paid Out",
            value: `₹${paid.toLocaleString("en-IN")}`,
            sub: "Settled to your bank",
            icon: BadgeIndianRupee,
            color: "text-blue-600 bg-blue-50",
          },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-[#F0EEEB] p-5 rounded-3xl shadow-sm flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <span className="text-[9px] text-[#737373] font-black uppercase tracking-widest block">{label}</span>
              <span className="text-2xl font-black text-neutral-950 block leading-none">{value}</span>
              <span className="text-[9px] text-neutral-400 font-bold block">{sub}</span>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* ── Main grid: Withdraw card + Bank details ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Withdraw request card (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-[#F0EEEB] rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#F7EBEF] rounded-xl flex items-center justify-center">
              <ArrowDownToLine className="w-4 h-4 text-[#D03D56]" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-950">Request Payout</h3>
              <p className="text-[9px] text-[#737373] font-bold">Processed within 2–3 business days</p>
            </div>
          </div>

          <div className="h-px bg-[#F5F5F0]" />

          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500 font-bold">Total Revenue</span>
              <span className="font-black text-neutral-950">₹{salesTotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500 font-bold">Platform Fee ({Math.round(platformFee * 100)}%)</span>
              <span className="font-bold text-red-500">− ₹{(salesTotal * platformFee).toLocaleString("en-IN")}</span>
            </div>
            <div className="h-px bg-[#F5F5F0]" />
            <div className="flex justify-between text-sm">
              <span className="font-black text-neutral-950">You Receive</span>
              <span className="font-black text-emerald-600">₹{available.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {!hasBankDetails && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                Add your bank details on the right before requesting a payout.
              </p>
            </div>
          )}

          <button
            disabled={updating || available <= 0 || !hasBankDetails}
            onClick={handleRequestWithdrawal}
            className="w-full py-3.5 bg-[#D03D56] hover:bg-[#3F0712] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowDownToLine className="w-4 h-4" />}
            Request Withdrawal
          </button>

          <div className="flex items-center gap-2 justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Secured by RBI-compliant payout rails</span>
          </div>
        </div>

        {/* Bank details form (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-[#F0EEEB] rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-950">Payout Account</h3>
              <p className="text-[9px] text-[#737373] font-bold">Your withdrawal destination</p>
            </div>
          </div>

          {/* Tabs: Bank vs UPI */}
          <div className="bg-neutral-50 border border-[#F0EEEB] p-1 rounded-2xl flex gap-1 max-w-xs">
            {["bank", "upi"].map(t => (
              <button
                key={t}
                onClick={() => setBankTab(t)}
                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  bankTab === t ? "bg-white text-neutral-950 shadow-sm border border-[#F0EEEB]" : "text-neutral-400 hover:text-neutral-700"
                }`}
              >
                {t === "bank" ? "Bank Account" : "UPI"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSaveBankDetails} className="space-y-4">
            {bankTab === "bank" ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <User className="w-3 h-3" /> Account Holder Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ravi Kumar"
                      value={bankAccountHolder}
                      onChange={e => setBankAccountHolder(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <Landmark className="w-3 h-3" /> Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. State Bank of India"
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <Hash className="w-3 h-3" /> Account Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 123456789012"
                      value={bankAccountNumber}
                      onChange={e => setBankAccountNumber(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <CreditCard className="w-3 h-3" /> IFSC Code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SBIN0001234"
                      value={bankIfsc}
                      onChange={e => setBankIfsc(e.target.value.toUpperCase())}
                      className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-mono font-bold tracking-wider"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">
                  UPI ID / VPA
                </label>
                <input
                  type="text"
                  placeholder="e.g. yourname@upi"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-mono font-bold"
                />
                <p className="mt-1.5 text-[9px] text-neutral-400 font-bold flex items-center gap-1">
                  <Info className="w-3 h-3" /> UPI payments settle instantly during business hours
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={updating}
              className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 disabled:opacity-40 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
              Save Bank Details
            </button>
          </form>
        </div>
      </div>

      {/* ── Avg order value highlight ─────────────────────────────────────── */}
      {avgOrderValue > 0 && (
        <div className="bg-gradient-to-r from-[#D03D56]/8 to-transparent border border-[#D03D56]/15 rounded-3xl p-5 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[9px] font-black text-[#D03D56] uppercase tracking-widest block">Average Order Value</span>
            <span className="text-2xl font-black text-neutral-950">₹{avgOrderValue.toLocaleString("en-IN")}</span>
            <span className="text-[9px] text-neutral-400 font-bold block">Based on {completedOrders.length} completed orders</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportOrders}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-[#F0EEEB] hover:border-[#D03D56]/30 text-neutral-700 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Export Orders
            </button>
          </div>
        </div>
      )}

      {/* ── Payout history ───────────────────────────────────────────────── */}
      <div className="bg-white border border-[#F0EEEB] rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#F5F5F0] flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-950">Payout History</h3>
            <p className="text-[9px] text-[#737373] font-bold mt-0.5">All withdrawal requests you have submitted</p>
          </div>
          <span className="px-3 py-0.5 bg-neutral-50 border border-[#F0EEEB] rounded-full text-[9px] font-black uppercase tracking-wider text-neutral-600">
            {withdrawalRequests.length} record{withdrawalRequests.length !== 1 ? "s" : ""}
          </span>
        </div>

        {withdrawalRequests.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center mx-auto text-neutral-300">
              <Wallet className="w-6 h-6" />
            </div>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">No payout requests yet</p>
            <p className="text-[9px] text-neutral-300 font-bold">Request your first withdrawal above once you have a balance.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F5F5F0]">
            {[...withdrawalRequests].reverse().map((req, idx) => (
              <div key={req._id || idx} className="p-5 flex items-center justify-between gap-4 hover:bg-neutral-50/60 transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-9 h-9 bg-[#FAFAFA] border border-[#F0EEEB] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <ArrowDownToLine className="w-4 h-4 text-neutral-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-neutral-950">
                        ₹{(req.amount || 0).toLocaleString("en-IN")}
                      </span>
                      <StatusBadge status={req.status || "pending"} />
                    </div>
                    <p className="text-[9px] text-neutral-400 font-bold mt-0.5">
                      {req.accountHolder || req.bankAccountHolder || "—"} · {req.bankName || "—"}
                    </p>
                    <p className="text-[9px] text-neutral-400 font-mono mt-0.5">
                      A/C ••••{(req.accountNumber || req.bankAccountNumber || "").slice(-4) || "—"}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[9px] text-neutral-400 font-bold block">
                    {req.createdAt ? new Date(req.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </span>
                  {req.processedAt && (
                    <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">
                      Settled {new Date(req.processedAt).toLocaleDateString("en-IN")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Fee breakdown note ───────────────────────────────────────────── */}
      <div className="bg-[#FAFAFA] border border-[#F0EEEB] rounded-2xl p-5 flex items-start gap-3">
        <Info className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <h4 className="text-[10px] font-black text-neutral-700 uppercase tracking-wider">Fee Breakdown</h4>
          <p className="text-[9px] text-neutral-500 font-bold leading-relaxed">
            HighP charges a <strong className="text-neutral-800">{Math.round(platformFee * 100)}% platform commission</strong> on completed orders.
            This fee covers hosting, payment infrastructure, KDS, dispatch logistics, and platform support.
            Payouts are processed within 2–3 business days to your linked bank account or UPI ID.
          </p>
        </div>
      </div>
    </div>
  );
}
