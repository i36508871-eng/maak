import { CalendarDays, ClipboardList, MapPin, MessageCircle } from "lucide-react";
import { useBookings } from "../context";
import { useRouter } from "../router";

export default function Bookings() {
  const { bookings } = useBookings();
  const { navigate } = useRouter();
  return (
    <main className="screen bookings-screen">
      <div className="page-title">
        <div>
          <span className="section-kicker">كل ما يخصّ طلباتك</span>
          <h1>طلباتي</h1>
        </div>
        <span className="count-badge">{bookings.length} طلبات</span>
      </div>
      {bookings.length === 0 ? (
      <div className="empty-state">
        <ClipboardList size={24} />
        <h3>لا توجد لديك طلبات بعد</h3>
        <p>ابدأ بطلب خدمة من مقدّم موثوق، وستظهر طلباتك هنا.</p>
        <button className="primary" style={{ marginTop: 8 }} onClick={() => navigate("/discover")}>اكتشف الخدمات</button>
      </div>
    ) : bookings.map((booking) => (
        <div className="booking-card" key={booking.id}>
          <div className="booking-icon">
            <CalendarDays size={20} />
          </div>
          <div className="booking-main">
            <span className="status">{booking.status}</span>
            <h3>{booking.service}</h3>
            <p>{booking.provider}</p>
            <small>
              <CalendarDays size={12} /> {booking.date}، {booking.time}
              <MapPin size={12} /> {booking.location}
            </small>
          </div>
          <button className="secondary mini-button" onClick={() => navigate("/chat")}>
            <MessageCircle size={14} /> مراسلة
          </button>
        </div>
      ))}
    </main>
  );
}