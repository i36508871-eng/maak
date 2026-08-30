import { useEffect, useState } from "react";
import { Ban, Clock, Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { useAuth } from "../auth";
import { useRouter } from "../router";
import { useToast } from "../context";
import * as onb from "../lib/onboarding";
import type { DocType, OnboardingPersonal, OnboardingProfessional, ProviderDocumentRow, ProviderProfileRow } from "../lib/onboarding";
import Progress from "../components/onboarding/Progress";
import PersonalStep from "../components/onboarding/PersonalStep";
import ProfessionalStep from "../components/onboarding/ProfessionalStep";
import DocumentsStep from "../components/onboarding/DocumentsStep";
import ReviewStep from "../components/onboarding/ReviewStep";
import "../styles/onboarding.css";

export default function Onboarding() {
  const { user, profile, role, loading } = useAuth();
  const { navigate } = useRouter();
  const { showToast } = useToast();

  const [booting, setBooting] = useState(true);
  const [bootError, setBootError] = useState<string | null>(null);
  const [provider, setProvider] = useState<ProviderProfileRow | null>(null);
  const [documents, setDocuments] = useState<ProviderDocumentRow[]>([]);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [personal, setPersonal] = useState<OnboardingPersonal>({ full_name: "", phone: "", city: "" });
  const [professional, setProfessional] = useState<OnboardingProfessional>({ profession: "", service_category: "", experience_years: "", bio: "" });

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (profile) {
      setPersonal((p) => ({
        full_name: p.full_name || profile.full_name || "",
        phone: p.phone || profile.phone || "",
        city: p.city || profile.city || "",
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (loading || !user) return;
    if (role === "admin") { setBooting(false); return; }
    let active = true;
    (async () => {
      try {
        const prof = await onb.ensureDraft(user.id);
        if (!active) return;
        setProvider(prof);
        setProfessional({
          profession: prof.profession || "",
          service_category: prof.service_category || "",
          experience_years: prof.experience_years == null ? "" : String(prof.experience_years),
          bio: prof.bio || "",
        });
        const docs = await onb.listDocuments(user.id);
        if (!active) return;
        setDocuments(docs);
      } catch (e) {
        if (active) setBootError(e instanceof Error ? e.message : "تعذّر تحميل الطلب");
      } finally {
        if (active) setBooting(false);
      }
    })();
    return () => { active = false; };
  }, [loading, user, role]);

  if (loading || booting) {
    return <main className="screen onb-loading"><Loader2 className="auth-spin" size={26} /></main>;
  }
  if (!user) return null;

  if (role === "admin") {
    return (
      <main className="screen">
        <div className="onb-status-card">
          <span className="onb-status-icon suspended"><ShieldAlert size={26} /></span>
          <h1 className="onb-status-title">غير متاح للمشرفين</h1>
          <p className="onb-status-body">حسابات المشرفين ما تقدرش تقدم طلب كمقدم خدمة.</p>
          <button className="primary" onClick={() => navigate("/")}>العودة للرئيسية</button>
        </div>
      </main>
    );
  }

  if (bootError) {
    return (
      <main className="screen">
        <div className="onb-status-card">
          <span className="onb-status-icon suspended"><ShieldAlert size={26} /></span>
          <h1 className="onb-status-title">تعذّر تحميل الطلب</h1>
          <p className="onb-status-body">{bootError}</p>
          <button className="primary" onClick={() => navigate("/account")}>العودة إلى حسابي</button>
        </div>
      </main>
    );
  }

  const status = provider?.verification_status;

  if (done || status === "pending") {
    return (
      <main className="screen">
        <div className="onb-status-card">
          <span className="onb-status-icon pending"><Clock size={26} /></span>
          <h1 className="onb-status-title">طلبك قيد المراجعة</h1>
          <p className="onb-status-body">وصلنا طلبك وغادي يمر على مراجعة من طرف إدارة معاك. ما تقدرش تعدل عليه دابا. غادي نعلموك بالنتيجة.</p>
          <button className="primary" onClick={() => navigate("/account")}>العودة إلى حسابي</button>
        </div>
      </main>
    );
  }
  if (status === "approved") {
    return (
      <main className="screen">
        <div className="onb-status-card">
          <span className="onb-status-icon approved"><ShieldCheck size={26} /></span>
          <h1 className="onb-status-title">تم اعتمادك كمقدم خدمة</h1>
          <p className="onb-status-body">طلبك تاع الاعتماد قبّلوه. تفعيل حسابك كمقدم خدمة فالمنصة غادي يكون قريب.</p>
          <button className="primary" onClick={() => navigate("/account")}>العودة إلى حسابي</button>
        </div>
      </main>
    );
  }
  if (status === "suspended") {
    return (
      <main className="screen">
        <div className="onb-status-card">
          <span className="onb-status-icon suspended"><Ban size={26} /></span>
          <h1 className="onb-status-title">تم تعليق حسابك</h1>
          <p className="onb-status-body">حسابك كمقدم خدمة معلق. تواصل مع إدارة معاك لمزيد من المعلومات.</p>
          <button className="primary" onClick={() => navigate("/account")}>العودة إلى حسابي</button>
        </div>
      </main>
    );
  }

  function next() {
    if (step === 1) {
      const err = onb.validatePersonal(personal);
      if (err) return showToast(err);
      setStep(2);
    } else if (step === 2) {
      const err = onb.validateProfessional(professional);
      if (err) return showToast(err);
      setStep(3);
    } else if (step === 3) {
      const required = (Object.keys(onb.DOC_TYPES) as DocType[]).filter((t) => onb.DOC_TYPES[t].required);
      const missing = required.filter((t) => !documents.some((d) => d.document_type === t));
      if (missing.length) return showToast("يرجى رفع جميع الوثائق المطلوبة");
      setStep(4);
    }
  }
  function prev() { setStep((s) => Math.max(1, s - 1)); }
  async function submit() {
    if (!user) return;
    setSubmitting(true);
    try {
      const required = (Object.keys(onb.DOC_TYPES) as DocType[]).filter((t) => onb.DOC_TYPES[t].required);
      await onb.submitOnboarding(user.id, personal, professional, required);
      setDone(true);
      showToast("تم إرسال طلبك بنجاح");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "تعذّر إرسال الطلب");
    } finally {
      setSubmitting(false);
    }
  }

  const isRejected = status === "rejected";

  return (
    <main className="screen onb-wrap">
      <div className="page-title">
        <div>
          <span className="section-kicker">قدّم خدماتك معنا</span>
          <h1>طلب التحقق كمقدم خدمة</h1>
        </div>
      </div>
      <Progress step={step} />
      {isRejected ? <div className="onb-banner">تم رفض طلبك السابق. عدّل المعلومات وأعد الإرسال.</div> : null}
      {step === 1 ? <PersonalStep value={personal} onChange={setPersonal} /> : null}
      {step === 2 ? <ProfessionalStep value={professional} onChange={setProfessional} /> : null}
      {step === 3 ? <DocumentsStep userId={user.id} documents={documents} onDocumentsChange={setDocuments} /> : null}
      {step === 4 ? <ReviewStep personal={personal} professional={professional} documents={documents} /> : null}
      <div className="onb-nav">
        {step > 1 ? <button className="secondary" type="button" onClick={prev}>السابق</button> : null}
        {step < 4 ? (
          <button className="primary" type="button" onClick={next}>التالي</button>
        ) : (
          <button className="primary" type="button" onClick={submit} disabled={submitting}>
            {submitting ? <Loader2 className="auth-spin" size={16} /> : null}
            <span>إرسال طلب التحقق</span>
          </button>
        )}
      </div>
    </main>
  );
}
