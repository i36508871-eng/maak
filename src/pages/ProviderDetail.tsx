import { AlertCircle, ArrowLeft, ChevronLeft, Clock3, Loader2, MapPin, MessageCircle, ShieldCheck, Star } from "lucide-react";
import { useProvider } from "../hooks/useProviders";
import { useRouter } from "../router";
import { Avatar } from "../components/atoms";

export default function ProviderDetail({ id }: { id: number }) {
  const { navigate } = useRouter();
  const { provider, status } = useProvider(id);

  if (status === "loading") {
    return (
      <main className="screen pdetail">
        <button className="pdetail-back" onClick={() => navigate("/discover")}>
          <ChevronLeft size={16} /> رجوع إلى الاكتشاف
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
      <main className="screen pdetail">
        <button className="pdetail-back" onClick={() => navigate("/discover")}>
          <ChevronLeft size={16} /> رجوع إلى الاكتشاف
        </button>
        <div className="pdetail-error">
          <AlertCircle size={24} />
          <h3>تعذّر تحميل بيانات مقدم الخدمة.</h3>
          <p>يرجى المحاولة مرة أخرى.</p>
          <button className="ghost-button" onClick={() => navigate("/discover")}>العودة إلى الاكتشاف</button>
        </div>
      </main>
    );
  }

  if (!provider) {
    return (
      <main className="screen pdetail">
        <button className="pdetail-back" onClick={() => navigate("/discover")}>
          <ChevronLeft size={16} /> رجوع إلى الاكتشاف
        </button>
        <div className="pdetail-error">
          <MapPin size={24} />
          <h3>لم يتم العثور على مقدم الخدمة.</h3>
        </div>
      </main>
    );
  }

  return (
    <main className="screen pdetail">
      <button className="pdetail-back" onClick={() => navigate("/discover")}>
        <ChevronLeft size={16} /> رجوع إلى الاكتشاف
      </button>

      <div className="pdetail-grid">
        <section className="pdetail-identity">
          <div className="pdetail-photo">
            <Avatar name={provider.name} src={provider.image} />
            {provider.available != null ? (
              <span className={`dot ${provider.available ? "online" : "offline"}`} />
            ) : null}
          </div>
          <span className="verified"><ShieldCheck size={12} /> موثّق</span>
          <h1 className="pdetail-name">{provider.name}</h1>
          <p className="pdetail-job">{provider.job}</p>
          <p className="pdetail-city"><MapPin size={13} /> {provider.city}</p>

          <ul className="pdetail-trust">
            <li>
              {provider.rating && Number(provider.rating) > 0 ? (
                <span className="t-ico gold"><Star size={15} fill="currentColor" /></span>
              ) : (
                <span className="t-ico"><Star size={15} fill="currentColor" /></span>
              )}
              <span className="t-val">
                {provider.rating && Number(provider.rating) > 0 ? (
                  <><b>{provider.rating}</b> <small>من {provider.reviews} مراجعة</small></>
                ) : (
                  <b>جديد</b>
                )}
              </span>
            </li>
            {provider.experience ? (
              <li>
                <span className="t-ico"><Clock3 size={15} /></span>
                <span className="t-val"><b>{provider.experience}</b> <small>من الخبرة</small></span>
              </li>
            ) : null}
            {provider.available != null ? (
              <li>
                <span className={`t-ico ${provider.available ? "green" : "muted"}`}>
                  <span className={`status-dot ${provider.available ? "on" : "off"}`} />
                </span>
                <span className="t-val"><b>{provider.available ? "متاح الآن" : "غير متاح الآن"}</b></span>
              </li>
            ) : null}
          </ul>

          <div className="pdetail-price">السعر التقديري <b>{provider.price ? provider.price : "السعر عند التواصل"}</b></div>

          <div className="pdetail-desktop-cta">
            <button className="primary" onClick={() => navigate(`/provider/${provider.id}/booking`)}>
              احجز الآن <ArrowLeft size={16} />
            </button>
            <button className="secondary" onClick={() => navigate("/chat")} aria-label="مراسلة مقدم الخدمة">
              <MessageCircle size={16} /> مراسلة
            </button>
          </div>
        </section>

        <section className="pdetail-content">
          {provider.intro ? (
            <div className="pdetail-section">
              <span className="section-kicker">نبذة</span>
              <h2>عن مقدم الخدمة</h2>
              <p className="body-copy">{provider.intro}</p>
            </div>
          ) : null}

          <div className="pdetail-section">
            <span className="section-kicker">الخدمات</span>
            <h2>ما يقدّمه</h2>
            <div className="pdetail-services">
              {provider.services.length ? (
                provider.services.map((service) => (
                  <span className="chip" key={service}>{service}</span>
                ))
              ) : (
                <span className="muted">لم تُحدّد بعد</span>
              )}
            </div>
          </div>

          <div className="pdetail-section">
            <span className="section-kicker">الموقع</span>
            <h2>نطاق العمل</h2>
            <ul className="pdetail-loc">
              <li><MapPin size={15} /> {provider.city}</li>
              {provider.distance ? <li><span className="muted-dot" /> يبعد حوالي {provider.distance}</li> : null}
            </ul>
          </div>
        </section>
      </div>

      <div className="pdetail-cta" role="region" aria-label="إجراء رئيسي">
        <div className="inner">
          <button className="secondary cta-chat" onClick={() => navigate("/chat")} aria-label="مراسلة مقدم الخدمة">
            <MessageCircle size={18} />
          </button>
          <button className="primary cta-book" onClick={() => navigate(`/provider/${provider.id}/booking`)}>
            احجز الآن <ArrowLeft size={16} />
          </button>
        </div>
      </div>
    </main>
  );
}
