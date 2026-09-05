import { Check } from "lucide-react";

const STEPS = ["البيانات الشخصية", "البيانات المهنية", "الوثائق", "مراجعة وإرسال"];

export default function Progress({ step }: { step: number }) {
  return (
    <div className="onb-progress" aria-label="مراحل التقديم">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const complete = n < step;
        const active = n === step;
        return (
          <div key={label} className={"onb-step" + (active ? " active" : "") + (complete ? " done" : "")}>
            <span className="onb-step-dot">{complete ? <Check size={11} strokeWidth={3} /> : n}</span>
            <span className="onb-step-label">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
