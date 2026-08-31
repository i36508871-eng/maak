import { useMemo, useState } from "react";
import { Loader2, MapPin, Search, ShieldCheck } from "lucide-react";
import { CategoryCard, ProviderRow, SearchBox } from "../components/atoms";
import { categoryCountLabel, filterProviders, getCategories } from "../services";
import { useProviders } from "../hooks/useProviders";
import { useAuth } from "../auth";
import { useToast } from "../context";
import { useRouter } from "../router";

export default function Home() {
  const { navigate } = useRouter();
  const { showToast } = useToast();
  const { profile } = useAuth();
  const [filter, setFilter] = useState("");
  const { providers, status } = useProviders();
  const categories = useMemo(
    () => getCategories().map((c) => ({ ...c, count: categoryCountLabel(providers, c.name) })),
    [providers],
  );
  const shown = useMemo(() => filterProviders(providers, filter), [providers, filter]);
  const name = profile?.full_name?.trim();
  const city = profile?.city?.trim();

  return (
    <main className="home">
      <div className="home-bar">
        <button className="home-loc" onClick={() => showToast("إدارة الموقع غير متاحة حالياً")}>
          <MapPin size={16} />
          <span>{city || "حدد موقعك"}</span>
        </button>
      </div>

      <section className="home-intro">
        <p className="home-greet">{name ? "مرحباً، " + name : "مرحباً بك في ماك"}</p>
        <h1 className="home-prompt">ما الخدمة التي تبحث عنها؟</h1>
        <SearchBox value={filter} onChange={setFilter} />
      </section>

      <section className="home-section">
        <div className="home-section-head">
          <h2>تصفّح حسب الخدمة</h2>
          <button className="text-button" onClick={() => navigate("/discover")}>الكل</button>
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

      <section className="home-section">
        <div className="home-section-head">
          <h2>{filter ? "نتائج البحث" : "مقدمو خدمات موثوقون بالقرب منك"}</h2>
        </div>
        {status === "loading" ? (
          <div className="home-loading">
            <Loader2 size={22} />
            <span>جارٍ تحميل مقدمي الخدمات…</span>
          </div>
        ) : status === "error" ? (
          <div className="home-state">
            <ShieldCheck size={26} />
            <h3>تعذّر تحميل البيانات.</h3>
            <p>يرجى المحاولة مرة أخرى.</p>
          </div>
        ) : shown.length === 0 ? (
          <div className="home-state">
            <Search size={26} />
            <h3>لا توجد نتائج مطابقة</h3>
            <p>جرّب كلمة أخرى أو اختر خدمة من القائمة.</p>
          </div>
        ) : (
          <div className="provider-list">
            {shown.map((provider) => (
              <ProviderRow
                key={provider.id}
                provider={provider}
                onClick={() => navigate("/provider/" + provider.id)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
