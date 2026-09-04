import { useState, type FormEvent } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "../auth";
import { Logo } from "../components/atoms";
import "../styles/auth.css";
import "../styles/admin-auth.css";

/**
 * Dedicated administrator sign-in (/admin/login). Uses the existing Supabase
 * Auth session — no second auth system. The parent gate in App.tsx sends
 * admins to /admin and keeps every non-admin outside the admin panel.
 */
export default function AdminLogin() {
  const { user, profile, profileLoading, signIn, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user && !profileLoading && (profile?.role ?? "customer") !== "admin") {
    return (
      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-brand">
            <Logo />
          </div>
          <span className="auth-admin-chip"><ShieldCheck size={13} /> منطقة المشرفين</span>
          <h1 className="auth-title">لا تملك صلاحيات إدارية</h1>
          <p className="auth-subtitle">
            تم تسجيل الدخول بحساب لا يملك صلاحيات الإدارة. سجّل الخروج ثم استخدم حساب المشرف الخاص بك.
          </p>
          <button className="auth-btn" onClick={() => void signOut()}>تسجيل الخروج</button>
        </div>
      </main>
    );
  }

  if (user) {
    return (
      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-brand">
            <Logo />
          </div>
          <h1 className="auth-title">جارٍ التحقق من الصلاحيات…</h1>
          <p className="auth-subtitle">نتحقق من صلاحيات حسابك قبل الدخول إلى لوحة الإدارة.</p>
          <div className="auth-admin-checking"><Loader2 size={22} className="auth-spin" /></div>
        </div>
      </main>
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signInError } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (signInError) {
      setError(signInError);
    }
    // On success the auth context resolves the profile; the parent gate then
    // redirects admins to /admin and this screen shows its checking state.
  }

  return (
    <main className="auth-main">
      <div className="auth-card">
        <div className="auth-brand">
          <Logo />
        </div>
        <span className="auth-admin-chip"><ShieldCheck size={13} /> منطقة المشرفين</span>
        <h1 className="auth-title">دخول المشرفين</h1>
        <p className="auth-subtitle">
          بوابة مخصصة لمشرفي منصة معك لإدارة طلبات مقدمي الخدمات والتحقق منهم.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>البريد الإلكتروني</span>
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
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
            {submitting ? <Loader2 size={18} className="auth-spin" /> : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </main>
  );
}
