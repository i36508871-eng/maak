import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "../auth";
import { useToast } from "../context";
import { fetchProviderProfile, SERVICE_OPTIONS, updateProviderMarketplaceProfile } from "../lib/onboarding";
import { ServiceChip } from "./atoms";
import { useLanguage } from "../i18n";

type Status = "loading" | "ready" | "error";

export default function ProviderProfileEditor() {
  const { t } = useLanguage();
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
      showToast(t("ppe.priceInvalid"));
      return;
    }
    const r = radius.trim();
    if (r !== "" && (isNaN(Number(r)) || Number(r) <= 0)) {
      showToast(t("ppe.radiusInvalid"));
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
      showToast(t("ppe.saved"));
    } catch (e) {
      showToast(t(e instanceof Error ? e.message : "ppe.saveFail"));
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return <div className="empty-state"><Loader2 className="spin" size={20} /><p>{t("ppe.loading")}</p></div>;
  }
  if (status === "error") {
    return <div className="empty-state"><p>{t("ppe.loadFail")}</p></div>;
  }

  return (
    <div className="provider-profile-editor">
      <div className="admin-top">
        <div>
          <span className="section-kicker">{t("ppe.title")}</span>
          <h1>{t("ppe.title")}</h1>
        </div>
        <span className="verified"><ShieldCheck size={14} /> {t("common.verified")}</span>
      </div>

      <div className="onb-fields">
        <div className="onb-field">
          <span>{t("ppe.servicesLabel")}</span>
          <p className="onb-step-sub">{t("ppe.servicesHint")}</p>
          <div className="service-chips">
            {SERVICE_OPTIONS.map((svc) => (
              <ServiceChip key={svc} label={t(svc)} active={services.includes(svc)} onClick={() => toggleService(svc)} />
            ))}
          </div>
        </div>

        <label className="onb-field">
          <span>{t("ppe.priceLabel")}</span>
          <input className="field" inputMode="decimal" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} placeholder={t("ppe.example", { n: 150 })} />
          <small>{t("ppe.priceHint")}</small>
        </label>

        <label className="onb-field">
          <span>{t("ppe.radiusLabel")}</span>
          <input className="field" inputMode="numeric" value={radius} onChange={(e) => setRadius(e.target.value)} placeholder={t("ppe.example", { n: 10 })} maxLength={3} />
        </label>

        <label className="onb-field">
          <span>{t("ppe.showAvatar")}</span>
          <input type="checkbox" checked={photoPublic} onChange={(e) => setPhotoPublic(e.target.checked)} />
          <small>{t("ppe.showAvatarHint")}</small>
        </label>
      </div>

      <div className="cta-row">
        <button className="primary" onClick={() => void save()} disabled={saving}>
          {saving ? <Loader2 className="spin" size={16} /> : null}
          {t("ppe.saveChanges")}
        </button>
      </div>
    </div>
  );
}
