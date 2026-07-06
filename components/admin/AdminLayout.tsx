"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  ChevronLeft,
  Menu,
  X,
  LogOut,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

const SUPERADMIN_ITEMS: NavItem[] = [
  { href: "/admin/settings", label: "Admin Users", icon: Shield },
];

const SETTINGS_ITEM: NavItem = {
  href: "/admin/settings",
  label: "Settings",
  icon: Settings,
};

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AdminLayout({
  children,
  title = "Admin",
  description,
  actions,
}: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, adminRole, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
      </div>
    );
  }

  if (!user || !adminRole) {
    return <AdminAccessDenied isLoggedIn={!!user} />;
  }

  const isSuper = adminRole === "superadmin";
  const allItems = [
    ...NAV_ITEMS,
    ...(isSuper ? SUPERADMIN_ITEMS.filter((s) => s.href !== "/admin/settings") : []),
    SETTINGS_ITEM,
  ];

  return (
    <div className="flex min-h-screen bg-black text-ivory">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 z-50 flex h-screen w-64 shrink-0 flex-col md:sticky",
          "border-r border-ivory/10 bg-black",
          "transition-transform duration-200 ease-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between border-b border-ivory/10 px-6 py-5">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center border border-gold bg-gold/10">
              <span className="font-serif text-lg font-bold text-gold">I</span>
            </div>
            <div>
              <p className="font-serif text-base font-semibold leading-none text-ivory">
                IYLO
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-widest text-muted">
                Admin Panel
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-muted hover:bg-ivory/5 hover:text-ivory md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {allItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-none px-3.5 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gold/15 text-gold"
                    : "text-ivory/65 hover:bg-ivory/5 hover:text-ivory"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-ivory/10 p-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-none px-3.5 py-2.5 text-sm text-muted transition-colors hover:bg-ivory/5 hover:text-ivory"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Store
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-none px-3.5 py-2.5 text-left text-sm text-red-400 transition-colors hover:bg-red-400/10"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-ivory/10 bg-black px-4 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-muted hover:bg-ivory/5"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-serif text-ivory">{title}</span>
        </div>

        <header className="hidden items-end justify-between gap-4 border-b border-ivory/10 px-8 pb-6 pt-8 md:flex lg:px-10">
          <div>
            <h1 className="editorial-heading text-3xl text-ivory">{title}</h1>
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>

        <main className="max-w-full flex-1 px-4 py-6 md:px-8 md:py-8 lg:px-10">
          {actions && (
            <div className="mb-4 flex flex-wrap items-center gap-2 md:hidden">{actions}</div>
          )}
          {description && (
            <p className="mb-4 text-sm text-muted md:hidden">{description}</p>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminAccessDenied({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md border border-ivory/10 p-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border border-gold/30 bg-gold/10">
          <Shield className="h-7 w-7 text-gold" />
        </div>
        <h1 className="editorial-heading text-2xl text-ivory">Admin access only</h1>
        <p className="mt-2 text-sm text-muted">
          {isLoggedIn
            ? "Your account does not have admin privileges. Ask a superadmin to invite you."
            : "Sign in with an admin account, then navigate to /admin."}
        </p>
        <div className="mt-6 flex flex-col gap-2">
          {!isLoggedIn && (
            <Link
              href="/auth/signin?redirect=/admin"
              className="border border-gold bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-widest text-black hover:bg-gold/90"
            >
              Sign In
            </Link>
          )}
          <Link href="/" className="text-sm text-muted hover:text-gold">
            Return to store
          </Link>
        </div>
      </div>
    </div>
  );
}
