import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getInitialBookings } from "./services";
import type { Booking } from "./types";

const BOOKINGS_KEY = "maak-bookings";

/* ----------------------------- Toast ----------------------------- */

type ToastValue = { toast: string; showToast: (message: string) => void };
const ToastContext = createContext<ToastValue>({ toast: "", showToast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState("");
  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }, []);
  const value = useMemo(() => ({ toast, showToast }), [toast, showToast]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastValue {
  return useContext(ToastContext);
}

export function ToastViewport() {
  const { toast } = useToast();
  return toast ? <div className="toast">{toast}</div> : null;
}

/* ---------------------------- Bookings --------------------------- */

type BookingsValue = { bookings: Booking[]; addBooking: (booking: Booking) => void };
const BookingsContext = createContext<BookingsValue>({
  bookings: [],
  addBooking: () => {},
});

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const stored = localStorage.getItem(BOOKINGS_KEY);
      return stored ? (JSON.parse(stored) as Booking[]) : getInitialBookings();
    } catch {
      return getInitialBookings();
    }
  });

  useEffect(() => {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = useCallback((booking: Booking) => {
    setBookings((current) => [...current, booking]);
  }, []);

  const value = useMemo(() => ({ bookings, addBooking }), [bookings, addBooking]);
  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>;
}

export function useBookings(): BookingsValue {
  return useContext(BookingsContext);
}