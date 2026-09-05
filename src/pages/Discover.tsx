import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { CategoryChip, ProviderRow, ProviderSkeleton, SearchBox, StateCard } from "../components/atoms";
import { FilterBar } from "../components/filters";
import { categoryCountLabel, filterProviders, getCategories } from "../services";
import { useProviders } from "../hooks/useProviders";
import type { Category } from "../types";
import { useRouter } from "../router";

const numDist = (d: string | null) => {
  if (!d) return Infinity;
  const m = d.match(/[\d.]+/);
  return m ? parseFloat(m[0]) : Infinity;
};

const providerCountLabel = (n: number): string => {
  if (n <= 0) return "";
  if (n === 1) return "مقدم خدمة واحد";
  if (n === 2) return "مقدما خدمة";
  return n + " مقدمي خدمة";
};

export default function Discover() {
  const { navigate } = useRouter();
  const initialQuery = useMemo(
    () => new URLSearchParams(window.location.search).get("q") || "",
    [],
  );
  const [filter, setFilter] = useState(initialQuery);
  const [city, setCity] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState<"default" | "rating" | "distance">("default");
  const { providers, status, refetch } = useProviders();

  const categories = useMemo(
    () => getCategories().map((c) => ({ ...c, count: categoryCountLabel(providers, c.name) })),
    [providers],
  );
  const chips: Category[] = useMemo(
    () => [
      { name: "الكل", icon: Sparkles, count: providerCountLabel(providers.length) },
      ...categories,
    ],
    [categories, providers.length],
  );
  const cities = useMemo(
    () => Array.from(new Set(providers.map((p) => p.city).filter(Boolean) as string[])),
    [providers],
  );

  const results = useMemo(() => {
    let list = filterProviders(providers, filter);
    if (city) list = list.filter((p) => p.city === city);
    if (availableOnly) list = list.filter((p) => p.available);
    if (sort === "rating") list = [...list].sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));
    else if (sort === "distance") list = [...list].sort((a, b) => numDist(a.distance) - numDist(b.distance));
    return list;
  }, [providers, filter, city, availableOnly, sort]);

  const hasActiveFilters = Boolean(filter) || Boolean(city) || availableOnly || sort !== "default";
  const clearAll = () => {
    setFilter("");
    setCity("");
    setAvailableOnly(false);
    setSort("default");
  };

  const marketplaceEmpty = providers.length === 0 && !hasActiveFilters;

  return (
    <main className="screen discover">
      <div className="page-title">
        <h1>اكتشف الخدمات</h1>
        {providers.length > 0 ? (
          <span className="count-badge">{providerCountLabel(providers.length)}</span>
        ) : null}
      </div>

      <SearchBox value={filter} onChange={setFilter} onSubmit={() => undefined} />

      <section className="content-section discover-categories">
        <div className="section-heading">
          <h2>الأقسام</h2>
        </div>
        <div className="category-rail" aria-label="الأقسام">
          {chips.map((category) => {
            const isActive = category.name === "الكل" ? !filter : filter === category.name;
            return (
              <CategoryChip
                key={category.name}
                category={category}
                active={isActive}
                onClick={() =>
                  category.name === "الكل"
                    ? setFilter("")
                    : setFilter(filter === category.name ? "" : category.name)
                }
              />
            );
          })}
        </div>
      </section>

      <FilterBar
        cities={cities}
        city={city}
        onCity={setCity}
        availableOnly={availableOnly}
        onAvailable={setAvailableOnly}
        sort={sort}
        onSort={(v) => setSort(v as "default" | "rating" | "distance")}
        onClear={clearAll}
        hasActive={hasActiveFilters}
      />

      <section className="content-section providers-section">
        <div className="section-heading">
          <h2>{filter ? "نتائج عن «" + filter + "»" : "كل مقدمي الخدمات"}</h2>
          <span className="results-count">{providerCountLabel(results.length)}</span>
        </div>
        <div className="discover-results">
          {status === "loading" ? (
            <ProviderSkeleton rows={4} />
          ) : status === "error" ? (
            <StateCard variant="error" actionLabel="إعادة المحاولة" onAction={refetch} />
          ) : results.length === 0 ? (
            <StateCard
              variant="empty"
              emptyTitle={marketplaceEmpty ? "لا يوجد مقدمو خدمات منشورون حالياً." : "لا توجد نتائج مطابقة."}
              emptyBody={marketplaceEmpty ? "ستظهر قوائم مقدمي الخدمات هنا فور نشرها في المنصة." : "جرّب تعديل البحث أو الفلاتر للعثور على مقدم خدمة مناسب."}
              actionLabel={hasActiveFilters ? "مسح الفلاتر" : undefined}
              onAction={hasActiveFilters ? clearAll : undefined}
            />
          ) : (
            results.map((provider) => (
              <ProviderRow
                key={provider.id}
                provider={provider}
                onClick={() => navigate("/provider/" + provider.id)}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
