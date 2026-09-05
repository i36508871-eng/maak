import { useEffect, useState, type FormEvent } from "react";
import { AlertTriangle, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "../auth";
import { useRouter } from "../router";
import { Logo } from "../components/atoms";
import { supabase } from "../lib/supabaseClient";
import "../styles/auth.css";

type PageStatus = "checking" | "ready" | "invalid" | "success";

function translateUpdateError(error: unknown): string {
  const message =
    error && typeof error === "object" && "message" in error
      ? String((error as { message?: unknown }).message ?? "")
      : String(error ?? "");
  const m = message.toLowerCase();
  if (m.includes("should be") || m.includes("weak") || m.includes("at least"))
    return "كلمة المرور ضعيفة. استخدم 6 أحرف على الأقل.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "محاولات كثيرة. حاول مرة أخرى بعد قليل.";
  if (m.includes("session") || m.includes("not found") || m.includes("expired"))
    return "انتهت صلاحية جلسة الاستعادة. اطلب رابطاً جديدًا.";
  if (m.includes("network") || m.includes("fetch") || m.includes("failed"))
    return "تعذّر الاتصال بالخادم. تحقق من الإنترنت.";
  return "تعذّر تحديث كلمة المرور. حاول مرة أخرى.";
}

export default function ResetPassword() {
  const { signOut } = useAuth();
  const { navigate } = useRouter();
  const [status, setStatus] = useState<PageStatus>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function checkRecoverySession() {
      const params = new URLSearchParams(window.location.search);
      const urlError = params.get("error") || params.get("error_description");
      const code = params.get("code");

      if (urlError) {
        if (!cancelled) setStatus("invalid");
        return;
      }

      if (code) {
        // PKCE flow: exchange the one-time code for a recovery session.
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (!cancelled && !exchangeError) {
          setStatus("ready");
          return;
        }
      }

      // The client may have already exchanged the link (detectSessionInUrl).
      const { data } = await supabase.auth.getSession();
      if (!cancelled) setStatus(data.session ? "ready" : "invalid");
    }

    void checkRecoverySession();
    return () => {
      cancelled = true;
    };
  }, []);

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
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (updateError) {
      setError(translateUpdateError(updateError));
      return;
    }

    setStatus("success");
  }

  async function goToLogin() {
    await signOut();
    navigate("/login");
  }

  return (
    <main className="auth-main">
      <div className="auth-card">
        <div className="auth-brand">
          <Logo />
        </div>

        {status === "checking" ? (
          <div className="auth-checking">
            <Loader2 size={26} className="auth-spin" />
            <p className="auth-subtitle">جارٍ التحقق من رابط الاستعادة…</p>
          </div>
        ) : null}

        {status === "ready" ? (
          <>
            <div className="auth-verify-icon">
              <KeyRound size={28} />
            </div>
            <h1 className="auth-title">كلمة مرور جديدة</h1>
            <p className="auth-subtitle">اختر كلمة مرور جديدة لحسابك في maak</p>
            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="auth-field">
                <span>كلمة المرور الجديدة</span>
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
                {submitting ? <Loader2 size={18} className="auth-spin" /> : "تعيين كلمة المرور"}
              </button>
            </form>
          </>
        ) : null}

        {status === "success" ? (
          <>
            <div className="auth-verify-icon">
              <ShieldCheck size={28} />
            </div>
            <h1 className="auth-title">تم تحديث كلمة المرور</h1>
            <p className="auth-subtitle">تم تحديث كلمة مرورك بنجاح. سجّل الدخول باستخدام كلمة المرور الجديدة.</p>
            <button className="auth-btn" onClick={() => void goToLogin()}>تسجيل الدخول</button>
          </>
        ) : null}

        {status === "invalid" ? (
          <>
            <div className="auth-verify-icon">
              <AlertTriangle size={28} />
            </div>
            <h1 className="auth-title">انتهت صلاحية الرابط</h1>
            <p className="auth-subtitle">يبدو أن رابط الاستعادة منتهي أو غير صالح. يمكنك طلب رابط استعادة جديد من صفحة استعادة كلمة المرور.</p>
            <button className="auth-btn" onClick={() => navigate("/forgot-password")}>طلب رابط استعادة جديد</button>
            <p className="auth-link-row">
              <button className="auth-link" onClick={() => navigate("/login")}>العودة لتسجيل الدخول</button>
            </p>
          </>
        ) : null}
      </div>
    </main>
  );
}
