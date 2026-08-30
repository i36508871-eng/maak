import { useState } from "react";
import { Check } from "lucide-react";
import { Logo } from "../components/atoms";
import { getProviders } from "../services";

const ITEMS = [
  "Dashboard",
  "Users",
  "Providers",
  "Verification",
  "Services",
  "Bookings",
  "Reviews",
  "Reports",
  "Settings",
];

export default function Admin({ switchRole }: { switchRole: () => void }) {
  const providers = getProviders();
  const [tab, setTab] = useState("Dashboard");

  return (
    <div className="admin">
      <aside className="admin-side">
        <Logo inverse />
        {ITEMS.map((item) => (
          <button
            className={tab === item ? "active" : ""}
            onClick={() => setTab(item)}
            key={item}
          >
            {item}
          </button>
        ))}
        <button className="return-app" onClick={switchRole}>
          رجوع للتطبيق
        </button>
      </aside>
      <main className="admin-main">
        <div className="admin-top">
          <div>
            <span className="section-kicker">Maak operations</span>
            <h1>{tab}</h1>
          </div>
          <span className="avatar">A</span>
        </div>
        {tab === "Dashboard" ? (
          <>
            <div className="metric-row">
              <div className="metric">
                <small>إجمالي المستخدمين</small>
                <strong>2,481</strong>
              </div>
              <div className="metric">
                <small>مقدمون موثوقون</small>
                <strong>186</strong>
              </div>
              <div className="metric">
                <small>طلبات هذا الشهر</small>
                <strong>842</strong>
              </div>
            </div>
            <div className="panel chart-panel">
              <h2>الطلبات خلال آخر 7 أيام</h2>
              <div className="bar-chart">
                {[42, 65, 53, 88, 70, 96, 78].map((height, index) => (
                  <div className="bar" style={{ height }} key={index} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="table">
            <div className="table-row head">
              <span>الاسم</span>
              <span>النوع</span>
              <span>المدينة</span>
              <span>الحالة</span>
            </div>
            {providers.map((provider, index) => (
              <div className="table-row" key={provider.name}>
                <b>{provider.name}</b>
                <span>{index % 2 ? "عميل" : "مقدم خدمة"}</span>
                <span>{index === 3 ? "تطوان" : "طنجة"}</span>
                <span className="verified">
                  <Check size={12} /> نشط
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}