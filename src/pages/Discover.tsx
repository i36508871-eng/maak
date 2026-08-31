import { useMemo, useState } from "react";
import { AlertCircle, ChevronLeft, Loader2, Search } from "lucide-react";
import { CategoryCard, ProviderRow, SearchBox } from "../components/atoms";
import { categoryCountLabel, filterProviders, getCategories } from "../services";
import { useProviders } from "../hooks/useProviders";
import { useRouter } from "../router";

export default function Discover() {
  const { navigate } = useRouter();
  const [filter, setFilter] = useState("");
  const { providers, status } = useProviders();
  const categories = useMemo(
    () => getCategories().map((c) => ({ ...c, count: categoryCountLabel(providers, c.name) })),
    [providers],
  );
  const shown = useMemo(() => filterProviders(providers, filter), [providers, filter]);

  return (
    <main className="screen">
      <div className="page-title">
        <div>
          <span className="section-kicker">كل الخدمات في مكان واحد</span>
          <h1>اكتشف الخدمات</h1>
        </div>
      </div>
      <SearchBox value={filter} onChange={setFilter} />
      <section className="content-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">اختر اللي مناسب ليك</span>
            <h2>الخدمات</h2>
          </div>
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
            <span className="section-kicker">{filter ? "نتائج البحث" : "محترفون موثوقون"}</span>
            <h2>{filter ? `نتائج عن «${filter}»` : "كل المقدمين"}</h2>
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
              <p>نجلب المحترفين...</p>
            </div>
          )}
          {status === "error" && (
            <div className="state-error">
              <AlertCircle size={26} />
              <h3>تعذّر تحميل بيانات المحترفين</h3>
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
