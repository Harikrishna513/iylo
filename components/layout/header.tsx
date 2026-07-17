"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useSearchStore } from "@/store/search-store";
import { contactInfo } from "@/data/site-content";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { BrandLogo } from "@/components/ui/brand-logo";
import { NAVBAR_LOGO_HEIGHT, ANNOUNCEMENT_BAR_HEIGHT_PX } from "@/lib/brand";
import { useAuth } from "@/context/AuthContext";
import { useFlyAnimationStore } from "@/store/fly-animation-store";

const navLinks = [
  { href: "/products", label: "Menu" },
  { href: "/#gifting", label: "Gifting & Bulk Orders" },
  { href: "/#birthday-wedding-cakes", label: "Birthday & Wedding Cakes (Custom)" },
  { href: "/#workshops", label: "Workshops" },
  { href: "/#about", label: "Story" },
  { href: "/#contact", label: "Contact" },
];

function IconButton({
  onClick,
  href,
  label,
  children,
  className,
  badge,
  id,
}: {
  onClick?: () => void;
  href?: string;
  label: string;
  children: ReactNode;
  className?: string;
  badge?: number;
  id?: string;
}) {
  const classes = cn(
    "relative flex h-9 w-9 items-center justify-center text-maroon/80 transition-colors hover:text-maroon sm:h-10 sm:w-10",
    className
  );

  const content = (
    <>
      {children}
      {badge != null && badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center bg-maroon text-[9px] font-bold text-white">
          {badge}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} id={id} className={classes} aria-label={label}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" id={id} onClick={onClick} className={classes} aria-label={label}>
      {content}
    </button>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const wishlistItems = useWishlistStore((s) => s.items);
  const openSearch = useSearchStore((s) => s.openSearch);
  const { user } = useAuth();
  const pulseTarget = useFlyAnimationStore((s) => s.pulseTarget);
  const accountHref = user ? "/account" : "/auth/signin?redirect=/account";

  const instagramLink = contactInfo.instagramUrl;

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className="fixed left-0 right-0 z-50 border-b border-maroon/15 bg-light-blue shadow-sm"
        style={{ top: ANNOUNCEMENT_BAR_HEIGHT_PX }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3 sm:px-6 lg:px-10">
          {/* Left: Hamburger · Search */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center text-maroon/80 transition-colors hover:text-maroon sm:h-10 sm:w-10"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={openSearch}
              className="flex h-9 min-w-9 items-center gap-2 rounded-full border border-maroon/20 bg-white/70 px-3 text-maroon/55 transition-colors hover:border-maroon/35 hover:text-maroon/75 sm:h-10 sm:min-w-[140px] sm:px-4"
              aria-label="Search products"
            >
              <Search className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span className="hidden text-xs tracking-wide sm:inline">Search</span>
            </button>
          </div>

          {/* Center: Logo on brand color */}
          <Link
            href="/"
            className="flex items-center justify-center rounded-full bg-light-blue px-3 py-1 sm:px-4"
            aria-label="iylo BAKEHOUSE home"
          >
            <BrandLogo
              priority
              height={NAVBAR_LOGO_HEIGHT.mobile}
              className="sm:hidden"
            />
            <BrandLogo
              priority
              height={NAVBAR_LOGO_HEIGHT.desktop}
              className="hidden sm:block"
            />
          </Link>

          {/* Right: Instagram · Account · Cart · Wishlist */}
          <div className="flex items-center justify-end gap-0.5 sm:gap-1">
            {instagramLink && (
            <a
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center text-maroon/80 transition-colors hover:text-maroon sm:h-10 sm:w-10"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
            </a>
            )}
            <IconButton href={accountHref} label="Account">
              <User className="h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={1.5} />
            </IconButton>
            <motion.div
              animate={
                pulseTarget === "cart"
                  ? { scale: [1, 1.35, 1], transition: { duration: 0.4 } }
                  : { scale: 1 }
              }
            >
              <IconButton href="/cart" label="Open cart" badge={cartCount} id="fly-target-cart">
                <ShoppingBag className="h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={1.5} />
              </IconButton>
            </motion.div>
            <motion.div
              animate={
                pulseTarget === "wishlist"
                  ? { scale: [1, 1.35, 1], transition: { duration: 0.4 } }
                  : { scale: 1 }
              }
            >
              <IconButton
                id="fly-target-wishlist"
                href="/account/wishlist"
                label="Wishlist"
                badge={wishlistItems.length}
              >
                <Heart className="h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={1.5} />
              </IconButton>
            </motion.div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[70] bg-maroon/40 backdrop-blur-[2px]"
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed bottom-0 left-0 top-0 z-[80] flex w-[min(100%,320px)] flex-col bg-cream shadow-[8px_0_40px_rgba(69,21,25,0.18)] sm:w-[340px]"
            >
              <div className="flex items-center justify-between border-b border-maroon/10 px-5 py-4">
                <BrandLogo variant="circle" height={48} />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-maroon/70 transition-colors hover:bg-maroon/5 hover:text-maroon"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-xl px-4 py-3.5 text-[15px] font-medium leading-snug text-maroon transition-colors hover:bg-mist-blue/70 hover:text-maroon"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="border-t border-maroon/10 px-5 py-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-maroon/40">
                  iylo bakehouse
                </p>
                <p className="mt-1 text-xs text-maroon/55">served with intent</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
