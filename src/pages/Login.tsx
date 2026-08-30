import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "../auth";
import { useRouter } from "../router";
import { Logo } from "../components/atoms";
import "../styles/auth.css";

export default function Login() {
  const { signIn } = useAuth();
  const { navigate } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signInError } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (signInError) {
      setError(signInError);
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
        <h1 className="auth-title">تسجيل الدخول</h1>
        <p className="auth-subtitle">أهلاً بعودتك إلى maak</p>

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
              autoComplete="current-password"
              required
              dir="ltr"
            />
          </label>

          {error ? <div className="auth-error">{error}</div> : null}

          <button className="auth-btn" type="submit" disabled={submitting}>
            {submitting ? <Loader2 size={18} className="auth-spin" /> : "دخول"}
          </button>
        </form>

        <p className="auth-link-row">
          ليس عندك حساب؟{" "}
          <button className="auth-link" onClick={() => navigate("/register")}>
            أنشئ حساباً
          </button>
        </p>
      </div>
    </main>
  );
}
