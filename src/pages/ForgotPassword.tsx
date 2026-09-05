import { useEffect, useState, type FormEvent } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { useRouter } from "../router";
import { Logo } from "../components/atoms";
import { supabase } from "../lib/supabaseClient";
import "../styles/auth.css";

const RESEND_COOLDOWN_SECONDS = 60;

/** Recovery emails land on /reset-password at the GitHub Pages origin. */
const RESET_REDIRECT_URL = "https://i36508871-eng.github.io/maak/reset-password";

export default function ForgotPassword() {
  const { navigate } = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendNote, setResendNote] = useState<string | null>(null);
  const [resendOk, setResendOk] = useState(true);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function requestReset(target: string, isResend: boolean) {
    if (isResend) {
      if (resending || cooldown > 0) return;
      setResending(true);
      setResendNote(null);
    } else {
      setSubmitting(true);
      setError(null);
    }

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(target, {
      redirectTo: RESET_REDIRECT_URL,
    });

    if (isResend) setResending(false);
    else setSubmitting(false);

    if (resetError) {
      const m = String(resetError.message ?? "").toLowerCase();
      const tooMany = m.includes("rate limit") || m.includes("too many") || m.includes("for security");
      const network = m.includes("network") || m.includes("fetch") || m.includes("failed");
      if (tooMany || network) {
        const note = tooMany
          ? "محاولات كثيرة. حاول مرة أخرى بعد قليل."
          : "تعذّر الاتصال بالخادم. تحقق من الإنترنت.";
        if (isResend) {
          setResendOk(false);
          setResendNote(note);
        } else {
          setError(note);
        }
        return;
      }
    }

    // Generic success for any other outcome — never reveal whether the email is registered.
    if (isResend) {
      setResendOk(true);
      setResendNote("تمت إعادة إرسال رسالة الاستعادة إلى بريدك.");
    }
    setSentTo(target);
    setCooldown(RESEND_COOLDOWN_SECONDS);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void requestReset(email.trim(), false);
  }

  if (sentTo) {
    return (
      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-brand">
            <Logo variant="lockup" />
          </div>
          <div className="auth-verify-icon">
            <MailCheck size={28} />
          </div>
          <h1 className="auth-title">تحقق من بريدك الإلكتروني</h1>
          <p className="auth-subtitle">
            أرسلنا رابط استعادة كلمة المرور إلى{" "}
            <span className="auth-verify-email" dir="ltr">{sentTo}</span>
            {" "}اتبع الرابط لإعادة تعيين كلمة مرور جديدة. لا تجد الرسالة؟ تحقّق من مجلد الرسائل غير المرغوبة.
          </p>

          {resendNote ? <div className={resendOk ? "auth-success" : "auth-error"}>{resendNote}</div> : null}

          <button className="auth-btn" onClick={() => void requestReset(sentTo, true)} disabled={resending || cooldown > 0}>
            {resending
              ? <Loader2 size={18} className="auth-spin" />
              : cooldown > 0
                ? `إعادة الإرسال بعد ${cooldown} ثانية`
                : "إعادة إرسال رابط الاستعادة"}
          </button>

          <p className="auth-link-row">
            <button className="auth-link" onClick={() => navigate("/login")}>العودة لتسجيل الدخول</button>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-main">
      <div className="auth-card">
        <div className="auth-brand">
          <Logo variant="lockup" />
        </div>
        <h1 className="auth-title">استعادة كلمة المرور</h1>
        <p className="auth-subtitle">أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>البريد الإلكتروني</span>
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              dir="ltr"
            />
          </label>

          {error ? <div className="auth-error">{error}</div> : null}

          <button className="auth-btn" type="submit" disabled={submitting}>
            {submitting ? <Loader2 size={18} className="auth-spin" /> : "إرسال رابط الاستعادة"}
          </button>
        </form>

        <p className="auth-link-row">
          <button className="auth-link" onClick={() => navigate("/login")}>العودة لتسجيل الدخول</button>
        </p>
      </div>
    </main>
  );
}
