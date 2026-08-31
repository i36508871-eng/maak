import type { OnboardingPersonal } from "../../lib/onboarding";

export default function PersonalStep({
  value,
  onChange,
}: {
  value: OnboardingPersonal;
  onChange: (next: OnboardingPersonal) => void;
}) {
  const set = (key: keyof OnboardingPersonal, v: string) => onChange({ ...value, [key]: v });
  return (
    <div className="onb-step-card">
      <h2 className="onb-step-title">البيانات الشخصية</h2>
      <p className="onb-step-sub">معلوماتك الأساسية التي ستظهر مع طلبك.</p>
      <div className="onb-fields">
        <label className="onb-field">
          <span>الاسم الكامل</span>
          <input className="field" value={value.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder="مثال: محمد العلوي" autoComplete="name" />
        </label>
        <label className="onb-field">
          <span>رقم الهاتف</span>
          <input className="field" inputMode="tel" value={value.phone} onChange={(e) => set("phone", e.target.value)} placeholder="06xxxxxxxx" autoComplete="tel" />
        </label>
        <label className="onb-field">
          <span>المدينة</span>
          <input className="field" value={value.city} onChange={(e) => set("city", e.target.value)} placeholder="مثال: طنجة" autoComplete="address-level2" />
        </label>
      </div>
    </div>
  );
}
