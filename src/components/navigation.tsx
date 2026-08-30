import {
  Bell,
  ChevronLeft,
  ClipboardList,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  UserRound,
} from "lucide-react";
import { useRouter } from "../router";
import { useToast } from "../context";
import { useAuth } from "../auth";
import type { Role } from "../types";
import { Logo } from "./atoms";

function roleLabel(role: Role): string {
  if (role === "admin") return "مدير";
  if (role === "provider") return "مقدّم خدمة";
  return "عميل";
}

export function Header({ path }: { path: string }) {
  const { navigate } = useRouter();
  const { showToast } = useToast();
  const { user, loading, signOut, profile, role } = useAuth();

  async function handleSignOut() {
    await signOut();
    showToast("تم تسجيل الخروج");
  }

  const email = user?.email ?? "";
  const displayName = profile?.full_name || (email ? email.split("@")[0] : "");
  const initial = (profile?.full_name || email || "?").charAt(0).toUpperCase();

  function showAccount() {
    if (!user) return;
    showToast("مرحباً " + displayName + " — دورك: " + roleLabel(role));
  }

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
          {loading ? (
            <span className="user-pill" aria-busy="true" />
          ) : user ? (
            <>
              <button className="user-pill" onClick={showAccount}>
                <span className="avatar">{initial}</span>
                <span className="user-copy">
                  <b>{displayName}</b>
                  <small>{email}</small>
                </span>
                <ChevronLeft size={14} />
              </button>
              <button
                className="icon-btn"
                aria-label="تسجيل الخروج"
                title="تسجيل الخروج"
                onClick={handleSignOut}
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <button className="auth-login-btn" onClick={() => navigate("/login")}>
              تسجيل الدخول
            </button>
          )}
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
