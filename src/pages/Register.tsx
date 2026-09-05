import { useEffect, useState, type FormEvent } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { useAuth } from "../auth";
import { useRouter } from "../router";
import { Logo } from "../components/atoms";
import { supabase } from "../lib/supabaseClient";
import "../styles/auth.css";

const RESEND_COOLDOWN_SECONDS = 60;

export default function Register() {
  const { signUp } = useAuth();
  const { navigate } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendNote, setResendNote] = useState<string | null>(null);
  const [resendOk, setResendOk] = useState(true);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("كلمة المرور تجب أن تكون 6 أحرف على الأقل.");
      return;
    }
    if (password !== confirm) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }

    setSubmitting(true);
    const { error: signUpError, needsEmailConfirmation } = await signUp(email.trim(), password);
    setSubmitting(false);

    if (signUpError) {
      setError(signUpError);
      return;
    }

    if (needsEmailConfirmation) {
      setPendingEmail(email.trim());
      setCooldown(RESEND_COOLDOWN_SECONDS);
      return;
    }

    navigate("/");
  }

  async function handleResend() {
    if (!pendingEmail || resending || cooldown > 0) return;
    setResending(true);
    setResendNote(null);
    const { error: resendError } = await supabase.auth.resend({ type: "signup", email: pendingEmail });
    setResending(false);
    if (resendError) {
      setResendOk(false);
      setResendNote("تعذّر إعادة الإرسال. حاول مرة أخرى بعد قليل.");
      return;
    }
    setResendOk(true);
    setResendNote("تم إعادة إرسال رابط التأكيد إلى بريدك.");
    setCooldown(RESEND_COOLDOWN_SECONDS);
  }

  if (pendingEmail) {
    return (
      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-brand">
            <Logo />
          </div>
          <div className="auth-verify-icon">
            <MailCheck size={28} />
          </div>
          <h1 className="auth-title">تفقّد بريدك الإلكتروني</h1>
          <p className="auth-subtitle">
            أرسلنا رابط تأكيد الحساب إلى{" "}
            <span className="auth-verify-email" dir="ltr">{pendingEmail}</span>
            {" "}اضغط على الرابط لإكمال التسجيل، ثم سجّل الدخول. لا تجد الرسالة؟ تحقّق من مجلد الرسائل غير المرغوبة.
          </p>

          {resendNote ? <div className={resendOk ? "auth-success" : "auth-error"}>{resendNote}</div> : null}

          <button className="auth-btn" onClick={handleResend} disabled={resending || cooldown > 0}>
            {resending
              ? <Loader2 size={18} className="auth-spin" />
              : cooldown > 0
                ? `إعادة الإرسال بعد ${cooldown} ثانية`
                : "إعادة إرسال رابط التأكيد"}
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
          <Logo />
        </div>
        <h1 className="auth-title">إنشاء حساب</h1>
        <p className="auth-subtitle">الحساب الجديد يمنحك الحجز مع أفضل مقدمي الخدمات في مدينتك</p>

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

          <label className="auth-field">
            <span>كلمة المرور</span>
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              dir="ltr"
            />
          </label>

          <label className="auth-field">
            <span>تأكيد كلمة المرور</span>
            <input
              className="auth-input"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
              dir="ltr"
            />
          </label>

          {error ? <div className="auth-error">{error}</div> : null}

          <button className="auth-btn" type="submit" disabled={submitting}>
            {submitting ? <Loader2 size={18} className="auth-spin" /> : "إنشاء الحساب"}
          </button>
        </form>

        <p className="auth-link-row">
          لديك حساب بالفعل؟{" "}
          <button className="auth-link" onClick={() => navigate("/login")}>
            سجّل الدخول
          </button>
        </p>
      </div>
    </main>
  );
}
