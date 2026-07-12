"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { mergeGuestCart } from "@/lib/cart-db";
import { mergeLocalWishlist } from "@/lib/wishlist-db";

export interface UserProfile {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  notification_email: boolean;
  notification_sms: boolean;
  marketing_opt_in: boolean;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  adminRole: "admin" | "superadmin" | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchAdminRole(): Promise<"admin" | "superadmin" | null> {
  try {
    const res = await fetch("/api/admin/me");
    const data = await res.json();
    return data.role ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [adminRole, setAdminRole] = useState<"admin" | "superadmin" | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string, email?: string | null) => {
    const { data } = await supabase
      .from("users")
      .select("id, name, phone, email, notification_email, notification_sms, marketing_opt_in")
      .eq("id", userId)
      .maybeSingle();

    if (data) {
      setProfile(data as UserProfile);
    } else if (email) {
      await supabase.from("users").upsert(
        { id: userId, email, name: email.split("@")[0] },
        { onConflict: "id" }
      );
      setProfile({
        id: userId,
        name: email.split("@")[0],
        phone: null,
        email,
        notification_email: true,
        notification_sms: false,
        marketing_opt_in: false,
      });
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id, session.user.email);
        fetchAdminRole().then(setAdminRole);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadProfile(session.user.id, session.user.email);
        setAdminRole(await fetchAdminRole());
        if (event === "SIGNED_IN") {
          await mergeGuestCart(session.user.id);
          await mergeLocalWishlist(session.user.id);
        }
      } else {
        setProfile(null);
        setAdminRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message };
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ) => {
    const normalizedPhone = phone ? phone.replace(/\D/g, "").slice(-10) : undefined;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone: normalizedPhone },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      await supabase.from("users").upsert(
        {
          id: data.user.id,
          email,
          name: fullName,
          phone: normalizedPhone ?? null,
        },
        { onConflict: "id" }
      );
    }

    return {};
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    if (user) await loadProfile(user.id, user.email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        adminRole,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
