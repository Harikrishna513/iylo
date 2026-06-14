"use client";

import { Phone, Mail, MessageCircle, Clock, MapPin } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { contactInfo } from "@/data/products";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";

export function ContactSection() {
  return (
    <section id="contact" className="section-padding bg-ivory text-black">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-brown">
            Get in Touch
          </p>
          <h2 className="editorial-heading mt-4 text-4xl text-black md:text-6xl">
            Contact Us
          </h2>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  icon: Phone,
                  label: "Phone",
                  value: contactInfo.phone,
                  href: `tel:${contactInfo.phone.replace(/\s/g, "")}`,
                },
                {
                  icon: MessageCircle,
                  label: "WhatsApp",
                  value: contactInfo.phone,
                  href: `https://wa.me/${contactInfo.whatsapp.replace(/\D/g, "")}`,
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: contactInfo.email,
                  href: `mailto:${contactInfo.email}`,
                },
                {
                  icon: InstagramIcon,
                  label: "Instagram",
                  value: contactInfo.instagram,
                  href: `https://instagram.com/${contactInfo.instagram.replace("@", "")}`,
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.label === "Phone" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="group border border-black/10 p-6 transition-colors hover:border-brown"
                >
                  <item.icon className="mb-4 h-5 w-5 text-brown" />
                  <p className="text-[10px] uppercase tracking-widest text-black/40">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm text-black group-hover:text-brown">
                    {item.value}
                  </p>
                </a>
              ))}
            </div>

            <div className="mt-8 border border-black/10 p-6">
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-brown" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-black/40">
                    Store Timings
                  </p>
                  <p className="mt-2 text-sm text-black">
                    Mon–Fri: {contactInfo.timings.weekdays}
                  </p>
                  <p className="text-sm text-black">
                    Sat–Sun: {contactInfo.timings.weekends}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-brown" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-black/40">
                    Address
                  </p>
                  <p className="mt-2 text-sm text-black">{contactInfo.address}</p>
                </div>
              </div>
            </div>

            <Button variant="brown" size="sm" className="mt-8">
              Get Directions
            </Button>
          </Reveal>

          <Reveal direction="left">
            <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[400px]">
              <iframe
                src={contactInfo.mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 400 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="IYLO Bake House Location"
                className="absolute inset-0 h-full w-full grayscale transition-all duration-500 hover:grayscale-0"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
