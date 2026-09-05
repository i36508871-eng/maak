import { useEffect, useState, type FormEvent } from "react";
import { AlertTriangle, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "../auth";
import { useRouter } from "../router";
import { Logo } from "../components/atoms";
import { supabase } from "../lib/supabaseClient";
import "../styles/auth.css";
import { useLanguage } from "../i18n";

type PageStatus = "checking" | "ready" | "invalid" | "success";

function translateUpdateError(error: unknown): string {
  const message =
    error && typeof error === "object" && "message" in error
      ? String((error as { message?: unknown }).message ?? "")
      : String(error ?? "");
  const m = message.toLowerCase();
  if (m.includes("should be") || m.includes("weak") || m.includes("at least"))
    return t("auth.err.weakPassword");
  if (m.includes("rate limit") || m.includes("too many"))
    return t("auth.err.rateLimit");
  if (m.includes("session") || m.includes("not found") || m.includes("expired"))
    return "انتهت صلاحية جلسة الاستعادة. اطلب رابطاً جديدًا.";
  if (m.includes("network") || m.includes("fetch") || m.includes("failed"))
    return t("auth.err.network");
  return t("auth.resetFail");
}

export default function ResetPassword() {
  const { t } = useLanguage();
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
      setError(t("auth.pwMatch"));
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
          <Logo variant="lockup" />
        </div>

        {status === "checking" ? (
          <div className="auth-checking">
            <Loader2 size={26} className="auth-spin" />
            <p className="auth-subtitle">{t("auth.verifying")}</p>
          </div>
        ) : null}

        {status === "ready" ? (
          <>
            <div className="auth-verify-icon">
              <KeyRound size={28} />
            </div>
            <h1 className="auth-title">{t("auth.resetTitle")}</h1>
            <p className="auth-subtitle">{t("auth.resetSub")}</p>
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
                <span>{t("auth.confirmPassword")}</span>
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
                {submitting ? <Loader2 size={18} className="auth-spin" /> : t("auth.resetBtn")}
              </button>
            </form>
          </>
        ) : null}

        {status === "success" ? (
          <>
            <div className="auth-verify-icon">
              <ShieldCheck size={28} />
            </div>
            <h1 className="auth-title">{t("auth.resetOk")}</h1>
            <p className="auth-subtitle">{t("auth.resetOkBody")}</p>
            <button className="auth-btn" onClick={() => void goToLogin()}>{t("auth.loginTitle")}</button>
          </>
        ) : null}

        {status === "invalid" ? (
          <>
            <div className="auth-verify-icon">
              <AlertTriangle size={28} />
            </div>
            <h1 className="auth-title">{t("auth.linkExpired")}</h1>
            <p className="auth-subtitle">{t("auth.linkExpiredBody")}</p>
            <button className="auth-btn" onClick={() => navigate("/forgot-password")}>{t("auth.requestNewLink")}</button>
            <p className="auth-link-row">
              <button className="auth-link" onClick={() => navigate("/login")}>{t("auth.backToLogin")}</button>
            </p>
          </>
        ) : null}
      </div>
    </main>
  );
}
