import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { CategoryChip, ProviderRow, ProviderSkeleton, SearchBox, ServiceChip, StateCard } from "../components/atoms";
import { categoryCountLabel, getCategories } from "../services";
import { useProviders } from "../hooks/useProviders";
import { useAuth } from "../auth";
import { useToast } from "../context";
import { useRouter } from "../router";

export default function Home() {
  const { navigate } = useRouter();
  const { showToast } = useToast();
  const { profile } = useAuth();
  const [query, setQuery] = useState("");
  const { providers, status, refetch } = useProviders();

  const categories = useMemo(
    () => getCategories().map((c) => ({ ...c, count: categoryCountLabel(providers, c.name) })),
    [providers],
  );
  const availableServices = useMemo(() => {
    const freq: Record<string, number> = {};
    for (const p of providers) for (const s of p.services) freq[s] = (freq[s] || 0) + 1;
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([s]) => s).slice(0, 8);
  }, [providers]);

  const name = profile?.full_name?.trim();
  const city = profile?.city?.trim();
  const goDiscover = (term: string) =>
    navigate("/discover" + (term ? "?q=" + encodeURIComponent(term) : ""));
  const featured = providers.slice(0, 4);

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
        <h1 className="home-prompt">ما الخدمة التي تحتاج إليها؟</h1>
        <p className="home-sub">اكتشف مقدمي الخدمات الموثوقين بالقرب منك</p>
        <SearchBox value={query} onChange={setQuery} onSubmit={() => goDiscover(query)} />
      </section>

      <section className="home-section">
        <div className="home-section-head">
          <h2>الخدمات</h2>
          <button className="text-button" onClick={() => goDiscover("")}>
            استكشف الخدمات
          </button>
        </div>
        <div className="category-rail" aria-label="الأقسام">
          {categories.map((category) => (
            <CategoryChip
              key={category.name}
              category={category}
              onClick={() => goDiscover(category.name)}
            />
          ))}
        </div>
        {availableServices.length > 0 ? (
          <div className="service-rail" aria-label="الخدمات المتوفرة">
            {availableServices.map((service) => (
              <ServiceChip key={service} label={service} onClick={() => goDiscover(service)} />
            ))}
          </div>
        ) : null}
      </section>

      <section className="home-section">
        <div className="home-section-head">
          <h2>مقدمو الخدمات</h2>
          <button className="text-button" onClick={() => goDiscover("")}>
            عرض الكل
          </button>
        </div>
        {status === "loading" ? (
          <ProviderSkeleton rows={3} />
        ) : status === "error" ? (
          <StateCard variant="error" actionLabel="إعادة المحاولة" onAction={refetch} />
        ) : providers.length === 0 ? (
          <StateCard
            variant="empty"
            emptyTitle="لا يوجد مقدمو خدمات منشورون حالياً."
            emptyBody="ستظهر قوائم مقدمي الخدمات هنا فور نشرها في المنصة."
            actionLabel="استكشف الخدمات"
            onAction={() => goDiscover("")}
          />
        ) : (
          <div className="provider-list">
            {featured.map((provider) => (
              <ProviderRow
                key={provider.id}
                provider={provider}
                onClick={() => navigate("/provider/" + provider.id)}
              />
            ))}
            {providers.length > featured.length ? (
              <button className="ghost-button home-more" onClick={() => goDiscover("")}>
                عرض كل مقدمي الخدمات
              </button>
            ) : null}
          </div>
        )}
      </section>
    </main>
  );
}
