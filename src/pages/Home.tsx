import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { CategoryChip, ProviderRow, SearchBox, ServiceChip, StateCard } from "../components/atoms";
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
  const popularServices = useMemo(() => {
    const freq: Record<string, number> = {};
    for (const p of providers) for (const s of p.services) freq[s] = (freq[s] || 0) + 1;
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([s]) => s).slice(0, 8);
  }, [providers]);

  const name = profile?.full_name?.trim();
  const city = profile?.city?.trim();
  const goDiscover = (term: string) =>
    navigate("/discover" + (term ? "?q=" + encodeURIComponent(term) : ""));

  return (
    <main className="home">
      <div className="home-bar">
        <button
          className="home-loc"
          onClick={() => showToast("إدارة الموقع غير متاحة حالياً")}
        >
          <MapPin size={16} />
          <span>{city || "حدد موقعك"}</span>
        </button>
      </div>

      <section className="home-intro">
        <p className="home-greet">{name ? "مرحباً بك، " + name : "مرحباً بك في ماك"}</p>
        <h1 className="home-prompt">ما الخدمة التي تبحث عنها؟</h1>
        <SearchBox value={filter} onChange={setFilter} onSubmit={() => goDiscover(filter)} />
      </section>

      <section className="home-section">
        <div className="home-section-head">
          <h2>تصفّح حسب الخدمة</h2>
          <button className="text-button" onClick={() => goDiscover("")}>الكل</button>
        </div>
        <div className="category-rail" aria-label="الأقسام">
          {categories.map((category) => (
            <CategoryChip
              key={category.name}
              category={category}
              active={filter === category.name}
              onClick={() => setFilter(filter === category.name ? "" : category.name)}
            />
          ))}
        </div>
      </section>

      {popularServices.length > 0 ? (
        <section className="home-section">
          <div className="home-section-head">
            <h2>خدمات شائعة</h2>
          </div>
          <div className="service-rail" aria-label="خدمات شائعة">
            {popularServices.map((service) => (
              <ServiceChip
                key={service}
                label={service}
                active={filter === service}
                onClick={() => setFilter(filter === service ? "" : service)}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="home-section">
        <div className="home-section-head">
          <h2>{filter ? "نتائج البحث" : "مقدمو خدمات موثوقون"}</h2>
          {filter ? (
            <button className="text-button" onClick={() => setFilter("")}>مسح البحث</button>
          ) : (
            <button className="text-button" onClick={() => goDiscover("")}>عرض الكل</button>
          )}
        </div>
        {status === "loading" ? (
          <StateCard variant="loading" />
        ) : status === "error" ? (
          <StateCard variant="error" />
        ) : shown.length === 0 ? (
          <StateCard variant="empty" actionLabel="مسح البحث" onAction={() => setFilter("")} />
        ) : (
          <div className="provider-list home-providers">
            {shown.slice(0, 6).map((provider) => (
              <ProviderRow
                key={provider.id}
                provider={provider}
                onClick={() => navigate("/provider/" + provider.id)}
              />
            ))}
            {shown.length > 6 ? (
              <button className="ghost-button home-more" onClick={() => goDiscover(filter)}>
                عرض كل المقدمين
              </button>
            ) : null}
          </div>
        )}
      </section>
    </main>
  );
}
