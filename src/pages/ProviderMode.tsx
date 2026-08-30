import { useState } from "react";
import { ArrowLeft, CalendarDays, Check } from "lucide-react";
import { Logo } from "../components/atoms";
import { useToast } from "../context";

const NAV_ITEMS = [
  "نظرة عامة",
  "الطلبات الجديدة",
  "الخدمات القادمة",
  "التقييمات",
  "ملفي المهني",
];

export default function ProviderMode({ switchRole }: { switchRole: () => void }) {
  const { showToast } = useToast();
  const [available, setAvailable] = useState(true);
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="provider-layout">
      <aside className="provider-side">
        <Logo inverse />
        <div className="provider-side-title">
          <span>مساحة المحترف</span>
          <b>محمد العلوي</b>
        </div>
        {NAV_ITEMS.map((item, index) => (
          <button className={index === 0 ? "sel" : ""} key={item}>
            {item}
          </button>
        ))}
        <button className="switch-role" onClick={switchRole}>
          العودة لحساب الزبون <ArrowLeft size={14} />
        </button>
      </aside>
      <main className="provider-main">
        <div className="admin-top">
          <div>
            <span className="section-kicker">الثلاثاء، 14 ماي 2024</span>
            <h1>صباح الخير، محمد</h1>
          </div>
          <button
            className={available ? "availability on" : "availability"}
            onClick={() => setAvailable(!available)}
          >
            <span /> {available ? "متاح لاستقبال الطلبات" : "غير متاح حاليا"}
          </button>
        </div>
        <div className="metric-row">
          <div className="metric">
            <small>طلبات جديدة</small>
            <strong>03</strong>
            <span>+2 اليوم</span>
          </div>
          <div className="metric">
            <small>هذا الأسبوع</small>
            <strong>12</strong>
            <span>من 15 طلب</span>
          </div>
          <div className="metric">
            <small>التقييم العام</small>
            <strong>4.9</strong>
            <span>128 تقييم</span>
          </div>
        </div>
        <div className="section-heading dashboard-heading">
          <div>
            <span className="section-kicker">خلي خدمتك دائماً حاضرة</span>
            <h2>طلبات جديدة</h2>
          </div>
          <button className="text-button">
            عرض الكل <ArrowLeft size={15} />
          </button>
        </div>
        <div className="request-row">
          <div className="request-client">
            <span className="avatar">ح</span>
            <div>
              <span className="status">جديد</span>
              <h3>إصلاح تسريب في المطبخ</h3>
              <p>حمزة العروستي · غدا، 18:00 · طنجة</p>
            </div>
          </div>
          <div className="cta-row">
            <button
              className="primary"
              onClick={() => {
                setAccepted(true);
                showToast("تم قبول الطلب بنجاح");
              }}
            >
              قبول
            </button>
            <button className="secondary" onClick={() => showToast("تم رفض الطلب")}>
              رفض
            </button>
            <button
              className="ghost-button"
              onClick={() => showToast("افتح الرسائل للتواصل")}
            >
              مراسلة
            </button>
          </div>
        </div>
        {accepted && (
          <div className="accepted-note">
            <Check size={15} /> الطلب مقبول، تقدر تتواصل مع حمزة الآن.
          </div>
        )}
        <div className="panel upcoming-panel">
          <div className="section-heading">
            <div>
              <span className="section-kicker">نظرة سريعة</span>
              <h2>الخدمات القادمة</h2>
            </div>
            <CalendarDays size={18} />
          </div>
          <div className="detail-row">
            <b>تركيب صنبور جديد</b>
            <span>اليوم · 16:30 · طنجة</span>
          </div>
          <div className="detail-row">
            <b>صيانة سخان الماء</b>
            <span>الجمعة · 10:00 · الملاباطا</span>
          </div>
        </div>
      </main>
    </div>
  );
}