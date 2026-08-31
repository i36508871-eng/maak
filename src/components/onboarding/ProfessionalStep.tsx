import { SERVICE_CATEGORIES, SERVICE_OPTIONS, type OnboardingProfessional } from "../../lib/onboarding";
import { ServiceChip } from "../atoms";

export default function ProfessionalStep({
  value,
  onChange,
}: {
  value: OnboardingProfessional;
  onChange: (next: OnboardingProfessional) => void;
}) {
  const set = (key: keyof OnboardingProfessional, v: string) => onChange({ ...value, [key]: v });

  const toggleService = (svc: string) => {
    const has = value.services.includes(svc);
    onChange({ ...value, services: has ? value.services.filter((s) => s !== svc) : [...value.services, svc] });
  };

  return (
    <div className="onb-step-card">
      <h2 className="onb-step-title">البيانات المهنية</h2>
      <p className="onb-step-sub">أخبرنا بما تقدمه وخبرتك حتى يثق بك العميل.</p>
      <div className="onb-fields">
        <label className="onb-field">
          <span>المهنة</span>
          <input className="field" value={value.profession} onChange={(e) => set("profession", e.target.value)} placeholder="مثال: سباك محترف" />
        </label>
        <label className="onb-field">
          <span>فئة الخدمة</span>
          <select className="field" value={value.service_category} onChange={(e) => set("service_category", e.target.value)}>
            <option value="" disabled>اختر فئة</option>
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="onb-field">
          <span>سنوات الخبرة (اختياري)</span>
          <input className="field" inputMode="numeric" value={value.experience_years} onChange={(e) => set("experience_years", e.target.value)} placeholder="مثال: 5" maxLength={2} />
        </label>
        <label className="onb-field">
          <span>نبذة قصيرة</span>
          <textarea className="field" value={value.bio} onChange={(e) => set("bio", e.target.value)} placeholder="وصف خدماتك وخبرتك باختصار" rows={4} />
        </label>

        <div className="onb-field">
          <span>الخدمات التي تقدّمها (اختياري — تظهر للعملاء عند النشر)</span>
          <p className="onb-step-sub">اختر خدماتك لتظهر في صفحتك. يمكنك اختيار أكثر من خدمة.</p>
          <div className="service-chips">
            {SERVICE_OPTIONS.map((svc) => (
              <ServiceChip key={svc} label={svc} active={value.services.includes(svc)} onClick={() => toggleService(svc)} />
            ))}
          </div>
        </div>

        <label className="onb-field">
          <span>السعر التقريبي (اختياري)</span>
          <input
            className="field"
            inputMode="decimal"
            value={value.price_from}
            onChange={(e) => set("price_from", e.target.value)}
            placeholder="مثال: 150"
          />
          <small>يظهر كـ«ابتداءً من» في صفحتك. اتركه فارغاً لعرض «السعر عند التواصل».</small>
        </label>

        <label className="onb-field">
          <span>نطاق العمل (كم) (اختياري)</span>
          <input
            className="field"
            inputMode="numeric"
            value={value.service_radius_km}
            onChange={(e) => set("service_radius_km", e.target.value)}
            placeholder="مثال: 10"
            maxLength={3}
          />
          <small>المسافة التي تقبل العمل ضمنها من موقعك.</small>
        </label>
      </div>
    </div>
  );
}
