"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { contactInfo } from "@/data/products";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";

const WHATSAPP_FALLBACK = "918105760776";

export function FloatingCTA() {
  const whatsappNumber = (contactInfo.whatsapp || WHATSAPP_FALLBACK).replace(/\D/g, "");
  const phoneNumber = contactInfo.phone?.replace(/\s/g, "");

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <motion.a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="flex h-[58px] w-[58px] items-center justify-center rounded-full text-white shadow-[0_4px_14px_rgba(37,211,102,0.45)] transition-shadow hover:shadow-[0_6px_20px_rgba(37,211,102,0.55)]"
        style={{
          background: "linear-gradient(145deg, #5DEE7E 0%, #25D366 45%, #128C7E 100%)",
        }}
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon className="h-8 w-8" />
      </motion.a>

      {phoneNumber && (
        <motion.a
          href={`tel:${phoneNumber}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#1A73E8] text-white shadow-[0_4px_14px_rgba(26,115,232,0.4)] transition-shadow hover:shadow-[0_6px_20px_rgba(26,115,232,0.5)]"
          aria-label="Call us"
        >
          <Phone className="h-6 w-6" strokeWidth={2} />
        </motion.a>
      )}
    </div>
  );
}
