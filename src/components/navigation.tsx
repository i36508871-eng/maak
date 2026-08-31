import {
  Bell,
  ClipboardList,
  Home,
  LogOut,
  MessageCircle,
  Search,
  UserRound,
} from "lucide-react";
import { useRouter } from "../router";
import { useToast } from "../context";
import { useAuth } from "../auth";
import { Logo } from "./atoms";

export function Header({ path }: { path: string }) {
  const { navigate } = useRouter();
  const { showToast } = useToast();
  const { user, loading, signOut, profile } = useAuth();

  async function handleSignOut() {
    await signOut();
    showToast("تم تسجيل الخروج");
    navigate("/");
  }

  const initial = (profile?.full_name || user?.email || "?").charAt(0).toUpperCase();

  return (
    <header className="topbar">
      <div className="header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="التنقل الرئيسي">
          <button className={path === "/" ? "selected" : ""} onClick={() => navigate("/")}>الرئيسية</button>
          <button className={path === "/discover" ? "selected" : ""} onClick={() => navigate("/discover")}>اكتشف</button>
          <button className={path === "/bookings" ? "selected" : ""} onClick={() => navigate("/bookings")}>الحجوزات</button>
        </nav>
        <div className="profile-line">
          {loading ? (
            <span className="user-pill" aria-busy="true" />
          ) : user ? (
            <>
              <button className="icon-btn notification" aria-label="الإشعارات" onClick={() => showToast("لا توجد إشعارات جديدة بعد")}>
                <Bell size={18} />
              </button>
              <button className="icon-btn desktop-only" aria-label="تسجيل الخروج" title="تسجيل الخروج" onClick={handleSignOut}>
                <LogOut size={18} />
              </button>
              <button className="icon-btn" aria-label="حسابي" onClick={() => navigate("/account")}>
                <span className="avatar">{initial}</span>
              </button>
            </>
          ) : (
            <button className="auth-login-btn" onClick={() => navigate("/login")}>تسجيل الدخول</button>
          )}
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
    ["bookings", "الحجوزات", ClipboardList, "/bookings"],
    ["chat", "الرسائل", MessageCircle, "/chat"],
    ["account", "حسابي", UserRound, "/account"],
  ] as const;

  return (
    <nav className="mobile-nav">
      {items.map(([id, label, Icon, to]) => (
        <button
          key={id}
          className={path === to ? "active" : ""}
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
