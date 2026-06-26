import { Product } from "@/types";
import { contactInfo } from "@/data/products";
import { ProductImages as img } from "@/lib/product-images";
import { BUSINESS_DESCRIPTION } from "@/data/site-content";

export function getProductSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDescription ?? product.description,
    image: product.image,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: product.isPreOrder
        ? "https://schema.org/PreOrder"
        : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "IYLO Bakehouse",
      },
    },
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount ?? 1,
        }
      : undefined,
  };
}

export const bakerySchema = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "IYLO Bakehouse",
  description: BUSINESS_DESCRIPTION,
  url: "https://iylobakehouse.com",
  telephone: contactInfo.phone || undefined,
  email: contactInfo.email || undefined,
  address: {
    "@type": "PostalAddress",
    streetAddress: "No. 476/65, 7th Main, 33rd Cross, 4th Block, Jayanagar",
    addressLocality: "Bangalore",
    postalCode: "560011",
    addressRegion: "Karnataka",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 12.9308,
    longitude: 77.5838,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Wednesday", "Thursday", "Friday"],
      opens: "11:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "10:00",
      closes: "20:00",
    },
  ],
  priceRange: "₹₹₹",
  servesCuisine: "Bakery",
  image: img.bannerHomeDesktop1200,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.9,
    reviewCount: 186,
    bestRating: 5,
  },
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do you deliver across Bangalore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we deliver across Bangalore including Jayanagar and surrounding areas. Delivery charges are calculated based on distance. Free delivery on orders above ₹999.",
      },
    },
    {
      "@type": "Question",
      name: "Can I pre-order for weekends?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Weekend boxes and limited items are available for pre-order. Place your order before the cutoff time for same-weekend delivery or pickup.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer corporate gifting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we create bespoke corporate hampers with branded packaging, GST invoices, and bulk delivery across Bangalore.",
      },
    },
  ],
};
