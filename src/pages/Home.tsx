import { useMemo, useState } from "react";
import { AlertCircle, ArrowLeft, Check, ChevronLeft, Loader2, Search, ShieldCheck } from "lucide-react";
import { CategoryCard, ProviderRow, SearchBox, TrustStrip } from "../components/atoms";
import { filterProviders, getCategories } from "../services";
import { useProviders } from "../hooks/useProviders";
import { useRouter } from "../router";

export default function Home() {
  const { navigate } = useRouter();
  const [filter, setFilter] = useState("");
  const { providers, status } = useProviders();
  const categories = getCategories();
  const shown = useMemo(() => filterProviders(providers, filter), [providers, filter]);

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
              <small>مراجعة تدوية لكل ملف</small>
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
            <span className="section-kicker">اختر اللي مناسب ليك</span>
            <h2>شنو محتاج اليوم؟</h2>
          </div>
          <button className="text-button" onClick={() => navigate("/discover")}>
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
            <span className="section-kicker">قريبين منك فطنجة</span>
            <h2>
              {filter ? `نتائج البحث عن «${filter}»` : "ناس تقدر تعتمد عليهم"}
            </h2>
          </div>
          <button className="filter-button" onClick={() => setFilter("")}>
            <span>{shown.length} محترفين</span>
            <ChevronLeft size={15} />
          </button>
        </div>
        <div className="provider-list">
          {status === "loading" && (
            <div className="state-loading">
              <Loader2 className="spin" size={26} />
              <p>كنجلبو المحترفين...</p>
            </div>
          )}
          {status === "error" && (
            <div className="state-error">
              <AlertCircle size={26} />
              <h3>ما قدرناش نحمّلو المحترفين</h3>
              <p>تحقق من الاتصال بالخادم وحاول مرة أخرى.</p>
            </div>
          )}
          {status !== "success" ? null : shown.length ? (
            shown.map((provider) => (
              <ProviderRow
                key={provider.id}
                provider={provider}
                onClick={() => navigate(`/provider/${provider.id}`)}
              />
            ))
          ) : (
            <div className="empty-state">
              <Search size={24} />
              <h3>ما لقيناش نتائج</h3>
              <p>جرّب كلمة أخرى أو اختر خدمة من القائمة.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}