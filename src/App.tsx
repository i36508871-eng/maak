import { useState, type ReactNode } from "react";
import { AuthProvider } from "./auth";
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

type Role = "customer" | "provider" | "admin";

function CustomerShell({
  onBecomeProvider,
  onBecomeAdmin,
}: {
  onBecomeProvider: () => void;
  onBecomeAdmin: () => void;
}) {
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
        {!isAuthScreen && <Header path={path} onRole={onBecomeProvider} />}
        <main className="app-main" key={path}>
          {content}
        </main>
      </div>
      {!isAuthScreen && !isProviderScreen && <MobileNav path={path} />}
      {!isAuthScreen && <button className="admin-hotspot" onClick={onBecomeAdmin} aria-label="Admin" />}
      <ToastViewport />
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState<Role>("customer");

  let shell: ReactNode;
  if (role === "provider") {
    shell = (
      <ToastProvider>
        <div className="app provider-app">
          <ProviderMode switchRole={() => setRole("customer")} />
          <ToastViewport />
        </div>
      </ToastProvider>
    );
  } else if (role === "admin") {
    shell = <Admin switchRole={() => setRole("customer")} />;
  } else {
    shell = (
      <ToastProvider>
        <BookingsProvider>
          <Router>
            <CustomerShell
              onBecomeProvider={() => setRole("provider")}
              onBecomeAdmin={() => setRole("admin")}
            />
          </Router>
        </BookingsProvider>
      </ToastProvider>
    );
  }

  return <AuthProvider>{shell}</AuthProvider>;
}
