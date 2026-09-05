import { useEffect, useState, type ReactNode } from "react";
import { Ban, Clock, Edit3, Loader2, LogOut, Rocket, ShieldCheck } from "lucide-react";
import { useAuth } from "../auth";
import { useRouter } from "../router";
import { useToast } from "../context";
import { fetchProviderProfile } from "../lib/onboarding";
import { useLanguage } from "../i18n";

function roleLabel(role: string): string {
  const { t } = useLanguage();
  if (role === "admin") return t("account.roleAdmin");
  if (role === "provider") return t("account.roleProvider");
  return t("account.roleCustomer");
}

export default function Account() {
  const { t } = useLanguage();
  const { user, profile, role, signOut, loading } = useAuth();
  const { navigate } = useRouter();
  const { showToast } = useToast();
  const [status, setStatus] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      try {
        const prof = await fetchProviderProfile(user.id);
        if (active) {
          setStatus(prof?.verification_status ?? null);
          setRejectionReason(prof?.rejection_reason ?? null);
        }
      } catch (e) {
        if (active) setLoadErr(e instanceof Error ? e.message : t("account.statusError"));
      } finally {
        if (active) setLoadingStatus(false);
      }
    })();
    return () => { active = false; };
  }, [user]);

  async function handleSignOut() {
  const { t } = useLanguage();
    await signOut();
    showToast(t("nav.loggedOut"));
    navigate("/");
  }

  if (loading || (user && loadingStatus)) {
    return <main className="screen onb-loading"><Loader2 className="auth-spin" size={26} /></main>;
  }
  if (!user) return null;

  const email = user.email ?? "";
  const displayName = profile?.full_name || (email ? email.split("@")[0] : "");

  let statusBlock: ReactNode;
  if (loadErr) {
    statusBlock = (
      <div className="acct-status">
        <p className="acct-status-body">{loadErr}</p>
        <button className="secondary" onClick={() => window.location.reload()}>{t("common.retry")}</button>
      </div>
    );
  } else if (status === null) {
    statusBlock = (
      <div className="acct-status">
        <h3 className="acct-status-title">{t("account.applyTitle")}</h3>
        <p className="acct-status-body">{t("account.applyBody")}</p>
        <button className="primary" onClick={() => navigate("/onboarding")}><Rocket size={16} /> ابدأ التقديم</button>
      </div>
    );
  } else if (status === "draft") {
    statusBlock = (
      <div className="acct-status">
        <h3 className="acct-status-title">{t("account.draftTitle")}</h3>
        <p className="acct-status-body">{t("account.draftBody")}</p>
        <button className="primary" onClick={() => navigate("/onboarding")}>{t("account.draftCta")}</button>
      </div>
    );
  } else if (status === "pending") {
    statusBlock = (
      <div className="acct-status">
        <h3 className="acct-status-title"><Clock size={15} /> طلبك قيد المراجعة</h3>
        <p className="acct-status-body">{t("account.reviewBody")}</p>
      </div>
    );
  } else if (status === "rejected") {
    statusBlock = (
      <div className="acct-status">
        <h3 className="acct-status-title"><Edit3 size={15} /> تعديل الطلب وإعادة الإرسال</h3>
        <p className="acct-status-body">تم رفض طلبك السابق. راجع السبب، ثم عدّل المعلومات وأعد الإرسال.</p>
        {rejectionReason ? <p className="acct-reason"><b>{t("account.reason")}</b> {rejectionReason}</p> : null}
        <button className="primary" onClick={() => navigate("/onboarding")}>{t("account.editCta")}</button>
      </div>
    );
  } else if (status === "approved") {
    statusBlock = (
      <div className="acct-status">
        <h3 className="acct-status-title"><ShieldCheck size={15} /> تم اعتمادك</h3>
        <p className="acct-status-body">تمت الموافقة على طلب اعتمادك. سيُفعّل حسابك كمقدم خدمة على المنصة قريباً.</p>
      </div>
    );
  } else if (status === "suspended") {
    statusBlock = (
      <div className="acct-status">
        <h3 className="acct-status-title"><Ban size={15} /> تم تعليق حسابك</h3>
        <p className="acct-status-body">حسابك كمقدم خدمة موقوف مؤقتاً. يرجى التواصل مع إدارة maak.</p>
      </div>
    );
  } else {
    statusBlock = <div className="acct-status"><p className="acct-status-body">{t("account.unknownStatus")}</p></div>;
  }

  return (
    <main className="screen">
      <div className="page-title">
        <div>
          <span className="section-kicker">{t("nav.account")}</span>
          <h1>{t("account.personalInfo")}</h1>
        </div>
      </div>
      <div className="acct-card">
        <div className="acct-row"><span>{t("common.name")}</span><span>{displayName || "—"}</span></div>
        <div className="acct-row"><span>{t("common.email")}</span><span>{email}</span></div>
        <div className="acct-row"><span>{t("common.role")}</span><span>{roleLabel(role)}</span></div>
        {profile?.city ? <div className="acct-row"><span>{t("common.city")}</span><span>{profile.city}</span></div> : null}
        {profile?.phone ? <div className="acct-row"><span>{t("common.phone")}</span><span>{profile.phone}</span></div> : null}
        {statusBlock}
        <div className="onb-nav" style={{ marginTop: 18 }}>
          <button className="secondary" onClick={handleSignOut}><LogOut size={16} /> تسجيل الخروج</button>
        </div>
      </div>
    </main>
  );
}
