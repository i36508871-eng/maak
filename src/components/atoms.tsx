import {
  ArrowLeft,
  ChevronLeft,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  ThumbsUp,
  X,
} from "lucide-react";
import type { Category, Provider } from "../types";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className={`brand ${inverse ? "inverse" : ""}`}>
      maak<span />
    </div>
  );
}

export function Rating({ value, reviews }: { value: string; reviews?: number }) {
  return (
    <span className="rating">
      <Star size={13} fill="currentColor" />
      {value}
      {reviews ? <small>({reviews})</small> : null}
    </span>
  );
}

export function SearchBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="search-box">
      <Search size={18} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="ما الخدمة التي تبحث عنها؟"
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

export function TrustStrip() {
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
          <b>استجابة سريعة</b>
          <small>تواصل مباشر وآمن</small>
        </span>
      </div>
      <div>
        <span className="trust-icon orange">
          <ThumbsUp size={19} />
        </span>
        <span>
          <b>اختيارك مضمون</b>
          <small>ضمان جودة الخدمة</small>
        </span>
      </div>
    </div>
  );
}

export function CategoryCard({
  category,
  active,
  onClick,
}: {
  category: Category;
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

export function ProviderRow({
  provider,
  onClick,
}: {
  provider: Provider;
  onClick: () => void;
}) {
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
        <span>{provider.available ? "متاح الآن" : "غير متاح الآن"}</span>
        <ChevronLeft size={17} />
      </div>
    </button>
  );
}