import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingCTA } from "@/components/layout/floating-cta";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { ProductQuickView } from "@/components/ecommerce/product-quick-view";
import { CheckoutModal } from "@/components/ecommerce/checkout-modal";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IYLO Bake House | Handcrafted Artisan Bakes",
  description:
    "Freshly baked artisan breads, pastries, cakes and desserts made with exceptional ingredients. Order online for delivery or pickup in New Delhi.",
  keywords: [
    "artisan bakery",
    "sourdough bread",
    "luxury bakery Delhi",
    "IYLO Bake House",
    "handcrafted pastries",
    "corporate gifting",
  ],
  authors: [{ name: "IYLO Bake House" }],
  openGraph: {
    title: "IYLO Bake House | Handcrafted Bakes Worth Waiting For",
    description:
      "Artisan breads, pastries, cakes and desserts made with exceptional ingredients and delivered with care.",
    url: "https://iylobakehouse.com",
    siteName: "IYLO Bake House",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "IYLO Bake House artisan bread",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IYLO Bake House | Handcrafted Artisan Bakes",
    description:
      "Freshly baked artisan breads, pastries, cakes and desserts in New Delhi.",
    images: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "IYLO Bake House",
  description:
    "Artisan bakery specializing in handcrafted breads, pastries, cakes and desserts.",
  url: "https://iylobakehouse.com",
  telephone: "+91-98765-43210",
  email: "hello@iylobakehouse.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "12, Hauz Khas Village",
    addressLocality: "New Delhi",
    postalCode: "110016",
    addressCountry: "IN",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "07:00",
      closes: "21:00",
    },
  ],
  priceRange: "₹₹₹",
  servesCuisine: "Bakery",
  image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-black font-body antialiased">
        <SmoothScrollProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <FloatingCTA />
          <CartDrawer />
          <ProductQuickView />
          <CheckoutModal />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
