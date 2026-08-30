import {
  Bell,
  ChevronLeft,
  ClipboardList,
  Home,
  Menu,
  MessageCircle,
  Search,
  UserRound,
} from "lucide-react";
import { useRouter } from "../router";
import { useToast } from "../context";
import { Logo } from "./atoms";

export function Header({ path, onRole }: { path: string; onRole: () => void }) {
  const { navigate } = useRouter();
  const { showToast } = useToast();
  return (
    <header className="topbar">
      <div className="header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="التنقل الرئيسي">
          <button
            className={path === "/" ? "selected" : ""}
            onClick={() => navigate("/")}
          >
            الرئيسية
          </button>
          <button
            className={path === "/discover" ? "selected" : ""}
            onClick={() => navigate("/discover")}
          >
            اكتشف الخدمات
          </button>
          <button
            className={path === "/bookings" ? "selected" : ""}
            onClick={() => navigate("/bookings")}
          >
            طلباتي
          </button>
        </nav>
        <div className="profile-line">
          <button
            className="icon-btn notification"
            aria-label="الإشعارات"
            onClick={() => showToast("ما عندك حتى إشعار جديد")}
          >
            <Bell size={18} />
            <i />
          </button>
          <button className="user-pill" onClick={onRole}>
            <span className="avatar">ح</span>
            <span className="user-copy">
              <b>حمزة</b>
              <small>طنجة، المغرب</small>
            </span>
            <ChevronLeft size={14} />
          </button>
          <button className="menu-btn" aria-label="القائمة">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

export function MobileNav({ path }: { path: string }) {
  const { navigate } = useRouter();
  const items = [
    ["home", "الرئيسية", Home, "/"],
    ["discover", "اكتشف", Search, "/discover"],
    ["bookings", "طلباتي", ClipboardList, "/bookings"],
    ["chat", "الرسائل", MessageCircle, "/chat"],
    ["profile", "حسابي", UserRound, "/"],
  ] as const;

  return (
    <nav className="mobile-nav">
      {items.map(([id, label, Icon, to]) => (
        <button
          key={id}
          className={id !== "profile" && path === to ? "active" : ""}
          onClick={() => navigate(to)}
        >
          <Icon size={18} />
          <span>{label}</span>
          {id === "bookings" && <i />}
        </button>
      ))}
    </nav>
  );
}