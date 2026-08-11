import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Check,
  ChevronLeft,
  CircleUserRound,
  ClipboardList,
  Clock3,
  Home,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  ThumbsUp,
  UserRound,
  Users,
  Wrench,
  X,
  Zap,
} from "lucide-react";

type Provider = {
  id: number;
  name: string;
  job: string;
  city: string;
  distance: string;
  price: string;
  rating: string;
  reviews: number;
  image: string;
  available: boolean;
  services: string[];
  experience: string;
  intro: string;
};

type Booking = {
  id: number;
  service: string;
  provider: string;
  date: string;
  time: string;
  location: string;
  status: string;
};

const providers: Provider[] = [
  {
    id: 1,
    name: "محمد العلوي",
    job: "سباك محترف",
    city: "طنجة",
    distance: "2.4 كم",
    price: "ابتداءً من 100 درهم",
    rating: "4.9",
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=85",
    available: true,
    services: ["إصلاح التسربات", "تركيب الصنابير", "صيانة السخانات"],
    experience: "8 سنوات",
    intro:
      "كنعاون العائلات فطنجة نحلّو مشاكل الماء بسرعة وبخدمة نقية. كنشرح المشكل قبل أي تدخل.",
  },
  {
    id: 2,
    name: "سلمى بنعيسى",
    job: "تنظيف المنازل",
    city: "طنجة",
    distance: "3.1 كم",
    price: "ابتداءً من 150 درهم",
    rating: "4.8",
    reviews: 74,
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=240&q=85",
    available: true,
    services: ["تنظيف شامل", "تنظيف بعد الانتقال"],
    experience: "5 سنوات",
    intro:
      "خدمة تنظيف منظمة وموثوقة، نهتم بالتفاصيل الصغيرة ونخليو دارك مرتبة ومرتاحة.",
  },
  {
    id: 3,
    name: "ياسين المرابط",
    job: "كهربائي معتمد",
    city: "طنجة",
    distance: "4.7 كم",
    price: "ابتداءً من 120 درهم",
    rating: "4.9",
    reviews: 92,
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=240&q=85",
    available: false,
    services: ["تركيب الإنارة", "إصلاح الأعطال", "لوحات الكهرباء"],
    experience: "11 سنة",
    intro:
      "كنقدم حلول كهربائية آمنة للمنازل والمحلات بطنجة، من التشخيص حتى الإصلاح.",
  },
  {
    id: 4,
    name: "عمر التازي",
    job: "نقل وتركيب",
    city: "تطوان",
    distance: "12 كم",
    price: "ابتداءً من 250 درهم",
    rating: "4.7",
    reviews: 51,
    image:
      "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=240&q=85",
    available: true,
    services: ["نقل الأثاث", "التركيب", "التغليف"],
    experience: "6 سنوات",
    intro: "نقل الأثاث بلا صداع، من الباب للباب وبعناية.",
  },
];

const categories = [
  { name: "السباكة", icon: Wrench, count: "42 خدمة" },
  { name: "الكهرباء", icon: Zap, count: "38 خدمة" },
  { name: "التنظيف", icon: Sparkles, count: "56 خدمة" },
  { name: "الصباغة", icon: Home, count: "27 خدمة" },
  { name: "النقل", icon: Users, count: "31 خدمة" },
  { name: "الصيانة", icon: ThumbsUp, count: "24 خدمة" },
];

const initialBookings: Booking[] = [
  {
    id: 11,
    service: "إصلاح تسريب في المطبخ",
    provider: "محمد العلوي",
    date: "الخميس 16 ماي",
    time: "18:00",
    location: "طنجة، النجمة",
    status: "تم القبول",
  },
];

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className={`brand ${inverse ? "inverse" : ""}`}>
      maak<span />
    </div>
  );
}

function Rating({ value, reviews }: { value: string; reviews?: number }) {
  return (
    <span className="rating">
      <Star size={13} fill="currentColor" />
      {value}
      {reviews ? <small>({reviews})</small> : null}
    </span>
  );
}

