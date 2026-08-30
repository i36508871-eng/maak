import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "../auth";
import { useRouter } from "../router";
import { Logo } from "../components/atoms";
import "../styles/auth.css";

export default function Register() {
  const { signUp } = useAuth();
  const { navigate } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

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
      setSuccess("تم إنشاء حسابك. تحقق من بريدك الإلكتروني لإكمال التسجيل، ثم سجّل الدخول.");
      setEmail("");
      setPassword("");
      setConfirm("");
      return;
    }

    navigate("/");
  }

  return (
    <main className="auth-main">
      <div className="auth-card">
        <div className="auth-brand">
          <Logo />
        </div>
        <h1 className="auth-title">إنشاء حساب</h1>
        <p className="auth-subtitle">انضم إلى maak واحجز مقدمي الخدمات الموثوقيين</p>

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
          {success ? <div className="auth-success">{success}</div> : null}

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
