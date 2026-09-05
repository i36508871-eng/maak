import { DOC_TYPES, type OnboardingPersonal, type OnboardingProfessional, type ProviderDocumentRow } from "../../lib/onboarding";

export default function ReviewStep({
  personal,
  professional,
  documents,
}: {
  personal: OnboardingPersonal;
  professional: OnboardingProfessional;
  documents: ProviderDocumentRow[];
}) {
  const rows: Array<[string, string]> = [
    ["الاسم", personal.full_name],
    ["الهاتف", personal.phone],
    ["المدينة", personal.city],
    ["المهنة", professional.profession],
    ["فئة الخدمة", professional.service_category],
    ["سنوات الخبرة", professional.experience_years || "—"],
    ["النبذة", professional.bio],
    ["الخدمات", professional.services.length ? professional.services.join("، ") : "غير محدد بعد"],
    ["السعر التقريبي", professional.price_from ? "ابتداءً من " + professional.price_from : "عند التواصل"],
    ["نطاق العمل", professional.service_radius_km ? professional.service_radius_km + " كم" : "غير محدد"],
  ];
  const docRows = (Object.keys(DOC_TYPES) as Array<keyof typeof DOC_TYPES>).map((dt) => {
    const doc = documents.find((d) => d.document_type === dt);
    return [DOC_TYPES[dt].label, doc ? "تم الرفع بنجاح" : "غير مرفوع"] as [string, string];
  });
  return (
    <div className="onb-step-card">
      <h2 className="onb-step-title">مراجعة وإرسال</h2>
      <p className="onb-step-sub">تأكد من المعلومات قبل الإرسال. لا يمكنك التعديل بعد الإرسال.</p>
      <div className="onb-review">
        {rows.map(([k, v]) => (
          <div key={k} className="onb-review-row"><span>{k}</span><span>{v || "—"}</span></div>
        ))}
        {docRows.map(([k, v]) => (
          <div key={k} className="onb-review-row"><span>{k}</span><span>{v}</span></div>
        ))}
      </div>
    </div>
  );
}
