import { useState } from "react";
import { X, Mail, User, Phone, AlertCircle, Loader2, ShieldCheck, RefreshCw, ArrowRight } from "lucide-react";
import axios from "axios";

export default function CustomerAuthModal({ isOpen, onClose, storeSlug, theme, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState(1); // 1 = details, 2 = OTP
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      document.getElementById(`otp-cust-modal-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-cust-modal-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...otp];
    paste.split("").forEach((char, i) => { next[i] = char; });
    setOtp(next);
    document.getElementById(`otp-cust-modal-${Math.min(paste.length, 5)}`)?.focus();
  };

  const startResendCooldown = () => {
    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (isSignUp && !formData.name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/customers/send-otp", {
        storeSlug,
        email:   formData.email.trim(),
        purpose: isSignUp ? "register" : "login",
        name:    formData.name.trim()
      });
      setStep(2);
      startResendCooldown();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to send verification code.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setErrorMsg("Please enter the complete 6-digit OTP.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    const url = isSignUp 
      ? "http://localhost:5000/api/customers/register" 
      : "http://localhost:5000/api/customers/login";

    const payload = isSignUp
      ? { storeSlug, otp: otpValue, ...formData }
      : { storeSlug, email: formData.email.trim(), otp: otpValue };

    try {
      const res = await axios.post(url, payload);
      
      // Auto login: store values in localStorage
      localStorage.setItem(`customerToken_${storeSlug}`, res.data.token);
      localStorage.setItem(`customerUser_${storeSlug}`, JSON.stringify(res.data.customer));
      
      if (onAuthSuccess) {
        onAuthSuccess(res.data.customer);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Authentication failed. Incorrect code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setErrorMsg("");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/customers/send-otp", {
        storeSlug,
        email:   formData.email.trim(),
        purpose: isSignUp ? "register" : "login",
        name:    formData.name.trim()
      });
      setOtp(["", "", "", "", "", ""]);
      startResendCooldown();
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in font-sans">
      <div 
        className="bg-white border border-[#F0EEEB] rounded-3xl p-8 max-w-sm w-full shadow-2xl relative space-y-6 animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 transition-colors p-1.5 hover:bg-neutral-50 rounded-xl"
        >
          <X className="w-4 h-4" />
        </button>

        {/* HEADER */}
        <div className="text-center space-y-2">
          <div className={`w-10 h-10 ${theme.lightBg} rounded-2xl flex items-center justify-center mx-auto mb-2`}>
            {step === 1 ? <User className={`w-5 h-5 ${theme.primary}`} /> : <ShieldCheck className={`w-5 h-5 ${theme.primary}`} />}
          </div>
          <h2 className="text-xl font-black tracking-tight text-neutral-950">
            {step === 1 ? (isSignUp ? "Create Profile" : "Customer Portal") : "Verify Code"}
          </h2>
          <p className="text-[10px] text-[#737373] leading-relaxed uppercase tracking-wider font-bold">
            {step === 1 ? "Secure multi-tenant check-in" : `Code sent to ${formData.email}`}
          </p>
        </div>

        {/* TABS (Step 1 only) */}
        {step === 1 && (
          <div className="bg-[#FAFAFA] border border-[#F5F5F0] p-1 rounded-xl flex gap-1">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setErrorMsg(""); }}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                !isSignUp 
                  ? "bg-[#D03D56] text-white shadow-sm" 
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setErrorMsg(""); }}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                isSignUp 
                  ? "bg-[#D03D56] text-white shadow-sm" 
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* ERROR SUMMARY */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-[11px] font-semibold rounded-xl flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Info Form */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Shamsaifudheen"
                    className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="customer@enterprise.com"
                  className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 9876543210"
                    className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#D03D56] hover:bg-[#3F0712] active:scale-[0.98] text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div>
              <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-3 ml-1 text-center">
                Enter 6-digit verification code
              </label>
              <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-cust-modal-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    className={`w-10 h-12 text-center text-lg font-black border-2 rounded-xl outline-none transition-all bg-[#FAFAFA] ${
                      digit ? "border-[#D03D56] bg-[#FEF2F4] text-[#D03D56]" : "border-[#F0EEEB] text-neutral-800"
                    } focus:border-[#D03D56]`}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.join("").length < 6}
              className="w-full py-3 bg-[#D03D56] hover:bg-[#3F0712] active:scale-[0.98] text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verify &amp; Log In</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-[10px] text-neutral-400 font-bold pt-1">
              <button 
                type="button" 
                onClick={() => { setStep(1); setOtp(["","","","","",""]); setErrorMsg(""); }} 
                className="hover:text-neutral-700 transition-colors"
              >
                ← Change details
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                className="flex items-center gap-1 hover:text-[#D03D56] transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-3 h-3" />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
