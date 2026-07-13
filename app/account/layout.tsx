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
import { LIGHT } from "@/lib/page-theme";

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
        className={cn("flex items-center justify-center", LIGHT.bg, LIGHT.muted)}
        style={{ paddingTop: SITE_HEADER_OFFSET_PX }}
      >
        Loading your account…
      </div>
    );
  }

  const displayName = profile?.name || user.email?.split("@")[0] || "there";

  return (
    <div className={cn(LIGHT.bg, "pb-20")} style={{ paddingTop: SITE_HEADER_OFFSET_PX }}>
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-8">
          <h1 className={cn(LIGHT.title, "text-3xl md:text-4xl")}>Hi, {displayName}</h1>
          <p className={cn("mt-1", LIGHT.subtitle)}>
            Manage your profile, orders, addresses, and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <aside
            className={cn(
              LIGHT.card,
              "h-fit p-4 lg:sticky lg:top-28 lg:p-5"
            )}
          >
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
                      "flex items-center gap-3 whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                      isActive ? LIGHT.navActive : LIGHT.navInactive
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
                className="mt-1 flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-left text-sm font-medium text-rosewood transition-colors hover:bg-rosewood/10"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          <main className={cn(LIGHT.card, "min-h-[420px] p-6 md:p-10")}>{children}</main>
        </div>
      </div>
    </div>
  );
}
