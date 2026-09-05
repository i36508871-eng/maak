import type { OnboardingPersonal } from "../../lib/onboarding";
import { useLanguage } from "../../i18n";

export default function PersonalStep({
  const { t } = useLanguage();
  value,
  onChange,
}: {
  value: OnboardingPersonal;
  onChange: (next: OnboardingPersonal) => void;
}) {
  const set = (key: keyof OnboardingPersonal, v: string) => onChange({ ...value, [key]: v });
  return (
    <div className="onb-step-card">
      <h2 className="onb-step-title"{t("steps.personalTitle")}/h2>
      <p className="onb-step-sub"{t("steps.personalSub")}/p>
      <div className="onb-fields">
        <label className="onb-field">
          <span{t("common.fullName")}/span>
          <input className="field" value={value.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder={t("steps.nameExample")} autoComplete="name" />
        </label>
        <label className="onb-field">
          <span{t("steps.phoneNum")}/span>
          <input className="field" inputMode="tel" value={value.phone} onChange={(e) => set("phone", e.target.value)} placeholder="06xxxxxxxx" autoComplete="tel" />
        </label>
        <label className="onb-field">
          <span{t("common.city")}/span>
          <input className="field" value={value.city} onChange={(e) => set("city", e.target.value)} placeholder={t("steps.cityExample")} autoComplete="address-level2" />
        </label>
      </div>
    </div>
  );
}
