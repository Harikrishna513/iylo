"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ShoppingBag,
  Search,
  Heart,
  User,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useSearchStore } from "@/store/search-store";
import { categories } from "@/data/products";

const navLinks = [
  { href: "#menu", label: "Menu" },
  { href: "#specials", label: "Specials" },
  { href: "#seasonal", label: "Seasonal" },
  { href: "#gifting", label: "Gifting" },
  { href: "#about", label: "Story" },
  { href: "#workshops", label: "Workshops" },
];

const megaMenuCategories = categories.filter((c) => c.id !== "workshops");

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const openCart = useCartStore((s) => s.openCart);
  const wishlistItems = useWishlistStore((s) => s.items);
  const openWishlist = useWishlistStore((s) => s.openWishlist);
  const openSearch = useSearchStore((s) => s.openSearch);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-50 transition-all duration-700",
          scrolled ? "glass-dark py-3 shadow-lg shadow-black/20" : "bg-transparent py-5"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="group flex flex-col">
            <span className="editorial-heading text-2xl tracking-[0.15em] text-ivory transition-colors group-hover:text-gold md:text-3xl">
              IYLO
            </span>
            <span className="text-[9px] uppercase tracking-[0.4em] text-muted">
              Bake House · Bangalore
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button className="flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-ivory/70 transition-colors hover:text-gold">
                Shop
                <ChevronDown className={cn("h-3 w-3 transition-transform", megaOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 top-full z-50 mt-4 w-[480px] -translate-x-1/2 glass-dark p-6 shadow-2xl"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {megaMenuCategories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`#category-${cat.id}`}
                          onClick={() => setMegaOpen(false)}
                          className="px-3 py-2 text-sm text-ivory/70 transition-colors hover:text-gold"
                        >
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-4 border-t border-ivory/10 pt-4">
                      <Link
                        href="#retail"
                        className="text-xs uppercase tracking-widest text-gold hover:underline"
                      >
                        Retail · Ships PAN India →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-[0.15em] text-ivory/70 transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={openSearch}
              className="flex h-10 w-10 items-center justify-center text-ivory/70 transition-colors hover:text-gold"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              onClick={openWishlist}
              className="relative hidden h-10 w-10 items-center justify-center text-ivory/70 transition-colors hover:text-gold sm:flex"
              aria-label="Wishlist"
            >
              <Heart className="h-4 w-4" />
              {wishlistItems.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center bg-gold text-[9px] font-bold text-black">
                  {wishlistItems.length}
                </span>
              )}
            </button>
            <button
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center text-ivory transition-colors hover:text-gold"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-4 w-4" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-gold text-[10px] font-bold text-black"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <Link
              href="/admin"
              className="hidden h-10 w-10 items-center justify-center text-ivory/70 transition-colors hover:text-gold lg:flex"
              aria-label="Account"
            >
              <User className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center text-ivory lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex h-full flex-col p-8">
              <div className="flex justify-end">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 w-10 items-center justify-center text-ivory"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex flex-1 flex-col items-center justify-center gap-6">
                {[...navLinks, { href: "#retail", label: "Retail" }, { href: "#contact", label: "Contact" }].map(
                  (link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="editorial-heading text-3xl text-ivory hover:text-gold"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  )
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
