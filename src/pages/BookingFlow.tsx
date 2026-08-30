import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, Check, ChevronLeft, Loader2, ShieldCheck } from "lucide-react";
import { useProvider } from "../hooks/useProviders";
import { useBookings, useToast } from "../context";
import { useRouter } from "../router";
import type { Booking } from "../types";

const LABELS = ["الخدمة", "المحترف", "التفاصيل", "المكان", "الوقت", "المراجعة"];

export default function BookingFlow({ id }: { id: number }) {
  const { navigate } = useRouter();
  const { addBooking } = useBookings();
  const { showToast } = useToast();
  const { provider, status } = useProvider(id);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    service: "",
    description: "",
    location: "طنجة، النجمة",
    date: "غدا",
    time: "18:00",
  });

  useEffect(() => {
    if (provider) {
      setForm((current) => ({ ...current, service: current.service || provider.services[0] }));
    }
  }, [provider]);

  if (status === "loading") {
    return (
      <main className="screen request-screen">
        <button className="back" onClick={() => navigate("/discover")}>
          <ChevronLeft size={15} /> رجوع
        </button>
        <div className="state-loading">
          <Loader2 className="spin" size={26} />
          <p>كنجلبو معلومات المحترف...</p>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="screen request-screen">
        <button className="back" onClick={() => navigate("/discover")}>
          <ChevronLeft size={15} /> رجوع
        </button>
        <div className="state-error">
          <AlertCircle size={26} />
          <h3>ما قدرناش نحمّلو المحترف</h3>
          <p>تحقق من الاتصال بالخادم وحاول مرة أخرى.</p>
        </div>
      </main>
    );
  }

  if (!provider) {
    return (
      <main className="screen request-screen">
        <button className="back" onClick={() => navigate("/discover")}>
          <ChevronLeft size={15} /> رجوع
        </button>
        <p>المحترف غير موجود.</p>
      </main>
    );
  }

  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const done = () => {
    const booking: Booking = {
      id: Date.now(),
      service: form.service,
      provider: provider.name,
      date: form.date,
      time: form.time,
      location: form.location,
      status: "طلب جديد",
    };
    addBooking(booking);
    navigate("/bookings");
    showToast("توصلنا بالطلب ديالك");
  };

  const summary: Array<[string, string]> = [
    ["الخدمة", form.service],
    ["المحترف", provider.name],
    ["المكان", form.location],
    ["الوقت", `${form.date} · ${form.time}`],
  ];

  return (
    <main className="screen request-screen">
      <button className="back" onClick={() => navigate(`/provider/${provider.id}`)}>
        <ChevronLeft size={15} /> رجوع
      </button>
      <div className="request-heading">
        <span className="section-kicker">خطوة بخطوة</span>
        <h1>طلب خدمة من {provider.name}</h1>
        <p>غادي نوصلو طلبك للمحترف وتجاوبك فأقرب وقت.</p>
      </div>
      <div className="steps">
        {LABELS.map((label, index) => (
          <div className={`step ${index <= step ? "on" : ""}`} key={label}>
            <b>{index < step ? <Check size={13} /> : index + 1}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
      {step === 0 && (
        <div className="panel form-panel">
          <span className="section-kicker">01 / 06</span>
          <h2>اختر الخدمة</h2>
          {provider.services.map((service) => (
            <button
              className={`choice-row ${form.service === service ? "chosen" : ""}`}
              key={service}
              onClick={() => update("service", service)}
            >
              <span>{service}</span>
              {form.service === service ? <Check size={15} /> : <span className="choice-circle" />}
            </button>
          ))}
        </div>
      )}
      {step === 1 && (
        <div className="panel form-panel">
          <span className="section-kicker">02 / 06</span>
          <h2>المحترف المختار</h2>
          <div className="selected-provider">
            <img src={provider.image} alt="" />
            <div>
              <b>{provider.name}</b>
              <small>{provider.job}</small>
            </div>
            <span className="verified">
              <ShieldCheck size={13} /> موثّق
            </span>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="panel form-panel">
          <span className="section-kicker">03 / 06</span>
          <h2>شرح لينا شنو محتاج</h2>
          <textarea
            className="field"
            rows={5}
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            placeholder="مثلا: عندي تسريب تحت الحوض..."
          />
        </div>
      )}
      {step === 3 && (
        <div className="panel form-panel">
          <span className="section-kicker">04 / 06</span>
          <h2>فين بغيتي الخدمة؟</h2>
          <label>العنوان</label>
          <input
            className="field"
            value={form.location}
            onChange={(event) => update("location", event.target.value)}
          />
        </div>
      )}
      {step === 4 && (
        <div className="panel form-panel">
          <span className="section-kicker">05 / 06</span>
          <h2>النهار والوقت المناسب</h2>
          <label>النهار</label>
          <select
            className="field"
            value={form.date}
            onChange={(event) => update("date", event.target.value)}
          >
            <option>غدا</option>
            <option>الخميس 16 ماي</option>
            <option>الجمعة 17 ماي</option>
          </select>
          <label>الوقت التقريبي</label>
          <select
            className="field"
            value={form.time}
            onChange={(event) => update("time", event.target.value)}
          >
            <option>09:00</option>
            <option>14:00</option>
            <option>18:00</option>
          </select>
        </div>
      )}
      {step === 5 && (
        <div className="panel form-panel">
          <span className="section-kicker">06 / 06</span>
          <h2>راجع الطلب ديالك</h2>
          {summary.map(([label, value]) => (
            <div className="detail-row" key={label}>
              <span>{label}</span>
              <b>{value}</b>
            </div>
          ))}
          <div className="notice">الثمن تتم الاتفاق عليه مباشرة مع مقدم الخدمة.</div>
        </div>
      )}
      <div className="form-actions">
        {step > 0 ? (
          <button className="secondary" onClick={() => setStep(step - 1)}>
            السابق
          </button>
        ) : (
          <span />
        )}
        <button className="primary" onClick={() => (step < 5 ? setStep(step + 1) : done())}>
          {step === 5 ? "إرسال الطلب" : "التالي"} <ArrowLeft size={15} />
        </button>
      </div>
    </main>
  );
}