"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { contactInfo } from "@/data/products";

const footerLinks = {
  explore: [
    { href: "#menu", label: "Menu" },
    { href: "#specials", label: "Weekend Specials" },
    { href: "#bundles", label: "Bundles" },
    { href: "#gifting", label: "Gifting" },
  ],
  company: [
    { href: "#about", label: "Our Story" },
    { href: "#workshops", label: "Workshops" },
    { href: "#gallery", label: "Gallery" },
    { href: "#corporate", label: "Corporate Orders" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-ivory/10 bg-black">
      <div className="section-padding mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="editorial-heading text-3xl tracking-[0.15em] text-ivory">
                IYLO
              </span>
              <span className="mt-1 block text-[9px] uppercase tracking-[0.4em] text-muted">
                Bake House
              </span>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ivory/50">
              Handcrafted artisan bakes made with exceptional ingredients and
              delivered with care.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-gold">
              Explore
            </h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ivory/60 transition-colors hover:text-ivory"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-gold">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ivory/60 transition-colors hover:text-ivory"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-gold">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-ivory/60">
              <li>{contactInfo.phone}</li>
              <li>{contactInfo.email}</li>
              <li>{contactInfo.address}</li>
            </ul>
            <div className="mt-6 flex gap-4">
              <a
                href={`https://instagram.com/${contactInfo.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/60 transition-colors hover:text-gold"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-ivory/10 pt-8 md:flex-row">
          <p className="text-xs text-ivory/40">
            © {new Date().getFullYear()} IYLO Bake House. All rights reserved.
          </p>
          <motion.a
            href="https://g.page/iylobakehouse/review"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 border border-ivory/20 px-6 py-3 text-xs uppercase tracking-widest text-ivory transition-colors hover:border-gold hover:text-gold"
          >
            <Star className="h-4 w-4 fill-gold text-gold" />
            Leave a Google Review
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
