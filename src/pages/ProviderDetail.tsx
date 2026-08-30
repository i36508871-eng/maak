import { AlertCircle, ArrowLeft, Check, ChevronLeft, Loader2, MessageCircle, ShieldCheck } from "lucide-react";
import { Rating } from "../components/atoms";
import { useProvider } from "../hooks/useProviders";
import { useRouter } from "../router";

const REVIEWS = [
  "خدمة فالمستوى وجا فالوقت بالضبط.",
  "تواصل واضح وخدمة نظيفة، كناعود نتعامل معاه.",
  "محترف وكتيشرح المشكل قبل ما يبدا.",
];

const REVIEWERS = ["نادية أ.", "سفيان م.", "مرتضى ل."];

const VERIFICATION = ["الهوية", "الهاتف", "الملف المهني"];

export default function ProviderDetail({ id }: { id: number }) {
  const { navigate } = useRouter();
  const { provider, status } = useProvider(id);

  if (status === "loading") {
    return (
      <main className="screen profile-screen">
        <button className="back" onClick={() => navigate("/discover")}>
          <ChevronLeft size={15} /> رجوع لاكتشاف
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
      <main className="screen profile-screen">
        <button className="back" onClick={() => navigate("/discover")}>
          <ChevronLeft size={15} /> رجوع لاكتشاف
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
      <main className="screen profile-screen">
        <button className="back" onClick={() => navigate("/discover")}>
          <ChevronLeft size={15} /> رجوع للاكتشاف
        </button>
        <p>المحترف غير موجود.</p>
      </main>
    );
  }

  return (
    <main className="screen profile-screen">
      <button className="back" onClick={() => navigate("/discover")}>
        <ChevronLeft size={15} /> رجوع للاكتشاف
      </button>
      <section className="profile-hero">
        <div className="profile-image-wrap">
          <img src={provider.image} alt={provider.name} />
          <span className={provider.available ? "online" : "offline"} />
        </div>
        <div className="profile-identity">
          <span className="profile-label">مقدم خدمة موثوق</span>
          <h1>{provider.name}</h1>
          <p>
            {provider.job} <span>·</span> {provider.city}
          </p>
          <div className="profile-rating">
            <Rating value={provider.rating} reviews={provider.reviews} />
            <span>•</span>
            <span>{provider.experience} خبرة</span>
          </div>
        </div>
        <div className="profile-status">
          <ShieldCheck size={18} />
          <span>{provider.available ? "متاح اليوم" : "غائب الآن"}</span>
        </div>
      </section>
      <div className="cta-row profile-actions">
        <button className="primary" onClick={() => navigate(`/provider/${provider.id}/booking`)}>
          طلب الخدمة <ArrowLeft size={15} />
        </button>
        <button className="secondary" onClick={() => navigate("/chat")}>
          <MessageCircle size={15} /> مراسلة
        </button>
      </div>
      <div className="profile-content">
        <div className="panel">
          <span className="section-kicker">عن المحترف</span>
          <h2>خدمة مزيانة كتبدا بالثقة</h2>
          <p className="body-copy">{provider.intro}</p>
          <h3 className="subheading">الخدمات</h3>
          <div className="chips">
            {provider.services.map((service) => (
              <span className="chip" key={service}>
                {service}
              </span>
            ))}
          </div>
          <h3 className="subheading reviews-heading">
            التقييمات <small>({provider.reviews})</small>
          </h3>
          {REVIEWS.map((review, index) => (
            <div className="review" key={review}>
              <strong>
                {REVIEWERS[index]} <Rating value="5.0" />
              </strong>
              <p>{review}</p>
            </div>
          ))}
        </div>
        <div>
          <div className="panel compact-panel">
            <span className="section-kicker">خلي بالك مرتاح</span>
            <h2>تفاصيل التحقق</h2>
            {VERIFICATION.map((item) => (
              <div className="detail-row" key={item}>
                <span>{item}</span>
                <b className="verified">
                  <Check size={13} /> تمت المراجعة
                </b>
              </div>
            ))}
          </div>
          <div className="panel compact-panel work-details">
            <span className="section-kicker">معلومات العمل</span>
            <h2>فالتفاصيل الصغيرة</h2>
            <div className="detail-row">
              <span>منطقة العمل</span>
              <b>طنجة والنواحي</b>
            </div>
            <div className="detail-row">
              <span>سنوات الخبرة</span>
              <b>{provider.experience}</b>
            </div>
            <div className="detail-row">
              <span>التوفر</span>
              <b className="available-text">
                {provider.available ? "متاح اليوم" : "غائب الآن"}
              </b>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}