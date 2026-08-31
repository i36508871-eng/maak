import { AlertCircle, ArrowLeft, ChevronLeft, Clock3, Loader2, MapPin, Search, ShieldCheck, Star, ThumbsUp, X } from "lucide-react";
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
  onSubmit,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}) {
  return (
    <div className="search-box">
      <Search size={18} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && onSubmit) onSubmit();
        }}
        placeholder={placeholder ?? "ابحث عن خدمة أو مقدم خدمة"}
        aria-label="ابحث عن خدمة أو مقدم خدمة"
      />
      {value ? (
        <button className="clear-search" onClick={() => onChange("")} aria-label="مسح البحث">
          <X size={15} />
        </button>
      ) : null}
      <button className="search-submit" onClick={onSubmit} aria-label="بحث">
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

export function CategoryChip({
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
    <button
      className={`category-chip ${active ? "active" : ""}`}
      onClick={onClick}
      aria-pressed={active}
    >
      <span className="chip-icon">
        <Icon size={18} />
      </span>
      <span className="chip-text">
        <b>{category.name}</b>
        <small>{category.count}</small>
      </span>
    </button>
  );
}

export function ServiceChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`service-chip ${active ? "active" : ""}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {label}
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

export function StateCard({
  variant,
  actionLabel,
  onAction,
}: {
  variant: "loading" | "empty" | "error";
  actionLabel?: string;
  onAction?: () => void;
}) {
  if (variant === "loading") {
    return (
      <div className="state-card loading">
        <span className="state-ico">
          <Loader2 size={24} />
        </span>
        <p>جارٍ تحميل مقدمي الخدمات…</p>
      </div>
    );
  }
  if (variant === "error") {
    return (
      <div className="state-card">
        <span className="state-ico">
          <AlertCircle size={24} />
        </span>
        <h3>تعذّر تحميل مقدمي الخدمات.</h3>
        <p>يرجى المحاولة مرة أخرى.</p>
      </div>
    );
  }
  return (
    <div className="state-card">
      <span className="state-ico">
        <Search size={24} />
      </span>
      <h3>لا توجد نتائج مطابقة.</h3>
      <p>جرّب تعديل البحث أو الفلاتر للعثور على مقدم خدمة مناسب.</p>
      {actionLabel && onAction ? (
        <button className="text-button state-action" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
