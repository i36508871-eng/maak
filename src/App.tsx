import { useState, type ReactNode } from "react";
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
  if (bookingParams) {
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

  return (
    <div className="app">
      <div className="shell">
        <Header path={path} onRole={onBecomeProvider} />
        <main className="app-main" key={path}>
          {content}
        </main>
      </div>
      {!isProviderScreen && <MobileNav path={path} />}
      <button className="admin-hotspot" onClick={onBecomeAdmin} aria-label="Admin" />
      <ToastViewport />
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState<Role>("customer");

  if (role === "provider") {
    return (
      <ToastProvider>
        <div className="app provider-app">
          <ProviderMode switchRole={() => setRole("customer")} />
          <ToastViewport />
        </div>
      </ToastProvider>
    );
  }

  if (role === "admin") {
    return <Admin switchRole={() => setRole("customer")} />;
  }

  return (
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
