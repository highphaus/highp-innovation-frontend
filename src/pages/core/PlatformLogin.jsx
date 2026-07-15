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
    startResendCooldown();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--surface-2)] p-4 antialiased sm:p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="animate-fade-up space-y-6 rounded-[32px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)] sm:p-8">
          <div className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand)] shadow-sm">
              {step === 1 ? <Store className="h-6 w-6 text-white" /> : <ShieldCheck className="h-6 w-6 text-white" />}
            </div>
            <h2 className="text-xl font-black tracking-[-0.02em] text-[var(--text-primary)]">HighP Platform</h2>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-3)]">
              {step === 1 ? "Sign in to your store dashboard" : `OTP sent to ${email}`}
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex gap-2">
            {[1, 2].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= s ? "bg-[var(--brand)]" : "bg-[var(--border)]"}`} />
            ))}
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-[11px] font-semibold text-red-700">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-[11px] font-semibold text-amber-700">
              {infoMsg}
            </div>
          )}

          {/* ── STEP 1: Email ── */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="form-label ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-4)]" />
                  <input
                    required
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    className="input pl-10 pr-4 text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full rounded-2xl px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.24em] disabled:opacity-70"
              >
                {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Send OTP</span><ArrowRight className="w-3.5 h-3.5" /></>}
              </button>
            </form>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <label className="mb-3 ml-1 block text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-3)]">
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
                      className={`h-12 w-10 rounded-2xl border-2 bg-[var(--surface)] text-center text-lg font-black transition-all sm:h-13 sm:w-11 ${
                        digit ? "border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)]" : "border-[var(--border)] text-[var(--text-primary)]"
                      } focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15`}
                      aria-label={`OTP Digit ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.join("").length < 6}
                className="btn-primary w-full rounded-2xl px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.24em] disabled:opacity-70"
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
                  className="flex items-center gap-1 transition-colors hover:text-[var(--brand)] disabled:opacity-50"
                >
                  <RefreshCw className="w-3 h-3" />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 text-[10px] font-semibold text-[var(--text-3)]">
            <Link to="/" className="transition-colors hover:text-[var(--text-primary)]">← Platform Hub</Link>
            <Link to="/register" className="transition-colors hover:text-[var(--brand)]">Register Store →</Link>
          </div>
        </div>

        <p className="text-center text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--text-4)]">
          Powered by HighP Innovation Platform
        </p>
      </div>
    </div>
  );
}
