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
import { LIGHT } from "@/lib/page-theme";

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
    <div className={cn("border-b", LIGHT.border)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-maroon transition-colors hover:text-light-blue"
        aria-expanded={open}
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-maroon/45 transition-transform duration-200",
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
    <div className={cn("mt-8 border-t pt-6", LIGHT.border)}>
      <div className={cn("border-b pb-5", LIGHT.border)}>
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-light-blue" />
          <div>
            <p className="text-sm text-maroon">{pickup.locationLabel}</p>
            <p className={cn("mt-1", LIGHT.body)}>{pickup.readyIn}</p>
            <Link
              href={pickup.storeInfoHref}
              className="mt-2 inline-block text-sm text-light-blue underline-offset-2 hover:underline"
            >
              {pickup.storeInfoLabel}
            </Link>
          </div>
        </div>
      </div>

      <AccordionItem title={needHelp.title}>
        <p className={LIGHT.body}>
          <a href={telUrl()} className="text-light-blue hover:underline">
            {needHelp.phoneDisplay}
          </a>
        </p>
        <p className={cn("mt-2", LIGHT.body)}>{needHelp.body}</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <a
            href={telUrl()}
            className="text-xs uppercase tracking-widest text-light-blue hover:underline"
          >
            Call {CONTACT_PHONE}
          </a>
          <a
            href={whatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-widest text-light-blue hover:underline"
          >
            WhatsApp
          </a>
        </div>
      </AccordionItem>

      <AccordionItem title={delivery.title}>
        <div className={cn("space-y-3 leading-relaxed", LIGHT.body)}>
          {delivery.paragraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
      </AccordionItem>

      <AccordionItem title={storage.title}>
        <div className={cn("space-y-3 leading-relaxed", LIGHT.body)}>
          {storage.paragraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
          <p className="pt-2 font-medium text-maroon">{storage.closing}</p>
        </div>
      </AccordionItem>
    </div>
  );
}
