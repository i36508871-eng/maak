import { SERVICE_CATEGORIES, SERVICE_OPTIONS, type OnboardingProfessional } from "../../lib/onboarding";
import { ServiceChip } from "../atoms";
import { useLanguage } from "../../i18n";

export default function ProfessionalStep({
  value,
  onChange,
}: {
  value: OnboardingProfessional;
  onChange: (next: OnboardingProfessional) => void;
}) {
  const { t } = useLanguage();
  const set = (key: keyof OnboardingProfessional, v: string) => onChange({ ...value, [key]: v });

  const toggleService = (svc: string) => {
    const has = value.services.includes(svc);
    onChange({ ...value, services: has ? value.services.filter((s) => s !== svc) : [...value.services, svc] });
  };

  return (
    <div className="onb-step-card">
      <h2 className="onb-step-title"{t("steps.profTitle")}/h2>
      <p className="onb-step-sub"{t("steps.profSub")}/p>
      <div className="onb-fields">
        <label className="onb-field">
          <span{t("steps.profession")}/span>
          <input className="field" value={value.profession} onChange={(e) => set("profession", e.target.value)} placeholder={t("steps.professionExample")} />
        </label>
        <label className="onb-field">
          <span{t("steps.serviceCategory")}/span>
          <select className="field" value={value.service_category} onChange={(e) => set("service_category", e.target.value)}>
            <option value="" disabled{t("steps.chooseCategory")}/option>
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{t(c)}</option>
            ))}
          </select>
        </label>
        <label className="onb-field">
          <span{t("steps.expYears")}/span>
          <input className="field" inputMode="numeric" value={value.experience_years} onChange={(e) => set("experience_years", e.target.value)} placeholder={t("onb.numberExample")} maxLength={2} />
        </label>
        <label className="onb-field">
          <span{t("steps.shortBio")}/span>
          <textarea className="field" value={value.bio} onChange={(e) => set("bio", e.target.value)} placeholder={t("steps.bioPlaceholder")} rows={4} />
        </label>

        <div className="onb-field">
          <span{t("steps.servicesOffered")}/span>
          <p className="onb-step-sub"{t("steps.servicesHint")}/p>
          <div className="service-chips">
            {SERVICE_OPTIONS.map((svc) => (
              <ServiceChip key={svc} label={t(svc)} active={value.services.includes(svc)} onClick={() => toggleService(svc)} />
            ))}
          </div>
        </div>

        <label className="onb-field">
          <span{t("ppe.priceLabel")}/span>
          <input
            className="field"
            inputMode="decimal"
            value={value.price_from}
            onChange={(e) => set("price_from", e.target.value)}
            placeholder={t("steps.priceExample")}
          />
          <small{t("steps.priceHint")}/small>
        </label>

        <label className="onb-field">
          <span{t("ppe.radiusLabel")}/span>
          <input
            className="field"
            inputMode="numeric"
            value={value.service_radius_km}
            onChange={(e) => set("service_radius_km", e.target.value)}
            placeholder={t("onb.example10")}
            maxLength={3}
          />
          <small{t("steps.rangeHint")}/small>
        </label>
      </div>
    </div>
  );
}
