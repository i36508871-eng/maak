import { ArrowDownUp, MapPin } from "lucide-react";

type SortMode = "default" | "rating" | "distance";

export function FilterBar({
  cities,
  city,
  onCity,
  availableOnly,
  onAvailable,
  sort,
  onSort,
  onClear,
  hasActive,
}: {
  cities: string[];
  city: string;
  onCity: (value: string) => void;
  availableOnly: boolean;
  onAvailable: (value: boolean) => void;
  sort: SortMode;
  onSort: (value: SortMode) => void;
  onClear: () => void;
  hasActive: boolean;
}) {
  return (
    <div className="discover-filterbar">
      <div className="filter-field">
        <MapPin size={14} />
        <select
          className="filter-select"
          value={city}
          onChange={(event) => onCity(event.target.value)}
          aria-label="المدينة"
        >
          <option value="">كل المدن</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <button
        className={`filter-toggle ${availableOnly ? "active" : ""}`}
        onClick={() => onAvailable(!availableOnly)}
        aria-pressed={availableOnly}
      >
        <span className="dot" />
        متاح الآن
      </button>
      <div className="filter-field">
        <ArrowDownUp size={14} />
        <select
          className="filter-select"
          value={sort}
          onChange={(event) => onSort(event.target.value as SortMode)}
          aria-label="الترتيب"
        >
          <option value="default">الترتيب الافتراضي</option>
          <option value="rating">الأعلى تقييماً</option>
          <option value="distance">الأقرب مسافةً</option>
        </select>
      </div>
      {hasActive ? (
        <button className="filter-clear" onClick={onClear}>
          مسح الفلاتر
        </button>
      ) : null}
    </div>
  );
}
