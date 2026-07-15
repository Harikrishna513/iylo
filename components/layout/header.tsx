"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search, Heart, User, } from "lucide-react";
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
  { href: "#menu", label: "Menu" },
  { href: "#gifting", label: "Gifting & Bulk Orders" },
  { href: "#birthday-wedding-cakes", label: "Birthday & Wedding Cakes (Custom)" },
  { href: "#workshops", label: "Workshops" },
  { href: "#about", label: "Story" },
  { href: "#contact", label: "Contact" },
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
  const openCart = useCartStore((s) => s.openCart);
  const wishlistItems = useWishlistStore((s) => s.items);
  const openWishlist = useWishlistStore((s) => s.openWishlist);
  const openSearch = useSearchStore((s) => s.openSearch);
  const { user } = useAuth();
  const pulseTarget = useFlyAnimationStore((s) => s.pulseTarget);
  const accountHref = user ? "/account" : "/auth/signin?redirect=/account";

  const instagramLink = contactInfo.instagramUrl;

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
              <IconButton
                id="fly-target-cart"
                onClick={openCart}
                label="Open cart"
                badge={cartCount}
              >
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
                onClick={openWishlist}
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-xl"
          >
            <div className="flex h-full flex-col p-8">
              <div className="flex items-center justify-between">
                <BrandLogo variant="circle" height={56} />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center text-ivory"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex flex-1 flex-col items-center justify-center gap-5 px-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="w-full max-w-md text-center"
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="editorial-heading text-2xl text-ivory hover:text-gold sm:text-3xl"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
