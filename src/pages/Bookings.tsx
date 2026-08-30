import { CalendarDays, MapPin, MessageCircle } from "lucide-react";
import { useBookings } from "../context";
import { useRouter } from "../router";

export default function Bookings() {
  const { bookings } = useBookings();
  const { navigate } = useRouter();
  return (
    <main className="screen bookings-screen">
      <div className="page-title">
        <div>
          <span className="section-kicker">كلشي مجموع هنا</span>
          <h1>طلباتي</h1>
        </div>
        <span className="count-badge">{bookings.length} طلبات</span>
      </div>
      {bookings.map((booking) => (
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