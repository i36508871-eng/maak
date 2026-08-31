import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "./auth";
import { BookingsProvider, ToastProvider, ToastViewport } from "./context";
import { Router, matchPath, useRouter } from "./router";
import { Header, MobileNav } from "./components/navigation";
import Admin from "./pages/Admin";
import ProviderMode from "./pages/ProviderMode";
import Home from "./pages/Home";
import Bookings from "./pages/Bookings";
import Chat from "./pages/Chat";
import ProviderDetail from "./pages/ProviderDetail";
import BookingFlow from "./pages/BookingFlow";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import Account from "./pages/Account";
import Discover from "./pages/Discover";

function CustomerShell() {
  const { path } = useRouter();
  const bookingParams = matchPath("/provider/:id/booking", path);
  const providerParams = bookingParams ? null : matchPath("/provider/:id", path);
  let content: ReactNode;
  if (path === "/login") {
    content = <Login />;
  } else if (path === "/register") {
    content = <Register />;
  } else if (bookingParams) {
    content = <BookingFlow id={Number(bookingParams.id)} />;
  } else if (providerParams) {
    content = <ProviderDetail id={Number(providerParams.id)} />;
  } else if (path === "/bookings") {
    content = <Bookings />;
  } else if (path === "/chat") {
    content = <Chat />;
  } else if (path === "/onboarding") {
    content = <Onboarding />;
  } else if (path === "/account") {
    content = <Account />;
  } else if (path === "/discover") {
    content = <Discover />;
  } else {
    content = <Home />;
  }
  const isProviderScreen = path.startsWith("/provider");
  const isAuthScreen = path === "/login" || path === "/register";
  return (
    <div className="app">
      <div className="shell">
        {!isAuthScreen && <Header path={path} />}
        <main className="app-main" key={path}>
          {content}
        </main>
      </div>
      {!isAuthScreen && !isProviderScreen && <MobileNav path={path} />}
      <ToastViewport />
    </div>
  );
}

function RoleShell() {
  const { role, signOut } = useAuth();
  const exit = () => void signOut();
  if (role === "provider") {
    return (
      <ToastProvider>
        <div className="app provider-app">
          <ProviderMode switchRole={exit} />
          <ToastViewport />
        </div>
      </ToastProvider>
    );
  }
  if (role === "admin") {
    return <Admin switchRole={exit} />;
  }
  return (
    <ToastProvider>
      <BookingsProvider>
        <Router>
          <CustomerShell />
        </Router>
      </BookingsProvider>
    </ToastProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RoleShell />
    </AuthProvider>
  );
}
