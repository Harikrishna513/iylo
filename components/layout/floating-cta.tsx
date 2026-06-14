"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { contactInfo } from "@/data/products";

export function FloatingCTA() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <motion.a
        href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="glass flex h-14 w-14 items-center justify-center rounded-full text-ivory shadow-2xl transition-colors hover:text-[#25D366]"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.a>
      <motion.a
        href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.7 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="glass flex h-14 w-14 items-center justify-center rounded-full text-ivory shadow-2xl transition-colors hover:text-gold"
        aria-label="Call"
      >
        <Phone className="h-6 w-6" />
      </motion.a>
    </div>
  );
}
