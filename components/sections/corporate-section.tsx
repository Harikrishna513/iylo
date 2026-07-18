"use client";

import { useState } from "react";
import Image from "next/image";
import { Building2, Gift, UtensilsCrossed } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import { ProductImages as img } from "@/lib/product-images";
import { ALERT } from "@/lib/page-theme";

const services = [
  {
    icon: Gift,
    title: "Bulk Gifting",
    description:
      "Custom hampers for teams, clients, and partners with branded and custom packaging.",
  },
  {
    icon: Building2,
    title: "Corporate Hampers",
    description: "Festive and year-round gifting programs tailored to your brand.",
  },
  {
    icon: UtensilsCrossed,
    title: "Event Catering",
    description: "Artisan bread baskets, dessert tables, and bespoke menus for events.",
  },
];

const emptyForm = {
  company: "",
  name: "",
  email: "",
  phone: "",
  gst: "",
  eventSize: "",
  deliveryDate: "",
  budget: "",
  requirements: "",
};

export function CorporateSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiry_type: "corporate",
          company_name: form.company,
          contact_name: form.name,
          email: form.email,
          phone: form.phone,
          gst: form.gst,
          event_size: form.eventSize,
          delivery_date: form.deliveryDate || null,
          budget: form.budget || null,
          message: form.requirements,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
      setForm(emptyForm);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="corporate" className="relative scroll-mt-28 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={img.luxuryGiftHamper}
          alt="Corporate gifting"
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        />
      </div>

      <div className="section-padding relative mx-auto max-w-7xl">
        <Reveal className="mb-10 max-w-2xl rounded-2xl border border-maroon/10 bg-mist-blue/95 p-8 shadow-[0_12px_40px_rgba(69,21,25,0.18)] backdrop-blur-sm md:p-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-rosewood">For Business</p>
          <h2 className="editorial-heading mt-4 text-4xl text-maroon md:text-6xl">
            Corporate Orders
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-maroon/70">
            Elevate your corporate gifting and events with IYLO&apos;s artisan collections. From
            Diwali hampers to boardroom catering and custom packaging, we deliver excellence at
            scale.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-maroon/10 bg-mist-blue/95 p-8 shadow-[0_8px_28px_rgba(69,21,25,0.12)] backdrop-blur-sm transition-colors hover:border-light-blue">
                <service.icon className="mb-4 h-7 w-7 text-rosewood" />
                <h3 className="editorial-heading text-xl text-maroon">{service.title}</h3>
                <p className="mt-3 text-sm text-maroon/65">{service.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12">
          <div
            id="corporate-enquiry"
            className="max-w-2xl scroll-mt-28 rounded-2xl border border-maroon/10 bg-mist-blue/95 p-8 shadow-[0_12px_40px_rgba(69,21,25,0.18)] backdrop-blur-sm md:p-10"
          >
            <h3 className="editorial-heading text-2xl text-maroon">Corporate / B2B Enquiry</h3>
            <p className="mt-2 text-sm text-maroon/60">
              Including bulk gifting, hampers, events, and custom packaging. GST invoices available.
              We respond within 24 hours.
            </p>

            {submitted ? (
              <p className="mt-8 text-emerald-700">
                Thank you. Our team will reach out within 24 hours.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
                {error && (
                  <div className={`${ALERT.errorBox} sm:col-span-2`} role="alert">
                    {error}
                  </div>
                )}

                {[
                  { key: "company", label: "Company", type: "text", required: false },
                  { key: "name", label: "Contact Name", type: "text", required: true },
                  { key: "email", label: "Email", type: "email", required: false },
                  { key: "phone", label: "Phone", type: "tel", required: true },
                  { key: "gst", label: "GST Number", type: "text", required: false },
                  {
                    key: "eventSize",
                    label: "Quantity / Event Size",
                    type: "text",
                    required: false,
                  },
                  { key: "deliveryDate", label: "Delivery Date", type: "date", required: false },
                  { key: "budget", label: "Budget (₹)", type: "text", required: false },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="mb-1 block text-[10px] uppercase tracking-widest text-maroon/50">
                      {field.label}
                      {field.required && <span className="ml-1 text-red-600">*</span>}
                    </label>
                    <input
                      required={field.required}
                      type={field.type}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full border border-maroon/15 bg-white/80 px-3 py-2 text-sm text-maroon outline-none placeholder:text-maroon/30 focus:border-light-blue"
                    />
                  </div>
                ))}

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] uppercase tracking-widest text-maroon/50">
                    Requirements
                  </label>
                  <textarea
                    rows={3}
                    value={form.requirements}
                    onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                    placeholder="Include custom packaging needs, branding, or event details…"
                    className="w-full resize-none border border-maroon/15 bg-white/80 px-3 py-2 text-sm text-maroon outline-none placeholder:text-maroon/30 focus:border-light-blue"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Button type="submit" variant="brown" disabled={loading}>
                    {loading ? "Submitting…" : "Submit Enquiry"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
