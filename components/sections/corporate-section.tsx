"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Building2, Gift, UtensilsCrossed } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import { ProductImages as img } from "@/lib/product-images";
import { consumePendingInquiryType, type InquiryScrollType } from "@/lib/scroll";

const services = [
  {
    icon: Gift,
    title: "Bulk Gifting",
    description: "Custom hampers for teams, clients, and partners with branded packaging.",
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
  const [inquiryType, setInquiryType] = useState<InquiryScrollType>("corporate");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const pending = consumePendingInquiryType();
    if (pending) setInquiryType(pending);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiry_type: inquiryType,
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

  const formTitle =
    inquiryType === "custom" ? "Custom Packaging Enquiry" : "Corporate Enquiry";

  return (
    <section id="corporate" className="relative scroll-mt-28 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={img.luxuryGiftHamper}
          alt="Corporate gifting"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="section-padding relative mx-auto max-w-7xl">
        <Reveal className="mb-16 max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">For Business</p>
          <h2 className="editorial-heading mt-4 text-4xl text-ivory md:text-6xl">
            Corporate Orders
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-ivory/60">
            Elevate your corporate gifting and events with IYLO&apos;s artisan collections. From
            Diwali hampers to boardroom catering, we deliver excellence at scale.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 0.1}>
              <div className="glass p-8 transition-colors hover:border-gold/30">
                <service.icon className="mb-4 h-7 w-7 text-gold" />
                <h3 className="editorial-heading text-xl text-ivory">{service.title}</h3>
                <p className="mt-3 text-sm text-ivory/50">{service.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16">
          <div id="corporate-enquiry" className="glass max-w-2xl scroll-mt-28 p-8">
            <div className="mb-6 flex gap-2">
              {(["corporate", "custom"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setInquiryType(type);
                    setSubmitted(false);
                    setError("");
                  }}
                  className={`border px-4 py-2 text-[10px] uppercase tracking-widest transition-colors ${
                    inquiryType === type
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-ivory/20 text-muted hover:border-ivory/40"
                  }`}
                >
                  {type === "corporate" ? "Corporate / B2B" : "Custom Packaging"}
                </button>
              ))}
            </div>

            <h3 className="editorial-heading text-2xl text-ivory">{formTitle}</h3>
            <p className="mt-2 text-sm text-ivory/50">
              GST invoices available for Bangalore businesses. We respond within 24 hours.
            </p>

            {submitted ? (
              <p className="mt-8 text-gold">
                Thank you. Our team will reach out within 24 hours.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
                {error && (
                  <div className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 sm:col-span-2">
                    {error}
                  </div>
                )}

                {[
                  {
                    key: "company",
                    label: inquiryType === "custom" ? "Company / Occasion" : "Company",
                    type: "text",
                    required: inquiryType === "corporate",
                  },
                  { key: "name", label: "Contact Name", type: "text", required: true },
                  { key: "email", label: "Email", type: "email", required: true },
                  { key: "phone", label: "Phone", type: "tel", required: true },
                  { key: "gst", label: "GST Number", type: "text", required: false },
                  { key: "eventSize", label: "Quantity / Event Size", type: "text", required: false },
                  { key: "deliveryDate", label: "Delivery Date", type: "date", required: false },
                  { key: "budget", label: "Budget (₹)", type: "text", required: false },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted">
                      {field.label}
                    </label>
                    <input
                      required={field.required}
                      type={field.type}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full border border-ivory/20 bg-transparent px-3 py-2 text-sm text-ivory outline-none focus:border-gold"
                    />
                  </div>
                ))}

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted">
                    Requirements
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.requirements}
                    onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                    className="w-full resize-none border border-ivory/20 bg-transparent px-3 py-2 text-sm text-ivory outline-none focus:border-gold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Button type="submit" variant="gold" disabled={loading}>
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
