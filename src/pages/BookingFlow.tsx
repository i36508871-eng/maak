import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, Check, ChevronLeft, Info, Loader2, MapPin } from "lucide-react";
import { useProvider } from "../hooks/useProviders";
import { useBookings } from "../context";
import { useAuth } from "../auth";
import { useRouter } from "../router";
import { BOOKING_STATUS_LABELS, mapBookingError } from "../lib/bookings";
import type { BookingRow } from "../types";

const STEPS = ["الخدمة", "تفاصيل الطلب", "الموعد والموقع", "المراجعة"];
const DATES = ["اليوم", "غداً", "خلال الأسبوع"];
const TIMES = ["09:00", "11:00", "14:00", "16:00", "18:00", "20:00"];

type FormState = {
  service: string;
  description: string;
  date: string;
  time: string;
  location: string;
};

function toServiceDate(day: string, time: string): string {
  const d = new Date();
  if (day === "غداً") d.setDate(d.getDate() + 1);
  else if (day === "خلال الأسبوع") d.setDate(d.getDate() + 6);
  const parts = time.split(":");
  d.setHours(Number(parts[0]), Number(parts[1]), 0, 0);
  return d.toISOString();
}

export default function BookingFlow({ id }: { id: number }) {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const { createBooking } = useBookings();
  const { provider, status } = useProvider(id);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({
    service: "",
    description: "",
    date: "اليوم",
    time: "18:00",
    location: "طنجة، النجمة",
  });
  const [errors, setErrors] = useState<{ service?: string; location?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [failMsg, setFailMsg] = useState("");
  const [completed, setCompleted] = useState<BookingRow | null>(null);

  useEffect(() => {
    if (provider && provider.services[0] && !form.service) {
      setForm((current) => ({ ...current, service: provider.services[0] }));
    }
  }, [provider, form.service]);

  const update = (key: keyof FormState, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const goBack = () =>
    step > 0 ? setStep(step - 1) : navigate(provider ? "/provider/" + provider.id : "/discover");

  const next = () => {
    const nextErrors: { service?: string; location?: string } = {};
    if (step === 0 && !form.service.trim()) nextErrors.service = "يرجى اختيار نوع الخدمة.";
    if (step === 2 && !form.location.trim()) nextErrors.location = "يرجى تحديد موقع تنفيذ الخدمة.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    if (step < 3) setStep(step + 1);
    else void submit();
  };

  const submit = async () => {
    if (!provider || submitting) return;
    setSubmitting(true);
    setFailMsg("");
    try {
      const row = await createBooking({
        providerListingId: provider.id,
        serviceCategory: form.service.trim(),
        serviceDescription: form.description.trim(),
        serviceDate: toServiceDate(form.date, form.time),
        locationText: form.location.trim(),
      });
      setCompleted(row);
    } catch (err) {
      setFailMsg(mapBookingError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <main className="screen booking">
        <button className="booking-back" onClick={() => navigate("/discover")}>
          <ChevronLeft size={16} /> رجوع
        </button>
        <div className="pdetail-loading">
          <Loader2 className="spin" size={24} />
          <p>جارٍ تحميل بيانات مقدم الخدمة…</p>
        </div>
      </main>
    );
  }
  if (status === "error") {
    return (
      <main className="screen booking">
        <button className="booking-back" onClick={() => navigate("/discover")}>
          <ChevronLeft size={16} /> رجوع
        </button>
        <div className="pdetail-error">
          <AlertCircle size={24} />
          <h3>تعذّر تحميل بيانات مقدم الخدمة.</h3>
          <p>يرجى المحاولة مرة أخرى.</p>
          <button className="ghost-button" onClick={() => navigate("/discover")}>
            العودة إلى الاكتشاف
          </button>
        </div>
      </main>
    );
  }
  if (!provider) {
    return (
      <main className="screen booking">
        <button className="booking-back" onClick={() => navigate("/discover")}>
          <ChevronLeft size={16} /> رجوع
        </button>
        <div className="pdetail-error">
          <MapPin size={24} />
          <h3>لم يتم العثور على مقدم الخدمة.</h3>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="screen booking">
        <button className="booking-back" onClick={() => navigate("/provider/" + provider.id)}>
          <ChevronLeft size={16} /> رجوع إلى الملف
        </button>
        <div className="auth-gate">
          <h3>يرجى تسجيل الدخول لإرسال طلب الخدمة.</h3>
          <p>تبقى طلبك محفوظاً بعد تسجيل الدخول في صفحة الطلبات.</p>
          <div className="actions">
            <button className="primary" onClick={() => navigate("/login")}>
              تسجيل الدخول <ArrowLeft size={16} />
            </button>
            <button className="ghost-button" onClick={() => navigate("/discover")}>
              العودة إلى الاكتشاف
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (completed) {
    return (
      <main className="screen booking">
        <button className="booking-back" onClick={() => navigate("/provider/" + provider.id)}>
          <ChevronLeft size={16} /> رجوع إلى الملف
        </button>
        <section className="booking-success">
          <span className="ok">
            <Check size={30} />
          </span>
          <h1>تم إرسال طلب الخدمة</h1>
          <p>سيظهر لك تحديث حالة الطلب عند توفره.</p>
          <span className="status-pill pending">{BOOKING_STATUS_LABELS.pending}</span>
          <div className="summary review-list">
            <div className="review-row">
              <span className="k">مقدم الخدمة</span>
              <span className="v">{provider.name}</span>
            </div>
            <div className="review-row">
              <span className="k">الخدمة</span>
              <span className="v">{completed.service_category}</span>
            </div>
            <div className="review-row">
              <span className="k">الموقع</span>
              <span className="v">{completed.location_text ?? "—"}</span>
            </div>
          </div>
          <div className="actions">
            <button className="primary" onClick={() => navigate("/bookings")}>
              عرض طلباتي <ArrowLeft size={16} />
            </button>
            <button className="ghost-button" onClick={() => navigate("/discover")}>
              العودة إلى الاكتشاف
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="screen booking">
      <button className="booking-back" onClick={goBack}>
        <ChevronLeft size={16} /> رجوع
      </button>
      <div className="booking-head">
        <span className="section-kicker">طلب خدمة</span>
        <h1>احجز مع {provider.name}</h1>
        <div className="booking-provider">
          <img src={provider.image} alt="" />
          <div>
            <div className="bp-name">{provider.name}</div>
            <div className="bp-job">{provider.job}</div>
            <div className="bp-city">
              <MapPin size={11} /> {provider.city}
            </div>
          </div>
        </div>
      </div>

      <div className="booking-steps" role="list">
        {STEPS.map((label, index) => (
          <div
            className={"booking-step" + (index === step ? " on" : "") + (index < step ? " done" : "")}
            key={label}
          >
            <span className="num">
              {index < step ? <Check size={14} /> : index + 1}
            </span>
            <span className="label">{label}</span>
          </div>
        ))}
      </div>

      <div className="booking-body">
        {failMsg ? (
          <div className="booking-fail">
            <AlertCircle size={16} /> {failMsg}
          </div>
        ) : null}

        {step === 0 ? (
          <div className="booking-field">
            <label>نوع الخدمة</label>
            <p className="hint">اختر الخدمة التي تريد طلبها.</p>
            <div className="service-chips">
              {provider.services.map((service) => (
                <button
                  className={"service-chip-opt" + (form.service === service ? " active" : "")}
                  key={service}
                  onClick={() => {
                    update("service", service);
                    setErrors((current) => ({ ...current, service: undefined }));
                  }}
                >
                  {service}
                </button>
              ))}
            </div>
            {errors.service ? <p className="err">{errors.service}</p> : null}
          </div>
        ) : null}

        {step === 1 ? (
          <div className="booking-field">
            <label>وصف الخدمة</label>
            <p className="hint">اذكر تفاصيل إضافية تساعد مقدم الخدمة على فهم طلبك (اختياري).</p>
            <textarea
              className="booking-native"
              rows={5}
              maxLength={500}
              placeholder="مثال: تسريب في أنبوب الماء تحت الحوض، يحتاج إصلاحاً عاجلاً."
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
            />
            <p className="hint counter">{form.description.length}/500</p>
          </div>
        ) : null}

        {step === 2 ? (
          <>
            <div className="booking-field">
              <label>الموعد المناسب</label>
              <p className="hint">اختر اليوم المناسب لتنفيذ الخدمة.</p>
              <div className="service-chips">
                {DATES.map((day) => (
                  <button
                    className={"service-chip-opt" + (form.date === day ? " active" : "")}
                    key={day}
                    onClick={() => update("date", day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <div className="booking-field">
              <label>الوقت التقريبي</label>
              <p className="hint">اختر الوقت المفضل.</p>
              <div className="time-grid">
                {TIMES.map((time) => (
                  <button
                    className={"time-opt" + (form.time === time ? " active" : "")}
                    key={time}
                    onClick={() => update("time", time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
            <div className="booking-field">
              <label>موقع تنفيذ الخدمة</label>
              <p className="hint">حدد العنوان أو المنطقة التي ستُنفَّذ فيها الخدمة.</p>
              <input
                className="booking-native"
                value={form.location}
                placeholder="المدينة، الحي"
                onChange={(event) => {
                  update("location", event.target.value);
                  setErrors((current) => ({ ...current, location: undefined }));
                }}
              />
              {errors.location ? <p className="err">{errors.location}</p> : null}
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <div className="booking-field">
            <label>المراجعة</label>
            <p className="hint">راجع تفاصيل طلبك قبل الإرسال.</p>
            <div className="review-list">
              <div className="review-row">
                <span className="k">مقدم الخدمة</span>
                <span className="v">{provider.name}</span>
              </div>
              <div className="review-row">
                <span className="k">الخدمة</span>
                <span className="v">{form.service}</span>
              </div>
              <div className="review-row">
                <span className="k">الموعد</span>
                <span className="v">{form.date} · {form.time}</span>
              </div>
              <div className="review-row">
                <span className="k">الموقع</span>
                <span className="v">{form.location}</span>
              </div>
              <div className="review-row">
                <span className="k">تفاصيل إضافية</span>
                <span className="v">{form.description.trim() || "—"}</span>
              </div>
            </div>
            <div className="booking-notice">
              <Info size={15} className="ico" />
              <span>السعر يُتفق عليه مباشرةً مع مقدم الخدمة. ستظهر حالة الطلب كـ«قيد الانتظار» حتى يردّ مقدم الخدمة.</span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="booking-actions">
        <div className="inner">
          <button className="secondary" onClick={goBack} disabled={submitting}>
            {step > 0 ? "السابق" : "إلغاء"}
          </button>
          <button className="primary" onClick={next} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="spin" size={16} /> جارٍ إرسال الطلب…
              </>
            ) : step < 3 ? (
              <>
                متابعة <ArrowLeft size={16} />
              </>
            ) : (
              <>
                إرسال طلب الخدمة <ArrowLeft size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