function Header({
  page,
  onPage,
  onNotify,
  onRole,
}: {
  page: string;
  onPage: (page: string) => void;
  onNotify: () => void;
  onRole: () => void;
}) {
  return (
    <header className="topbar">
      <div className="header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="التنقل الرئيسي">
          <button className={page === "home" ? "selected" : ""} onClick={() => onPage("home")}>
            الرئيسية
          </button>
          <button className={page === "discover" ? "selected" : ""} onClick={() => onPage("discover")}>
            اكتشف الخدمات
          </button>
          <button className={page === "bookings" ? "selected" : ""} onClick={() => onPage("bookings")}>
            طلباتي
          </button>
        </nav>
        <div className="profile-line">
          <button className="icon-btn notification" aria-label="الإشعارات" onClick={onNotify}>
            <Bell size={18} />
            <i />
          </button>
          <button className="user-pill" onClick={onRole}>
            <span className="avatar">ح</span>
            <span className="user-copy">
              <b>حمزة</b>
              <small>طنجة، المغرب</small>
            </span>
            <ChevronLeft size={14} />
          </button>
          <button className="menu-btn" aria-label="القائمة">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

function MobileNav({ page, setPage }: { page: string; setPage: (page: string) => void }) {
  const items = [
    ["home", "الرئيسية", Home],
    ["discover", "اكتشف", Search],
    ["bookings", "طلباتي", ClipboardList],
    ["chat", "الرسائل", MessageCircle],
    ["profile", "حسابي", UserRound],
  ] as const;
  return (
    <nav className="mobile-nav">
      {items.map(([id, label, Icon]) => (
        <button key={id} className={page === id ? "active" : ""} onClick={() => setPage(id)}>
          <Icon size={18} />
          <span>{label}</span>
          {id === "bookings" && <i />}
        </button>
      ))}
    </nav>
  );
}

function SearchBox({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="search-box">
      <Search size={18} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="شنو الخدمة اللي محتاج اليوم؟"
        aria-label="ابحث عن خدمة"
      />
      {value ? (
        <button className="clear-search" onClick={() => onChange("")} aria-label="مسح البحث">
          <X size={15} />
        </button>
      ) : null}
      <button className="search-submit" aria-label="بحث">
        <ArrowLeft size={17} />
      </button>
    </div>
  );
}

function TrustStrip() {
  return (
    <div className="trust-strip">
      <div>
        <span className="trust-icon green">
          <ShieldCheck size={19} />
        </span>
        <span>
          <b>مقدمون موثوقون</b>
          <small>نتحقق من كل ملف</small>
        </span>
      </div>
      <div>
        <span className="trust-icon blue">
          <Clock3 size={19} />
        </span>
        <span>
          <b>جواب سريع</b>
          <small>تواصل مباشر وآمن</small>
        </span>
      </div>
      <div>
        <span className="trust-icon orange">
          <ThumbsUp size={19} />
        </span>
        <span>
          <b>اختيارك مضمون</b>
          <small>تقييمات حقيقية</small>
        </span>
      </div>
    </div>
  );
}

function CategoryCard({
  category,
  active,
  onClick,
}: {
  category: (typeof categories)[number];
  active: boolean;
  onClick: () => void;
}) {
  const Icon = category.icon;
  return (
    <button className={`category-card ${active ? "active" : ""}`} onClick={onClick}>
      <span className="category-icon">
        <Icon size={20} />
      </span>
      <b>{category.name}</b>
      <small>{category.count}</small>
    </button>
  );
}

function ProviderRow({ provider, onClick }: { provider: Provider; onClick: () => void }) {
  return (
    <button className="provider-row" onClick={onClick}>
      <div className="provider-avatar-wrap">
        <img src={provider.image} alt="" />
        <span className={provider.available ? "online" : "offline"} />
      </div>
      <div className="provider-info">
        <div className="provider-title">
          <h3>{provider.name}</h3>
          <span className="verified">
            <ShieldCheck size={12} /> موثّق
          </span>
        </div>
        <p>{provider.job}</p>
        <div className="provider-meta">
          <Rating value={provider.rating} reviews={provider.reviews} />
          <span>
            <MapPin size={12} /> {provider.distance}
          </span>
        </div>
      </div>
      <div className="provider-action">
        <b>{provider.price}</b>
        <span>{provider.available ? "متاح اليوم" : "غير متاح الآن"}</span>
        <ChevronLeft size={17} />
      </div>
    </button>
  );
}

function HomePage({
  select,
  filter,
  setFilter,
  setPage,
}: {
  select: (provider: Provider) => void;
  filter: string;
  setFilter: (value: string) => void;
  setPage: (page: string) => void;
}) {
  const shown = useMemo(
    () =>
      providers.filter(
        (provider) =>
          !filter ||
          provider.job.includes(filter) ||
          provider.services.some((service) => service.includes(filter)) ||
          provider.name.includes(filter),
      ),
    [filter],
  );

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> خدمات قريبة منك، وقت ما تحتاجها
          </p>
          <h1>
            دارك كتستاهل
            <br />
            <em>العناية.</em>
          </h1>
          <p className="hero-description">
            لقا المحترف المناسب لمشكلتك، تواصل معاه مباشرة وخلي الباقي علينا.
          </p>
          <SearchBox value={filter} onChange={setFilter} />
          <div className="hero-note">
            <div className="mini-avatars">
              {providers.slice(0, 3).map((provider) => (
                <img key={provider.id} src={provider.image} alt="" />
              ))}
            </div>
            <span>
              <b>+2,400</b> شخص لقاو المساعدة هاد الشهر
            </span>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-photo">
            <img
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=720&q=90"
              alt="مقدمة خدمة منزلية"
            />
          </div>
          <div className="floating-card verified-card">
            <span className="floating-symbol">
              <ShieldCheck size={19} />
            </span>
            <span>
              <b>محترفون موثوقون</b>
              <small>مراجعة يدوية لكل ملف</small>
            </span>
          </div>
          <div className="floating-card request-card">
            <span className="request-check">
              <Check size={16} />
            </span>
            <span>
              <small>آخر طلب</small>
              <b>تم قبول الطلب</b>
            </span>
            <strong>الآن</strong>
          </div>
          <div className="hero-stamp">
            <span>MAAK</span>
            <small>معاك فالدار</small>
          </div>
        </div>
      </section>

      <TrustStrip />

      <section className="content-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">اختار اللي مناسب ليك</span>
            <h2>شنو محتاج اليوم؟</h2>
          </div>
          <button className="text-button" onClick={() => setPage("discover")}>
            جميع الخدمات <ArrowLeft size={15} />
          </button>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              category={category}
              active={filter === category.name}
              onClick={() => setFilter(filter === category.name ? "" : category.name)}
            />
          ))}
        </div>
      </section>

      <section className="content-section providers-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">قريبين منك في طنجة</span>
            <h2>{filter ? `نتائج البحث عن «${filter}»` : "ناس تقدر تعتمد عليهم"}</h2>
          </div>
          <button className="filter-button" onClick={() => setFilter("")}>
            <span>{shown.length} محترفين</span>
            <ChevronLeft size={15} />
          </button>
        </div>
        <div className="provider-list">
          {shown.length ? (
            shown.map((provider) => (
              <ProviderRow key={provider.id} provider={provider} onClick={() => select(provider)} />
            ))
          ) : (
            <div className="empty-state">
              <Search size={24} />
              <h3>ما لقيناش نتائج</h3>
              <p>جرّب كلمة أخرى أو اختار خدمة من القائمة.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Profile({
  provider,
  back,
  request,
  message,
}: {
  provider: Provider;
  back: () => void;
  request: () => void;
  message: () => void;
}) {
  return (
    <main className="screen profile-screen">
      <button className="back" onClick={back}>
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
        <button className="primary" onClick={request}>
          طلب الخدمة <ArrowLeft size={15} />
        </button>
        <button className="secondary" onClick={message}>
          <MessageCircle size={15} /> مراسلة
        </button>
      </div>
      <div className="profile-content">
        <div className="panel">
          <span className="section-kicker">عن المحترف</span>
          <h2>خدمة مزيانة كتبدأ بالثقة</h2>
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
          {["خدمة في المستوى وجا فالوقت بالضبط.", "تواصل واضح وخدمة نظيفة، كنعاود نتعامل معاه.", "محترف وكيشرح المشكل قبل ما يبدا."].map(
            (review, index) => (
              <div className="review" key={review}>
                <strong>
                  {["نادية أ.", "سفيان م.", "مريم ل."][index]} <Rating value="5.0" />
                </strong>
                <p>{review}</p>
              </div>
            ),
          )}
        </div>
        <div>
          <div className="panel compact-panel">
            <span className="section-kicker">خلي بالك مرتاح</span>
            <h2>تفاصيل التحقق</h2>
            {["الهوية", "الهاتف", "الملف المهني"].map((item) => (
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
              <b className="available-text">{provider.available ? "متاح اليوم" : "غائب الآن"}</b>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function RequestFlow({ provider, done, back }: { provider: Provider; done: (booking: Booking) => void; back: () => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    service: provider.services[0],
    description: "",
    location: "طنجة، النجمة",
    date: "غدا",
    time: "18:00",
  });
  const labels = ["الخدمة", "المحترف", "التفاصيل", "المكان", "الوقت", "المراجعة"];
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  return (
    <main className="screen request-screen">
      <button className="back" onClick={back}>
        <ChevronLeft size={15} /> رجوع
      </button>
      <div className="request-heading">
        <span className="section-kicker">خطوة بخطوة</span>
        <h1>طلب خدمة من {provider.name}</h1>
        <p>غادي نوصلو طلبك للمحترف ويجاوبك فأقرب وقت.</p>
      </div>
      <div className="steps">
        {labels.map((label, index) => (
          <div className={`step ${index <= step ? "on" : ""}`} key={label}>
            <b>{index < step ? <Check size={13} /> : index + 1}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
      {step === 0 && (
        <div className="panel form-panel">
          <span className="section-kicker">01 / 06</span>
          <h2>اختار الخدمة</h2>
          {provider.services.map((service) => (
            <button className={`choice-row ${form.service === service ? "chosen" : ""}`} key={service} onClick={() => update("service", service)}>
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
          <textarea className="field" rows={5} value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="مثلا: عندي تسريب تحت الحوض..." />
        </div>
      )}
      {step === 3 && (
        <div className="panel form-panel">
          <span className="section-kicker">04 / 06</span>
          <h2>فين بغيتي الخدمة؟</h2>
          <label>العنوان</label>
          <input className="field" value={form.location} onChange={(event) => update("location", event.target.value)} />
        </div>
      )}
      {step === 4 && (
        <div className="panel form-panel">
          <span className="section-kicker">05 / 06</span>
          <h2>النهار والوقت المناسب</h2>
          <label>النهار</label>
          <select className="field" value={form.date} onChange={(event) => update("date", event.target.value)}>
            <option>غدا</option>
            <option>الخميس 16 ماي</option>
            <option>الجمعة 17 ماي</option>
          </select>
          <label>الوقت التقريبي</label>
          <select className="field" value={form.time} onChange={(event) => update("time", event.target.value)}>
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
          {[
            ["الخدمة", form.service],
            ["المحترف", provider.name],
            ["المكان", form.location],
            ["الوقت", `${form.date} · ${form.time}`],
          ].map(([label, value]) => (
            <div className="detail-row" key={label}>
              <span>{label}</span>
              <b>{value}</b>
            </div>
          ))}
          <div className="notice">الثمن يتم الاتفاق عليه مباشرة مع مقدم الخدمة.</div>
        </div>
      )}
      <div className="form-actions">
        {step > 0 ? <button className="secondary" onClick={() => setStep(step - 1)}>السابق</button> : <span />}
        <button
          className="primary"
          onClick={() =>
            step < 5
              ? setStep(step + 1)
              : done({
                  id: Date.now(),
                  service: form.service,
                  provider: provider.name,
                  date: form.date,
                  time: form.time,
                  location: form.location,
                  status: "طلب جديد",
                })
          }
        >
          {step === 5 ? "إرسال الطلب" : "التالي"} <ArrowLeft size={15} />
        </button>
      </div>
    </main>
  );
}

function Bookings({ bookings, onChat }: { bookings: Booking[]; onChat: () => void }) {
  return (
    <main className="screen bookings-screen">
      <div className="page-title">
        <div>
          <span className="section-kicker">كلشي مجموع هنا</span>
          <h1>طلباتي</h1>
        </div>
        <span className="count-badge">{bookings.length} طلبات</span>
      </div>
      {bookings.map((booking) => (
        <div className="booking-card" key={booking.id}>
          <div className="booking-icon">
            <CalendarDays size={20} />
          </div>
          <div className="booking-main">
            <span className="status">{booking.status}</span>
            <h3>{booking.service}</h3>
            <p>{booking.provider}</p>
            <small>
              <CalendarDays size={12} /> {booking.date}، {booking.time}
              <MapPin size={12} /> {booking.location}
            </small>
          </div>
          <button className="secondary mini-button" onClick={onChat}>
            <MessageCircle size={14} /> مراسلة
          </button>
        </div>
      ))}
    </main>
  );
}

function Chat() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    "السلام عليكم، محتاج سباك اليوم.",
    "وعليكم السلام، مرحبا. شنو المشكل؟",
    "عندي تسريب فالمطبخ.",
    "نقدر نجي عندك اليوم، ونتفاهمو على الثمن من بعد ما نشوف المشكل.",
  ]);
  const send = () => {
    if (!text.trim()) return;
    setMessages([...messages, text.trim()]);
    setText("");
  };
  return (
    <main className="screen chat-screen">
      <div className="page-title">
        <div>
          <span className="section-kicker">تواصل مباشر</span>
          <h1>الرسائل</h1>
        </div>
      </div>
      <div className="chat-panel panel">
        <div className="chat-person">
          <img src={providers[0].image} alt="" />
          <div>
            <b>{providers[0].name}</b>
            <small><span /> متصل الآن · إصلاح التسربات</small>
          </div>
          <PhoneIcon />
        </div>
        <div className="messages">
          {messages.map((message, index) => (
            <div className={`message ${index % 2 ? "received" : "sent"}`} key={`${message}-${index}`}>
              {message}
            </div>
          ))}
        </div>
        <div className="message-compose">
          <input className="field" value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send()} placeholder="كتب رسالة..." />
          <button className="primary send-button" onClick={send}><ArrowLeft size={16} /></button>
        </div>
      </div>
    </main>
  );
}

function PhoneIcon() {
  return <span className="chat-call"><CircleUserRound size={18} /></span>;
}

function ProviderMode({ switchRole, toast }: { switchRole: () => void; toast: (message: string) => void }) {
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
        {["نظرة عامة", "الطلبات الجديدة", "الخدمات القادمة", "التقييمات", "ملفي المهني"].map((item, index) => (
          <button className={index === 0 ? "sel" : ""} key={item}>{item}</button>
        ))}
        <button className="switch-role" onClick={switchRole}>العودة لحساب الزبون <ArrowLeft size={14} /></button>
      </aside>
      <main className="provider-main">
        <div className="admin-top">
          <div>
            <span className="section-kicker">الثلاثاء، 14 ماي 2024</span>
            <h1>صباح الخير، محمد</h1>
          </div>
          <button className={available ? "availability on" : "availability"} onClick={() => setAvailable(!available)}>
            <span /> {available ? "متاح لاستقبال الطلبات" : "غير متاح حاليا"}
          </button>
        </div>
        <div className="metric-row">
          <div className="metric"><small>طلبات جديدة</small><strong>03</strong><span>+2 اليوم</span></div>
          <div className="metric"><small>هذا الأسبوع</small><strong>12</strong><span>من 15 طلب</span></div>
          <div className="metric"><small>التقييم العام</small><strong>4.9</strong><span>128 تقييم</span></div>
        </div>
        <div className="section-heading dashboard-heading">
          <div><span className="section-kicker">خلي خدمتك دايماً حاضرة</span><h2>طلبات جديدة</h2></div>
          <button className="text-button">عرض الكل <ArrowLeft size={15} /></button>
        </div>
        <div className="request-row">
          <div className="request-client"><span className="avatar">ح</span><div><span className="status">جديد</span><h3>إصلاح تسريب في المطبخ</h3><p>حمزة العروسي · غدا، 18:00 · طنجة</p></div></div>
          <div className="cta-row">
            <button className="primary" onClick={() => { setAccepted(true); toast("تم قبول الطلب بنجاح"); }}>قبول</button>
            <button className="secondary" onClick={() => toast("تم رفض الطلب")}>رفض</button>
            <button className="ghost-button" onClick={() => toast("افتح الرسائل للتواصل")}>مراسلة</button>
          </div>
        </div>
        {accepted && <div className="accepted-note"><Check size={15} /> الطلب مقبول، تقدر تتواصل مع حمزة الآن.</div>}
        <div className="panel upcoming-panel">
          <div className="section-heading"><div><span className="section-kicker">نظرة سريعة</span><h2>الخدمات القادمة</h2></div><CalendarDays size={18} /></div>
          <div className="detail-row"><b>تركيب صنبور جديد</b><span>اليوم · 16:30 · طنجة</span></div>
          <div className="detail-row"><b>صيانة سخان الماء</b><span>الجمعة · 10:00 · مالاباطا</span></div>
        </div>
      </main>
    </div>
  );
}

function Admin({ switchRole }: { switchRole: () => void }) {
  const [tab, setTab] = useState("Dashboard");
  const items = ["Dashboard", "Users", "Providers", "Verification", "Services", "Bookings", "Reviews", "Reports", "Settings"];
  return (
    <div className="admin">
      <aside className="admin-side"><Logo inverse />{items.map((item) => <button className={tab === item ? "active" : ""} onClick={() => setTab(item)} key={item}>{item}</button>)}<button className="return-app" onClick={switchRole}>رجوع للتطبيق</button></aside>
      <main className="admin-main"><div className="admin-top"><div><span className="section-kicker">Maak operations</span><h1>{tab}</h1></div><span className="avatar">A</span></div>{tab === "Dashboard" ? <><div className="metric-row"><div className="metric"><small>إجمالي المستخدمين</small><strong>2,481</strong></div><div className="metric"><small>مقدمون موثقون</small><strong>186</strong></div><div className="metric"><small>طلبات هذا الشهر</small><strong>842</strong></div></div><div className="panel chart-panel"><h2>الطلبات خلال آخر 7 أيام</h2><div className="bar-chart">{[42, 65, 53, 88, 70, 96, 78].map((height, index) => <div className="bar" style={{ height }} key={index} />)}</div></div></> : <div className="table"><div className="table-row head"><span>الاسم</span><span>النوع</span><span>المدينة</span><span>الحالة</span></div>{providers.map((provider, index) => <div className="table-row" key={provider.name}><b>{provider.name}</b><span>{index % 2 ? "عميل" : "مقدم خدمة"}</span><span>{index === 3 ? "تطوان" : "طنجة"}</span><span className="verified"><Check size={12} /> نشط</span></div>)}</div>}</main>
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState<"customer" | "provider" | "admin">("customer");
  const [page, setPage] = useState("home");
  const [selected, setSelected] = useState<Provider | null>(null);
  const [request, setRequest] = useState(false);
  const [filter, setFilter] = useState("");
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("maak-bookings") || "null") || initialBookings;
    } catch {
      return initialBookings;
    }
  });
  const [toast, setToast] = useState("");
  useEffect(() => {
    localStorage.setItem("maak-bookings", JSON.stringify(bookings));
  }, [bookings]);
  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };
  const changePage = (nextPage: string) => {
    setSelected(null);
    setRequest(false);
    setPage(nextPage);
  };

  if (role === "provider") {
    return <div className="app provider-app"><ProviderMode switchRole={() => setRole("customer")} toast={showToast} />{toast && <div className="toast">{toast}</div>}</div>;
  }
  if (role === "admin") {
    return <Admin switchRole={() => setRole("customer")} />;
  }
  const content = request && selected ? (
    <RequestFlow
      provider={selected}
      back={() => setRequest(false)}
      done={(booking) => {
        setBookings([...bookings, booking]);
        setRequest(false);
        setSelected(null);
        setPage("bookings");
        showToast("توصلنا بالطلب ديالك");
      }}
    />
  ) : selected ? (
    <Profile provider={selected} back={() => setSelected(null)} request={() => setRequest(true)} message={() => setPage("chat")} />
  ) : page === "bookings" ? (
    <Bookings bookings={bookings} onChat={() => setPage("chat")} />
  ) : page === "chat" ? (
    <Chat />
  ) : (
    <HomePage select={setSelected} filter={filter} setFilter={setFilter} setPage={changePage} />
  );
  return (
    <div className="app">
      <div className="shell">
        <Header page={page} onPage={changePage} onNotify={() => showToast("ما عندك حتى إشعار جديد")} onRole={() => setRole("provider")} />
        {content}
      </div>
      {!request && !selected && <MobileNav page={page} setPage={changePage} />}
      <button className="admin-hotspot" onClick={() => setRole("admin")} aria-label="Admin" />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}