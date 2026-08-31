import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Check, X } from "lucide-react";
import { Logo } from "../components/atoms";
import { useToast } from "../context";
import { useAuth } from "../auth";
import {
  BOOKING_STATUS_LABELS,
  acceptBooking,
  completeBooking,
  getProviderBookings,
  mapBookingError,
  rejectBooking,
  startBooking,
} from "../lib/bookings";
import ProviderProfileEditor from "../components/ProviderProfileEditor";
import type { BookingRow, BookingStatus } from "../types";

type TabKey = "profile" | "new" | "accepted" | "in_progress" | "completed" | "rejected";

const TABS: { key: TabKey; label: string }[] = [
  { key: "profile", label: "ملفي المهني" },
  { key: "new", label: "طلبات جديدة" },
  { key: "accepted", label: "مقبولة" },
  { key: "in_progress", label: "جارٍ التنفيذ" },
  { key: "completed", label: "مكتملة" },
  { key: "rejected", label: "مرفوضة" },
];

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

function pad2(n: number): string {
  return n < 10 ? "0" + n : String(n);
}

export default function ProviderMode({ switchRole }: { switchRole: () => void }) {
  const { showToast } = useToast();
  const { profile, user } = useAuth();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabKey>("new");
  const [openId, setOpenId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setBookings(await getProviderBookings());
    } catch {
      setError("تعذّر تحميل الطلبات. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const providerName = profile?.full_name ?? user?.email ?? "مقدّم الخدمة";

  const counts = useMemo<Record<TabKey, number>>(
    () => ({
      profile: 0,
      new: bookings.filter((b) => b.status === "pending").length,
      accepted: bookings.filter((b) => b.status === "accepted").length,
      in_progress: bookings.filter((b) => b.status === "in_progress").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      rejected: bookings.filter((b) => b.status === "rejected").length,
    }),
    [bookings],
  );

  const list = useMemo(() => {
    if (tab === "profile") return [];
    const target: BookingStatus = tab === "new" ? "pending" : tab;
    return bookings.filter((b) => b.status === target);
  }, [bookings, tab]);

  const runAction = async (
    id: string,
    fn: () => Promise<BookingRow>,
    okMsg: string,
  ) => {
    setBusy(id);
    try {
      const row = await fn();
      setBookings((cur) => cur.map((b) => (b.id === row.id ? row : b)));
      showToast(okMsg);
    } catch (err) {
      showToast(mapBookingError(err));
    } finally {
      setBusy(null);
    }
  };

  const confirmReject = async () => {
    if (!rejectId) return;
    const reason = rejectReason.trim();
    if (!reason) {
      showToast("يرجى ذكر سبب الرفض.");
      return;
    }
    setBusy(rejectId);
    try {
      const row = await rejectBooking(rejectId, reason);
      setBookings((cur) => cur.map((b) => (b.id === row.id ? row : b)));
      showToast("تم رفض الطلب.");
      setRejectId(null);
      setRejectReason("");
    } catch (err) {
      showToast(mapBookingError(err));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="provider-layout">
      <aside className="provider-side">
        <Logo inverse />
        <div className="provider-side-title">
          <span>مساحة المحترف</span>
          <b>{providerName}</b>
        </div>
        {TABS.map((t) => (
          <button
            className={tab === t.key ? "sel" : ""}
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setOpenId(null);
              setRejectId(null);
            }}
          >
            {t.label}
            {counts[t.key] > 0 ? <span className="nav-count">{counts[t.key]}</span> : null}
          </button>
        ))}
        <button className="switch-role" onClick={switchRole}>
          العودة إلى حساب الزبون <ArrowLeft size={14} />
        </button>
      </aside>

      <main className="provider-main">
        {tab === "profile" ? (
          <ProviderProfileEditor />
        ) : (
          <>
        <div className="admin-top">
          <div>
            <span className="section-kicker">طلبات الخدمة</span>
            <h1>مرحباً، {providerName}</h1>
          </div>
        </div>

        <div className="metric-row">
          <div className="metric">
            <small>طلبات جديدة</small>
            <strong>{pad2(counts.new)}</strong>
            <span>بانتظار قبولك</span>
          </div>
          <div className="metric">
            <small>قيد التنفيذ</small>
            <strong>{pad2(counts.in_progress)}</strong>
            <span>خدمات جارية</span>
          </div>
          <div className="metric">
            <small>مكتملة</small>
            <strong>{pad2(counts.completed)}</strong>
            <span>خدمات منجزة</span>
          </div>
        </div>

        <div className="section-heading dashboard-heading">
          <div>
            <span className="section-kicker">
              {TABS.find((t) => t.key === tab)?.label}
            </span>
            <h2>{list.length} طلب</h2>
          </div>
          <button className="text-button" onClick={() => void load()}>
            <ArrowLeft size={15} /> تحديث
          </button>
        </div>

        {loading ? (
          <div className="empty-state">
            <p>جارٍ تحميل الطلبات…</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <p>{error}</p>
            <button className="ghost-button" onClick={() => void load()}>
              إعادة المحاولة
            </button>
          </div>
        ) : list.length === 0 ? (
          <div className="empty-state">
            <CalendarDays size={24} />
            <h3>لا توجد طلبات في هذا القسم.</h3>
          </div>
        ) : (
          list.map((b) => (
            <div className="request-row" key={b.id}>
              <div className="request-client">
                <span className="avatar">
                  {(b.customer_name ?? "ز").slice(0, 1)}
                </span>
                <div>
                  <span className="status">{BOOKING_STATUS_LABELS[b.status]}</span>
                  <h3>{b.service_category}</h3>
                  <p>
                    {b.customer_name ?? "زبون"} · {fmtDate(b.service_date)} ·{" "}
                    {b.location_text ?? "غير محدد"}
                  </p>
                </div>
              </div>

              <div className="cta-row">
                {b.status === "pending" ? (
                  <>
                    <button
                      className="primary"
                      disabled={busy === b.id}
                      onClick={() =>
                        void runAction(b.id, () => acceptBooking(b.id), "تم قبول الطلب.")
                      }
                    >
                      <Check size={15} /> قبول الطلب
                    </button>
                    <button
                      className="secondary"
                      disabled={busy === b.id}
                      onClick={() => {
                        setRejectId(rejectId === b.id ? null : b.id);
                        setRejectReason("");
                      }}
                    >
                      <X size={15} /> رفض الطلب
                    </button>
                  </>
                ) : b.status === "accepted" ? (
                  <button
                    className="primary"
                    disabled={busy === b.id}
                    onClick={() =>
                      void runAction(b.id, () => startBooking(b.id), "تم بدء الخدمة.")
                    }
                  >
                    بدء الخدمة
                  </button>
                ) : b.status === "in_progress" ? (
                  <button
                    className="primary"
                    disabled={busy === b.id}
                    onClick={() =>
                      void runAction(b.id, () => completeBooking(b.id), "اكتملت الخدمة.")
                    }
                  >
                    إتمام الخدمة
                  </button>
                ) : null}
                <button
                  className="ghost-button"
                  onClick={() => setOpenId(openId === b.id ? null : b.id)}
                >
                  {openId === b.id ? "إخفاء" : "تفاصيل"}
                </button>
              </div>

              {rejectId === b.id ? (
                <div className="reject-form">
                  <textarea
                    className="booking-native"
                    rows={3}
                    placeholder="سبب الرفض (إلزامي)"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <div className="cta-row" style={{ marginTop: 10 }}>
                    <button
                      className="primary"
                      disabled={busy === b.id}
                      onClick={() => void confirmReject()}
                    >
                      تأكيد الرفض
                    </button>
                    <button
                      className="ghost-button"
                      onClick={() => {
                        setRejectId(null);
                        setRejectReason("");
                      }}
                    >
                      تراجع
                    </button>
                  </div>
                </div>
              ) : null}

              {openId === b.id ? (
                <div className="request-detail">
                  <div className="detail-row">
                    <b>الزبون</b>
                    <span>{b.customer_name ?? "—"}</span>
                  </div>
                  <div className="detail-row">
                    <b>الخدمة</b>
                    <span>{b.service_category}</span>
                  </div>
                  {b.service_description ? (
                    <div className="detail-row">
                      <b>الوصف</b>
                      <span>{b.service_description}</span>
                    </div>
                  ) : null}
                  <div className="detail-row">
                    <b>الموعد</b>
                    <span>{fmtDate(b.service_date)}</span>
                  </div>
                  <div className="detail-row">
                    <b>الموقع</b>
                    <span>{b.location_text ?? "—"}</span>
                  </div>
                  {b.customer_note ? (
                    <div className="detail-row">
                      <b>ملاحظة الزبون</b>
                      <span>{b.customer_note}</span>
                    </div>
                  ) : null}
                  {b.rejection_reason ? (
                    <div className="detail-row">
                      <b>سبب الرفض</b>
                      <span>{b.rejection_reason}</span>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ))
        )}
          </>
        )}
      </main>
    </div>
  );
}
