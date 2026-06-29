import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingCTA } from "@/components/layout/floating-cta";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { AnnouncementPopup } from "@/components/layout/announcement-popup";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { ProductQuickView } from "@/components/ecommerce/product-quick-view";
import { CheckoutModal } from "@/components/ecommerce/checkout-modal";
import { SearchModal } from "@/components/ecommerce/search-modal";
import { WishlistDrawer } from "@/components/ecommerce/wishlist-drawer";
import { bakerySchema, faqSchema } from "@/lib/seo";
import { getGoogleReviewsSchema } from "@/lib/google-reviews-schema";
import { ProductImages as img } from "@/lib/product-images";
import { BUSINESS_DESCRIPTION } from "@/data/site-content";
import { BRAND_LOGO } from "@/lib/brand";

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
  title: "IYLO Bakehouse | Eggless Artisan Bakes · Jayanagar, Bangalore",
  description:
    "Contemporary premium bakehouse specialising in eggless sweet and savoury bakes. Order online for delivery or pickup in Jayanagar, Bangalore.",
  keywords: [
    "eggless bakery Bangalore",
    "celebration cakes Jayanagar",
    "premium bakery Bangalore",
    "IYLO Bakehouse",
    "handcrafted pastries",
    "corporate gifting Bangalore",
    "custom cakes Bangalore",
  ],
  authors: [{ name: "IYLO Bake House" }],
  metadataBase: new URL("https://iylobakehouse.com"),
  openGraph: {
    title: "IYLO Bakehouse | Modern Eggless Baking",
    description: BUSINESS_DESCRIPTION,
    url: "https://iylobakehouse.com",
    siteName: "IYLO Bakehouse",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: img.bannerHomeDesktop1200,
        width: 1200,
        height: 630,
        alt: "IYLO Bake House artisan bread",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IYLO Bakehouse | Eggless Artisan Bakes",
    description: BUSINESS_DESCRIPTION,
    images: [img.bannerHomeDesktop1200],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://iylobakehouse.com",
  },
  icons: {
    icon: BRAND_LOGO,
    apple: BRAND_LOGO,
  },
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(bakerySchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getGoogleReviewsSchema()) }}
        />
      </head>
      <body className="bg-black font-body antialiased">
        <SmoothScrollProvider>
          <AnnouncementBar />
          <Header />
          <main>{children}</main>
          <Footer />
          <FloatingCTA />
          <MobileBottomNav />
          <CartDrawer />
          <ProductQuickView />
          <CheckoutModal />
          <SearchModal />
          <WishlistDrawer />
          <AnnouncementPopup />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
