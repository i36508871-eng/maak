import { SERVICE_CATEGORIES, type OnboardingProfessional } from "../../lib/onboarding";

export default function ProfessionalStep({
  value,
  onChange,
}: {
  value: OnboardingProfessional;
  onChange: (next: OnboardingProfessional) => void;
}) {
  const set = (key: keyof OnboardingProfessional, v: string) => onChange({ ...value, [key]: v });
  return (
    <div className="onb-step-card">
      <h2 className="onb-step-title">البيانات المهنية</h2>
      <p className="onb-step-sub">قولينا شنو كتقدم وشنو خبرتك باش يقدر العميل يثق فيك.</p>
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
      </div>
    </div>
  );
}
