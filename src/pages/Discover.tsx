import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { CategoryChip, ProviderRow, SearchBox, StateCard } from "../components/atoms";
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
  const { providers, status } = useProviders();

  const categories = useMemo(
    () => getCategories().map((c) => ({ ...c, count: categoryCountLabel(providers, c.name) })),
    [providers],
  );
  const chips: Category[] = useMemo(
    () => [
      { name: "الكل", icon: Sparkles, count: providers.length ? providers.length + " محترف" : "قريباً" },
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

  return (
    <main className="screen discover">
      <div className="page-title">
        <div>
          <span className="section-kicker">كل الخدمات في مكان واحد</span>
          <h1>اكتشف الخدمات</h1>
        </div>
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
          <div>
            <span className="section-kicker">{filter ? "نتائج مفلترة" : "محترفون موثوقون"}</span>
            <h2>{filter ? "نتائج عن «" + filter + "»" : "كل المقدمين"}</h2>
          </div>
          <span className="results-count">{results.length} محترف</span>
        </div>
        <div className="discover-results">
          {status === "loading" ? (
            <StateCard variant="loading" />
          ) : status === "error" ? (
            <StateCard variant="error" />
          ) : results.length === 0 ? (
            <StateCard
              variant="empty"
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
