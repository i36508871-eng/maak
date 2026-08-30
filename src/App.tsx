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

// Routes by the REAL database role (auth != authorization). A logged-in user
// is a "customer" by default; provider/admin views are only reachable when the
// profiles.role column actually says so (set server-side by an admin). There is
// no client-side "become provider / become admin" instant escalation.
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
