import { useState, useCallback } from "react";
import axios from "axios";

/**
 * useBalance — manages payout/withdrawal state for the Balance tab.
 *
 * @param {string} slug   — the store slug
 * @param {number} salesTotal — total completed-order revenue
 */
export default function useBalance(slug, salesTotal = 0) {
  const PLATFORM_FEE = 0.18; // 18%

  // ── Withdrawal requests ──────────────────────────────────────────────────
  const [withdrawalRequests, setWithdrawalRequests] = useState(() => {
    try {
      const stored = localStorage.getItem("ownerWithdrawalRequests");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // ── Bank details ─────────────────────────────────────────────────────────
  const [bankAccountHolder, setBankAccountHolder] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [upiId, setUpiId] = useState("");

  // ── UI state ─────────────────────────────────────────────────────────────
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ── Computed ─────────────────────────────────────────────────────────────
  const available = Number((salesTotal * (1 - PLATFORM_FEE)).toFixed(2));
  const pendingTotal = withdrawalRequests
    .filter(r => r.status === "pending")
    .reduce((s, r) => s + (r.amount || 0), 0);
  const paidTotal = withdrawalRequests
    .filter(r => r.status === "approved" || r.status === "paid")
    .reduce((s, r) => s + (r.amount || 0), 0);

  // ── Fetch payout history from backend ────────────────────────────────────
  const fetchWithdrawals = useCallback(async () => {
    if (!slug) return;
    try {
      const res = await axios.get(`/api/stores/${slug}/payouts`);
      setWithdrawalRequests(res.data);
      localStorage.setItem("ownerWithdrawalRequests", JSON.stringify(res.data));
    } catch (err) {
      console.error("Failed to load payout history:", err);
    }
  }, [slug]);

  // ── Save bank details ─────────────────────────────────────────────────────
  const handleSaveBankDetails = useCallback(async (e) => {
    if (e) e.preventDefault();
    if (!slug) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.put(`/api/stores/${slug}`, {
        bankAccountHolder,
        bankName,
        bankAccountNumber,
        bankIfsc,
        upiId,
      });
      setSuccess("Bank details saved successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to save bank details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [slug, bankAccountHolder, bankName, bankAccountNumber, bankIfsc, upiId]);

  // ── Request withdrawal ────────────────────────────────────────────────────
  const handleRequestWithdrawal = useCallback(async () => {
    if (!bankAccountHolder?.trim() || !bankAccountNumber?.trim() || !bankIfsc?.trim()) {
      setError("Please complete your bank details before requesting a payout.");
      return;
    }
    if (available <= 0) {
      setError("No available balance to withdraw.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.post(`/api/stores/${slug}/payouts`, {
        amount: available,
        accountHolder: bankAccountHolder,
        bankName: bankName || "Primary Bank",
        accountNumber: bankAccountNumber,
        ifscCode: bankIfsc,
      });
      await fetchWithdrawals();
      setShowWithdrawModal(false);
      setSuccess(`Withdrawal request submitted for ₹${available.toLocaleString("en-IN")}. Processing in 2–3 business days.`);
    } catch (err) {
      console.error(err);
      setError("Unable to submit withdrawal request. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [slug, available, bankAccountHolder, bankName, bankAccountNumber, bankIfsc, fetchWithdrawals]);

  // ── Hydrate bank details from store data ─────────────────────────────────
  const hydrateBankDetails = useCallback((storeData) => {
    if (!storeData) return;
    setBankAccountHolder(storeData.bankAccountHolder || "");
    setBankName(storeData.bankName || "");
    setBankAccountNumber(storeData.bankAccountNumber || "");
    setBankIfsc(storeData.bankIfsc || "");
    setUpiId(storeData.upiId || "");
  }, []);

  return {
    // Bank form state
    bankAccountHolder, setBankAccountHolder,
    bankName,          setBankName,
    bankAccountNumber, setBankAccountNumber,
    bankIfsc,          setBankIfsc,
    upiId,             setUpiId,

    // Payout data
    withdrawalRequests,
    available,
    pendingTotal,
    paidTotal,

    // UI state
    showWithdrawModal, setShowWithdrawModal,
    loading,
    error,
    success,

    // Actions
    fetchWithdrawals,
    handleSaveBankDetails,
    handleRequestWithdrawal,
    hydrateBankDetails,
  };
}
