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
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  superadminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/inquiries", label: "Enquiries", icon: MessageSquare },
  {
    href: "/admin/admin-users",
    label: "Admin Users",
    icon: Shield,
    superadminOnly: true,
  },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
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
      <div className="admin-theme flex min-h-screen items-center justify-center bg-mist-blue">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-maroon border-t-transparent" />
      </div>
    );
  }

  if (!user || !adminRole) {
    return <AdminAccessDenied isLoggedIn={!!user} />;
  }

  const isSuper = adminRole === "superadmin";
  const visibleItems = NAV_ITEMS.filter((item) => !item.superadminOnly || isSuper);

  return (
    <div className="admin-theme flex min-h-screen bg-mist-blue text-maroon">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-maroon/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 z-50 flex h-screen w-64 shrink-0 flex-col md:sticky",
          "border-r border-maroon/10 bg-white shadow-sm",
          "transition-transform duration-200 ease-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between border-b border-maroon/10 px-5 py-5">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-maroon">
              <span className="font-serif text-lg font-bold text-white">I</span>
            </div>
            <div>
              <p className="font-serif text-base font-semibold leading-none text-maroon">
                IYLO
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-widest text-maroon/45">
                Admin Panel
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-maroon/50 hover:bg-mist-blue md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {visibleItems.map((item) => {
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
                  "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-mist-blue text-maroon"
                    : "text-maroon/65 hover:bg-mist-blue/60 hover:text-maroon"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
                {item.superadminOnly && (
                  <span className="ml-auto rounded bg-rosewood/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-rosewood">
                    Super
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-maroon/10 p-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm text-maroon/55 transition-colors hover:bg-mist-blue hover:text-maroon"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Store
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-lg px-3.5 py-2.5 text-left text-sm text-rosewood transition-colors hover:bg-rosewood/10"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-maroon/10 bg-white px-4 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-maroon/60 hover:bg-mist-blue"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-serif text-maroon">IYLO Admin</span>
        </div>

        <main className="max-w-full flex-1 px-4 py-6 md:px-8 md:py-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminAccessDenied({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className="admin-theme flex min-h-screen items-center justify-center bg-mist-blue px-4">
      <div className="w-full max-w-md rounded-lg border border-maroon/10 bg-white p-10 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mist-blue">
          <Shield className="h-7 w-7 text-maroon" />
        </div>
        <h1 className="editorial-heading text-2xl text-maroon">Admin access only</h1>
        <p className="mt-2 text-sm text-maroon/60">
          {isLoggedIn
            ? "Your account does not have admin privileges. Ask a superadmin to invite you."
            : "Sign in with an admin account, then navigate to /admin."}
        </p>
        <div className="mt-6 flex flex-col gap-2">
          {!isLoggedIn && (
            <Link
              href="/auth/signin?redirect=/admin"
              className="bg-maroon px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white hover:bg-rosewood"
            >
              Sign In
            </Link>
          )}
          <Link href="/" className="text-sm text-maroon/55 hover:text-maroon">
            Return to store
          </Link>
        </div>
      </div>
    </div>
  );
}
