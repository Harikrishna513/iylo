"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MapPin, Phone, Mail } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { BrandLogo } from "@/components/ui/brand-logo";
import { contactInfo } from "@/data/products";
import { categories } from "@/data/products";

const footerLinks = {
  shop: categories.map((c) => ({ href: `#category-${c.id}`, label: c.label })),
  care: [
    { href: "#delivery", label: "Delivery" },
    { href: "#store", label: "Pickup" },
    { href: "#workshops", label: "Workshops" },
    { href: "#corporate", label: "Corporate" },
    { href: "#gifting", label: "Gifting" },
  ],
  company: [
    { href: "#about", label: "Our Story" },
    { href: "#gallery", label: "Gallery" },
    { href: "#reviews", label: "Reviews" },
    { href: "#contact", label: "Contact" },
  ],
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <footer className="border-t border-ivory/10 bg-black pb-24 lg:pb-0">
      <div className="section-padding mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <BrandLogo height={81} />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/50">
              A contemporary premium bakehouse specialising in eggless sweet and savoury creations.
              Delivery across Bangalore · pickup at Jayanagar.
            </p>
            {(contactInfo.instagram || contactInfo.whatsapp) && (
            <div className="mt-6 flex gap-4">
              {contactInfo.instagram && (
              <a
                href={`https://instagram.com/${contactInfo.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/60 transition-colors hover:text-gold"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              )}
              {contactInfo.whatsapp && (
              <a
                href={`https://wa.me/${contactInfo.whatsapp.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-widest text-ivory/60 transition-colors hover:text-gold"
              >
                WhatsApp
              </a>
              )}
            </div>
            )}
          </div>

          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-gold">
              Categories
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.slice(0, 6).map((link) => (
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
              Customer Care
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.care.map((link) => (
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
              Visit Us
            </h4>
            <ul className="space-y-3 text-sm text-ivory/60">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {contactInfo.address}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold" />
                {contactInfo.phone}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold" />
                {contactInfo.email}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-ivory/10 pt-12">
          <div className="mx-auto max-w-md text-center">
            <h4 className="editorial-heading text-2xl text-ivory">Stay in the Loop</h4>
            <p className="mt-2 text-sm text-ivory/50">
              Weekend specials, festival menus, and workshop announcements.
            </p>
            {subscribed ? (
              <p className="mt-6 text-sm text-gold">Thank you for subscribing.</p>
            ) : (
              <form onSubmit={handleNewsletter} className="mt-6 flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 border border-ivory/20 bg-transparent px-4 py-3 text-sm text-ivory outline-none focus:border-gold"
                />
                <button
                  type="submit"
                  className="bg-gold px-6 py-3 text-xs font-medium uppercase tracking-widest text-black transition-opacity hover:opacity-90"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-ivory/10 pt-8 md:flex-row">
          <p className="text-xs text-ivory/40">
            © {new Date().getFullYear()} IYLO Bake House, Bangalore. All rights reserved.
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
