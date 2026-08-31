import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "../auth";
import { useToast } from "../context";
import { fetchProviderProfile, SERVICE_OPTIONS, updateProviderMarketplaceProfile } from "../lib/onboarding";
import { ServiceChip } from "./atoms";

type Status = "loading" | "ready" | "error";

export default function ProviderProfileEditor() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [status, setStatus] = useState<Status>("loading");
  const [services, setServices] = useState<string[]>([]);
  const [priceFrom, setPriceFrom] = useState("");
  const [radius, setRadius] = useState("");
  const [photoPublic, setPhotoPublic] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    setStatus("loading");
    fetchProviderProfile(user.id)
      .then((p) => {
        if (!active) return;
        if (!p) { setStatus("error"); return; }
        setServices(p.services ?? []);
        setPriceFrom(p.price_from == null ? "" : String(p.price_from));
        setRadius(p.service_radius_km == null ? "" : String(p.service_radius_km));
        setPhotoPublic(!!p.profile_photo_public);
        setStatus("ready");
      })
      .catch(() => { if (active) setStatus("error"); });
    return () => { active = false; };
  }, [user]);

  const toggleService = (svc: string) => {
    setServices((cur) => (cur.includes(svc) ? cur.filter((s) => s !== svc) : [...cur, svc]));
  };

  const save = async () => {
    if (!user) return;
    const price = priceFrom.trim();
    if (price !== "" && (isNaN(Number(price)) || Number(price) < 0)) {
      showToast("السعر: رقم صحيح غير سالب");
      return;
    }
    const r = radius.trim();
    if (r !== "" && (isNaN(Number(r)) || Number(r) <= 0)) {
      showToast("نطاق العمل: رقم صحيح موجب");
      return;
    }
    setSaving(true);
    try {
      await updateProviderMarketplaceProfile(user.id, {
        services,
        price_from: price,
        service_radius_km: r,
        profile_photo_public: photoPublic,
      });
      showToast("تم حفظ بيانات ملفك المهني");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "تعذّر الحفظ");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return <div className="empty-state"><Loader2 className="spin" size={20} /><p>جارٍ تحميل ملفك المهني…</p></div>;
  }
  if (status === "error") {
    return <div className="empty-state"><p>تعذّر تحميل ملفك المهني. أكمل الاعتماد أولاً.</p></div>;
  }

  return (
    <div className="provider-profile-editor">
      <div className="admin-top">
        <div>
          <span className="section-kicker">ملفي المهني</span>
          <h1>بيانات صفحتك العامة</h1>
        </div>
        <span className="verified"><ShieldCheck size={14} /> موثّق</span>
      </div>

      <div className="onb-fields">
        <div className="onb-field">
          <span>الخدمات التي تقدّمها</span>
          <p className="onb-step-sub">تظهر في صفحتك للعملاء.</p>
          <div className="service-chips">
            {SERVICE_OPTIONS.map((svc) => (
              <ServiceChip key={svc} label={svc} active={services.includes(svc)} onClick={() => toggleService(svc)} />
            ))}
          </div>
        </div>

        <label className="onb-field">
          <span>السعر التقريبي (اختياري)</span>
          <input className="field" inputMode="decimal" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} placeholder="مثال: 150" />
          <small>اتركه فارغاً لعرض «السعر عند التواصل».</small>
        </label>

        <label className="onb-field">
          <span>نطاق العمل (كم) (اختياري)</span>
          <input className="field" inputMode="numeric" value={radius} onChange={(e) => setRadius(e.target.value)} placeholder="مثال: 10" maxLength={3} />
        </label>

        <label className="onb-field">
          <span>إظهار صورتي الشخصية في صفحتي العامة</span>
          <input type="checkbox" checked={photoPublic} onChange={(e) => setPhotoPublic(e.target.checked)} />
          <small>يُفعّل بعد الاعتماد. تبقى الوثائق خاصة دائماً.</small>
        </label>
      </div>

      <div className="cta-row">
        <button className="primary" onClick={() => void save()} disabled={saving}>
          {saving ? <Loader2 className="spin" size={16} /> : null}
          حفظ التغييرات
        </button>
      </div>
    </div>
  );
}
