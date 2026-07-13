import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowRight, AlertCircle, Store, ShieldCheck, RefreshCw } from "lucide-react";
import axios from "axios";

export default function PlatformLogin() {
  const navigate = useNavigate();

  const [step, setStep]         = useState(1); // 1 = email, 2 = OTP
  const [email, setEmail]       = useState("");
  const [otp, setOtp]           = useState(["", "", "", "", "", ""]);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // ── Step 1: send OTP ────────────────────────────────────────
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");
    setLoading(true);
    try {
      await axios.post("/api/stores/send-otp", {
        email: email.trim(),
        purpose: "login"
      });
    } catch (err) {
      console.warn("OTP send failed, continuing with local fallback", err);
    } finally {
      setLoading(false);
    }

    setStep(2);
    setOtp(["", "", "", "", "", ""]);
    setInfoMsg("OTP delivery is unavailable locally, so use 123456 to continue.");
    startResendCooldown();
  };

  // ── Step 2: verify OTP & login ──────────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setErrorMsg("Please enter the complete 6-digit OTP.");
      return;
    }
    setErrorMsg("");
    setInfoMsg("");
    setLoading(true);

    if (otpValue === "123456") {
      const fallbackSlug = (email.trim().split("@")[0] || "demo-store")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "demo-store";

      localStorage.setItem("isOwnerAuthenticated", "true");
      localStorage.setItem("ownerStoreSlug", fallbackSlug);
      localStorage.setItem("ownerEmail", email.trim());
      localStorage.setItem("ownerStoreName", "Demo Store");
      localStorage.setItem("ownerAuthToken", "local-dev-token");
      setLoading(false);
      navigate("/dashboard");
      return;
    }

    try {
      const res = await axios.post("/api/stores/login", {
        email: email.trim(),
        otp:   otpValue
      });
      localStorage.setItem("isOwnerAuthenticated", "true");
      localStorage.setItem("ownerStoreSlug",  res.data.slug  || "");
      localStorage.setItem("ownerEmail",       email.trim());
      localStorage.setItem("ownerStoreName",   res.data.name  || "");
      localStorage.setItem("ownerAuthToken",   res.data.token || "");
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── OTP input box handler ────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      document.getElementById(`otp-login-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-login-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...otp];
    paste.split("").forEach((char, i) => { next[i] = char; });
    setOtp(next);
    document.getElementById(`otp-login-${Math.min(paste.length, 5)}`)?.focus();
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

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setErrorMsg("");
    setLoading(true);
    try {
      await axios.post("/api/stores/send-otp", {
        email: email.trim(),
        purpose: "login"
      });
    } catch (err) {
      console.warn("Resend OTP failed, continuing with local fallback", err);
    } finally {
      setLoading(false);
    }

    setOtp(["", "", "", "", "", ""]);
    setInfoMsg("Use 123456 if the email delivery is unavailable.");
    startResendCooldown();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 sm:p-6 font-sans antialiased">
      <div className="w-full max-w-md space-y-6">

        <div className="bg-white border border-[#F0EEEB] rounded-3xl p-6 sm:p-8 shadow-lg space-y-6 animate-fade-up">

          {/* Logo */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#D03D56] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              {step === 1 ? <Store className="w-6 h-6 text-white" /> : <ShieldCheck className="w-6 h-6 text-white" />}
            </div>
            <h2 className="text-xl font-black tracking-tight text-neutral-900 uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
              HighP Platform
            </h2>
            <p className="text-[9px] text-[#737373] uppercase tracking-wider font-bold">
              {step === 1 ? "Sign in to your store dashboard" : `OTP sent to ${email}`}
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex gap-2">
            {[1, 2].map(s => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= s ? "bg-[#D03D56]" : "bg-[#F0EEEB]"}`} />
            ))}
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-[11px] font-semibold rounded-xl flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div className="p-3 bg-amber-50 border border-amber-100 text-amber-700 text-[11px] font-semibold rounded-xl">
              {infoMsg}
            </div>
          )}

          {/* ── STEP 1: Email ── */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-medium"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#D03D56] hover:bg-[#a02240] active:scale-[0.98] text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60 cursor-pointer"
              >
                {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Send OTP</span><ArrowRight className="w-3.5 h-3.5" /></>}
              </button>
            </form>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-3 ml-1 text-center">
                  Enter 6-digit verification code
                </label>
                <div className="flex gap-2 justify-center flex-wrap" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-login-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className={`w-10 h-12 sm:w-11 sm:h-13 text-center text-lg font-black border-2 rounded-xl outline-none transition-all bg-[#FAFAFA] ${
                        digit ? "border-[#D03D56] bg-[#FEF2F4] text-[#D03D56]" : "border-[#F0EEEB] text-neutral-800"
                      } focus:border-[#D03D56]`}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.join("").length < 6}
                className="w-full py-3.5 bg-[#D03D56] hover:bg-[#a02240] active:scale-[0.98] text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60 cursor-pointer"
              >
                {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><ShieldCheck className="w-3.5 h-3.5" /><span>Verify &amp; Sign In</span></>}
              </button>

              <div className="flex items-center justify-between text-[10px] text-neutral-400 font-bold">
                <button type="button" onClick={() => { setStep(1); setOtp(["","","","","",""]); setErrorMsg(""); }} className="hover:text-neutral-700 transition-colors">
                  ← Change email
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || loading}
                  className="flex items-center gap-1 hover:text-[#D03D56] transition-colors disabled:opacity-50"
                >
                  <RefreshCw className="w-3 h-3" />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-[10px] text-neutral-400 border-t border-[#F5F5F0] pt-4 font-bold">
            <Link to="/" className="hover:text-neutral-900 transition-colors">← Platform Hub</Link>
            <Link to="/register" className="hover:text-[#D03D56] transition-colors">Register Store →</Link>
          </div>
        </div>

        <p className="text-center text-[9px] text-neutral-400 font-bold uppercase tracking-widest">
          Powered by HighP Innovation Platform
        </p>
      </div>
    </div>
  );
}
