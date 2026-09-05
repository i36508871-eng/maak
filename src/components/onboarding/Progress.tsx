import { Check } from "lucide-react";
import { useLanguage } from "../../i18n";

const STEPS = ["steps.personalTitle", "steps.profTitle", "onb.docsLabel", "steps.reviewTitle"];

export default function Progress({ step }: { step: number }) {
  const { t } = useLanguage();
  return (
    <div className="onb-progress" aria-label={t("onb.stepsAria")}>
      {STEPS.map((label, i) => {
        const n = i + 1;
        const complete = n < step;
        const active = n === step;
        return (
          <div key={label} className={"onb-step" + (active ? " active" : "") + (complete ? " done" : "")}>
            <span className="onb-step-dot">{complete ? <Check size={11} strokeWidth={3} /> : n}</span>
            <span className="onb-step-label">{t(label)}</span>
          </div>
        );
      })}
    </div>
  );
}
