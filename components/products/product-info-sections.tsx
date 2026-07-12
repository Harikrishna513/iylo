"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronDown, MapPin } from "lucide-react";
import {
  PRODUCT_DETAIL_INFO,
  telUrl,
  whatsAppUrl,
  CONTACT_PHONE,
} from "@/data/site-content";
import { cn } from "@/lib/utils";

function AccordionItem({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-ivory/10">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-ivory transition-colors hover:text-gold"
        aria-expanded={open}
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-200 ease-out",
          open ? "grid-rows-[1fr] pb-4 opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

export function ProductInfoSections() {
  const { pickup, needHelp, delivery, storage } = PRODUCT_DETAIL_INFO;

  return (
    <div className="mt-8 border-t border-ivory/10 pt-6">
      {/* Pickup — always visible */}
      <div className="border-b border-ivory/10 pb-5">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <div>
            <p className="text-sm text-ivory">{pickup.locationLabel}</p>
            <p className="mt-1 text-sm text-ivory/60">{pickup.readyIn}</p>
            <Link
              href={pickup.storeInfoHref}
              className="mt-2 inline-block text-sm text-gold underline-offset-2 hover:underline"
            >
              {pickup.storeInfoLabel}
            </Link>
          </div>
        </div>
      </div>

      {/* Need Help */}
      <AccordionItem title={needHelp.title}>
        <p className="text-sm leading-relaxed text-ivory/65">
          <a href={telUrl()} className="text-gold hover:underline">
            {needHelp.phoneDisplay}
          </a>
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ivory/60">{needHelp.body}</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <a
            href={telUrl()}
            className="text-xs uppercase tracking-widest text-gold hover:underline"
          >
            Call {CONTACT_PHONE}
          </a>
          <a
            href={whatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-widest text-gold hover:underline"
          >
            WhatsApp
          </a>
        </div>
      </AccordionItem>

      {/* Delivery */}
      <AccordionItem title={delivery.title} defaultOpen>
        <div className="space-y-3 text-sm leading-relaxed text-ivory/60">
          {delivery.paragraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
      </AccordionItem>

      {/* Storage */}
      <AccordionItem title={storage.title} defaultOpen>
        <div className="space-y-3 text-sm leading-relaxed text-ivory/60">
          {storage.paragraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
          <p className="pt-2 font-medium text-ivory/80">{storage.closing}</p>
        </div>
      </AccordionItem>
    </div>
  );
}
