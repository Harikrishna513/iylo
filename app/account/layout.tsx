"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Package,
  MapPin,
  Heart,
  CreditCard,
  Bell,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_HEADER_OFFSET_PX } from "@/lib/brand";

const NAV = [
  { href: "/account", label: "Profile", icon: User },
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/payments", label: "Payments", icon: CreditCard },
  { href: "/account/notifications", label: "Notifications", icon: Bell },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/auth/signin?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-black text-muted"
        style={{ paddingTop: SITE_HEADER_OFFSET_PX }}
      >
        Loading your account…
      </div>
    );
  }

  const displayName = profile?.name || user.email?.split("@")[0] || "there";

  return (
    <div
      className="min-h-screen bg-black pb-20"
      style={{ paddingTop: SITE_HEADER_OFFSET_PX }}
    >
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-8">
          <h1 className="editorial-heading text-3xl text-ivory md:text-4xl">
            Hi, {displayName}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage your profile, orders, addresses, and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit border border-ivory/10 bg-black/50 p-4 lg:sticky lg:top-28 lg:p-5">
            <nav className="-mx-1 flex gap-1 overflow-x-auto px-1 lg:flex-col lg:overflow-visible">
              {NAV.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/account" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 whitespace-nowrap px-3.5 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-gold/15 text-gold"
                        : "text-ivory/65 hover:bg-ivory/5 hover:text-ivory"
                    )}
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={handleSignOut}
                className="mt-1 flex items-center gap-3 px-3.5 py-2.5 text-left text-sm font-medium text-red-400 transition-colors hover:bg-red-400/10"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          <main className="min-h-[420px] border border-ivory/10 p-6 md:p-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
