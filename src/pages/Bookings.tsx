import { useState } from "react";
import { CalendarDays, ClipboardList, Loader2, MapPin, X } from "lucide-react";
import { useBookings, useToast } from "../context";
import { useProviders } from "../hooks/useProviders";
import { useRouter } from "../router";
import { Avatar } from "../components/atoms";
import { BOOKING_STATUS_LABELS, mapBookingError } from "../lib/bookings";
import type { BookingRow, BookingStatus, Provider } from "../types";

function statusClass(status: BookingStatus): string {
  return (
    "status-pill " +
    (status === "pending"
      ? "pending"
      : status === "accepted"
        ? "accepted"
        : status === "in_progress"
          ? "progress"
          : status === "completed"
            ? "done"
            : status === "rejected"
              ? "rejected"
              : "cancelled")
  );
}

function fmtDate(iso: string | null): string {
  if (!iso) return "غير محدد";
  try {
    return new Intl.DateTimeFormat("ar-MA", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function Bookings() {
  const { bookings, loading, error, refresh, cancelBooking } = useBookings();
  const { providers } = useProviders();
  const { navigate } = useRouter();
  const { showToast } = useToast();
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"all" | "upcoming" | "done" | "cancelled">("all");

  const TABS: { key: "all" | "upcoming" | "done" | "cancelled"; label: string }[] = [
    { key: "all", label: "الكل" },
    { key: "upcoming", label: "قادم" },
    { key: "done", label: "مكتمل" },
    { key: "cancelled", label: "ملغي" },
  ];
  const filtered = bookings.filter((b) =>
    tab === "all"
      ? true
      : tab === "upcoming"
        ? b.status === "pending" || b.status === "accepted" || b.status === "in_progress"
        : tab === "done"
          ? b.status === "completed"
          : b.status === "rejected" || b.status === "cancelled",
  );

  const providerMap = new Map<number, Provider>();
  providers.forEach((p) => providerMap.set(p.id, p));

  const doCancel = async (id: string) => {
    setBusy(true);
    try {
      await cancelBooking(id);
      showToast("تم إلغاء الطلب.");
      setCancelId(null);
    } catch (err) {
      showToast(mapBookingError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="screen bookings-screen">
      <div className="page-title">
        <div>
          <span className="section-kicker">كل ما يخصّ طلباتك</span>
          <h1>طلباتي</h1>
        </div>
        <span className="count-badge">{bookings.length} طلب</span>
      </div>

      <div className="seg-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={"seg-tab" + (tab === t.key ? " active" : "")}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="empty-state">
          <Loader2 className="spin" size={22} />
          <p>جارٍ تحميل طلباتك…</p>
        </div>
      ) : error ? (
        <div className="empty-state">
          <p>{error}</p>
          <button className="ghost-button" onClick={() => void refresh()}>
            إعادة المحاولة
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <ClipboardList size={24} />
          <h3>لا توجد حجوزات بعد.</h3>
          <p>ابدأ بطلب خدمة من مقدّم موثوق، وستظهر طلباتك هنا.</p>
          <button
            className="primary"
            style={{ marginTop: 8 }}
            onClick={() => navigate("/discover")}
          >
            اكتشف الخدمات
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <ClipboardList size={24} />
          <h3>لا توجد طلبات في هذه الحالة.</h3>
        </div>
      ) : (
        filtered.map((booking) => {
          const provider = booking.provider_listing_id
            ? providerMap.get(booking.provider_listing_id)
            : undefined;
          const canCancel = booking.status === "pending";
          return (
            <div className="booking-card" key={booking.id}>
              <div className="booking-icon">
                {provider ? (
                  <Avatar name={provider.name} src={provider.image} />
                ) : (
                  <CalendarDays size={20} />
                )}
              </div>
              <div className="booking-main">
                <span className={statusClass(booking.status)}>
                  {BOOKING_STATUS_LABELS[booking.status]}
                </span>
                <h3>{booking.service_category}</h3>
                <p>{provider ? provider.name : "مقدّم خدمة"}</p>
                <small className="booking-meta">
                  <CalendarDays size={12} /> {fmtDate(booking.service_date)}
                  {booking.location_text ? (
                    <>
                      <MapPin size={12} /> {booking.location_text}
                    </>
                  ) : null}
                </small>
                {booking.service_description ? (
                  <p className="booking-note">{booking.service_description}</p>
                ) : null}
                {booking.provider_note ? (
                  <p className="booking-note">ملاحظة المقدّم: {booking.provider_note}</p>
                ) : null}
                {booking.status === "rejected" && booking.rejection_reason ? (
                  <p className="booking-reason">سبب الرفض: {booking.rejection_reason}</p>
                ) : null}
                {canCancel ? (
                  cancelId === booking.id ? (
                    <div className="cta-row" style={{ marginTop: 10 }}>
                      <button
                        className="secondary mini-button"
                        onClick={() => doCancel(booking.id)}
                        disabled={busy}
                      >
                        <X size={14} /> تأكيد الإلغاء
                      </button>
                      <button
                        className="ghost-button mini-button"
                        onClick={() => setCancelId(null)}
                        disabled={busy}
                      >
                        تراجع
                      </button>
                    </div>
                  ) : (
                    <button
                      className="ghost-button mini-button"
                      style={{ marginTop: 8 }}
                      onClick={() => setCancelId(booking.id)}
                    >
                      <X size={14} /> إلغاء الطلب
                    </button>
                  )
                ) : null}
              </div>
            </div>
          );
        })
      )}
    </main>
  );
}
