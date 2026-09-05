import { ArrowDownUp, MapPin } from "lucide-react";
import { useLanguage } from "../i18n";

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
  const { t } = useLanguage();
  return (
    <div className="discover-filterbar">
      <div className="filter-field">
        <MapPin size={14} />
        <select
          className="filter-select"
          value={city}
          onChange={(event) => onCity(event.target.value)}
          aria-label={t("common.city")}
        >
          <option value="">{t("filters.allCities")}</option>
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
        {t("filters.availableNow")}
      </button>
      <div className="filter-field">
        <ArrowDownUp size={14} />
        <select
          className="filter-select"
          value={sort}
          onChange={(event) => onSort(event.target.value as SortMode)}
          aria-label={t("filters.sort")}
        >
          <option value="default">{t("filters.sortDefault")}</option>
          <option value="rating">{t("filters.sortRating")}</option>
          <option value="distance">{t("filters.sortDistance")}</option>
        </select>
      </div>
      {hasActive ? (
        <button className="filter-clear" onClick={onClear}>
          {t("discover.clearFilters")}
        </button>
      ) : null}
    </div>
  );
}
