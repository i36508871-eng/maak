import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./lib/supabaseClient";
import type { Profile, Role } from "./types";

type AuthResult = { error: string | null; needsEmailConfirmation?: boolean };

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: Profile | null;
  role: Role;
  profileLoading: boolean;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  profile: null,
  role: "customer",
  profileLoading: false,
  signUp: async () => ({ error: "غير متاح" }),
  signIn: async () => ({ error: "غير متاح" }),
  signOut: async () => {},
});

function translateError(error: unknown): string {
  const message =
    error && typeof error === "object" && "message" in error
      ? String((error as { message?: unknown }).message ?? "")
      : String(error);

  const m = message.toLowerCase();
  if (m.includes("invalid login credentials") || m.includes("invalid email or password"))
    return "البريد الإلكتروني أو كلمة المرور غغطبق إما بريدك أو كلمة مرورك.";
  if (m.includes("user already registered") || m.includes("already been registered"))
    return "هذا البريد الإلكتروني مسجّل بالفعل. سجّل الدخول أو استخدم بريدث آخر.";
  if (m.includes("email not confirmed") || m.includes("confirm your email") || m.includes("email address is not confirmed"))
    return "تجب تأكيد بريدك الإلكتروني قبل تسجيل الدخول.";
  if (m.includes("password should be") || m.includes("weak password") || m.includes("at least") || m.includes("password is too weak"))
    return "كلمة المرور ضعيفة. استخدم 6 أحرف على الأقل.";
  if (m.includes("unable to validate email") || m.includes("valid email") || m.includes("invalid email"))
    return "البريد الإلكتروني غير صالح.";
  if (m.includes("rate limit") || m.includes("too many") || m.includes("for security purposes"))
    return "محاولات كثيرة. حاول مرة أخرى بعد قليل.";
  if (m.includes("fetch") || m.includes("network") || m.includes("failed to") || m.includes("connection"))
    return "تعذّر الاتصال بالخادم. تحقق من الإنترنت.";
  return message || "حدث خطأ تير متوقع. حاول مرة أخرى.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Load the signed-in user's profile (RLS guarantees only their own row).
  // If the table/row is not present yet, profile stays null and the role
  // defaults to "customer" — authentication itself is unaffected.
  const loadProfile = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, role, full_name, phone, city, avatar_url, created_at, updated_at")
        .eq("id", userId)
        .maybeSingle();
      if (!error) {
        setProfile((data as Profile | null) ?? null);
      }
    } catch {
      // network or schema error: keep auth working; role falls back to "customer"
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setSession(data.session);
        setLoading(false);
        void loadProfile(data.session?.user?.id);
      })
      .catch(() => {
        if (!mounted) return;
        setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setLoading(false);
      void loadProfile(newSession?.user?.id);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signUp = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: translateError(error) };
    return { error: null, needsEmailConfirmation: !data.session };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: translateError(error) };
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const role: Role = profile?.role ?? "customer";

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      profile,
      role,
      profileLoading,
      signUp,
      signIn,
      signOut,
    }),
    [session, loading, profile, role, profileLoading, signUp, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
